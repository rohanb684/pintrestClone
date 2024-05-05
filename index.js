import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import expressSession from 'express-session';
import flash from 'connect-flash';
import passport from 'passport';

import UserModel from './src/models/userModel/user.schema.js';
import userRouter from './src/routes/user.route.js';
import pinRouter from './src/routes/pin.route.js';

const app = express();

app.set("views", path.resolve("src", "views"));
app.set('view engine', 'ejs');

app.use(flash());
app.use(expressSession({
  resave: false,
  saveUninitialized: false,
  secret: 'bossalwaysright'
}));

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(UserModel.serializeUser());
passport.deserializeUser(UserModel.deserializeUser());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.resolve("src", "public")));

app.use('/', pinRouter);
app.use('/user',userRouter);

app.use((req, res, next) => {
  next(createError(404));
});

app.use((err, req, res, next) => {
  res.locals.message = err.message;

  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500)
  
  res.render('error');
});

export default app;
