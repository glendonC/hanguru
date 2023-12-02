const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('./models/User');

function initialize(passport) {
  const authenticateUser = async (usernameOrEmail, password, done) => {
    try {
      // Check if input is an email or username
      const isEmail = usernameOrEmail.includes('@');
      const user = isEmail 
        ? await User.findOne({ email: usernameOrEmail })
        : await User.findOne({ username: usernameOrEmail });

      if (!user) {
        return done(null, false, { message: 'No user found' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        return done(null, user);
      } else {
        return done(null, false, { message: 'Password incorrect' });
      }
    } catch (e) {
      return done(e);
    }
  };
  
  passport.use(new LocalStrategy({ usernameField: 'usernameOrEmail' }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    console.log("Deserializing user with ID: ", id);
    try {
        const user = await User.findById(id);
        if (user) {
            console.log("User found in deserializeUser: ", user);
        } else {
            console.log("No user found with ID: ", id);
        }
        done(null, user);
    } catch (e) {
        console.error("Error in deserialization:", e);
        done(e);
    }
});

  
}

module.exports = initialize;
