const bcrypt = require('bcrypt');
const LocalStrategy = require('passport-local').Strategy;

function initialize(passport,existingUser,passwordMatch,getIdByUser,getUserById,db){
    const authenticateUser = async (username, password, done) => {
        const userID = await existingUser(username, db);
        if (userID == -1){
            return done(null, false, {message: 'no user found'});
        }
        try {
            hashedPassword = await bcrypt.hash(password, 10);
            correctPassword = await passwordMatch(userID, hashedPassword, db);
            if (correctPassword){
                return done(null, userID);
            }
            return done(null, false, {message: 'incorrect password'});
        } catch (e){
            console.log('Error: ',e);
            return done(e);
        }
    };

    passport.use(new LocalStrategy({usernameField: 'username'}, authenticateUser));
    passport.serializeUser( async (username, done)=>{
        try {
            const id = await getIdByUser(username,db);
        done(null,id);
        }
        catch(e){
            done(e);
        }
    });
    passport.deserializeUser(async (id, done)=>{
        try {
            const user = await getUserById(id,db);
            done(null,user);
        }
        catch (e) {
            done(e);
        }
    });
}

module.exports.initialize = initialize;