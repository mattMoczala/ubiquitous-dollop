const postgres = require('postgres')

// db connection
const sql = postgres('', {
    host                 : 'localhost',                      // Postgres ip address[s] or domain name[s]
    port                 : 5432,                             // Postgres server port[s]
    database             : 'postgres',                       // Name of database to connect to
    username             : 'maciejmoczala',                  // Username of database user
    password             : '',                               // Password of database user
    ssl                  : 'require'
  });

module.exports = sql;