if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

const express = require("express");
const cookieParser = require("cookie-parser");
const db = require("./config/db").db;
const bcrypt = require("bcrypt");
const flash = require("express-flash");
const session = require("express-session");
const app = express();

//Functions
const {existingUser, passwordHashed} = require('./public/js/login');
const {checkDB, createUser} = require('./public/js/signup');
const {createHabitList, addHabit, completeToggle, getHabitInfo, checkDuplicate, deleteHabit, editHabit} = require('./public/js/dash-function');
const {habitCount, createUserForAccount} = require('./public/js/account');


//Set views
app.set('view engine', 'ejs');
app.set('views', 'views');

//anything the app needs to use involving the below, it will use the second argument
app.use(express.static("public"));
app.use(express.json());
app.use(cookieParser());
//app.use("./dashboard", dashboard);
app.use(express.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
}));

const isAuth = (req,res,next) => {
  if(req.session.isAuth){
    next();
  } else {
    res.redirect('/');
  }
};

app.get("/", (req, res) => {
  res.render('login');
});
app.get("/signup", (req, res) => {
  res.render('signup');
});
app.get("/dashboard", isAuth, async (req,res)=>{
  try{
    const userId = req.session.userId;
    const habits = await createHabitList(userId,db);
    if(habits.length>0){
      const context = {
        habits: habits
      }
      res.render('dashboard', {context});
    } else {
      const context = {};
      res.render('dashboard', {context});
    }
  } catch(e){
    console.log('Error: ',e);
    res.redirect('/');
  }
});
app.get("/account", isAuth, async (req,res)=>{
  try{
    const userId = req.session.userId;
    const habit_count = await habitCount(userId,db);
    User = await createUserForAccount(userId,habit_count,db);
    const context = {
      'User' : User
    }
    res.render('account', {context});

  } catch(e){
    res.redirect('/');
  }
});
app.get('/contact', isAuth, (req,res)=>{
  res.render('contact');
});
app.get('/logout', (req,res)=>{
  req.session.destroy((err)=>{
    if(err){
      console.log('Error: ',err);
      throw err;
    } else {
      res.redirect('/');
    }
  });
})
//=========================================POST
app.post("/signup", async (req,res)=>{
  try {
    const email = req.body.email;
    const username = req.body.username;
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const checkResult = await checkDB(email, username, db);
    if (checkResult == 1) {
      //email and username are unique
      const result = await createUser(email, username, hashedPassword, db);
      if(result == 'success'){
        res.status(201).redirect("/");
      }else{
        req.flash('error','Error in account creation');
        res.status(400).redirect("/signup");
      }
    } else if (checkResult == -1) {
      //email already exist
      req.flash('error','Account with email already Exist');
      res.status(401).redirect("/signup");
    } else {
      //username already exist
      req.flash('error', 'Username is not Unique')
      res.status(402).redirect("/signup");
    }
  } catch (err) {
    console.log("Error:", err);
    res.redirect("/signup");
  }
});

app.post("/", async (req,res)=>{
    const username = req.body.username;
    const password = req.body.password;
    const userId = await existingUser(username,db);
    if (userId!=-1){
      const hashedPassword = await passwordHashed(userId, db);
      bcrypt.compare(password, hashedPassword, (err, result)=>{
        if(err){
          req.flash('error', 'Error in Authentication');
          res.status(500).redirect('/');
          console.log('Error: ',err);
        } else{
          if(result==true){
            req.session.isAuth = true;
            req.session.userId = userId;
            res.status(201).redirect('/dashboard');
          }else{
            req.flash('error','Incorrect Password');
            res.status(400).redirect('/');
          }
        }
      });
    } else {
      req.flash('error','User does not Exist');
      res.status(200).redirect('/');
    }
});

app.post('/dashboard-add', isAuth, async (req,res)=>{
  try{
    const User = {
      user_id: req.session.userId,
      habit_name: req.body.habit,
      total_reps: req.body.reps,
      timeframe: req.body.timeframe
    }
    const result = await addHabit(User,checkDuplicate,db);
    if(result==true){
      res.redirect('/dashboard');
    }else{
      req.flash('error','Cannot add duplicates');
      res.redirect('/dashboard');
    }
  } catch (e){
    console.log('Error: ',e);
    res.redirect('/dashboard');
  }
  
});
app.post("/dashboard-toggle", isAuth, async (req,res)=>{
  try {
    const habitId = req.body.habitId;
    const data = await getHabitInfo(habitId,db);
    const result = await completeToggle(habitId, data, db);
    res.json({
      status: result
    });
  } catch(err){
    console.log('Error: in toggle post: ',err);
  }

});

app.post("/dashboard-delete", isAuth, async (req,res)=>{
  try{
    const habitId = req.body.habitId;
    const result = await deleteHabit(habitId,db);
    res.json({
      status: result
    });
  }
  catch(e){
    console.log('Error: ',e);
    res.redirect('/dashboard');
  }
});

app.post("/dashboard-edit", isAuth, async (req,res)=>{
  try{
    const habitId = req.body.habitId;
    const newReps = req.body.newReps;
    const newFrequency  = req.body.newFrequency;
    console.log(habitId);
    console.log(newReps);
    console.log(newFrequency);
    const result = await editHabit(newReps, newFrequency, habitId,db);
    if(result){
      res.status(205).redirect("/dashboard");
    }else{
      res.status(405).redirect("/dashboard");
    }
    console.log(result);

  } catch(e){
    console.log('Error in edit habit: ',e);
    res.redirect("/dashboard");
  }
})

module.exports.app = app;