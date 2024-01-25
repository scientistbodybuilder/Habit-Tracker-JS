const mysql = require('mysql2');
const session = require("express-session");
const MySQLStore = require('express-mysql-session')(session);
const db = mysql.createConnection({
    host     : process.env.DB_HOST,
    user     : process.env.DB_USER,
    password : process.env.DB_PASSWORD,
    database : process.env.DB_NAME  
});

db.connect((err)=>{
    if(err){
        console.log('Error :' + err);
    }
    else{
        console.log("MySQL is connected");
    }
});
module.exports = {db};