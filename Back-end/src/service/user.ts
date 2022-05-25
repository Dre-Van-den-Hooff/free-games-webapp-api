import logger from "../core/logging";
import { tables, getKnex } from "../data/index";
import { generateJWT, verifyJWT } from "../core/jwt";
import { roles } from "../core/roles";
import { hashPassword, verifyPassword } from "../core/password";
import { User } from "../interfaces";
import { ServiceError } from "../core/serviceError";

const makeLoginData = async (user: User) => {
  const token = await generateJWT(user);
  return {
    user: makeExposedUser(user),
    token: token,
  };
};

const makeExposedUser = ({ id, username, email, password, roles }: User): User => {
  return {
    id: id,
    username: username,
    email: email,
    password: password,
    roles: roles,
  };
};

/* roept databank op en returnt alle users */
const getAll = async (): Promise<Array<User>> => {
  const allUsers: Array<User> = await getKnex()(tables.user).select();
  return allUsers;
};

const login = async ({ email, password }: User) => {
  const user: User = await getByEmail(email);

  if (!user) throw new Error("Email and password don't match");
  if (await verifyPassword(password, user.password)) {
    logger.info("login successful");
    return makeLoginData(user);
  }
  return false;
};

const getByEmail = (email: string) => {
  try {
    return getKnex()(tables.user).where("email", email).first();
  } catch (error) {
    logger.error(`Error getting user with email ${email}`);
  }
};

const updateUser = async ({ email, username }: User): Promise<User> => {
  try {
    await getKnex()(tables.user).update({ username: username }).where("email", email);
  } catch (error) {
    logger.error(`Error while updating user ${username}: ${error}`);
  }
  const user = await getByEmail(email);

  if (!user) throw new Error("Email cannot be found");

  logger.info("update successful");
  return user;
};

/* roept databank op en returnt user met specifiek id */
const getById = async (id: number): Promise<User> => {
  const userWithId = await getKnex()(tables.user).where("id", id).first();
  if (!userWithId) logger.error("Cannot find user");
  return userWithId;
};

/* voegt een user toe aan de databank */
const create = async ({ username, email, password }: User): Promise<User | false> => {
  try {
    const userExists = await getByEmail(email);
    if (!userExists) {
      const passwordHash = await hashPassword(password);
      const newUser = {
        username: username,
        email: email,
        password: passwordHash,
        roles: JSON.stringify([roles.USER]),
      };
      await getKnex()(tables.user).insert(newUser);
      logger.info(`Successfully registered user ${username}`);
      return newUser;
    } else return false;
  } catch (error) {
    logger.error(`Error while registering user: ${error}`);
    return false;
  }
};

/* verwijdert een user uit de databank */
const deleteById = async (id: number): Promise<boolean> => {
  const userWithId = await getKnex()(tables.user).delete().where("id", id);
  return userWithId > 0;
};

const checkAndParseSession = async (authHeader?: string) => {
  if (!authHeader) {
    throw ServiceError.unauthorized("You need to be signed in", {});
  }

  if (!authHeader.startsWith("Bearer ")) {
    throw ServiceError.unauthorized("Invalid authentication token", {});
  }

  const authToken = authHeader.substring(7);
  try {
    const { roles, userId }: any = await verifyJWT(authToken);

    return {
      userId,
      roles,
      authToken,
    };
  } catch (error: any) {
    logger.error(error);
    throw ServiceError.unauthorized(error, {});
  }
};

const operations = {
  getAll,
  login,
  getByEmail,
  getById,
  create,
  updateUser,
  deleteById,
  checkAndParseSession,
};

export default operations;
