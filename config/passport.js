const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const User = require('../models').user;
const AppError = require('../utils/appError');

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

passport.use(
  'login',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        const user = await User.findOne({ where: { email: req.body.email } });
        const compare = await bcrypt.compare(user.password, req.body.password);

        if (!user || !compare) {
          return done(new AppError('Invalid Username or Password', 401), false);
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);

// const cookieExtractor = req => {
//   const token = null;
//   if (req && req.cookies) {
//     token = req.cookies['jwt'];
//   }
//   return token;
// };

// const opts = {
//   jwtFromRequest: cookieExtractor(),
//   secretOrKey: process.env.JWT_SECRET,
// };

// passport.use(
//   new JwtStrategy(opts, async (jwt_payload, done) => {
//     console.log(jwt_payload);
//   })
// );

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
