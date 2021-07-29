var express = require('express');
var router = express.Router();
var paginate=require('express-paginate');
var Property=require('../modules/property')
var Land=require('../modules/land')
var Agent=require('../modules/agent')



/* GET API */
router.get('/api/users',function(req,res,next) {
  Agent.find({},function(err,data) {
    if (err) {
      return
    }
    return res.json({data:data});

  })
})


/* GET home page. */
router.get('/', function(req, res, next) {
   var message=req.flash('danger');
   Property.find({})
   .limit(3)
   .sort({created_at:-1})
  .populate('property_agent_id')
  .exec(function(err,properties){
  if (err) {
    console.log(err);
  }
  //res.send(properties)
  Property.find({})
  .limit(3)
  .sort({special_rate:-1})
  .where({'special_rate':true})
  .populate('property_agent_id')
  .exec(function(err,special_prop) {
    Land.find({})
    .limit(3)
    .sort({created_at:-1})
   .populate('land_agent_id')
   .exec(function(err,land){
   res.render('index', { property:properties,special_property:special_prop,land:land,message:message,hasError:message.length > 0 });
});
});
});
});
router.get('/search', function(req, res, next){
const { range,property_type,property_address_state,action }=req.query;
var str=range;
var index=str.indexOf('-');
var minR=parseInt(str.substr(1,index-1))
var maxR=parseInt(str.substr(index+3));
  Property.find({
    $or:[
    {"property_category":property_type},
    {"property_location":property_address_state},
    {"property_price":{'$gt':minR,'$lt':maxR}}
  ]})
  .limit(req.query.limit)
  .skip(req.skip)
  .lean()
  .exec(function(err,search_result) {
    if (err) {
      console.log(err);
    }else {
      Property.count({
        $or:[
        {"property_category":property_type},
        {"property_location":property_address_state},
        {"property_price":{'$gt':minR,'$lt':maxR}}
      ]},function (err,count) {
      const pageCount=Math.ceil(count/req.query.limit);
      res.render('search',{
        search_result:search_result,
        count:count,
        pageCount:pageCount,
        currentPage:req.query.page,
        pages:paginate.getArrayPages(req)(3,pageCount,req.query.page)
      })
  })
}
})
// else if (property_address_state=='any') {
//   Property.find({})
//   .where({'property_category':property_type,'property_price':{'$gt':minR,'$lt':maxR}})
//   .exec(function(err,search_result) {
//     if (err) {
//       console.log(err);
//     }else {
//       var count=search_result.length
//       res.render('search',{search_result:search_result,count:count})
//     }
//   })
// }
// else if (property_address_state=='any' && property_type=='any') {
//   Property.find({})
//   .where({'property_price':{'$gt':minR,'$lt':maxR}})
//   .exec(function(err,search_result) {
//     if (err) {
//       console.log(err);
//     }else {
//       var count=search_result.length
//       res.render('search',{search_result:search_result,count:count})
//     }
//   })
// }
// else if ($minR==0 && maxR==1000) {
//   Property.find({})
//   .where({'property_category':property_type,'property_location':property_address_state})
//   .exec(function(err,search_result) {
//     if (err) {
//       console.log(err);
//     }else {
//       var count=search_result.length
//       res.render('search',{search_result:search_result,count:count})
//     }
//   })
// }
// else {
//   Property.find({})
//   .where({'property_category':property_type,'property_location':property_address_state,'property_price':{'$gt':minR,'$lt':maxR}})
//   .exec(function(err,search_result) {
//     if (err) {
//       console.log(err);
//     }else {
//       var count=search_result.length
//       res.render('search',{search_result:search_result,count:count})
//     }
//   })
//
// }
})


module.exports = router;
