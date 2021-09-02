const express = require("express");

const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended : false } ));

/* Referencia o authcontroller , passando o app, para assim definir
as rotas desejadas,exemplo -> module.exports = app => app.use()    */
require ("./app/controllers/authController")(app);
require ("./app/controllers/projectControllers")(app);

app.listen(3000);