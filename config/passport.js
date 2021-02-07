const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
    usernameField: 'email'
  }, 
  async (email, password) => {
    User.findOne({ email }, function(err, user) {
      if (err) return done(err);
      const authenticate = await bcrypt.comparePassword()
    })
  }
))