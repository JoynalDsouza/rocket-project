const { parse } = require("csv-parse");
//import file system module
const fs = require("fs");
const path = require("path");

const habitablePlanets = [];

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
      .on("data", (data) => {
        if (isHabitablePlanet(data)) {
          habitablePlanets.push(data);
        }
      })
      .on("error", (err) => {
        console.log({ err });
        reject(err);
      })
      .on("end", () => {
        console.log(`${habitablePlanets.length} habitable planets found!!`);
        resolve();
      });
  });
}

module.exports = { loadPlanetsData, planets: habitablePlanets };
