let mongoose = require('mongoose');
let Schema=mongoose.Schema;
let propertyRequetSchema=mongoose.Schema({
  property_id:[{
    type:Schema.Types.ObjectId,
    ref:'propertys'
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
  email:{
    type:String,
    required:true
  },
  type:{
    type:Array,
    required:true
  },
 created_at:{
    type:Date,
    default:new Date(),
  },
});
let PropertyRequest=module.exports= mongoose.model('propertyRequets',propertyRequetSchema)
