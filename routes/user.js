const express = require('express');
const jwt = require('jsonwebtoken');

const jwtSecret = require('../jwtSecret');
const models = require('../models');
const getToken = require('../helpers/getToken');

const router = express.Router();

router.get('/events', (req, res) => { // pour récupérer les events d'un user une fois connecté
  const token = getToken(req); // on utilise la fonction créée dans getToken pour récupérer le token (clé créée lors du signin) qui identifie le user
  jwt.verify(token, jwtSecret, (err, decode) => { // decode c'est ce qu'il y a dans le tokenInfo (donc l'id)
    if (err) {
      res.sendStatus(403);
    } else {
      models.event.findAll({
        where: {
          userId: decode.id, // on checke que l'id dans le token corresponde à la foreign key de user qui est dans event pour avoir les event d'un user en particulier
          status: true,
        },
      })
        .then(events => res.status(200).json(events));
    }
  });
});

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
