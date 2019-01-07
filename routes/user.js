const express = require('express');
const models = require('../models');

const router = express.Router();

router.route('/receivers/:caregiverId')
  .get((req, res) => {
    const { caregiverId } = req.params;

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
  })
  .post((req, res) => {
    const data = req.body;
    // console.log("User added");
    const NewUser = new models.User(data);
    NewUser.save()
      .then((user) => {
        // when we received a NewUser, we send back a JSON to the client
        res.status(200).json(user);
      })
      .catch((err) => {
        console.log(err.message);
      }); // to do - error handling
  });

module.exports = router;
