require("dotenv").config();
const db = require("knex")({
  client: "pg",
  connection: {
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
  },
});

module.exports = db;
