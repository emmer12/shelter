let mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
let adminSchema=mongoose.Schema({
  username:{
    type:String,
    required:true
  },
   email:{
      type:String,
      required:true
    },
   password:{
      type:String,
      required:true
    },

});

let Admin=module.exports= mongoose.model('admins',adminSchema)
