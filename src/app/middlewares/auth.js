// middleware serve para interceptar o usúario para realizar determinadas ações
// só dps de dar o comando next() que o usuario irá pra o controller e prosseguir
const jwt = require('jsonwebtoken');
const authconfig = require('../../config/auth.json');
module.exports = (req,res , next) => 
{
    const authHeader = req.headers.authorization;

    // Verificações saúdaveis para nossa aplicação, já que não conseme quase nada de processamento  
    if(! authHeader) // erro 401 é erro de autorização
        return res.status(401).send({ error : "Token não foi informado!"});

    const parts = authHeader.split(' '); // separa para um vetor

    // padrão do token -> Bearer dlkasnio23432dk32lldak423mf
    if(!parts.lenght === 2)
        return res.status(401).send({ error : "Erro de Token!"}) ;
        
    // schema recebe Bearer , e token = token gigantesco (padrão)
    const [ scheme , token ] = parts ;

    // '/' inicio da regex , ^ inicio da verificação , '$' fim , i -> case sensitive
    if(!/^Bearer$/i.test(scheme) )
        return res.status(401).send({ error : "Token mal formatado!"});
    
     // err retorna um erro se tiver , decoded -> id do usúario caso o token está correto
    jwt.verify(token , authconfig.secret , (err , decoded) =>
    {
        if(err) return res.status(401).send({ error : "Erro token inválido!"});
      
        // inclui a info do user id para as próximas requisições para o controller
        // req.userId pode ser usado em qualquer func controllers que esteja autenticado
        
        req.userId = decoded.id; // é decoded.id pois na authcontroller(controllers) a gente passa um id nos parametros da func generatetoken
        return next(); // indica que pode passar para a próxima etapa (cotroller)
    });
};  