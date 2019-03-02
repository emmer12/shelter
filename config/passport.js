const localStrategy=require("passport-local").Strategy;
const Agent=require("../modules/agent");
const config=require("../config/database");
const bcrypt=require("bcryptjs");

module.exports=function(passport) {
  // local Strategy
  passport.use(new localStrategy(function(username,password,done){
    // match username
    let query={username:username};
    Agent.findOne(query,function(err,agent){
      if(err) throw err;
      if(!agent){
        console.log("no user");
        return done(null,false,{message:"No agent found"})
      }
      bcrypt.compare(password,agent.password,function(err,isMatch){
        if(err) throw err;
        if(isMatch){
          return done(null,agent);
        }else{
          console.log("no user");
          return done(null,false,{message:"wrong password"})
        }
      });
    });
  }));

 passport.serializeUser(function(user,done){
   done(null,user.id);
 });
 passport.deserializeUser(function(id,done){
   Agent.findById(id,function(err,user){
     done(err,user);
   });
 });
}
