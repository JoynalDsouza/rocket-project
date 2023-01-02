const axios = require("axios");

const launchesDB = require("./launches.mongo");

const planets = require("./planets.mongo");

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function populateLaunches() {
  console.log("Downloading Launch data...");
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
      pagination: false,
      populate: [
        { path: "rocket", select: { name: 1 } },
        {
          path: "payloads",
          select: {
            customers: 1,
          },
        },
      ],
    },
  });

  if (response.status !== 200) {
    console.log("Problem with downloading launch data");
    throw new Error("Downloading launch data failed");
  }

  const launchDocs = response.data.docs;

  for (const launchDoc of launchDocs) {
    const payloads = launchDoc["payloads"];
    const customers = payloads.flatMap((payload) => payload["customers"]);

    const launch = {
      flightNumber: launchDoc["flight_number"],
      mission: launchDoc["name"],
      rocket: launchDoc["rocket"]["name"],
      launchDate: launchDoc["date_local"],
      customers: customers,
      upcoming: launchDoc["upcoming"],
      success: launchDoc["success"],
    };

    await saveLaunch(launch);
  }
}

async function loadLaunchData() {
  const firstLaunch = await findLaunch({
    flightNumber: 1,
    rocket: "Falcon 1",
    mission: "FalconSat",
  });

  if (firstLaunch) {
    console.log("Launches data exists");
  } else {
    await populateLaunches();
  }
}

async function findLaunch(filter) {
  return await launchesDB.findOne(filter);
}

async function existsLaunchById(launchId) {
  return await findLaunch({ flightNumber: launchId });
}

async function getLatestFlightNumber() {
  const launch = await launchesDB.findOne({}).sort("-flightNumber");

  return Number(launch?.flightNumber) || 100;
}

async function getAllLaunches(skip, limit) {
  return await launchesDB
    .find({}, { _id: 0, __v: 0 })
    .sort({ flightNumber: 1 })
    .skip(skip)
    .limit(limit);
}

async function saveLaunch(launch) {
  await launchesDB.findOneAndUpdate(
    { flightNumber: launch.flightNumber },
    launch,
    {
      upsert: true,
    }
  );
}

async function scheduleNewLaunch(launch) {
  const planet = await planets.find({ keplerName: launch.target });

  if (!planet.length) {
    throw new Error("Planet does not exsits");
  }
  const flightNumber = (await getLatestFlightNumber()) + 1;
  const newLaunch = Object.assign(launch, {
    customers: ["ZTM", "NASA"],
    upcoming: true,
    success: true,
    flightNumber: flightNumber,
  });

  await saveLaunch(newLaunch);
}

async function abortLaunchById(launchId) {
  const aborted = await launchesDB.updateOne(
    { flightNumber: launchId },
    { upcoming: false, success: false }
  );

  return aborted.acknowledged;
}

module.exports = {
  loadLaunchData,
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchById,
  abortLaunchById,
};
