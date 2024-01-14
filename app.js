var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');
var sassMiddleware = require('node-sass-middleware');
const session = require('express-session');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const bodyParser = require('body-parser');
const { loginExists, matchPassword, getUserById } = require('./helpers');
const pg = require('pg')
const fs = require('fs')

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const app = express();


passport.serializeUser(function(user, done) { //In serialize user you decide what to store in the session. Here I'm storing the user id only.
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  const user = await getUserById(id);
  done(null, user);
});

passport.use('local-login', new LocalStrategy(async (username, password, done) => {
  const user = await loginExists(username);

  const Client = pg.Client;
  const client = new Client({
    host: 'localhost',
    port: 5432,
    database: 'games',
    user: 'maciejmoczala',
    password: '',
    sslmode: 'require',
    ssl: {
      rejectUnauthorized: false,
      ca: fs.readFileSync('/opt/homebrew/var/postgresql@14/server.crt').toString()
    }
  })
  await client.connect()

  if (!user) {
    console.log(`${username} attempt to login failed, incorret username.`)
    try {
      await client.query(
         'INSERT INTO "audit_log"  ("login", "event_type") VALUES($1, $2)',
         [username, 'Incorrect username']
      );
      console.log('Pomyślnie dodano rekord do audit_log.');
   } catch (error) {
      console.error('Błąd podczas dodawania rekordu do audit_log:', error);
   };
    return done(null, false, { message: 'Incorrect username.' });
  }

  const passesMatch = await matchPassword(password, user.passwd);

  if ( passesMatch ) {
    console.log(`${username} logged in.`)
    await client.query(
      'INSERT INTO "audit_log"  ("login", "event_type") VALUES($1, $2)',
      [username, 'Logged in.']
   );
    return done(null, user);
  }
  try {
    await client.query(
       'INSERT INTO "audit_log"  ("login", "event_type") VALUES($1, $2)',
       [username, 'Incorrect password']
    );
    console.log('Pomyślnie dodano rekord do audit_log.');
 } catch (error) {
    console.error('Błąd podczas dodawania rekordu do audit_log:', error);
 };
  console.log(`${username} attempt to login failed, incorret password.`)
  return done(null, false, { message: 'Incorrect password.' });
}));

// body-parser for retrieving form data
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({ secret: 'super secret' })); 
app.use(passport.initialize());
app.use(passport.session());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());

app.use(sassMiddleware({
  src: path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  indentedSyntax: true, // true = .sass and false = .scss
  sourceMap: true
}));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/users/login',passport.authenticate('local-login',{successRedirect: '/games', failureRedirect: '/'}),
    function(req,res,next){
      res.redirect(301, '/games');
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
