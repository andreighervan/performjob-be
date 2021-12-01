const express = require('express');
const app = express();
const morgan = require('morgan');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv/config');
const authJwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');

app.use(cors());
app.options('*', cors());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});

//middleware
app.use(express.json());
app.use(morgan('tiny'));
//app.use(authJwt());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use(errorHandler);

//Routes
const jobsRoutes = require('./routes/jobs');
const usersRoutes = require('./routes/users');
const postsRoutes = require('./routes/posts');
const categoriesRoutes = require('./routes/categories');

const api = process.env.API_URL;

app.use(`${api}/jobs`, jobsRoutes);
app.use(`${api}/users`, usersRoutes);
app.use(`${api}/posts`, postsRoutes);
app.use(`${api}/categories`, categoriesRoutes);

//Database
mongoose
    .connect(process.env.CONNECTION_STRING, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        dbName: process.env.DB_NAME
    })
    .then(() => {
        console.log('we are using ' + process.env.DB_NAME);
        console.log('Database Connection is ready...');
    })
    .catch((err) => {
        console.log(err);
    });
const PORT = process.env.PORT || 3000;
//Server
app.listen(PORT, () => {
    console.log('server is running http://localhost:3000');
});
