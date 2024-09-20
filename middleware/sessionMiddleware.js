const session = require('express-session');
const MongoStore = require('connect-mongo');

const sessionMiddleware = session({
    secret: 'thisismynewtoken',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost:27017/furniture',
        collectionName: 'sessions'
    })
});

module.exports = sessionMiddleware;
