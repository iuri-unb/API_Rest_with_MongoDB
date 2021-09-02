const nodemailer = require('nodemailer');
const hbs = require("nodemailer-express-handlebars"); // serve para preencher variaveis em HTML
const path = require("path");
const {host , port , user , pass } = require("../config/mail.json");
const transport = nodemailer.createTransport({
    host ,
    port ,
    auth: { user ,pass },
  });

  transport.use("compile " , hbs ({
    viewEngine: 'handlebars',
    viewPaht: path.resolve("./src/resources/mails/"), // sempre parte da raiz absoluta do projeto
    extName: '.html',
  }));
  module.exports = transport;