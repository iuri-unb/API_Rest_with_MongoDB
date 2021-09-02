const express = require('express');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.use(authMiddleware);

router.get('/' , (req,res) => {
    // user Id É IMPORTANTE, pois garante que o usúario é aquele usuario mesmo autenticado, exemplo: usuario x , altera senha do usuario x
    res.send({ ok: true , user : req.userId});// como usou userId no req (middelware), pode printar o userId na tela do imnso
});

module.exports = app => app.use('/project', router);