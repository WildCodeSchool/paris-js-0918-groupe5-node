const express = require('express');
const jwt = require('jsonwebtoken');

const Router = express.Router();

const jwtSecret = require('../jwtSecret');

Router.get('/', (req, res) => {
  res.send('authentification page');
});

Router.post('/connexion', (req, res) => {
  console.log(req.body);
  if (req.body.mail === 'widaad.barreto@gmail.com' && req.body.password === 'coucou') {
    const tokenInfo = {
      mail: req.body.mail,
      role: 'LordOfChicken',
    };
    const token = jwt.sign(tokenInfo, jwtSecret);
    console.log(token);
    res.header('Access-Control-Expose-Headers', 'x-access-token');
    res.set('x-access-token', token);
    res.status(200).send({ info: 'user connected' });
  }
});

module.exports = Router;
