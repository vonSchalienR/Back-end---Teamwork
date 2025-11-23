// Load environment variables from .env (optional). This allows using MONGO_URI from .env or docker-compose.
require('dotenv').config();

const express = require('express');
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

// Palvellaan staattiset tiedostot kansiosta src/resources/public
app.use(express.static(path.join(__dirname, 'resources/public')));

// Lomake-data (POST) käyttöön
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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
