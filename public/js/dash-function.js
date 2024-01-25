const { result } = require("lodash");
 async function createHabitList(userId,db){
   return new Promise((resolve, reject)=>{
     const habits = [];
     sql='SELECT * FROM habits WHERE user_id = ?';
     db.query(sql, [userId], (err,result)=>{
       if(err){
         reject(err);
       } else {
        if (result.length > 0) {
          for (let i = 0; i < result.length; i++) {
            if (result[i].hasOwnProperty('habit_name') && result[i].hasOwnProperty('current_reps') && result[i].hasOwnProperty('habit_reps') && result[i].hasOwnProperty('habit_frequency') && result[i].hasOwnProperty('habit_id')) {
              const habit = {
                text: result[i].habit_name,
                reps: result[i].current_reps,
                totalCounts: result[i].habit_reps,
                timeframe: result[i].habit_frequency,
                completed: result[i].completed === 1, 
                habitId: result[i].habit_id
              };
              habits.push(habit);
            } else {
              console.warn('Invalid data in database result:', result[i]);
            }
          }
        }
        resolve(habits);
      }
   });
  });
  }

 async function addHabit(User,checkDuplicate,db){
  const duplicate = await checkDuplicate(User.user_id,User.habit_name,User.total_reps,User.timeframe,db);
  if(duplicate){
    return new Promise((resolve, reject)=>{
      sql = 'INSERT INTO habits (user_id,habit_name,habit_reps,habit_frequency,current_reps,times_completed,completed) VALUES (?,?,?,?,0,0,0)';
      db.query(sql, [User.user_id,User.habit_name,User.total_reps,User.timeframe], (err,result)=>{
        if(err){
          reject(err);
          console.log('Error: ',err);
        }else{
          resolve(true);
          console.log('habit added successful');
        }
      });
    });
  }
  return false;
 }

 async function checkDuplicate(user_id,text,total,timeframe,db){   //use this to modify addHabit
  return new Promise((resolve, reject)=>{
    sql = `SELECT * FROM habits WHERE user_id = ? AND habit_name = ? AND habit_reps = ? AND habit_frequency = ?`;
    db.query(sql, [user_id,text,total,timeframe], (err,result)=>{
      if(err){
        reject(err);
      }
      else{
        resolve(result.length==0);
        }
      });
  });
 }
 async function completeToggle(habitId, data,db){
  return new Promise((resolve, reject)=>{
    if(data==0){resolve(0);}
    else if(data.currentReps == data.totalReps-1){
      sql = 'UPDATE habits SET current_reps = ?, completed = ?, times_completed = ? WHERE habit_id = ?';
      db.query(sql, [data.currentReps+1,1,data.timesCompleted+1,habitId], (err,result)=>{
        if(err){
          reject(err);
        }else{
          resolve(1);
        }
      });
    } else if(data.currentReps == data.totalReps){
      sql= 'UPDATE habits SET current_reps = ?, completed =? WHERE habit_id = ?';
      db.query(sql, [0,0,habitId], (err,result)=>{
        if(err){
          reject(err);
        }else{
          resolve(2);
        }
      })
    } else {
      sql = 'UPDATE habits SET current_reps = ? WHERE habit_id = ?';
      db.query(sql, [data.currentReps+1,habitId], (err,result)=>{
        if(err){
          reject(err);
        }else{
          resolve(3);
        }
      })
    }
  });
 }


 async function getHabitInfo(habitId, db){
  return new Promise((resolve, reject)=>{
    sql = 'SELECT * FROM habits WHERE habit_id = ?';
    db.query(sql, [habitId], (err,result)=>{
      if(err){
        reject(err);
      } else {
        if(result.length>0){
            const data = {
            totalReps: result[0].habit_reps,
            currentReps: result[0].current_reps,
            timesCompleted: result[0].times_completed,
            completed: result[0].completed
          }
          resolve(data);
        } else {
          resolve(0);
        }
        
      }
    });
  });
 }

 async function deleteHabit(habitID,db){
  return new Promise((resolve, reject)=>{
    sql = 'DELETE FROM habits WHERE habit_id = ?';
    db.query(sql, [habitID], (err,result)=>{
      if(err){
        reject(err);
      }else{
        if(result.affectedRows==1){
          resolve("successfully deleted");
        }
        resolve("failed to deleted");
      }
    })
  });
 }

 async function editHabit(newReps, newFrequency, habitID,db){
  return new Promise((resolve, reject)=>{
    sql = 'UPDATE habits SET habit_reps = ?, habit_frequency = ?, current_reps = 0 WHERE habit_id = ?';
    db.query(sql, [newReps, newFrequency, habitID], (err,result)=>{
      if(err){
        reject(err);
      }else{
        if(result.affectedRows == 1){
          resolve(1);
        }else{
          resolve(0);
        }
      }
    })
  });
 }
 module.exports = {createHabitList, addHabit, completeToggle, getHabitInfo, checkDuplicate, deleteHabit, editHabit};
