import * as express from 'express';
import * as compression from 'compression';
import * as bodyParser from 'body-parser';
import * as passport from 'passport';
import * as Sequelize from 'sequelize';
import { DBConfig, GoogleConfig, JWTKey } from './utils/secrets';
import { initModels, models } from './models';
import * as cors from 'cors';
import { passportConfig } from './config';
import { OAuth2Client } from 'google-auth-library';
import * as jwt from 'jsonwebtoken';
import * as request from 'request';

// Create Express server
const app = express();

// Connect to SQL
const sequelize = new Sequelize(DBConfig.DBNAME, DBConfig.USERNAME, DBConfig.PASSWORD, {
  host: DBConfig.HOST,
  dialect: 'mysql',
  operatorsAliases: false,
  port: DBConfig.PORT,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
});

sequelize
  .authenticate()
  .then(() =>
  {
    console.log('Connection has been established successfully.');
    initModels(sequelize);
  })
  .catch(err =>
  {
    console.error('Unable to connect to the database:', err);
  });

// Express configuration
app.set('port', process.env.PORT || 3000);
app.use(compression());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(cors());
app.use(express.static(`${__dirname}/view`));

passportConfig(passport);

app.get('/', (req, res) =>
{
  res.render('index');
});

/**
 * OAuth authentication routes. (Sign in)
 */
app.post('/auth/facebook',
  passport.authenticate('facebook-token', { session: false }),
  function (req, res)
  {    // do something with req.user
    res.send(req.user);
  }
);
app.post('/auth/google', (req, res) =>
{
  const client = new OAuth2Client(GoogleConfig.ClientID);
  client.verifyIdToken({
    idToken: req.body.id_token,
    audience: GoogleConfig.ClientID
  }).then((ticket) =>
  {
    const profile = ticket.getPayload();
    if (!profile) return res.sendStatus(401);
    models.User.findOrCreate({
      where: {
        googleId: profile.email
      },
      defaults: {
        firstName: profile.given_name,
        lastName: profile.family_name,
        googleId: profile.email,
      }
    }).then((response) =>
    {
      const user = response[0].dataValues;
      user.token = jwt.sign(user, JWTKey);
      res.send(user);
    });
  });
});
app.post('/auth/login',
  passport.authenticate('local', { session: false }),
  function (req, res)
  {
    res.send(req.user);
  }
);
app.post('/auth/signin',
  function (req, res)
  {
    models.User.findOrCreate({
      where: {
        userName: req.body.username
      },
      defaults: {
        firstName: req.body.username,
        userName: req.body.username,
        password: req.body.password
      }
    }).then((response) =>
    {
      const user = response[0].dataValues;
      user.token = jwt.sign(user, JWTKey);
      res.send(user);
    });
  });


// Search Routes
app.get('/search', passport.authenticate('jwt', { session: false }),
  (req, res) =>
  {
    const term: string = req.query.term;
    request({
      url: `https://api.github.com/search/repositories?q=${term}%20-language:${term}`,
      headers: {
        'user-agent': 'node.js'
      }
    },
      (error, response, responseBody: string) =>
      {
        const body = JSON.parse(responseBody);
        const results = body.items.map(item =>
          ({
            name: item.name,
            owner: {
              name: item.owner.login,
              url: item.owner.html_url
            },
            url: item.html_url,
            description: item.description,
            stars: item.stargazers_count,
            homepage: item.homepage
          }));

        models.Search.upsert({
          term: term,
          user: req.user.id
        });
        res.send(results);
      });
  });

app.get('/search/history', passport.authenticate('jwt', { session: false }),
  (req, res) =>
  {
    models.Search.findAll({
      where: {
        user: req.user.id
      },
      group: ['term'],
      order: [['createdAt', 'DESC']],
      limit: 5
    }).then(result =>
    {
      res.send(!!result ? result.map(r => r.term) : null);
    });
  });

export default app;
