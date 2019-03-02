var express = require('express');
var router = express.Router();
var Property=require('../modules/property');
var PropertyRequest=require('../modules/request-property')
var paginate=require('express-paginate');
var fs=require('fs');

/* GET property page listing. */
router.get('/', function(req, res, next) {
  Property.find({})
  .limit(req.query.limit)
  .skip(req.skip)
  .lean()
  .populate('property_agent_id')
  .exec(function(err,data) {
    Property.count({},function (err,count) {
      const pageCount=Math.ceil(count/req.query.limit);
      console.log(data);
      res.render("property/allProperty",{
        property:data,
        pageCount:pageCount,
        count:count,
        currentPage:req.query.page,
        pages:paginate.getArrayPages(req)(3,pageCount,req.query.page)
      });
    })
  })
});

router.get('/property-advanced-search', function(req, res, next) {
    res.render("property/advanced-search",{search:"Advanced Search"});
});


router.delete('/delete', function(req, res, next) {
  let query={_id:req.body.id}
  Property.find(query,function(err,property) {
    var count=property[0].property_images;
    for (var i = 0; i < count.length; i++) {
      fs.unlink(`./public/uploads/images/${count[i]}`,function (err) {
        if (err) {
          console.log(err);
        }
      })
    }
    Property.remove(query,function(err,property_deleted) {
      if (err) {
        console.log(err);
      }
      res.send({'data':req.body.id});

    })
  })
});
router.get("/for-sale",function (req,res) {
   Property.find({"duration":"sale"},function(err,forSale) {
     if (err) {
       console.log(err);
     }else {
       res.render('property/sale',{forSale:forSale})
     }
   })
})

router.get("/for-rent",function (req,res) {
   Property.find(
     {
       $or:[
         {"duration":"Month"},{"duration":"Year"}
       ]
     },function(err,forRent) {
       if (err) {
         console.log(err);
       }else {
         res.render('property/rent',{forRent:forRent})
       }
   })
})



router.get('/category/:category', function(req, res, next) {
  Property.find({property_category:req.params.category})
  .exec(function(err,property) {
    console.log(property);
    //res.send('<pre>'+property+'</pre>')
     console.log(property);
     res.render('property/index', { property:property });


  })
});




router.get('/:id', function(req, res, next) {
 var id=req.params.id
 //--> you can also use findById(id,function(req,res))... <--//
  Property.findOne({_id:id})
  .populate('property_agent_id')
  .exec(function (err,property) {
  	if(err){
  	 //res.render('error');

  	}
    if (!property) {
      console.log("invalid id");
      //res.render('property/single', { property:"not found"});
      next()
    }else {
      Property.find({property_category:property.property_category})
      .limit(4)
      .sort({created_at:-1})
      .exec(function (err,recent_property) {
        if(err){
          //res.render('error');
        }
        res.render('property/single', { property:property,recent_property:recent_property});

  })
}
})
});


router.get("/buy/request/:id",function(req,res) {
  res.render("property/request",{property_id:req.params.id})
})


router.get('/buy/:id', function(req, res, next) {
  var id=req.params.id
  Property.findOne({_id:id})
  .populate('property_agent_id')
  .exec(function (err,property) {
    if(err){
      //res.render('error');
    }
    res.render('property/buydetails',{property:property})
  })
});

router.post("/buy/request",function(req,res) {
  var fullname=req.body.fullname;
  var phoneNo=req.body.phoneNo;
  var otherPhoneNo=req.body.otherPhoneNo;
  var location=req.body.location;
  var type=req.body.type;
  var email=req.body.email;
  var property_id=req.body.property_id;
  console.log(type);

  req.checkBody('fullname','Land title is required').notEmpty();
  req.checkBody('type','Land title is required').notEmpty();
  req.checkBody('phoneNo','Land discription is required').notEmpty();
  req.checkBody('location','Land proice details is required').notEmpty();
  req.checkBody('email','land location is required').notEmpty();
  let error=req.validationErrors()
  if (error) {
    res.send(error);
  }
  else {
    var newRequest=new PropertyRequest({
       fullname:fullname,
       phone_number:phoneNo,
       other_phone_number:otherPhoneNo,
       location:location,
       email:email,
       type:type,
       property_id:property_id
    })

    newRequest.save(function(err,request) {
      if (err) {
        res.send({error:err,msg:err.message});
      }
      else {
        res.send({success:request,state:'success',property:'property'});
      }
    })
  }
})

module.exports = router;
