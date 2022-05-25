import { axios } from "./index";

export const getUserById = async id => {
  const { data } = await axios.get(`user/${id}`);
  return data;
};

export const login = async ({ email, password }) => {
  const { data } = await axios.post("user/login", { email, password });
  return data;
};

export const register = async ({ username, email, password }) => {
  const { data } = await axios.post("user/register", { username, email, password });
  return data;
};

export const deleteUserById = async id => {
  await axios.delete(`user/${id}`);
};

export const updateUser = async ({ email, username }) => {
  const { data } = await axios.put("user/update", { email, username });
  return data;
};
