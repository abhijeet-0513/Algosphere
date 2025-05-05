const User = require("../models/user");
const validate = require("../utils/validate");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// User registration feature

const register = async (req, res) => {
  try {
    // validate the data
    validate(req.body);

    const { firstName, emailId, password } = req.body;

    req.body.password = await bcrypt.hash(password, 10);

    const user = await User.create(req.body);
    const token = jwt.sign({ _id: user._id, emailId }, process.env.JWT_KEY, {
      expiresIn: 60 * 60,
    });
    res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
    res.status(201).send('User Registered Successfully')
  } catch (err) {
    res.status(400).send("Error: " + err);
  }
};

// User login feature

const login=async(req,res)=>{
    try {
        const{emailId,password}=req.body

        if(!emailId)
            throw new Error('Invalid Credentials')
        if(!password)
            throw new Error('Invalid Credentials')

        const user=await User.findOne({emailId})

        const match=bcrypt.compare(password,user.password) 

        if(!match)
            throw new Error('Invalid Credentials')
        const token = jwt.sign({ _id: user._id, emailId }, process.env.JWT_KEY, {
            expiresIn: 60 * 60,
          });
          res.cookie("token", token, { maxAge: 60 * 60 * 1000 });
          res.status(200).send('Logged In Successfully')

    } catch (err) {
        res.status(401).send('Error: '+rrr)
    }
}

