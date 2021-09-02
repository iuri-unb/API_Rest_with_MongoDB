const fs = require('fs');

const path = require('path');

module.exports = app => 
{
    fs 
        .readdirSync(__dirname) // lê o diretorio(o que está operando  o index.js)
        .filter(file => ( ( file.indexOf('.')) !== 0 && (file !== ("index.js")))) // procura todos arquivos que não são index e não começam com '.'
        .forEach(file =>  require(path.resolve(__dirname, file))(app) );//
};