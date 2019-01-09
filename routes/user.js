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
          models.Event.create(newEvent)
            .then((event) => {
              models.User.findById(decode.id)
                .then((caregiver) => {
                  caregiver.getReceiver()
                    .then((receivers) => {
                      receivers[0].addEvent(event)
                        .then((eventCreated) => { res.status(200).json(eventCreated); });
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
      // models.User.findAll({
      //   limit: 1,
      //   where: {
      //     userId: decode.id,
      //     status: true,
      //   },
      //   order: [['createdAt', 'DESC']],
      // }).then(result=>console.log("receiverId", result))
      models.User.findById(decode.id).then((caregiver) => { // on checke que l'id dans le token corresponde à la foreign key de user qui est dans event pour avoir les event d'un user en particulier
        caregiver.getReceiver().then((receivers) => { // méthode de sequelize pour récupérer les receivers du caregiver identifié
          // console.log('===================receivers', receivers);
          // const idReceiversArr = receivers.map((receiver) => {
          //   return receiver.dataValues.id;
          // }).sort();
          // console.log(idReceiversArr[0]);
          receivers[0].getEvents().then((events) => { // on récupére le 1er receiver (le plus ancien créé) et je récupére ses events avec la méthode getEvents de sequelize
            res.status(200).json(events);
          });
        });
      });

    //   .then((receiver) => {
    //     models.Event.findAll({
    //     where: {
    //       status: true,
    //       userId: receiver.id,
    //     },
    //   });
    // })
    // .then(events => res.status(200).json(events));
      // models.Event.findAll({
      //   where: {
      //     userId: decode.id, // on checke que l'id dans le token corresponde à la foreign key de user qui est dans event pour avoir les event d'un user en particulier
      //     status: true,
      //   },
      // })
        // .then(events => res.status(200).json(events));
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
