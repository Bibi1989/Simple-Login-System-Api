const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()

const Register = require('../models/register')
const auth = require('./auth')

const { validateRegister } = require('../controllers/validate')

/* GET home page. */
router.get('/', (req, res) => {
  console.log(auth(res))
  Register.find().then(doc => res.status(200).json(doc)).catch(err => res.status(400).json({msg: err}))
});

router.post('/login', async (req, res) => {
  const reg = await Register.findOne({ email: req.body.email })
  if(!reg) return res.status(404).json("Email is wrong or you have not register")
  validatedPassword = await bcrypt.compare(req.body.password, reg.password)
  if(!validatedPassword) return res.status(404).json("Password is wrong or you have not register")

  const token = jwt.sign({_id: req._id}, process.env.SECRET)
  // res.header('auth-token', token).json(token)
  return res.status(200).json(`Welcome ${reg.firstname} ${reg.lastname}`)
});

router.post('/register', async (req, res) => {
    const { error } = validateRegister(req.body)
    if(error) return res.status(404).json(error.details[0].message)

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hashSync(req.body.password, salt)

    Register.find({
        email: req.body.email
    }, (err, doc) => {
        if(err) return res.status(404).json({msg: "server error"})
        if(doc.length > 0) return res.status(404).json({msg: "email exist"})

        const user = new Register({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: hashedPassword,
            username: req.body.username
        })
        user.save((err, response) => {
            if(err) return res.status(404).json({msg: "something went wrong on the server"})
            return res.status(200).json({msg: response})
        })
    })
})



module.exports = router;
