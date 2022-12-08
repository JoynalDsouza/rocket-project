const request = require("supertest");

const app = require("../../app");

const { mongoConnect, mongoDisconnect } = require("../../services/mongo");

describe("Launches API", () => {
  beforeAll(async () => {
    await mongoConnect();
  });

  afterAll(async () => {
    await mongoDisconnect();
  });

  describe("Test /GET Launches", () => {
    test("Should return 200 status", async () => {
      const response = await request(app)
        .get("/launches")
        .expect(200)
        .expect("Content-Type", /json/);
    });
  });

  describe("Test /POST Launches", () => {
    const launchData = {
      mission: "Test mission",
      target: "Kepler-62 f",
      rocket: "FX120F",
      launchDate: "May 23,2032",
    };
    const launchDataWithoutDate = {
      mission: "Test mission",
      target: "Kepler-62 f",
      rocket: "FX120F",
    };

    test("should return 201 created", async () => {
      const response = await request(app)
        .post("/launches")
        .send(launchData)
        .expect(201)
        .expect("Content-Type", /json/);

      const launchDate = new Date(launchData.launchDate).valueOf();
      const responseLaunchDate = new Date(response.body.launchDate).valueOf();

      expect(response.body).toMatchObject(launchDataWithoutDate);

      expect(launchDate).toBe(responseLaunchDate);
    });

    test("should catch missing required properties", async () => {
      const response = await request(app)
        .post("/launches")
        .send(launchDataWithoutDate)
        .expect(400)
        .expect("Content-Type", /json/);

      expect(response.body).toStrictEqual({
        error: "Missing required launch property",
      });
    });

    test("should catch invalid date", async () => {
      const response = await request(app)
        .post("/launches")
        .send({ ...launchDataWithoutDate, launchDate: "hello" })
        .expect(400)
        .expect("Content-Type", /json/);

      expect(response.body).toStrictEqual({
        error: "Invalid launch date",
      });
    });
  });
});
