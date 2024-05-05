import passport from "passport";
import UserModel from "../models/userModel/user.schema.js";

//render register page
export const getRegister = (req, res, next) =>{
    const error = req.flash().error
    if(error){
      if(error[0].includes('email_1')){
        res.render('register', {error:'Email already registered.'});  
      }else{
        res.render('register', {error:error[0]}); 
      }
    }else{
      res.render('register', {error:null});
    }
}

//register user
export const userRegister = (req, res, next) =>{
  const {username, email, fullname, dob, password} = req.body;
  const userData = new UserModel({username, email, fullname, dob});
  
  UserModel.register(userData, password, function(err, account) {
      if (err) {
          console.error(err.message);
          req.flash('error', err.message)
          return res.redirect('/user/register'); // Handle errors properly
      }
      passport.authenticate("local")(req, res, function(){
          res.redirect("/");
      });
  });
}

//render login page
export const getLogin = (req, res, next) =>{
  const error = req.flash().error;
  // console.log(error);
  if(error){
    // console.log("Inside if error");
    // console.log(error);
    res.render('login', {error:error});  
  }else{
    res.render('login', {error:null});  
    }
}

