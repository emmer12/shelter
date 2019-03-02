var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
const passport = require('passport');
const flash=require('connect-flash');
var Property=require('../modules/property')
var Land=require('../modules/land')
var PropertyRequest=require('../modules/request-property')
var LandRequest=require('../modules/request-land')
var humanReadableTimeDiff=require('../config/humanReadableTimeDiff')
var Agent=require('../modules/agent')


router.get('/login',notLoggedIn,function (req,res){
  var message=req.flash('error');
  res.render('admin/login',
  {
  error:message,
  hasError:message.length > 0
}
)

})
router.get('/dashboard',isLoggedIn,function (req,res){
 Property.find()
.populate('property_agent_id')
.exec(function (err,property) {
  if(err){
    console.log(err);
  }
  Land.find()
 .populate('land_agent_id')
 .exec(function (err,land) {
   res.render('admin/dashboard',{property:property,land:land,isAdmin:'admin'})
})
})
})

router.get('/requests',function(req,res) {
  PropertyRequest.find()
 .populate('property_id')
 .exec(function (err,propertyRequests) {
   if(err){
     console.log(err);
   }
   LandRequest.find()
  .populate('land_id')
  .exec(function (err,landRequests) {
    console.log(landRequests);
    res.render('admin/requests',{landRequests:landRequests})
 })
 })
})
router.post('/login',function (req,res,next){
  passport.authenticate('local.admin',{
    successRedirect:'/admin/dashboard',
    failureRedirect:'/admin/login',
    failureFlash:true
  })(req,res,next);
})


router.get('/dashboard/:routes',isLoggedIn,function (req,res){
  var route=req.params.routes;
 Property.find()
.populate('property_agent_id')
.exec(function (err,property) {
  if(err){
    console.log(err);
  }
  Land.find()
 .populate('land_agent_id')
 .exec(function (err,land) {
   PropertyRequest.find({},function  (err,requests) {
   console.log(getAllAgent.allAgent);
   res.render(`admin/${route}`,{property:property,land:land,isAdmin:'admin',requests:requests,time:humanReadableTimeDiff(requests.created_at)})
})
})
})
})

function isLoggedIn(req,res,next){
   if(req.isAuthenticated() && req.user.admin=='true'){
     return next();
   }
   res.redirect('/admin/login')
 }
 function notLoggedIn(req,res,next){
   if(!req.isAuthenticated()){
     return next();
   }
   var error=req.flash('danger','Your access to ths page has been denied')
   res.redirect('/')
 }


function getAllAgent() {
  Agent.find({},function (err,allAgent) {
    if(err) return
    return {
      allAgent:allAgent,
      count:allAgent.length
    }
  })
}

module.exports=router;
