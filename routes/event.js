const express = require('express');
const jwt = require('jsonwebtoken');

const models = require('../models');
const getToken = require('../helpers/getToken');
const jwtSecret = require('../jwtSecret');

const router = express.Router();

router.route('/')
  .post((req, res) => {
    const token = getToken(req); // on utilise la fonction créée dans getToken pour récupérer le token (clé créée lors du signin) qui identifie le user
    jwt.verify(token, jwtSecret, (err, decode) => { // decode c'est ce qu'il y a dans le tokenInfo (donc l'id)
      if (err) {
        res.sendStatus(403);
      } else {
        const newEvent = {
          ...req.body,
        };
        models.Event.create(newEvent) // on créée un nouvel event dans la table Event avec le contenu du req.body
          .then((event) => {
            models.User.findById(decode.id) // ensuite on va chercher le caregiver dont l'id correspond à celui du token
              .then((caregiver) => {
                caregiver.getReceiver() // je récupère les receiver du caregiver
                  .then((receivers) => {
                    if (receivers[0].status) {
                      receivers[0].addEvent(event) // et je lie l'événement créée au 1er receiver
                        .then((eventCreated) => {
                          res.status(200).json(eventCreated);
                        });
                    } else {
                      res.sendStatus(403);
                    }
                  });
              });
          });
      }
    });
  })
  .get((req, res) => { // pour récupérer les events d'un user une fois connecté
    const token = getToken(req); // on utilise la fonction créée dans getToken pour récupérer le token (clé créée lors du signin) qui identifie le user
    jwt.verify(token, jwtSecret, (err, decode) => { // decode c'est ce qu'il y a dans le tokenInfo (donc l'id)
      if (err) {
        res.sendStatus(403);
      } else {
        models.User.findById(decode.id) // on checke que l'id dans le token corresponde à la foreign key de user qui est dans event pour avoir les event d'un user en particulier
        .then((caregiver) => {
          caregiver.getReceiver() // méthode de sequelize pour récupérer les receivers du caregiver identifié
            .then((receivers) => {
              if (receivers[0].status) { // si le receiver le plus ancien est actif
                receivers[0].getEvents() // on récupére le 1er receiver (le plus ancien créé) et je récupére ses events avec la méthode getEvents de sequelize
                  .then((events) => {
                    res.status(200).json(events);
                });
              } else {
                res.sendStatus(403);
              }
          });
        });
      }
    });
  });

// router.post('/', (req, res) => {
// 	const data = req.body;
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
