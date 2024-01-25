async function existingUser(username,db){
  return new Promise((resolve, reject)=>{
    sql = 'SELECT * FROM users WHERE username = ?';
    db.query(sql, [username], (err,result)=>{
      if(err){
        console.log('Error: ',err);
        reject(err);
      } else {
        if(result.length>0){
          resolve(result[0].user_id);
        }else{
          resolve(-1);
        }
      }
    });
  });
}

async function passwordHashed(id, db){
  return new Promise((resolve, reject)=>{
    sql = 'SELECT user_password FROM users WHERE user_id = ?';
    db.query(sql, [id], (err,result)=>{
      if(err){
        console.log('Error: ',err);
        reject(err);
      }else {
        resolve(result[0].user_password);
      }
    });
  });
}

module.exports = {existingUser, passwordHashed};
