let mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
let agentSchema=mongoose.Schema({
  firstname:{
    type:String,
    required:true
  },
  lastname:{
    type:String,
    required:true
  },
  company:{
    type:String,
    required:false
  },
  username:{
    type:String,
    required:true
  },
  admin:{
    type:String,
    required:true,
    default:false
  },
   email:{
      type:String,
      required:true
    },
  phone_number:{
       type:String,
       required:true
     },
  location:{
        type:String,
        required:true
      },
  address:{
    type:String,
    required:true
  },
  activate:{
        type:Boolean,
        default:false
          },
  auth:{
      type:Boolean,
      default:false
        },

  profile_image:{
         type:String,
         default:"default.png"
           },
  diskSpace:{
        type:String,
        default:"3"
          },
   password:{
      type:String,
      required:true
    },
    hash:{
      type:String,
      required:true
    },
   created_at:{
    type:Date,
    default:new Date(),
  }


});
agentSchema.methods.encryptPassword=function(password) {
  return bcrypt.hashSync(password,bcrypt.genSaltSync(5),null)
}
agentSchema.methods.validPassword=function(password) {
  return bcrypt.compareSync(password,this.password)
}


let Agent=module.exports= mongoose.model('agents',agentSchema)
