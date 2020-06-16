const morgan = require('morgan');
const helmet = require('helmet');
const express = require('express');
const server = express();

const dbConnection = require('./data/data-config')

const session = require('express-session');
const KnexSessionStore = require('connect-session-knex')(session);
const sessionConfig = {
    name: 'mmm',
    secret: 'secret',
    cookie: {
      maxAge: 1000 * 60 * 10 * 6,
      secure: false,
      httpOnly: true,
    },
    resave: false,
    saveUninitialized: true,
    store: new KnexSessionStore({
      knex: dbConnection,
      createtable: true,
      clearInterval:  1000 * 60 * 60* 24, // one day
    })
  };

server.use(session(sessionConfig));
server.use(helmet());
server.use(express.json());
server.use(morgan());

const authRouter = require('./auth/auth-router');
const usersRouter = require('./users/users-router');

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req,res) => {
    res.status(200).json({api:'is up'});
})

module.exports=server;