const request = require("supertest");

const app = require("../../app");

describe("Test /GET Launches", () => {
  test("Should return 200 status", async () => {
    const response = await request(app)
      .get("/launches")
      .expect(200)
      .expect("Content-Type", /json/);
  });
});
