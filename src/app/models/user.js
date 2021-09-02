const mongoose = require('../../database');

const bcrypt = require('bcryptjs');
const UserSchema = new mongoose.Schema
({
    name: 
    {
        type: String,
        required : true ,
    },
    email: 
    {
        type: String,
        required : true,
        unique : true,
        lowercase: true,
    },
    password: 
    {
        type : String,
        required: true,
        select : false, // quando realizar uma busca de usuarios, não trará junto a senha , por isso select = false
    },

    passwordResetToken:
    {
        type: String,
        select: false,
    },

    passwordResetExpires:
    {
        type: Date,
        select: false,
    },

    createdAt: 
    {
        type : Date,
        default: Date.now,
    },
        
}); 
// só é possível usar o await com o async
// antes de salvar, encripte a senha. Por isso do uso do Pre.
UserSchema.pre('save' , async function(next)
{
    /** Encripta a senha com o numero de rounds = 10, para deixar mais forte o hash  */
    // this refere-se ao objeto que está sendo salvado
    const hash = await bcrypt.hash(this.password , 10);
    this.password = hash; 

    next();
});

const User = mongoose.model('User', UserSchema); /* nome da tabela é User */ 

module.exports = User;