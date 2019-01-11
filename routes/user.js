const express = require('express');
const models = require('../models');

const router = express.Router();

  router.route('/receivers')
    .get((req, res) => {
      req.caregiver.getReceiver()
        .then((receivers) => {
          res.status(200).json(receivers);
        });
    })
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

router.route('/')
  .get((req, res) => {
    models.User.findAll().then((data) => {
      res.status(200).json(data);
    });
  });

module.exports = router;
