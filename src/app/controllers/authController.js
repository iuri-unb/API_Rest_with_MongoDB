const express = require('express');
const bcrypt = require ('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const authconfig = require("../../config/auth");
const crypto = require("crypto");
const mailer = require('../../modules/mailer');

const router = express.Router(); /* define uma rota para o usuario */

function generatetokens (params = { } ) 
{
   return  jwt.sign( params , authconfig.secret, {
        expiresIn: 86400, // tempo que o token irá expirar, por padrão 1 dia
    });
}

router.post('/register' , async(req,res ) => {
    // testa a inserção dos dados no banco
    // imsonia ->  base_url/auth/register colocar na barra de pesquisa
    const { email } = req.body;
    try
    {
        if(await User.findOne({ email }))
            return res.status(400).send({ error : "Usúario já cadastrado no banco" });
        /* informacoes de cadastro nome, email ... vão tudo para esse create */
        /* todos os parametros estao dentro de req.body */
        const user = await User.create(req.body); // await espera até essa linha ser executada

        user.password = undefined; // remove o password manualmente do imnsonia

        // Mostra o usuario e token quando cria o usúario com o sucesso
        return res.send( { 
            user, 
            token: generatetokens({id: user.id }) ,
        });
    }
    catch(err)
    {
        return res.status(400).send({ error : "Falha no Registro"});
    }
});

router.post('/authenticate' , async (req, res) =>
{   //usuario loga com o email e senha
    const { email , password } = req.body;
    
    // realiza uma busca para ver a existência do email no banco de dados
    // como necessita verificar se o email e senha coincidem com as corretas, precisa puxar tb a senha, por isso do select
    const user = await User.findOne( { email } ).select('+password') ;

    if(!user)
        return res.status(400).send( { error : "Usuario não encontrado!"} );
    
    // Compara se a senha do banco é igual com a senha inserida pelo usúario
    // usa o bcrypt.compare, pois criptografamos a senha na modelagem da senha
    if(! await bcrypt.compare(password , user.password) ) // usa await pq é um função assincrona
        return res.status(400).send({error : "Senha incorreta!" });
    
    user.password = undefined; // não retorna a senha no imnsonia
    
    //gera token , e passa o id, pois é o que diferencia um token de outro. Passa tb um hash, tb tem q ser único para a aplicação
    // para diferenciar um token dessa aplicação de outra
    
     // mosntra usuario e o token quando loga com sucesso
    res.send({
        user, 
        token: generatetokens({ id : user.id }),
    });
});
router.post('/forgot_password' , async (req, res) =>
{ 
    const {email} = req.body;

    try 
    {
        const user = await User.findOne({email}) ; // procura o usúario com esse email

        if(!user)
            return res.status(400).send({error :  "Usuario não encontrado!"});

        // gera um token com 20 catac aleatorios em hexadecimais
        const token = crypto.randomBytes(20).toString('hex');

        const now = new  Date(); // determina o tempo de expiração do token
        now.setHours(now.getHours() + 1); // tempo de agora + 1

        await User.findByIdAndUpdate(user.id , {
            '$set':  // indica quais os campos que irá setar 
            {
                passwordResetToken: token,
                passwordResetExpires: now, 
            }
        });

        //console.log(token , now); // manda uma msg no console, com o token e a data com hora

        mailer.sendMail ({
            to: email,
            from: "iurisousavieira@gmail.com",
            template: "auth/forgot_password",
            token: {token},
        } , (err) => 
        {
            if(err)
                return res.status(400).send({erros : "erro na senha esquecida, tente novamente."});

            return res.send(); // se não deu erro, retorne 200, significa -> OK    
        })
        
    }
    catch(err)
    {
        console.log(err); // bom pra debugar
        res.status(400).send( {error : "Erro na senha esquecida, tente novamente!"});
    }
});
/** definindo as rotas usando o app */
// toda vez que o usuario acessar o '/auth', ele chama o router!
// todas rotas q definimos nesse arquivo, serão prefixadas com o /auth
module.exports = app => app.use('/auth' , router);