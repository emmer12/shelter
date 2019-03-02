var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
const passport = require('passport');
const flash=require('connect-flash');
const multer = require('multer');
const path = require('path');
var Agent=require('../modules/agent')
var Property=require('../modules/property')

/**

   -------------------------------------
     ++++++> CONFIG  ['muter'] <++++++++
   -------------------------------------

**/

var storage=multer.diskStorage({
  destination:'./public/uploads/images',
  filename:function(req,file,cb){
    cb(null,file.fieldname+'-'+Date.now()+path.extname(file.originalname));
  }
});
var upload=multer({storage:storage}).any('property_images');
var uploadUpdate=multer({storage:storage}).single('company-logo');




/**

   -------------------------------------
     ++++++> GET REQUESTS  <++++++++
   -------------------------------------

**/
/* GET agent register page. */

router.get('/logout',function(req,res,next){
  req.logout();
  res.redirect('login');
});



/* GET agent register page. */

router.get('/register',notLoggedIn, function(req, res, next) {

  /**
   *

  let newAgent=new Agent({
     firstname:'shelt',
     lastname:'shelt',
     company:'shelt',
     username:'admin_emmer',
     email:'shelt@gmail.com',
     phone_number:'080SHELTHOT',
     password:'$2a$10$y7.3KeNZQCTVNXTqnj9QQuuZjHQ./wWBkX/.AZGkiuLTSeKsrNUpe',
     location:'Lagos',
     address:'No 61 ikeja Lagos',
     profile_image:'shelt.logo.png',
     auth:true,
     diskSpace:'unlimited',
     activate:true,
     hash:"shelter_hashing_$2a$10$y7.3KeNZQCTVNXTqnj9QQuuZjHQ./wWBkX/.AZGkiuLTSeKsrNUpe"
  });
  newAgent.save(function (err) {
    if (err) {
      console.log(err);
    }else {
      console.log(newAgent);
    }
  })
  */
  res.render('agent/register');
});

/* GET agent login page. */

router.get('/login',notLoggedIn, function(req, res, next) {
  var message=req.flash('error');
  res.render('agent/login',{
    //csrfToken:req.csrfToken(),
    error:message,
    hasError:message.length > 0
  });
});

/* GET agent dashboard page. */

router.get('/dashboard',isLoggedIn, function(req, res, next) {
  Property.find({property_agent_id:req.user.id},function (err,property) {
      var count=property.length;
      var agent=req.user;
      if (count >=agent.diskSpace) {
        var isMemory=false;
      }else {
        var isMemory=true;
      }
      console.log(req.user,"user");
    res.render('agent/dashboard',{properties:property,isMemory:isMemory});
  })
});



/**

   -------------------------------------
     ++++++> POST REQUESTS  <++++++++
   -------------------------------------

**/
router.post('/register', function(req, res, next) {
  const firstname=req.body.firstname;
  const lastname=req.body.lastname;
  const company=req.body.company;
  const username=req.body.username;
  const address=req.body.address;
  const email=req.body.email;
  const phone_number=req.body.phone_number;
  const location=req.body.location;
  const password=req.body.password;
  const confirm_password=req.body.confirm_password;

  req.checkBody('firstname','firstname is required').notEmpty();
  req.checkBody('lastname','lastname is required').notEmpty();
  req.checkBody('company','company name is required').notEmpty();
  req.checkBody('username','username is required').notEmpty();
  req.checkBody('address','address is required').notEmpty();
  req.checkBody('email','email is required').notEmpty();
  req.checkBody('email','email is not valid').isEmail();
  req.checkBody('location','location is required').notEmpty();
  req.checkBody('phone_number','phoneNo is required').notEmpty();
  req.checkBody('password','password is required').notEmpty();
  req.checkBody('confirm_password','password do not match').equals(password);
  let error=req.validationErrors();
  if (error) {
  	res.send({error:error});
  }
  else{
        Agent.findOne({
          $or:[
            {"username":username},{"email":email}
          ]},function(err,agent) {
          if (agent) {
            if (agent.username == username) {
              res.send({error:`username <b>${username}</b> has been taken`,state:'error'});
            }else {
              res.send({error:`email <b>${email}</b> has been taken`,state:'error'});
            }
          }
          else{

            let newAgent=new Agent({
              firstname:firstname,
              lastname:lastname,
              company:company,
              username:username,
              address:address,
              email:email,
              phone_number:phone_number,
              password:password,
              location:location,
            });
            bcrypt.genSalt(10,function(err,salt){
              bcrypt.hash(newAgent.password,salt,function(err,hashPass) {
                if (err) {
                  console.log(err);
                }
                bcrypt.hash('shelter_hashing',salt,function(err,hash) {
                  if (err) {
                    console.log(err);
                  }
                  newAgent.password=hashPass;
                  newAgent.hash=hash
                  newAgent.save(function(err) {
                    if (err) {
                      console.log(err);
                    }
                    else{
                      res.send({state:'success'});

                    }
                  })

                })
              })
            })

          }
        })

      }

});


 router.post("/login",function(req,res,next){
    passport.authenticate('local.agent',{
      successRedirect:'/agent/dashboard',
      failureRedirect:'/agent/login',
      failureFlash:true
    })(req,res,next);
  });


