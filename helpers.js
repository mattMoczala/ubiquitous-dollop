const pg = require('pg')
const sql = require('./dbConnection')
const bcrypt = require("bcryptjs")
const fs = require('fs')

const Client = pg.Client;

const createUser = async (login, password, displayName, role) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'postgres',
    user: 'maciejmoczala',
    password: '',
    sslmode: 'require',
    ssl: {
      rejectUnauthorized: false,
      ca: fs.readFileSync('/opt/homebrew/var/postgresql@14/server.crt').toString()
    }
  })
  await client.connect()

  // SQL Injection
  await client.query(`INSERT INTO users(login, passwd, role, displayName) VALUES ('${login}', '${hash}', '${role}', '${displayName}')`)
  // SAFE
  // await client.query(`INSERT INTO users(login, passwd, role, displayName) VALUES ($1::text, $2::text, $3::text, $4::text)`, [login, hash, role, displayName])

  console.log(`Registered user ${login}`)
};

const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect('/');
  };

const matchPassword = async (password, hashPassword) => {
  return new Promise(async (resolve) => {
    await bcrypt.compare(password, hashPassword, function(err,result) {
      resolve(result)
    });
  })
  
};

const getUserById = async (id) => {
  const data = await sql`SELECT * FROM users WHERE id=${id}`

  if (data.length == 0) return false; 
  return data[0];
};

const loginExists = async (login) => {
  const data = await sql`SELECT * FROM users WHERE login=${login}`

  if (data.length == 0) return false; 
  return data[0];
};

module.exports = { loginExists, createUser, matchPassword, ensureAuthenticated, getUserById };