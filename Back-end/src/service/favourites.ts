import logger from "../core/logging";
import { tables, getKnex } from "../data/index";
import { Favourites } from "../interfaces";

const getAll = async () => {
  const allGames = await getKnex()(tables.favourites).select();
  return allGames;
};

const getById = async (id: number) => {
  const gameWithId = await getKnex()(tables.favourites).where("id", id).first();
  if (!gameWithId) logger.error(`Game with id ${id} not found`);
  return gameWithId;
};

const create = async ({
  title,
  thumbnail = "https://www.freeiconspng.com/uploads/no-image-icon-6.png",
  genre,
  developer,
  release_date,
  username,
}: Favourites) => {
  const newGame = {
    title: title,
    thumbnail: thumbnail,
    genre: genre,
    developer: developer,
    release_date: release_date,
    username: username,
  };

  await getKnex()(tables.favourites).insert(newGame);
  return newGame;
};

const deleteById = async (id: number): Promise<boolean> => {
  const deletedGame = await getKnex()(tables.favourites).delete().where("id", id);
  return deletedGame > 0;
};

const operations = {
  getAll,
  getById,
  create,
  deleteById,
};

export default operations;
