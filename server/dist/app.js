"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var compression = require("compression");
var bodyParser = require("body-parser");
var passport = require("passport");
var Sequelize = require("sequelize");
var secrets_1 = require("./utils/secrets");
var models_1 = require("./models");
var cors = require("cors");
var config_1 = require("./config");
var google_auth_library_1 = require("google-auth-library");
var jwt = require("jsonwebtoken");
var request = require("request");
// Create Express server
var app = express();
// Connect to SQL
var sequelize = new Sequelize(secrets_1.DBConfig.DBNAME, secrets_1.DBConfig.USERNAME, secrets_1.DBConfig.PASSWORD, {
    host: secrets_1.DBConfig.HOST,
    dialect: 'mysql',
    operatorsAliases: false,
    port: secrets_1.DBConfig.PORT,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
});
sequelize
    .authenticate()
    .then(function () {
    console.log('Connection has been established successfully.');
    models_1.initModels(sequelize);
})
    .catch(function (err) {
    console.error('Unable to connect to the database:', err);
});
// Express configuration
app.set('port', 3000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(cors());
config_1.passportConfig(passport);
/**
 * OAuth authentication routes. (Sign in)
 */
app.post('/auth/facebook', passport.authenticate('facebook-token', { session: false }), function (req, res) {
    res.send(req.user);
});
app.post('/auth/google', function (req, res) {
    var client = new google_auth_library_1.OAuth2Client(secrets_1.GoogleConfig.ClientID);
    client.verifyIdToken({
        idToken: req.body.id_token,
        audience: secrets_1.GoogleConfig.ClientID
    }).then(function (ticket) {
        var profile = ticket.getPayload();
        if (!profile)
            return res.sendStatus(401);
        models_1.models.User.findOrCreate({
            where: {
                googleId: profile.email
            },
            defaults: {
                firstName: profile.given_name,
                lastName: profile.family_name,
                googleId: profile.email,
            }
        }).then(function (response) {
            var user = response[0].dataValues;
            user.token = jwt.sign(user, secrets_1.JWTKey);
            res.send(user);
        });
    });
});
app.post('/auth/login', passport.authenticate('local', { session: false }), function (req, res) {
    res.send(req.user);
});
app.post('/auth/signin', function (req, res) {
    models_1.models.User.findOrCreate({
        where: {
            userName: req.body.username
        },
        defaults: {
            firstName: req.body.username,
            userName: req.body.username,
            password: req.body.password
        }
    }).then(function (response) {
        var user = response[0].dataValues;
        user.token = jwt.sign(user, secrets_1.JWTKey);
        res.send(user);
    });
});
// Search Routes
app.get('/search', passport.authenticate('jwt', { session: false }), function (req, res) {
    var term = req.query.term;
    request({
        url: "https://api.github.com/search/repositories?q=" + term + "%20-language:" + term,
        headers: {
            'user-agent': 'node.js'
        }
    }, function (error, response, responseBody) {
        var body = JSON.parse(responseBody);
        var results = body.items.map(function (item) {
            return ({
                name: item.name,
                owner: {
                    name: item.owner.login,
                    url: item.owner.html_url
                },
                url: item.html_url,
                description: item.description,
                stars: item.stargazers_count,
                homepage: item.homepage
            });
        });
        models_1.models.Search.upsert({
            term: term,
            user: req.user.id
        });
        res.send(results);
    });
});
app.get('/search/history', passport.authenticate('jwt', { session: false }), function (req, res) {
    models_1.models.Search.findAll({
        where: {
            user: req.user.id
        },
        order: [['createdAt', 'DESC']],
        limit: 5
    }).then(function (result) {
        res.send(!!result ? result.map(function (r) { return r.term; }) : null);
    });
});
exports.default = app;
