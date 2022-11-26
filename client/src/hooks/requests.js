const API_URL = "http://localhost:8000/";

async function httpGetPlanets() {
  // TODO: Once API is ready.
  const response = await fetch(`${API_URL}planets`);

  // Load planets and return as JSON.
  return await response.json();
}

// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
  const response = await fetch(`${API_URL}launches`);
  const fetchedData = await response.json();
  return fetchedData.sort((a, b) => {
    return a.flightNumber - b.flightNumber;
  });
}

async function httpSubmitLaunch(launch) {
  // TODO: Once API is ready.
  // Submit given launch data to launch system.
}

async function httpAbortLaunch(id) {
  // TODO: Once API is ready.
  // Delete launch with given ID.
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
