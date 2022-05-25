import { axios } from "./index";

export const getAllGames = async () => {
  const { data } = await axios.get("games");
  return data;
};

export const postGame = async formData => {
  await axios.post("games", formData);
};

export const getGameBySearchTerm = async term => {
  const { data } = await axios.get(`games/query/${term}`);
  return data;
};
