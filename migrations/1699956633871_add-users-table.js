/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.sql(`
        CREATE TABLE users(
            id SERIAL PRIMARY KEY,
            username VARCHAR(30) NOT NULL,
            bio VARCHAR(400),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        );
    `);
};

exports.down = pgm => {
    pgm.sql(`
        DROP TABLE users;
    `);
};
