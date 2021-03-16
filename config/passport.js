const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models').user;

passport.use(
  'signup',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const user = await User.create(req.body);
        return done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);

// passport.use(new LocalStrategy({
//     usernameField: 'email'
//   },
//   async (email, password) => {
//     User.findOne({ email }, function(err, user) {
//       if (err) return done(err);
//       const authenticate = await bcrypt.comparePassword()
//     })
//   }
// ))
