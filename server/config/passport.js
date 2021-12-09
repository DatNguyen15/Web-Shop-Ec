const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
const passport = require("passport");

const UserModel = require("../models/users");
const configGoogleAuth = {
  clientID:
    "86113623625-tuas1o8fbb33m23l99q7sb3d89jkmibi.apps.googleusercontent.com",
  clientSecret: "G8r8JJRqgQFNabLj3siojjpp",
  callbackURL: "http://localhost:8000/api/google-signin/callback",
};

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(async function (user, done) {
  const result = await UserModel.findById(user._id);

  if (!result) {
    return done(null, false);
  }

  done(null, result);
});

// google
passport.use(
  new GoogleStrategy(
    {
      clientID: configGoogleAuth.clientID,
      clientSecret: configGoogleAuth.clientSecret,
      callbackURL: configGoogleAuth.callbackURL,
    },
    function (token, refreshToken, profile, done) {
      process.nextTick(async function () {
        try {
          // // tìm trong db xem có user nào đã sử email này chưa
          const user = await UserModel.findOne({
            email: profile._json.email,
          });

          if (user) {
            return done(null, user);
          } else {
            const newUser = {
              email: profile._json.email,
              name: profile._json.name,
              userRole: 0,
            };
            const newUserCreated = await UserModel.create(newUser);
            return done(null, newUserCreated);
          }
        } catch (err) {
          done(err, null);
        }
      });
    }
  )
);

module.exports = passport;
