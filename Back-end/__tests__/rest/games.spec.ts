import { tables } from "../../src/data/index";
import { Knex } from "knex";
import { SuperTest, Test } from "supertest";
import { withServer, loginUser } from "../supertest.setup";
import { Game, Setter } from "../../src/interfaces";

const testData = {
  games: [
    {
      id: 1,
      title: "Dauntless",
      thumbnail: "https://www.freetogame.com/g/1/thumbnail.jpg",
      genre: "MMORPG",
      developer: "Phoenix Labs, Iron Galaxy",
      release_date: "2019-05-21",
    },
    {
      id: 2,
      title: "World of Tanks",
      thumbnail: "https://www.freetogame.com/g/2/thumbnail.jpg",
      genre: "Shooter",
      developer: "Wargaming",
      release_date: "2011-04-12",
    },
    {
      id: 3,
      title: "Warframe",
      thumbnail: "https://www.freetogame.com/g/3/thumbnail.jpg",
      genre: "Shooter",
      developer: "Digital Extremes",
      release_date: "2013-03-25",
    },
  ],
};

const dataToDelete = {
  games: [1, 2, 3],
};

describe("Games", () => {
  let knex: Knex;
  let loginHeader: string;
  let req: SuperTest<Test>;

  withServer(({ knex: k, supertest: s }: Setter) => {
    knex = k;
    req = s;
  });

  beforeAll(async () => {
    loginHeader = await loginUser(req);
  });

  const url = "/api/games";

  //GET ALL TEST
  describe(`GET ${url}`, () => {
    beforeAll(async () => {
      await knex(tables.game).insert(testData.games);
    });

    afterAll(async () => {
      await knex(tables.game).whereIn("id", dataToDelete.games).delete();
    });

    test("it should 200 and return all games", async () => {
      const response = await req.get(url);

      expect(response.status).toBe(200);
      expect(response.body.length).toBeGreaterThanOrEqual(3);
    });
  });

  //GET BY ID TEST
  describe(`GET ${url}/id/:id`, () => {
    beforeAll(async () => {
      await knex(tables.game).insert(testData.games[0]);
    });

    afterAll(async () => {
      await knex(tables.game).where("id", testData.games[0].id).delete();
    });

    test("it should 200 and return the requested game", async () => {
      const response = await req.get(`${url}/id/${testData.games[0].id}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(testData.games[0]);
    });
  });

  //POST TEST
  describe(`POST ${url}`, () => {
    const gamesToDelete: Array<Game> = [];

    afterAll(async () => {
      await knex(tables.game).whereIn("id", gamesToDelete).delete();
    });

    test("it should 200 and return the created game", async () => {
      const response = await req.post(url).send({
        title: "New game",
        thumbnail: "",
        genre: "",
        developer: "",
        release_date: "",
      });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe("New game");
      expect(response.body.thumbnail).toBe("https://www.freeiconspng.com/uploads/no-image-icon-6.png");
      expect(response.body.genre).toBe("not specified");
      expect(response.body.developer).toBe("not specified");
      expect(response.body.release_date).toBe("not specified");

      gamesToDelete.push(response.body.id);
    });
  });

  //GET BY QUERY PARAM TEST
  describe(`GET ${url}/query/:query`, () => {
    beforeAll(async () => {
      await knex(tables.game).insert(testData.games[0]);
    });

    afterAll(async () => {
      await knex(tables.game).whereIn("id", dataToDelete.games).delete();
    });

    test("it should 200 return the game with query param", async () => {
      const response = await req.get(`${url}/query/${testData.games[0].title}`);

      expect(response.status).toBe(200);
      expect(response.body[0].title).toBe(`${testData.games[0].title}`);
    });
  });

  //DELETE BY ID TEST
  describe(`DELETE ${url}/:id`, () => {
    beforeAll(async () => {
      await knex(tables.game).insert(testData.games[0]);
    });

    test("it should 200 and return nothing", async () => {
      const response = await req.delete(`${url}/${testData.games[0].id}`);
      expect(response.status).toBe(200);
      expect(response.body).toEqual(true);
    });
  });
});
