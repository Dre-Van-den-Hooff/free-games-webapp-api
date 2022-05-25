import supertest, { SuperTest, Test } from "supertest";
import createServer from "../src/createServer";
import { getKnex } from "../src/data";

export const loginUser = async (supertest: SuperTest<Test>): Promise<string> => {
  const res = await supertest.post("/api/user/login").send({
    email: "test@test.com",
    password: "12345678",
  });

  if (res.statusCode !== 200) {
    throw new Error(res.body.message || "Unknown error occured");
  }

  return `Bearer ${res.body.token}`;
};

export const loginAdmin = async (supertest: SuperTest<Test>): Promise<string> => {
  const res = await supertest.post("/api/user/login").send({
    email: "admin@admin.com",
    password: "12345678",
  });

  if (res.statusCode !== 200) {
    throw new Error(res.body.message || "Unknown error occured");
  }

  return `Bearer ${res.body.token}`;
};

export const withServer = (setter: Function) => {
  let server: { getApp: Function; stop: Function; start?: () => Promise<void> };

  beforeAll(async () => {
    server = await createServer();

    setter({
      knex: getKnex(),
      supertest: supertest(server.getApp().callback()),
    });
  });

  afterAll(async () => {
    await server.stop();
  });
};
