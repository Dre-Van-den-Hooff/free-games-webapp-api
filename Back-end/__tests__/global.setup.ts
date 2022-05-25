import { initializeData, getKnex, tables } from "../src/data";
import { roles } from "../src/core/roles";

const testUsers = [
  //password 12345678

  {
    username: "Test User",
    email: "test@test.com",
    password: "$argon2id$v=19$m=2048,t=2,p=1$NF6PFLTgSYpDSex0iFeFQQ$Rz5ouoM9q3EH40hrq67BC3Ajsu/ohaHnkKBLunELLzU",
    roles: JSON.stringify([roles.USER]),
  },
  {
    username: "Admin User",
    email: "admin@admin.com",
    password: "$argon2id$v=19$m=2048,t=2,p=1$NF6PFLTgSYpDSex0iFeFQQ$Rz5ouoM9q3EH40hrq67BC3Ajsu/ohaHnkKBLunELLzU",
    roles: JSON.stringify([roles.ADMIN, roles.USER]),
  },
];

module.exports = async () => {
  await initializeData();
  const knex = getKnex();
  await knex(tables.user).insert(testUsers);
};
