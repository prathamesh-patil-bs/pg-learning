const request = require("supertest");
const buildApp = require("../../app");
const UserRepo = require("../../repos/user-repo");
const pool = require("../../pool");

beforeAll(async () => {
  return pool.connect({
    host: "localhost",
    port: 5432,
    user: "pratham",
    password: "1234",
    database: "socialnetwork-test",
  });
});

it("Should create a user", async () => {
  const startingCount = await UserRepo.count();

  await request(buildApp())
    .post("/users")
    .send({ username: "testuser", bio: "testbio" })
    .expect(200);

  const finishedCount = await UserRepo.count();
  expect(finishedCount - startingCount).toEqual(1);
});

afterAll(() => {
    pool.close();
})