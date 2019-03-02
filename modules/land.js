let mongoose = require('mongoose');
let Schema=mongoose.Schema;
let landSchema=mongoose.Schema({
  land_agent_id:[{
    type:Schema.Types.ObjectId,
    ref:'agents'
  }],
  land_title:{
    type:String,
    required:true
  },
  land_category:{
      type:String,
      required:true
    },
  land_discription:{
    type:String,
    required:true
  },
  land_location:{
    type:String,
    required:true
  },
  land_price:{
    type:Number,
    required:true
  },
  location_details:{
    type:String,
    required:true
  },
  land_area:{
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

let Land=module.exports= mongoose.model('lands',landSchema)
