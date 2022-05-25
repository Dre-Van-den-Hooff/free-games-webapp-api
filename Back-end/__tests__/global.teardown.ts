import { shutdownData, getKnex, tables } from "../src/data/";

module.exports = async () => {
  await getKnex()(tables.game).delete();
  await getKnex()(tables.user).delete();
  await getKnex()(tables.favourites).delete();

  await shutdownData();
};
