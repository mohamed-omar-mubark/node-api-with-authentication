const router = require("express").Router();
const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation } = require("../validation");

// register
router.post("/register", async (req, res) => {
    // validate the data before register user
    const { error } = registerValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // check if the user is already in db
    const emailExist = await User.findOne({ email: req.body.email });
    if(emailExist) return res.status(400).send("Email already exist");

    // hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    try {
        const savedUser = await user.save();
        res.status(200).send({ user: user._id, message: "Successfull.", success: true });
    } catch(err) {
        re.status(400).send(err);
    }
});

// login
router.post("/login", async (req, res) => {
    // validate the data before login user
    const { error } = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    // check if the email exist
    const user = await User.findOne({ email: req.body.email });
    if(!user) return res.status(400).send("Email dosn't exist");

    // check password
    const validPass = await bcrypt.compare(req.body.password, user.password);
    // if wrong password
    if(!validPass) return res.status(400).send("Invalid password");

    // if valid password

    // create and assign a token
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.status(200).header("authToken", token).send({ token: token, message: "Successful login.", success: true });

    // res.status(200).send("Logged in!");
});

module.exports = router;
