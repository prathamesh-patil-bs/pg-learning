const format = require("pg-format");
const { randomBytes } = require("crypto");
const { default: migrate } = require("node-pg-migrate");

const pool = require('../pool');

const DEFAULT_OPTS = {
    host: "localhost",
    port: 5432,
    user: "pratham",
    password: "1234",
    database: "socialnetwork-test",
  }

class Context {
  static async build() {
    // Randomly generating a role name to connect pg as
    const roleName = "a" + randomBytes(4).toString("hex");

    // connect to pg as usual
    await pool.connect(DEFAULT_OPTS);

    // Create a new role
    await pool.query(
      format(`CREATE ROLE %I WITH LOGIN PASSWORD %L;`, roleName, roleName)
    );

    // Create a schema with the same name
    await pool.query(
      format(`CREATE SCHEMA %I AUTHORIZATION %I;`, roleName, roleName)
    );

    // Disconnect entirely from pg
    await pool.close();

    // Run migration in new schema
    await migrate({
      schema: roleName,
      direction: "up",
      log: () => {},
      noLock: true,
      dir: "migrations",
      databaseUrl: {
        host: "localhost",
        port: 5432,
        user: roleName,
        password: roleName,
        database: "socialnetwork-test",
      },
    });

    // Connect to pg as newly created role
    await pool.connect({
      host: "localhost",
      port: 5432,
      user: roleName,
      password: roleName,
      database: "socialnetwork-test",
    });

    return new Context(roleName);
  }

  constructor(roleName) {
    this.roleName = roleName;
  }

  async close() {
    // Disconnect form pg
    await pool.close();

    // Reconnect as our root user
    await pool.connect(DEFAULT_OPTS);

    // Delete the role and schema we created
    await pool.query(format(`DROP SCHEMA %I CASCADE`, this.roleName))
    await pool.query(format(`DROP ROLE %I`, this.roleName));

    // Disconnect
    await pool.close();
  }

  async reset() {
    return pool.query(`DELETE FROM users;`)
  }
}

module.exports = Context;
