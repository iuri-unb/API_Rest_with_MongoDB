const mongoose =  require ('mongoose');
// Conexão com o mongodb
mongoose.connect("mongodb://localhost/noderest", 
{   //yuseMongoClient : true,
    useNewUrlParser: true, // new parameters
    useUnifiedTopology: true
} );

mongoose.Promise= global.Promise; 

module.exports = mongoose;