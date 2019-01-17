const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const jwtSecret = require('../helpers/jwtSecret');
const models = require('../models');

const router = express.Router();

router.post('/signup', (req, res) => { // Caregiver creation
  models.User.create(req.body)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch(() => {
      res.sendStatus(500);
    });
});

router.post('/signin', (req, res) => {
  const { email, password } = req.body;
  // find in the db an user which have the same email than the one entered by the user
  models.User.findOne({
    where: {
      email,
    },
  })
  .then((user) => {
    bcrypt.compare(password, user.password, (err, match) => {
      if (match) {
        const tokenInfo = {
          email,
          id: user.id,
        };
        // creation of the token with the tokenInfo
        // we use the jwtSecret to create it (and decrypt it later)
        const token = jwt.sign(tokenInfo, jwtSecret);
        // creation of an header 'Access-Control...' with the name 'x-access-token'
        res.header('Access-Control-Expose-Headers', 'x-access-token');
        // we set the value of the header with the token
        res.set('x-access-token', token);
        res.status(200).send({ id: user.id });
      } else {
        res.sendStatus(403);
      }
    });
  })
  .catch(() => res.sendStatus(404));
});

module.exports = router;
