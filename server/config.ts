import * as  FacebookTokenStrategy from 'passport-facebook-token';
import * as LocalStrategy from 'passport-local';
import * as PassportJWT from 'passport-jwt';
import * as jwt from 'jsonwebtoken';
import { models } from './models';
import { FacebookConfig, JWTKey } from './utils/secrets';

export const passportConfig = function (passport)
{
    passport.use(new FacebookTokenStrategy({
        clientID: FacebookConfig.clientID,
        clientSecret: FacebookConfig.clientSecret
    }, (accessToken, refreshToken, profile, done) =>
        {
            models.User.findOrCreate({
                where: {
                    facebookId: profile.id
                },
                defaults: {
                    firstName: profile.name.givenName,
                    lastName: profile.name.familyName,
                    facebookId: profile.id,
                }
            }).then((response) =>
            {
                const user = response[0].dataValues;
                user.token = jwt.sign(user, JWTKey);
                done(null, user);
            });
            // console.log(accessToken, refreshToken, profile);
        })
    );
    passport.use(new LocalStrategy(
        function (username, password, done)
        {
            models.User.findOne({
                where: {
                    userName: username,
                    password: password
                }
            }).then(response =>
            {
                if (response)
                {
                    const user = response.dataValues;
                    user.token = jwt.sign(user, JWTKey);
                    done(null, user);
                }
                else
                {
                    done('No User Found', null);
                }
            });
        }
    ));
    passport.use(new PassportJWT.Strategy({
        jwtFromRequest: PassportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: JWTKey
    },
        function (jwtPayload, cb)
        {
            cb(null, jwtPayload);
        }
    ));
};
