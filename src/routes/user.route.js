import express from 'express';
import passport from "passport";
import localStrategy from 'passport-local';

import { getRegister, userRegister, getLogin } from "../controllers/user.controller.js";
import UserModel from "../models/userModel/user.schema.js";

passport.use(new localStrategy(UserModel.authenticate()));

const userRouter = express.Router();

// Register page
userRouter.get('/register', (req, res, next) => {
    getRegister(req, res, next);
});
  
// Register user
userRouter.post('/register', (req, res, next) => {
    userRegister(req, res, next);
});

// Login page
userRouter.get('/login', (req, res, next) => {
    getLogin(req, res, next);
});

// Login user
userRouter.post('/login', passport.authenticate("local", {
    successRedirect:"/",
    failureRedirect: "/user/login", // Corrected the redirect path
    failureFlash:true
}), (req, res) => {});

// Logout
userRouter.get("/logout", (req, res, next) => {
    req.logout(function(err){
        if(err){ return next(err); }
        res.redirect('/user/login');
    });
});

export default userRouter;
