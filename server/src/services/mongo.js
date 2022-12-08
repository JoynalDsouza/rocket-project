const mongoose = require("mongoose");

const MONGO_URL =
  "mongodb+srv://rocket-api:Ni6KtTeArqFN3WWE@cluster0.ivv8r.mongodb.net/?retryWrites=true&w=majority";

mongoose.connection.once("open", () => {
  console.log("Mongo connection ready!");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});

async function mongoConnect() {
  await mongoose.connect(MONGO_URL);
}

async function mongoDisconnect() {
  await mongoose.disconnect();
}

module.exports = {
  mongoConnect,
  mongoDisconnect,
};
