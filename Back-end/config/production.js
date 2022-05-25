module.exports = {
  log: {
    level: "info",
    disabled: false,
  },
  cors: {
    origins: ["http://localhost:3000", "https://hogent-web.github.io/frontendweb-karine-2122-Dre-Van-den-Hooff/"],
    maxAge: 3 * 60 * 60,
  },
  database: {
    client: "mysql2",
    host: "127.0.0.1",
    port: 3306,
    name: "webdevdb",
  },

  auth: {
    argon: {
      saltLength: 16,
      hashLength: 32,
      timeCost: 6,
      memoryCost: 2 ** 17,
    },
    jwt: {
      // secret comes via env
      expirationInterval: 3 * 24 * 60 * 60 * 1000, // ms (3 days)
      issuer: "budget.hogent.be",
      audience: "budget.hogent.be",
    },
  },
};
