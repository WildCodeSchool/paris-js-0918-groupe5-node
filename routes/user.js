const express = require('express');
const models = require('../models');

const router = express.Router();

router.route('/receivers')
  // get all the active receivers of the connected caregiver
  .get((req, res) => {
    req.caregiver.getReceiver({ where: { status: true } })
      .then((receivers) => {
        res.status(200).json(receivers);
      });
  })
  // create a new receiver and link it with the connected caregiver
  .post((req, res) => {
    const newReceiver = req.body;
    newReceiver.avatar = newReceiver.title === 'M.'
      ? '../assets/avatar_old_man.png'
      : '../assets/avatar_old_woman.png';
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

router.route('/receivers/:idReceiver')
  // update the selected receiver
  .put((req, res) => {
    const { idReceiver } = req.params;
    const updatedReceiver = req.body;
    models.User.findByPk(idReceiver).then((receiver) => {
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
          // est-ce qu'on fais passer le statut des événement à faux ou bien est-ce qu'on casse les liens ac la table d'association
          // est-ce qu'on supprime les contacts ou bien on les garde en mémoire pour le caregiver ?
          events.forEach((eventEl) => {
            eventEl.update({
              status: false,
            });
          });
        });

      receiver.update({
        status: false,
      }).then(() => {
        req.caregiver.getReceiver((receivers) => {
          req.caregiver.update({
            selectedReceiverId: receivers.length > 0 ? receivers[0].id : -1,
          });
        });
        res.sendStatus(200);
      });
    });
  });

router.route('/selectReceiver/:idReceiver')
  // select an other receiver
  .put((req, res) => {
    const { idReceiver } = req.params;
    models.User.findByPk(idReceiver).then((receiver) => {
      req.caregiver.update({
        selectedReceiverId: idReceiver,
      }).then(() => {
        res.status(200).json(receiver);
      });
    });
  });

// router.route('/caregiver/contacts')
//   // get all the active contact created by the connected caregiver
//   .get((req, res) => {
//     const { selectedReceiverId } = req.caregiver;
//     req.caregiver.getReceiver({
//       where: {
//         status: true,
//         id !== selectedReceiverId,
//       },
//     }).then((receivers) => {
//       receivers.forEach((receiver) => {
//         receiver.getContacts({
//           where: {
//             status: true,
//           },
//         })
//           .then((contacts) => {

//           });
//       });
//     });
//   });

router.route('/caregiver')
  // update the connected caregiver
  .put((req, res) => {
    const updatedCaregiver = req.body;
      req.caregiver.update({
        ...updatedCaregiver,
      }).then(() => {
        res.status(200).json(req.caregiver);
      });
  })
  // delete the connected caregiver (change his status to false)
  .delete((req, res) => {
      req.caregiver.update({
        status: false,
      }).then(() => {
        res.sendStatus(200);
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
