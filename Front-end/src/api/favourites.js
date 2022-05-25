import { axios } from "./index";

export const getAllGames = async () => {
  const { data } = await axios.get("favourites");
  return data;
};

export const deleteGameById = async id => {
  await axios.delete(`favourites/${id}`);
};

export const postGame = async game => {
  await axios.post("favourites", game);
};
