"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var postgres_js_1 = require("drizzle-orm/postgres-js");
var pg_1 = require("pg");
var schema = require("./dbSchema");
var pool = new pg_1.Pool({
    connectionString: process.env.DATABASE_URL,
});
var db = (0, postgres_js_1.drizzle)(pool, { schema: schema });
exports.default = db;
