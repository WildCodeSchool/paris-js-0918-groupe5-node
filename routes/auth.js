const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const router = express.Router();

const jwtSecret = require('../jwtSecret');
const models = require('../models');

router.post('/signup', (req, res) => { // Créér un aidant
  const { password } = req.body;
  console.log("Ajout d'un contact");
  bcrypt.hash(password, 10, (err, hash) => { // bcrypt permet de crypter le mot de passe que le client rentre avant la création du user
    if (err) {
      res.sendStatus(500);
    } else {
      const data = { // s'il n'y a pas d'erreur, je récupère toutes les infos du body et req.body.password devient 'hash', le mot de passe crypté. et il sera enregostré crypté en bdd
        ...req.body,
        password: hash,
      };
      const newUser = new models.user(data); // je créee dinc un nouvel user avec un mot de passe crypté
      newUser.save()
        .then((user) => {
        // when we received a newContact, we send back a JSON to the client
          res.status(200).json(user);
        })
        .catch((error) => {
          console.log(error.message);
        });
    }
    // Store hash in your password DB.
  });
});

router.post('/signin', (req, res) => {
  console.log('=======================', req.body);
  const { email, password } = req.body;
  models.user.findOne({// je cherche dans la bdd un user dont le mail correspond au mail rentré par le user
    where: {
      email,
    },
  })
    .then((user) => {
      if (user) { // si j'ai bien un user
        bcrypt.compare(password, user.password, (err, match) => { // alors avec la méthode compare de bcrypt, je compare le mot de passe rentré par le user avec le mdp crypté en bdd
          console.log('match', match);
          if (match) { // si le mdp du user et le mdp crypté en bdd correspondent, alors je stocke dans tokenInfo, le mail et l'id du user
            const tokenInfo = {
              email,
              id: user.id,
            };
            const token = jwt.sign(tokenInfo, jwtSecret); // et j'utilise le jwtSecret pour créér et plus tard décrypter le token que l'on a crée avec le tokenInfo
            console.log('token================', token);
            res.header('Access-Control-Expose-Headers', 'x-access-token'); // je crée un header de type 'access-contro...' avec le nom 'x-access-token')
            res.set('x-access-token', token);// je set la valeur du header avec le token
            res.status(200).send({ info: 'user connected' });// si c'est ok
          } else {
            res.sendStatus(403);
          }
        });
      } else {
        res.sendStatus(404);
      }
    });
});

module.exports = router;
