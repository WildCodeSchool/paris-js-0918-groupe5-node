const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const models = require('./models');
const routerAuth = require('./routes/auth');
const routerContacts = require('./routes/contact');
const routerUsers = require('./routes/user');
const routerEvents = require('./routes/event');

const app = express();

app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/contacts', routerContacts);
app.use('/users', routerUsers);
app.use('/events', routerEvents);
app.use('/auth', routerAuth);

// app.post('/api', (req, res) => {
//   const newUser = new models.User({
//     lastName: req.body.lastName,
//     firstName: req.body.firstName,
//   });
//   newUser.save();
//   res.sendStatus(200);
// });

const port = process.env.PORT || 4244;

// app.get('/api', (req, res) => (
//   // models.user.findAll({}).then(user => res.json(user))
// );

models.sequelize.sync().then(() => {
  app.listen(port, () => console.log(`Listening on port ${port}...`));
});
