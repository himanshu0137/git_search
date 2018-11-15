"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var FacebookTokenStrategy = require("passport-facebook-token");
var LocalStrategy = require("passport-local");
var PassportJWT = require("passport-jwt");
var jwt = require("jsonwebtoken");
var models_1 = require("./models");
var secrets_1 = require("./utils/secrets");
exports.passportConfig = function (passport) {
    passport.use(new FacebookTokenStrategy({
        clientID: secrets_1.FacebookConfig.clientID,
        clientSecret: secrets_1.FacebookConfig.clientSecret
    }, function (accessToken, refreshToken, profile, done) {
        models_1.models.User.findOrCreate({
            where: {
                facebookId: profile.id
            },
            defaults: {
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                facebookId: profile.id,
            }
        }).then(function (response) {
            var user = response[0].dataValues;
            user.token = jwt.sign(user, secrets_1.JWTKey);
            done(null, user);
        });
        // console.log(accessToken, refreshToken, profile);
    }));
    passport.use(new LocalStrategy(function (username, password, done) {
        models_1.models.User.findOne({
            where: {
                userName: username,
                password: password
            }
        }).then(function (response) {
            if (response) {
                var user = response.dataValues;
                user.token = jwt.sign(user, secrets_1.JWTKey);
                done(null, user);
            }
            else {
                done('No User Found', null);
            }
        });
    }));
    passport.use(new PassportJWT.Strategy({
        jwtFromRequest: PassportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: secrets_1.JWTKey
    }, function (jwtPayload, cb) {
        cb(null, jwtPayload);
    }));
};
