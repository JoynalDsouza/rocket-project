const { getAllLaunches } = require("../../models/launches.model");

function httpGetAllLaunches(req, res) {
  return res.json(getAllLaunches());
}

module.exports = {
  httpGetAllLaunches,
};
