const express = require('express');
const jwt = require('jsonwebtoken');

const models = require('../models');
const jwtSecret = require('../jwtSecret');

const getToken = require('../helpers/getToken');

const router = express.Router();

router.route('/')
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
                          // console.log('=====================', contactCreated[0][0].dataValues);
                          models.Contact.findById(contactCreated[0][0].dataValues.ContactId)
                          .then((contactUpdated) => {
                            res.status(200).json(contactUpdated);
                          });
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
                    receivers[0].setContact(contactUpdated)
                      .then(contactUpdated => res.status(200).json(contactUpdated));
                });
              } else {
                res.sendStatus(403);
              }
          });
        });
      }
    });
  })
  .put((req, res) => {
    const token = getToken(req);
    jwt.verify(token, jwtSecret, (err, decode) => {
      if (err) {
        res.sendStatus(403);
      } else {
        const contactUpdated = {
          ...req.body,
        };
        models.Contact.update(contactUpdated)
          .then((contact) => {
            models.User.findById(decode.id)
              .then((caregiver) => {
                caregiver.getReceiver()
                  .then((receivers) => {
                    if (receivers[0].status) {
                      receivers[0].getContacts(contactUpdated.id)
                        .then(() => {
                          receivers[0].setContact(contact)
                            .then(newContactUpdated => res.status(200).json(newContactUpdated));
                        });
                    }
                  });
              });
          });
        }
    });
  });

// router.get('/:x', (req,res) => {
// models.users.findAll({
// where : {
// firstname : req.params.x
// }
// }).then(data  => {
// res.status(200).json(data)
// })
// })

// router.post('/', (req, res) => {
//   const data = req.body;
//   console.log("Ajout d'un contact");
//   const newContact = new models.Contact(data);
//   newContact.save()
//     .then((contact) => {
//       // when we received a newContact, we send back a JSON to the client
//       res.status(200).json(contact);
//     })
//     .catch((err) => {
//       console.log(err.message);
//     });
// });

// router.put('/:id(\\d+)', (req,res) => {
// models.users.findById(req.params.id)
// .then(userFound => {
// if(userFound){
// const data = req.body;
// models.users.update(
// data,
// { where : { id : req.params.id } }
// )
// .then(
// updatedUser => {
// res.status(200).send(`user update at id ${req.params.id}`)
// })
// }
// else {
// return res.status(404).send("User no exist")
// }
// })
// })

module.exports = router;
