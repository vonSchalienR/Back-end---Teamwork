// Load environment variables from .env (optional). This allows using MONGO_URI from .env or docker-compose.
require('dotenv').config();

const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const User = require('./app/models/User');
const helmet = require('helmet');
const sass = require('sass');
const path = require('path');
const handlebars = require('express-handlebars');
const methodOverride = require('method-override');
const morgan = require('morgan');
const route = require('./routes');
const db = require('./config/db');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Security headers
app.use(
    helmet({
        contentSecurityPolicy: false, 
    })
);

// Palvellaan staattiset tiedostot kansiosta src/resources/public
app.use(express.static(path.join(__dirname, 'resources/public')));

// Lomake-data (POST) käyttöön
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session middleware (MemoryStore by default - not for production)
app.use(
    // Use connect-mongo as session store when MONGO_URI is available
    session({
        secret: process.env.SESSION_SECRET || 'change_this_secret',
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/baokim_dev',
            ttl: 24 * 60 * 60, // 1 day
        }),
        cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
    })
);

// Make current user available to views via res.locals.user
app.use(async (req, res, next) => {
    res.locals.user = null;
    try {
        if (req.session && req.session.userId) {
            const user = await User.findById(req.session.userId).lean();
            res.locals.user = user || null;
        }
        next();
    } catch (err) {
        next(err);
    }
});

// Protect routes: require login for non-whitelisted routes
const authMiddleware = require('./middleware/auth');
app.use(authMiddleware);

// Yhteys tietokantaan
db.connect();

// app.use(morgan('combined'))
app.set('view cache', false);

app.engine(
    'hbs',
    handlebars.engine({
        extname: 'hbs',
        cache: false,
            helpers: {
                sum: (a, b) => a + b,
                ifEq: function (a, b, options) {
                    return (a === b) ? options.fn(this) : options.inverse(this);
                },
                truncate: function (text, length) {
                    if (text == null) return '';
                    const s = String(text);
                    const n = parseInt(length, 10) || 140;
                    if (s.length <= n) return s;
                    return s.slice(0, n) + '...';
                },
            }
    }),
);

app.set('view engine', 'hbs');
app.use(methodOverride('_method'));
app.set('views', path.join(__dirname, 'resources', 'views'));

// Reitit
route(app);

app.listen(port, () => {
    console.log(`App listening on port http://localhost:${port}`);
});
