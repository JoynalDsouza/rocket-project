const launchesDB = require("./launches.mongo");

const planets = require("./planets.mongo");

const launches = new Map();

let latestFlightNumber = 100;

const launch = {
  flightNumber: 100,
  mission: "Kepler Exploration X",
  rocket: "Explorer 1SI",
  launchDate: new Date("December 27,2030"),
  target: "Kepler-442 b",
  customers: ["ZTM", "NASA"],
  upcoming: true,
  success: true,
};

// launches.set(launch.flightNumber, launch);
saveLaunch(launch);

function existsLaunchById(launchId) {
  return launches.has(launchId);
}

async function getAllLaunches() {
  return await launchesDB.find({}, { _id: 0, __v: 0 });
}

async function saveLaunch(launch) {
  const planet = await planets.find({ keplerName: launch.target });

  if (!planet.length) {
    throw new Error("Planet does not exsits");
  }
  await launchesDB.updateOne({ flightNumber: launch.flightNumber }, launch, {
    upsert: true,
  });
}

function addNewLaunch(launch) {
  latestFlightNumber++,
    launches.set(
      latestFlightNumber,
      Object.assign(launch, {
        flightNumber: latestFlightNumber,
        customers: ["ZTM", "NASA"],
        upcoming: true,
        success: true,
      })
    );
}

function abortLaunchById(launchId) {
  const aborted = launches.get(launchId);
  aborted.upcoming = false;
  aborted.success = false;

  return aborted;
}

module.exports = {
  getAllLaunches,
  addNewLaunch,
  existsLaunchById,
  abortLaunchById,
};
