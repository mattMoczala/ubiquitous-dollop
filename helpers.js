

const sql = require('./dbConnection')
const bcrypt = require("bcryptjs")

const createUser = async (login, password, displayName, role) => {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
 
  const data = await sql`
  INSERT INTO users(login, passwd, displayName, role) VALUES (${login}, ${hash}, ${displayName}, ${role}) RETURNING id, login, passwd
  `;
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