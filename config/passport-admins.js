const localStrategy=require("passport-local").Strategy;
const Agent=require("../modules/agent");
const config=require("../config/database");
const bcrypt=require("bcryptjs");

module.exports=function(passport) {
  // local Strategy
  passport.use('local.admin',new localStrategy(function(username,password,done){
    // match username
    let query={username:username,admin:"true"};
    Agent.findOne(query,function(err,admin){
      if(err) throw err;
      if(!admin){
        console.log("no user");
        return done(null,false,{message:"you are not the admin, you can't access this page"})
      }
      bcrypt.compare(password,admin.password,function(err,isMatch){
        if(err) throw err;
        if(isMatch){
          return done(null,admin);
        }else{
          console.log("no user");
          return done(null,false,{message:"wrong password"})
        }
      });
    });
  }));

 passport.serializeUser(function(admin,done){
   done(null,user.id);
 });
 passport.deserializeUser(function(id,done){
   Agent.findById(id,function(err,admin){
     done(err,admin);
   });
 });
}
