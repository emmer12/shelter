let mongoose = require('mongoose');
let Schema=mongoose.Schema;
let landRequetSchema=mongoose.Schema({
  land_id:[{
    type:Schema.Types.ObjectId,
    ref:'lands'
  }],
  fullname:{
    type:String,
    required:true
  },
  phone_number:{
      type:Number,
      required:true
    },
  other_phone_number:{
    type:Number,
    required:false
  },
  location:{
    type:String,
    required:true
  },
  type:{
    type:String,
    required:Array
  },
  email:{
    type:String,
    required:true
  },
 created_at:{
    type:Date,
    default:new Date(),
  },
});
let LandRequest=module.exports= mongoose.model('landRequets',landRequetSchema)