/* POST property  */
router.post('/property',function(req,res){
	 upload(req,res,function(err) {
     if (err) {
       console.log(err);
     }
     else {
     var property_title=req.body.property_title;
     var property_details=req.body.property_details;
     var property_features=req.body.property_features;
     var property_price=req.body.property_price;
     var property_location=req.body.property_location;
     var property_address=req.body.property_address;
     var property_category=req.body.property_category;
     var property_agent_id=req.body.property_agent_id;
     var special_product=req.body.special_product;
     var special_rate=req.body.special_rate;
     var property_duration=req.body.property_duration;
     var property_agent_id=req.body.property_agent_id;
     var property_images=req.files;

     req.checkBody('property_title','property title is required').notEmpty();
     req.checkBody('property_duration','property duration is required').notEmpty();
     req.checkBody('property_details','property details is required').notEmpty();
     req.checkBody('property_features','property features is required').notEmpty();
     req.checkBody('property_price','property price is required').notEmpty();
     req.checkBody('property_location','property location is required').notEmpty();
     req.checkBody('property_address','property address is required').notEmpty();
     req.checkBody('property_category','property category is required').notEmpty();
     let error=req.validationErrors();
     if (error) {
       res.send({error:error})
       console.log(error);
       return false
     }else{
     var images=[];
     for (var i = 0; i < property_images.length; i++) {
     	newImages=property_images[i].filename
        images.push(newImages)
     };
     var property_features=property_features.split(',')

     //** genrated a random refrence number  **//
     var ref_number=Math.floor(Math.random(1000) * 100000)

     var newProperty=new Property({
     	 property_title:property_title,
     	 property_details:property_details,
     	 property_features:property_features,
       property_location:property_location,
       property_address:property_address,
     	 property_category:property_category,
     	 property_price:property_price,
       special_rate:special_rate,
       special_product:special_product,
       duration:property_duration,
     	 property_agent_id:property_agent_id,
     	 property_images:images,
       ref_number:ref_number
     })


     newProperty.save(function(err,property) {
     	if (err) {
     		console.log(err)
     	}
     	else{
        console.log(property);
     		res.send({success:true})
     	}
     })

 }
}
});
});

router.post("/update",function(req,res) {
  uploadUpdate(req,res,function(err) {
    if (err) {
      console.log(err);
    }
    else {

   var updateAgent={}
   var id=req.body.agent_id
   if (req.file===undefined) {
     updateAgent.fullname=req.body.fullname;
     updateAgent.username=req.body.username;
     updateAgent.company=req.body.company
     updateAgent.phone_number=req.body.phone_number
     updateAgent.location=req.body.location
  }else {
    updateAgent.fullname=req.body.fullname;
    updateAgent.username=req.body.username;
    updateAgent.company=req.body.company
    updateAgent.phone_number=req.body.phone_number
    updateAgent.location=req.body.location
    updateAgent.profile_image=req.file.filename
 }
 let query={_id:id}
 Agent.update(query,updateAgent,function(err,agent) {
   if (err) {
     console.log(err);
   }else {
     req.flash('success',"Account was successfully updated")
     res.redirect('/agent/dashboard')
   }
 })
 }
})
})
router.get('/subscribe',function(req,res) {
  res.render('agent/subscribe')
})
router.get('/:id', function(req, res, next) {
  Agent.findById(req.params.id)
  .exec(function(err,agent) {
    console.log(agent);
    res.render('agent/agent', { agentInfo:agent });
  })
});


module.exports = router;

/**

   -------------------------------------
     ++++++> HELPER FUNCTIONS  <++++++++
   -------------------------------------

**/

function isLoggedIn(req,res,next){
   if(req.isAuthenticated()){
     return next();
   }
   res.redirect('/')
 }
 function notLoggedIn(req,res,next){
   if(!req.isAuthenticated()){
     return next();
   }
   var error=req.flash('danger','Your access to ths page has been denied')
   res.redirect('/')
 }
