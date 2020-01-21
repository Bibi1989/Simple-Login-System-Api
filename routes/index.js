var express = require('express');
var router = express.Router();

const Register = require('../models/register')

const { validateRegister } = require('../controllers/validate')

/* GET home page. */
router.get('/', (req, res) => {
  Register.find().then(doc => res.status(200).json(doc)).catch(err => res.status(400).json({msg: err}))
});

router.post('/login', async (req, res) => {
  const reg = await Register.findOne({ email: req.body.email, password: req.body.password })
  console.log(reg)
  if(!reg) return res.status(404).json("You have not register")
  return res.status(200).json(`Welcome ${reg.firstname} ${reg.lastname}`)
});

router.post('/register', async (req, res) => {
  const { error } = validateRegister(req.body)
  if(error) return res.status(404).json(error.details[0].message)

  const checkEmail = await Register.findOne({ email: req.body.email })
  console.log("Database" , checkEmail)
  console.log("Body ",req.body.email)
  console.log(checkEmail)
  if(checkEmail) {
    return res.json("Email exist")
  }else{
    const register = new Register(req.body)
    register.save().then(doc => res.status(200).json(doc)).catch(err => res.status(404).json({msg: err}))
  }
})



module.exports = router;
