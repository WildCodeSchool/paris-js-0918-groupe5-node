const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const models = require("./models"); 
app.use(cors())
app.use(bodyParser.json());
app.use(
 bodyParser.urlencoded({
   extended: true
 })
);

app.get("/", (req, res) => res.send("Hello World!"));

app.post("/api", (req, res) => {
    const newUser = new models.user({
      lastName: req.body.lastName,
      firstName: req.body.firstName
    });
    newUser.save();
    res.sendStatus(200);
   });

app.get('/api', (req, res) => models.user.findAll({}).then(user => res.json(user)))

const port = process.env.PORT || 4243;
models.sequelize.sync().then(() => {
 app.listen(port, () => console.log(`Listening on port ${port}...`));
});
