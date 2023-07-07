const jwt = require("jsonwebtoken");
const User = require("../models/User");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  // console.log(token);

  if (token) {
    jwt.verify(token, "pratik wlale swcret key", (err, decodedToken) => {
      if (err) {
        console.log(err.message);
        res.redirect("/signin");
      } else {
        next();
      }
    });
  } else {
    res.redirect("/signin");
  }
};

//check current user
const checkUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    jwt.verify(token, "pratik wlale swcret key", async (err, decodeToken) => {
      if (err) {
        console.log(err.message);
        res.locals.user = null;
        next();
      } else {
        let user = await User.findById(decodeToken.id);
        res.locals.user = user;

        next();
      }
    });
  } else {
    res.locals.user = null;
    next();
  }
};
module.exports = { requireAuth, checkUser };
