const express = require('express');
const jwt = require('jsonwebtoken');

const jwtSecret = require('../jwtSecret');
const models = require('../models');
const getToken = require('../helpers/getToken');

const router = express.Router();

// .then(result => {
//   result.findAll({
//   limit: 1,
//   order: [['createdAt', 'DESC']],
//   )}

router.route('/events')
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
                    receivers[0].addEvent(event) // et je lie l'événement créée au 1er receiver
                      .then((eventCreated) => {
                        res.status(200).json(eventCreated);
                      });
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
              }
          });
        });
      }
    });
  });

router.route('/contacts')
  .post((req, res) => {
    const token = getToken(req);
    jwt.verify(token, jwtSecret, (err, decode) => {
      if (err) {
        res.sendStatus(403);
      } else {
        const newContact = {
          ...req.body,
        };
        models.Contact.create(newContact)
          .then((contact) => {
            models.User.findById(decode.id)
              .then((caregiver) => {
                caregiver.getReceiver()
                  .then((receivers) => {
                    if (receivers[0].status) {
                      receivers[0].addContact(contact)
                        .then((contactCreated) => {
                          res.status(200).json(contactCreated);
                        });
                    }
                  });
              });
          });
      }
    });
  })
  .get((req, res) => {
    const token = getToken(req);
    jwt.verify(token, jwtSecret, (err, decode) => {
      if (err) {
        res.sendStatus(403);
      } else {
        models.User.findById(decode.id)
        .then((caregiver) => {
          caregiver.getReceiver()
            .then((receivers) => {
              if (receivers[0].status) {
                receivers[0].getContacts()
                  .then((contacts) => {
                    res.status(200).json(contacts);
                });
              }
          });
        });
      }
    });
  });

router.route('/receivers/:caregiverId')
  .get((req, res) => {
    const { caregiverId } = req.params; // on récupére le 1er receiver (le plus ancien créé) et je récupére ses events avec la méthode getEvents de sequelize
    models.User.findById(caregiverId).then((caregiver) => {
      caregiver.getReceiver().then((receivers) => {
        res.status(200).json(receivers);
      });
    });
  })
  .post((req, res) => {
    const { caregiverId } = req.params;
    const newReceiver = req.body;
    newReceiver.avatar = newReceiver.title === 'M.' ? '../assets/avatar_old_man.png' : '../assets/avatar_old_woman.png';

    models.User.create(newReceiver).then((receiver) => {
      models.User.findById(caregiverId).then((caregiver) => {
        caregiver.addReceiver(receiver).then((obj) => {
          res.status(200).json(obj);
        });
      });
    });
  });

router.route('/')
  .get((req, res) => {
    models.User.findAll().then((data) => {
      res.status(200).json(data);
    });
  });

  // .post((req, res) => {
  //   const data = req.body;
  //   // console.log("User added");
  //   const NewUser = new models.User(data);
  //   NewUser.save()
  //     .then((user) => {
  //       // when we received a NewUser, we send back a JSON to the client
  //       res.status(200).json(user);
  //     })
  //     .catch((err) => {
  //       console.log(err.message);
  //     }); // to do - error handling
  // });

module.exports = router;
