var express = require('express');
var Land=require('../modules/land');
var LandRequest=require('../modules/request-land')
var paginate=require('express-paginate');

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  Land.find({})
  .limit(req.query.limit)
  .skip(req.skip)
  .lean()
  .exec(function(err,data) {
    Land.count({},function (err,count) {
      console.log(count);
      const pageCount=Math.ceil(count/req.query.limit);
      console.log(paginate);
      res.render("land/allLand",{
        land:data,
        pageCount:pageCount,
        count:count,
        currentPage:req.query.page,
        pages:paginate.getArrayPages(req)(3,pageCount,req.query.page)
      });
    })
 });
});


router.post('/', function(req, res, next) {
  var land_title=req.body.land_title;
  var land_discription=req.body.land_discription;
  var land_price=req.body.land_price;
  var land_area=req.body.land_area;
  var land_location=req.body.land_location;
  var location_details=req.body.location_details;
  var land_category="land";
  var property_agent_id=req.body.property_agent_id;

  req.checkBody('land_title','Land title is required').notEmpty();
  req.checkBody('land_discription','Land discription is required').notEmpty();
  req.checkBody('land_area','Land Area is required').notEmpty();
  req.checkBody('land_price','Land pro=ice details is required').notEmpty();
  req.checkBody('land_location','land location is required').notEmpty();
  req.checkBody('location_details','land location details is required').notEmpty();
  let error=req.validationErrors()
  if (error) {
    res.send({error})
    console.log(error);
  }
  else {
    var newLand=new Land({
      land_title:land_title,
      land_discription:land_discription,
      land_category:land_category,
      land_location:land_location,
      location_details:location_details,
      land_price:land_price,
      land_area:land_area,
      land_agent_id:property_agent_id,
    })
    newLand.save(function(err,land) {
      if (err) {
        console.log(err);
      }
      else {
        res.send({success:land});
      }
    })
  }
});


router.get("/buy/request/:id",function(req,res) {
  res.render("land/request",{land_id:req.params.id})
})


router.post("/buy/request",function(req,res) {
  var fullname=req.body.fullname;
  var phoneNo=req.body.phoneNo;
  var otherPhoneNo=req.body.otherPhoneNo;
  var location=req.body.location;
  var email=req.body.email;
  var land_id=req.body.land_id;

  req.checkBody('fullname','Land title is required').notEmpty();
  req.checkBody('phoneNo','Land discription is required').notEmpty();
  req.checkBody('location','Land proice details is required').notEmpty();
  req.checkBody('email','land location is required').notEmpty();
  let error=req.validationErrors()
  if (error) {
    res.send(error);
  }
  else {
    var newRequest=new LandRequest({
       fullname:fullname,
       phone_number:phoneNo,
       otherPhoneNo:otherPhoneNo,
       location:location,
       email:email,
       land_id:land_id
    })
    newRequest.save(function(err,request) {
      if (err) {
        res.send({error:err,msg:err.message});
      }
      else {
        res.send({success:request,state:'success'});
      }
    })
  }
})
router.delete('/delete', function(req, res, next) {
  let query={_id:req.body.id}
  Land.remove(query,function(err,landDeleted) {
    if (err) {
      console.log(err);
    }
    res.send({'data':req.body.id});

  })
});
/**
* post land
*/
router.get('/:id', function(req, res, next) {
  var id=req.params.id
  Land.findOne({_id:id})
  .populate('land_agent_id')
  .exec(function (err,land) {
    if(err){
      //res.render('error');
    }
    res.render('land/single',{land:land})
  })
});
router.get('/buy/:id', function(req, res, next) {
  var id=req.params.id
  Land.findOne({_id:id})
  .populate('land_agent_id')
  .exec(function (err,land) {
    if(err){
      //res.render('error');
    }
    res.render('land/buydetails',{land:land})
  })
});
module.exports = router;
