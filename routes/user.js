const express = require('express');
const models = require('../models');
const properNoun = require('../helpers/properNoun');

const router = express.Router();

router.route('/')
  .get((req, res) => { // get all the active users
    models.User.findAll({
      where: {
        status: true,
      },
    })
      .then((data) => {
        res.status(200).json(data);
      });
  });

router.route('/caregiver')
  .get((req, res) => { // get a caregiver by his id
    models.User.findByPk(req.caregiver.id)
      .then((caregiver) => {
        res.status(200).json(caregiver);
      });
  })

  .put((req, res) => { // update the connected caregiver
    const reqArray = Object.entries(req.body)[0]; // we transform the req.body into an array to browse it to get out the value of the field to modify
    const fieldToModify = reqArray[0]; // here we get the field in database (ex firstName, lastName...)
    const value = reqArray[1]; // here we get the value to modify

    if (fieldToModify === 'lastName' || fieldToModify === 'firstName') {
      const updatedCaregiver = properNoun(value); // if the condition is ok we change the first letter into upperCase
      req.caregiver.update({
        [fieldToModify]: updatedCaregiver,
      })
        .then(() => {
          res.status(200).json(req.caregiver);
        });
    } else {
      req.caregiver.update({ // else we change the value as it is received
        [fieldToModify]: value,
      })
        .then(() => {
          res.status(200).json(req.caregiver);
        });
    }
  })

  .delete((req, res) => { // delete the connected caregiver (change his status to false)
      req.caregiver.update({
        status: false,
      })
        .then(() => {
          res.sendStatus(200);
        });
  });

router.route('/receivers')
  .get((req, res) => { // get all the active receivers of the connected caregiver
    const { selectedReceiverId } = req.caregiver;
    req.caregiver.getReceiver({
      where: {
        status: true,
      },
    })
      .then((receivers) => {
        res.status(200).json({ receivers, selectedReceiverId });
      });
  })

  .post((req, res) => { // create a new receiver and link it with the connected caregiver
    const newReceiver = { // changing the first letter of firstName and lastName into upper cases
      ...req.body,
      firstName: properNoun(req.body.firstName),
      lastName: properNoun(req.body.lastName),
    };

    newReceiver.avatar = newReceiver.title === 'M.' // loading man avatar or woman avatar according to sex title
      ? 'http://localhost:4244/public/avatars/avatar_old_man.png'
      : 'http://localhost:4244/public/avatars/avatar_old_woman.png';

    models.User.create(newReceiver) // we add this new receiver into database
      .then((receiver) => {
        const receiverId = receiver.id;
        req.caregiver.addReceiver(receiver) // we connect this receiver into the connected caregiver
          .then(() => {
            req.caregiver.update({
              selectedReceiverId: receiverId, // and we select this newreceiver
            });
            res.status(200).json(receiver);
          });
      });
  });

router.route('/receiver/:idReceiver')
  .get((req, res) => { // get the selected receiver of the connected caregiver
    const { idReceiver } = req.params;
    models.User.findByPk(idReceiver)
      .then((receiver) => {
        res.status(200).json(receiver);
      });
  })

  .put((req, res) => { // update the selected receiver
    const { idReceiver } = req.params;

    const updatedReceiver = { // changing the first letter of firstName and lastName into upper cases
      ...req.body,
      firstName: properNoun(req.body.firstName),
      lastName: properNoun(req.body.lastName),
    };

    models.User.findByPk(idReceiver).then((receiver) => {
      updatedReceiver.avatar = updatedReceiver.title === 'M.'
      ? 'http://localhost:4244/public/avatars/avatar_old_man.png'
      : 'http://localhost:4244/public/avatars/avatar_old_woman.png';
      receiver.update({
        ...updatedReceiver,
      }).then(() => {
        res.status(200).json(receiver);
      });
    });
  })

  .delete((req, res) => { // delete the selected receiver (change his status to false)
    const { idReceiver } = req.params;
    models.User.findByPk(idReceiver)
    .then((receiver) => {
      receiver.getEvents({ // we get all active events of the receiver
        where: {
          status: true,
        },
      })
        .then((events) => {
          events.forEach((eventEl) => { // we set all of his events'status to false
            eventEl.update({
              status: false,
            });
          });
        }).then(() => {
          receiver.update({ // we set his status to false
            status: false,
          }).then(() => {
            req.caregiver.getReceiver({ // then we get all active receivers of the caregiver connected
              where: {
                status: true,
              },
            }).then((receivers) => { // and we set the id of the selectedReceiver
              req.caregiver.update({
                selectedReceiverId: receivers.length > 0 ? receivers[0].id : -1,
              });
            });
            res.sendStatus(200);
          });
        });
    });
  });

router.route('/selectReceiver/:idReceiver')
  .get((req, res) => { // select an other receiver
    const { idReceiver } = req.params;
    models.User.findByPk(idReceiver) // we get the id of the receiver clicked
    .then((receiver) => {
      req.caregiver.update({ // we set the value of the selectedReceiverId of the caregiver connected with this id
        selectedReceiverId: idReceiver,
      }).then(() => {
        receiver.getEvents({ // we get all the active events of this receiver
          where: {
            status: true,
          },
        })
          .then((events) => {
            receiver.getContacts({ // we get all the active contacts of this receiver
              where: {
                status: true,
              },
            })
              .then((contacts) => {
                res.status(200).json({
                  receiver,
                  events,
                  contacts,
                });
              });
          });
        // res.status(200).json(receiver);
      });
    });
  });

module.exports = router;
