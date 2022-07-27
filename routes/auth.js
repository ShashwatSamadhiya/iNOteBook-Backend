const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var fetchuser = require("../middleware/fetchUser");

const JWT_SECRET = "AllHailToLord";

//ROUTE1: Create a User using: POST "/api/auth". Doesn't require auth
router.post(
  "/createUser",
  [
    body("name", "Enter a valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "minimum length of password should be 8").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    let success=false;
    // if there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    //Check whether the user with this email exist already
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        success=false;
        return res
          .status(400)
          .json({ error: "Sorry a user with this email already exist" });
      }
      const salt = await bcrypt.genSalt(10);
      let secPass = await bcrypt.hash(req.body.password, salt);
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });
      const data = {
        user: {
          id: user.id,
        },
      };
      // const jwtData=jwt.sign(data,JWT_SECRET);
      // console.log(jwtData);
      
      const authToken = jwt.sign(data, JWT_SECRET);
      success=true;
      res.json({success,authToken});
      // res.json(user);
    } catch (error) {
      //console.log(error.message);
      res.status(500).send("Some error occured");
    }

    // .then(User=>res.json(User)) if we don't use aync ansd await
    // .catch(err=>{console.log(err)
    // res.json({error:'Please enter valid email',message:err.message})});
  }
);

//Route2: create a User using: POST "/api/auth/login". No login Required

router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password cannot be blank").exists(),
  ],
  async (req, res) => {
    let success=false;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      
      let user = await User.findOne({ email });
      if (!user) {
        success=false;
        return res
          .status(400)
          .json({success, error: "Please try to login with correct credentials" });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        success=false;
        return res
          .status(400)
          .json({success, error: "Please try to login with correct credentials" });
      }

      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      success=true;
      res.json({success,authToken});
    } catch (error) {
      // console.log(error.message);
      res.status(500).send("Interval server error");
    }
  }
);

//Route3: Get loggedin user details using : POST "/api/auth/getuser". Login required

router.post("/getUser", fetchuser, async (req, res) => {
  try {
    let userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    //console.log(error.message);
    res.status(500).send("Interval server error");
  }
});
module.exports = router;
