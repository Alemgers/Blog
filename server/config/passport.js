const passport = require("passport");
const User = require("../auth/User");
const bcrypt = require("bcrypt");
const LocalStrategy = require("passport-local");
const GitHubStrategy = require("passport-github2").Strategy;

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    function (email, password, done) {
      User.findOne({ email })
        .then((user) => {
          if (!user) {
            return done(null, false, { message: "Неверный email" });
          }
          bcrypt.compare(password, user.password, function(err, result) {
            if (err) {
              return done(err);
            }
            if (result) {
              return done(null, user);
            } else {
              return done(null, false, { message: 'Неправильный пароль' });
            }
          });
          
        })
        .catch((e) => {
          return done(e);
        });
    }
  )
);

passport.use(
  new GitHubStrategy(
    {
      clientID: "Ov23li2S8Wjc7ul7GIkm",
      clientSecret: "47f699d22a371b3c36d58f7ae4cf836c111a962f",
      callbackURL: "http://localhost:8000/api/auth/github",
      scope: ["user", "email"],
    },
    async function (accessToken, refreshToken, profile, cb) {
      const user = await User.find({ githubId: profile.id });
      const newUser = await new User({
        githubId: profile.id,
        full_name: profile.displayName,
        email: profile.emails[0].value,
      }).save();
      return cb(null, newUser);
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user._id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id).then((user, err) => {
    done(err, user);
  });
});
