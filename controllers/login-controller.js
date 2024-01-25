async function loginController(req, res,db){
    const bcrypt = require('bcrypt');
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
  };

  module.exports = {loginController};