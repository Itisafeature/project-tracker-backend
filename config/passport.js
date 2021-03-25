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
        console.log(err);
        return done(err);
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
        if (!user)
          return done(new AppError('Invalid Username or Password', 401), false);

        const compare = await bcrypt.compare(password, user.password);
        if (!compare)
          return done(new AppError('Invalid Username or Password', 401), false);

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

const cookieExtractor = req => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['jwt'];
  }
  return token;
};

const opts = {
  jwtFromRequest: cookieExtractor,
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await User.findByPk(jwt_payload.id);
      if (user) return done(null, user);
    } catch (err) {
      console.log(err);
      return done(new AppError('Unauthorized Request', 401), false);
    }
  })
);
