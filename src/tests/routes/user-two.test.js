const request = require("supertest");
const buildApp = require("../../app");
const UserRepo = require("../../repos/user-repo");
const pool = require("../../pool");
const Context = require('../context');

let context;

beforeAll(async () => {
  context = await Context.build();
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
  context.close();
});
