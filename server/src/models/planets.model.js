const { parse } = require("csv-parse");
//import file system module
const fs = require("fs");
const path = require("path");

const planets = require("./planets.mongo");

const isHabitablePlanet = (planet) =>
  planet.koi_disposition === "CONFIRMED" &&
  planet.koi_insol > 0.36 &&
  planet.koi_insol < 1.11 &&
  planet.koi_prad < 1.6;

function loadPlanetsData() {
  //createReadStream crates stream of data -> listens to data,error,end events

  //pipe function connects readable Stream source to writiable stream destination
  return new Promise((resolve, reject) => {
    fs.createReadStream(
      path.join(__dirname, "..", "..", "data", "kepler_data.csv")
    )
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", async (data) => {
        if (isHabitablePlanet(data)) {
          savePlanet(data);
        }
      })
      .on("error", (err) => {
        console.log({ err });
        reject(err);
      })
      .on("end", async () => {
        const habitablePlanetsLength = (await getAllPlanets()).length;
        console.log(`${habitablePlanetsLength} habitable planets found!!`);
        resolve();
      });
  });
}

async function getAllPlanets() {
  return await planets.find({}, { _id: 0, __v: 0 });
}

async function savePlanet(planet) {
  try {
    await planets.updateOne(
      {
        keplerName: planet.kepler_name,
      },
      {
        keplerName: planet.kepler_name,
      },
      {
        upsert: true,
      }
    );
  } catch (err) {
    console.log(`Could not add planet : ${err}`);
  }
}

module.exports = { loadPlanetsData, getAllPlanets };
