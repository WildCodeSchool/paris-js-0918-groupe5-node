const express = require('express');
const models = require('../models');
const properNoun = require('../helpers/properNoun');

const router = express.Router();

router.route('/receivers')
  // get all the active receivers of the connected caregiver
  .get((req, res) => {
    const { selectedReceiverId } = req.caregiver;
    req.caregiver.getReceiver({ where: { status: true } })
      .then((receivers) => {
        res.status(200).json({ receivers, selectedReceiverId });
      });
  })
  // create a new receiver and link it with the connected caregiver
  .post((req, res) => {
    const newReceiver = { ...req.body, firstName: properNoun(req.body.firstName), lastName: properNoun(req.body.lastName) };
    console.log('=================NEW RECEIVER===================', newReceiver);
    newReceiver.avatar = newReceiver.title === 'M.'
      ? 'http://localhost:4245/public/avatars/avatar_old_man.png'
      : 'http://localhost:4245/public/avatars/avatar_old_woman.png';
    models.User.create(newReceiver)
      .then((receiver) => {
        const receiverId = receiver.id;
        req.caregiver.addReceiver(receiver)
          .then(() => {
            req.caregiver.update({
              selectedReceiverId: receiverId,
            });
            res.status(200).json(receiver);
          });
      });
  });

router.route('/receiver/:idReceiver')
  // get the selected receiver of the connected caregiver
  .get((req, res) => {
    const { idReceiver } = req.params;
    models.User.findByPk(idReceiver).then((receiver) => {
      res.status(200).json(receiver);
    });
  })
  // update the selected receiver
  .put((req, res) => {
    const { idReceiver } = req.params;
    const updatedReceiver = { ...req.body, firstName: properNoun(req.body.firstName), lastName: properNoun(req.body.lastName) };
    models.User.findByPk(idReceiver).then((receiver) => {
      updatedReceiver.avatar = updatedReceiver.title === 'M.'
      ? 'http://localhost:4245/public/avatars/avatar_old_man.png'
      : 'http://localhost:4245/public/avatars/avatar_old_woman.png';
      receiver.update({
        ...updatedReceiver,
      }).then(() => {
        res.status(200).json(receiver);
      });
    });
  })
  // delete the selected receiver (change his status to false)
  .delete((req, res) => {
    const { idReceiver } = req.params;
    models.User.findByPk(idReceiver).then((receiver) => {
      receiver.getEvents({ where: { status: true } })
        .then((events) => {
          events.forEach((eventEl) => {
            eventEl.update({
              status: false,
            });
          });
        }).then(() => {
          receiver.update({
            status: false,
          }).then(() => {
            req.caregiver.getReceiver({ where: { status: true } }).then((receivers) => {
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
  // select an other receiver
  .get((req, res) => {
    const { idReceiver } = req.params;
    models.User.findByPk(idReceiver).then((receiver) => {
      req.caregiver.update({
        selectedReceiverId: idReceiver,
      }).then(() => {
        receiver.getEvents({ where: { status: true } })
          .then((events) => {
            receiver.getContacts({ where: { status: true } })
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

router.route('/caregiver')
  // update the connected caregiver
  .put((req, res) => {
    const reqArray = Object.entries(req.body)[0]
    const fieldToModify = reqArray[0]
    const value = reqArray[1]

    if (fieldToModify === 'lastName' || fieldToModify === 'firstName'){
      const updatedCaregiver = properNoun(value);
      req.caregiver.update({ [fieldToModify]: updatedCaregiver}).then(() => {
        res.status(200).json(req.caregiver);
      });
    } else {
      req.caregiver.update({ [fieldToModify]: value}).then(() => {
        res.status(200).json(req.caregiver);
      });
    }
  })

  // delete the connected caregiver (change his status to false)
  .delete((req, res) => {
      req.caregiver.update({
        status: false,
      }).then(() => {
        res.sendStatus(200);
      });
  })
  .get((req, res) => {
    models.User.findByPk(req.caregiver.id).then((caregiver) => {
      res.status(200).json(caregiver);
    });
  });


router.route('/')
  // get all the active users
  .get((req, res) => {
    models.User.findAll({ where: { status: true } }).then((data) => {
      res.status(200).json(data);
    });
  });

module.exports = router;
