const express = require('express');
const jwt = require('jsonwebtoken');

const models = require('../models');
const getToken = require('../helpers/getToken');
const jwtSecret = require('../jwtSecret');

const router = express.Router();

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
      const newEvent = new models.Event(data);
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

router.get('/', (req, res) => {
	models.Event.findAll()
		.then((data) => {
			res.status(200).json(data);
		});
});

// router.post('/', (req, res) => {
// 	const data = req.body;
// 	console.log('data => ', req.body);
// 	// console.log(`Ajout de ${data}`);
// 	const newEvent = new models.Event(data);
// 	newEvent.save()
// 		.then(() => {
// 			res.status(200).json(newEvent);
// 		})
// 		.catch((err) => {
// 			console.log(err.message);
// 		});
// });

module.exports = router;
