async function signupController(req,res,db){
    try {
        const bcrypt = require('bcrypt');
        const email = req.body.email;
        const username = req.body.username;
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const checkResult = await checkDB(email, username, db);
        if (checkResult == 1) {
          //email and username are unique
          createUser(email, username, hashedPassword, db);
          res.status(201).redirect("/");
        } else if (checkResult == -1) {
          //email already exist
          req.flash('error','Account with email already Exist');
          res.status(401).redirect("/signup");
          console.log("Existing email");
        } else {
          //username already exist
          req.flash('error', 'Username is not Unique')
          console.log("Existing username");
          res.status(402).redirect("/signup");
        }
      } catch (err) {
        console.log("Error:", err);
        res.redirect("/signup");
      }
}

module.exports = {signupController};