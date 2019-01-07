const express = require('express');
const jwt = require('jsonwebtoken');

const jwtSecret = require('../jwtSecret');
const models = require('../models');
const getToken = require('../helpers/getToken');

const router = express.Router();

router.post('/', (req, res) => { // Créér un vieux
  const data = req.body;
  console.log(req.body);
  const newUser = new models.user(data);
  newUser.save()
    .then((user) => {
    // when we received a newContact, we send back a JSON to the client
      res.status(200).json(user);
    })
    .catch((err) => {
      res.send(err.message);
      console.log(err.message);
    });
});

router.get('/all', (req, res) => {
  models.user.findAll()
    .then((data) => {
      res.status(200).json(data);
    });
});

router.get('/events', (req, res) => {
  const token = getToken(req); // on utilise la fonction créée dans getToken pour récupérer le token (clé créée lors du signin)
  jwt.verify(token, jwtSecret, (err, decode) => { // decode c'est ce qu'il y a dans le tokenInfo (donc l'id)
    if (err) {
      res.sendStatus(403);
    } else {
      models.event.findAll({
        where: {
          userId: decode.id, // on checke que l'id dans le token corresponde à la foreign key de user qui est dans event pour avoir les event d'un user en particulier
          status: true,
        },
      })
        .then(events => res.status(200).json(events));
    }
  });
});

module.exports = router;
