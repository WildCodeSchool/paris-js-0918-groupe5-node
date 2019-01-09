const express = require('express');
const jwt = require('jsonwebtoken');

const models = require('../models');
const getToken = require('../helpers/getToken');
const jwtSecret = require('../jwtSecret');

const router = express.Router();

// .then(result => {
//   result.findAll({
//   limit: 1,
//   order: [['createdAt', 'DESC']],
//   )}

// router.route('/receivers/:caregiverId')
//   .get((req, res) => {
//     const { caregiverId } = req.params; // on récupére le 1er receiver (le plus ancien créé) et je récupére ses events avec la méthode getEvents de sequelize
//     models.User.findById(caregiverId).then((caregiver) => {
//       caregiver.getReceiver().then((receivers) => {
//         res.status(200).json(receivers);
//       });
//     });
//   })
//   .post((req, res) => {
//     const { caregiverId } = req.params;
//     const newReceiver = req.body;
//     newReceiver.avatar = newReceiver.title === 'M.' ? '../assets/avatar_old_man.png' : '../assets/avatar_old_woman.png';

//     models.User.create(newReceiver).then((receiver) => {
//       models.User.findById(caregiverId).then((caregiver) => {
//         caregiver.addReceiver(receiver).then((obj) => {
//           res.status(200).json(obj);
//         });
//       });
//     });
//   });

  router.route('/receivers')
  .get((req, res) => {
    const token = getToken(req);
      jwt.verify(token, jwtSecret, (err, decode) => {
        if (err) {
          res.sendStatus(403);
        } else {
          const caregiverId = decode.id; // on récupére le 1er receiver (le plus ancien créé) et je récupére ses events avec la méthode getEvents de sequelize
          models.User.findById(caregiverId)
            .then((caregiver) => {
              caregiver.getReceiver()
                .then((receivers) => {
                  res.status(200).json(receivers);
                });
            });
        }
    });
  })
  .post((req, res) => {
    const token = getToken(req);
    jwt.verify(token, jwtSecret, (err, decode) => {
      const caregiverId = decode.id;
      if (err) {
        res.sendStatus(403);
      } else {
        const newReceiver = req.body;
        newReceiver.avatar = newReceiver.title === 'M.' ? '../assets/avatar_old_man.png' : '../assets/avatar_old_woman.png';
        models.User.create(newReceiver)
          .then((receiver) => {
            models.User.findById(caregiverId)
              .then((caregiver) => {
                caregiver.addReceiver(receiver)
                  .then((receiverCreated) => {
                    res.status(200).json(receiverCreated);
                  });
              });
          });
      }
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
