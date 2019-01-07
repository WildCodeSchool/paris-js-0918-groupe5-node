const express = require('express');
const jwt = require('jsonwebtoken');

const router = express.Router();

const models = require('../models');
const getToken = require('../helpers/getToken');
const jwtSecret = require('../jwtSecret');

// router.get('/', (req, res) => {
//   models.event.findAll()
//     .then((data) => {
//       res.status(200).json(data);
//     });
// });

router.post('/', (req, res) => {
  const token = getToken(req); // on utilise la fonction créée dans getToken pour récupérer le token (clé créée lors du signin)
  jwt.verify(token, jwtSecret, (err, decode) => { // decode c'est ce qu'il y a dans le tokenInfo (donc l'id)
    if (err) {
      res.sendStatus(403);
    } else {
      const data = {
        ...req.body,
        userId: decode.id,
      };
      const newEvent = new models.event(data);
      newEvent.save()
        .then((event) => { // when we received a newContact, we send back a JSON to the client
          res.status(200).json(event);
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
  });
});

module.exports = router;
