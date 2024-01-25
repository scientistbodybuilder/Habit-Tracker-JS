

async function createUserForAccount(userId,habit_count,db){
    return new Promise((resolve, reject)=>{
        sql = 'SELECT * FROM users WHERE user_id = ?';
        let email;
        let password;
        let username;
        let account_created;
        db.query(sql, [userId], (err,result)=>{
            if(err){
                reject(err);
            } else {
                if(result.length>0){
                    email = result[0].email;
                    username = result[0].username;
                    account_created = result[0].account_created;

                    const account = {
                        email: email,
                        username: username,
                        account_created: account_created,
                        habit_count: habit_count
                    }
                    resolve(account);
                } else{
                    const account = {
                        email: 'not found',
                        username: 'not found',
                        account_created: 'not found',
                        habit_count: habit_count
                    }
                    resolve(account);
                }
            }
        });
    });
}

async function habitCount(userId,db){
    return new Promise((resolve, reject)=>{
        sql = 'SELECT * FROM habits WHERE user_id = ?';
        let count = 0;
        db.query(sql, [userId], (err,result)=>{
            if(err){
                reject(err);
            } else {
                if(result.length>0){
                    for (i=0;i<result.length>0;i++){
                        count++;
                    }
                    resolve(count);
                } else {
                    resolve(count);
                }
            }
        });
    });
}
//populateInfo(id);
module.exports = {habitCount, createUserForAccount};