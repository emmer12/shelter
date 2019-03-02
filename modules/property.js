let mongoose = require('mongoose');
let Schema=mongoose.Schema;
let propertySchema=mongoose.Schema({
  property_agent_id:[{
    type:Schema.Types.ObjectId,
    ref:'agents'
  }],
  property_title:{
    type:String,
    required:true
  },
  property_category:{
      type:String,
      required:true
    },
  property_details:{
    type:String,
    required:true
  },
  property_location:{
    type:String,
    required:true
  },
  property_address:{
    type:String,
    required:true
  },
  property_features:{
    type:Array,
    required:true
  },
  property_price:{
    type:Number,
    required:true
  },
  property_images:{
    type:Array,
    required:true
  },
  special_rate:{
    type:String,
  },
  special_product:{
    type:Boolean,
    required:true
  },
  duration:{
    type:String,
    required:true
  },
  ref_number:{
    type:Number,
    required:true
  },
 created_at:{
    type:Date,
    default:new Date(),
  },



});

propertySchema.methods.encryptPassword=function(password) {
  return bcrypt.hashSync(password,bcrypt.genSaltSync(5),null)
}
propertySchema.methods.validPassword=function(password) {
  return bcrypt.compareSync(password,this.password)
}


let Property=module.exports= mongoose.model('propertys',propertySchema)
