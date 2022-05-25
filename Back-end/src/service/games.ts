import logger from "../core/logging";
import { tables, getKnex } from "../data/index";
import { Game } from "../interfaces";

/* roept databank op en returnt alle games */
const getAll = async () => {
  const allGames: Array<Game> = await getKnex()(tables.game).select();
  return allGames;
};

/* roept databank op en returnt game met specifiek id */
const getById = async (id: number) => {
  const gameWithId = await getKnex()(tables.game).where("id", id).first();
  if (!gameWithId) logger.error(`Game with id ${id} not found`);
  return gameWithId;
};

const getBySearchTerm = async (term: string) => {
  const games: Array<Game> = await getKnex()(tables.game)
    .where("title", "like", `%${term}%`)
    .orWhere("genre", "like", `%${term}%`)
    .orWhere("developer", "like", `%${term}%`)
    .orWhere("release_date", "like", `%${term}%`);

  return games;
};

/* voegt een game toe aan de databank */
const create = async ({ title, thumbnail = "https://www.freeiconspng.com/uploads/no-image-icon-6.png", genre, developer, release_date }: Game) => {
  //zoeken naar eerstvolgende id dat nog niet in gebruik is
  const allGames = await getAll();
  let counter: number = 0;
  let id: number = 0;
  for (const game of allGames) {
    counter++;
    if (game.id !== counter) {
      id = counter;
      break;
    }
  }

  if (thumbnail === "") thumbnail = "https://www.freeiconspng.com/uploads/no-image-icon-6.png";
  if (genre === "") genre = "not specified";
  if (developer === "") developer = "not specified";
  if (release_date === "") release_date = "not specified";

  const newGame = {
    id: id,
    title: title,
    thumbnail: thumbnail,
    genre: genre,
    developer: developer,
    release_date: release_date,
  };
  await getKnex()(tables.game).insert(newGame);

  return await getById(id);
};

/* verwijdert een game uit de databank */
const deleteById = async (id: number): Promise<boolean> => {
  const gameWithId = await getKnex()(tables.game).delete().where("id", id);
  return gameWithId > 0;
};

const operations = {
  getAll,
  getById,
  getBySearchTerm,
  create,
  deleteById,
};

export default operations;
