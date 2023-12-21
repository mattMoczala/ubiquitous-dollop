const postgres = require('postgres')
const fs = require('fs')

// db connection
const sql = postgres('', {
    host                 : 'localhost',                      // Postgres ip address[s] or domain name[s]
    port                 : 5432,                             // Postgres server port[s]
    database             : 'postgres',                       // Name of database to connect to
    username             : 'maciejmoczala',                  // Username of database user
    password             : '',                               // Password of database user
    ssl: {
      rejectUnauthorized: false,
      ca: fs.readFileSync('/opt/homebrew/var/postgresql@14/server.crt').toString()
    }
  });

module.exports = sql;