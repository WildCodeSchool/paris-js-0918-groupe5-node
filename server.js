const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const models = require('./models');
const jwtSecret = require('./helpers/jwtSecret');
const getToken = require('./helpers/getToken');
const routerAuth = require('./routes/auth');
const routerUsers = require('./routes/user');
const routerContacts = require('./routes/contact');
const routerEvents = require('./routes/event');

const verifyToken = (req, res, next) => {
  const token = getToken(req);
  jwt.verify(token, jwtSecret, (err, decode) => {
    if (err) {
      res.sendStatus(401);
    } else {
      console.log('verifyToken id------------------------', decode.id);
      models.User.findByPk(decode.id)
        .then((caregiver) => {
          if (!caregiver) {
            console.log('verifyToken no caregiver------------------------');
            res.sendStatus(401);
          }
          // we keep the caregiver in the req so we can access it in the following requests
          req.caregiver = caregiver;
          next();
        });
    }
  });
};

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/public', express.static('public'));
app.use('/auth', routerAuth);
// we always want to verify the token before any request after authentication
app.use(verifyToken);
app.use('/users', routerUsers);
app.use('/contacts', routerContacts);
app.use('/events', routerEvents);

const port = process.env.PORT || 4244;

models.sequelize.sync().then(() => {
  app.listen(port, () => console.log(`Listening on port ${port}...`));
});
