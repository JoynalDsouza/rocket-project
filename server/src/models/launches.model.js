const axios = require("axios");

const launchesDB = require("./launches.mongo");

const planets = require("./planets.mongo");

const launch = {
  flightNumber: 100, //flight_number
  mission: "Kepler Exploration X", //name
  rocket: "Explorer 1SI", // rocket.name
  launchDate: new Date("December 27,2030"), //date_local
  target: "Kepler-442 b", //NA
  customers: ["ZTM", "NASA"],
  upcoming: true, //upcoming
  success: true, //success
};

// saveLaunch(launch);

const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query";

async function loadLaunchesData() {
  const response = await axios.post(SPACEX_API_URL, {
    query: {},
    options: {
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

  // console.log(response.data);
}

async function existsLaunchById(launchId) {
  return await launchesDB.findOne({ flightNumber: launchId });
}

async function getLatestFlightNumber() {
  const launch = await launchesDB.findOne({}).sort("-flightNumber");

  return Number(launch?.flightNumber) || 100;
}

async function getAllLaunches() {
  return await launchesDB.find({}, { _id: 0, __v: 0 });
}

async function saveLaunch(launch) {
  const planet = await planets.find({ keplerName: launch.target });

  if (!planet.length) {
    throw new Error("Planet does not exsits");
  }
  await launchesDB.findOneAndUpdate(
    { flightNumber: launch.flightNumber },
    launch,
    {
      upsert: true,
    }
  );
}

async function scheduleNewLaunch(launch) {
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
  loadLaunchesData,
  getAllLaunches,
  scheduleNewLaunch,
  existsLaunchById,
  abortLaunchById,
};
