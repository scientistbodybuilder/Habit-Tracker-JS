async function checkDB(email_to_check, username_to_check, db){
    return new Promise((resolve, reject) => {
      sql = 'SELECT * FROM users WHERE email = ?';
      db.query(sql, [email_to_check], (err, results) => {
        if (err) {
          console.log("Error: " + err);
          reject(err);
        } else {
          if (results.length > 0) {
            console.log('Email exists');
            resolve(-1); // Email exists, resolve with false
          } else {
            sql2 = 'SELECT * FROM users WHERE username = ?';
            db.query(sql2, [username_to_check], (err, results2) => {
              if (err) {
                console.log("Error: " + err);
                reject(err);
              } else {
                if (results2.length > 0) {
                  console.log('Username exists');
                  resolve(0); // Username exists, resolve with false
                } else {
                  console.log('Email and username are unique');
                  resolve(1); // Email and username are unique, resolve with true
                }
              }
            });
          }
        }
      });
    });
  }
  
//This function is called is the email does not exist in the database
async function createUser(email, username, password, db){
  return new Promise((resolve, reject)=>{
    sql = `INSERT INTO users(email, username, user_password, account_created) VALUES(?,?,?,NOW())`;
        db.query(sql, [email,username,password], (err,result)=>{
            if(err){
                reject(err);
            }else{
                if(result.affectedRows==1){
                  resolve('success');
                }else{
                  resolve('fail');
                }
            }
        });
  });
}
module.exports = {checkDB, createUser};