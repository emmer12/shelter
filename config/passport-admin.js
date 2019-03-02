const localStrategy=require("passport-local").Strategy;
const Admin=require("../modules/admin");
const Agent=require("../modules/agent");
const config=require("../config/database");
var passport = require('passport');
const bcrypt=require("bcryptjs");

// local Strategy for agent

passport.use('local.agent',new localStrategy(function(username,password,done){
  // match username
  var agentflag="agent"
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
  // local Strategy for Admin
  passport.use('local.admin',new localStrategy(function(username,password,done){
    var adminflag="admin"
    // match username
    let query={username:username,admin:true};
    Agent.findOne(query,function(err,admin){
      if(err) throw err;
      if(!admin){
        console.log("you are not the admin you can't access this page");
        return done(null,false,{message:"you are not the admin you can't access this page"})
      }
      bcrypt.compare(password,admin.password,function(err,isMatch){
        if(err) throw err;
        if(isMatch){
          return done(null,admin);
        }else{
          console.log("wronge password");
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
