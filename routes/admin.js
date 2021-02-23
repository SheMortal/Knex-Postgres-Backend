const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('config');
const { v4 } =  require('uuid');
const auth = require('../middleware/auth');
const bcrypt = require('bcryptjs');
const knex = require('../db/knex');
const { check, validationResult } = require('express-validator');
const { withUserParams } = require('../db/knex');


// @route       GET api/user
// @desc        Get all users
// @access      Private
router.get('/', auth, async (req, res) => {
  try {
    let user = await knex.select().from('users').then((user) => { return user[0] });
    if (user.role === 'admin') {
      let users = await knex.select().from('users');
      res.send(users);
    } else {
      res.status(401);
      return res.send("Access Rejected, Not Authorized");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route Post api/user
//@desc Add new user
//@access Private
router.post('/', auth, [
  check('fullname', 'Please Enter a valid name').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please password with 6 or less characters').isLength({ max: 6 })
],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      let user = await knex.select().from('users').then((user) => { return user[0] });
      if (user.role === 'admin') {
        const {
          fullname,
          email,
          password,
          role
        } = req.body;

        let exists = await knex.select().from('users').where('email', email).then((user) => { return user[0] });
        if (exists) {
          return res.status(400).json({ msg: 'User already registered' });
        }
        else if(!exists){
          const user = {
            id: v4(),
            fullname,
            email,
            password,
            role
          }

          const salt = await bcrypt.genSalt(10);
    
          user.password = await bcrypt.hash(password, salt);
    
          knex('users').insert(user)
            .then(function () {
              const payload = {
                user: {
                  id: user.id,
                },
              };
        
              jwt.sign(
                payload,
                config.get("jwtSecret"),
                {
                  expiresIn: 400000,
                },
                (err, token) => {
                  if (err) throw err;
                  res.json({ token });
                }
              );
            })
    
          
        }
      } else {
        res.status(401);
        return res.send("Access Rejected, Not Authorized");
      }
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  })


// @route       UPDATE api/users
// @desc        uPDATE USER
// @access      Private
router.put('/:id', auth, async (req, res) => {
  try {
    let user = await knex.select().from('users').then((user) => { return user[0] });
    if (user.role === 'admin') {
      let {
        fullname,
        email,
        password,
        role,
        updated_at = new Date(),
      } = req.body;

      const updateUser = {};
      if (fullname) updateUser.fullname = fullname;
      if (email) updateUser.email = email;
      if (password) {
        // hash the password
        const salt = await bcrypt.genSalt(10);
        password = await bcrypt.hash(password, salt);
        updateUser.password = password;
      }
      if (role) updateUser.role = role;
      if (updated_at) updateUser.updated_at = updated_at;

      knex('users').where('id', req.params.id)
        .update(updateUser).then(function () {
          knex.select()
            .from('users').where('id', req.params.id).then((users) => {
              res.send(users[0])
            })
        })
    } else {
      res.status(401);
      return res.send("Access Rejected, Not Authorized");
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route DELETE api/admin/:id
//@desc Delete users
//@access Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let user = await knex.select().from('users').then((user) => { return user[0] });
      if (user.role === 'admin') {
        let exists = await knex.select().from('users').where('id', req.params.id).then((user) => { return user[0] });
        if (!exists) {
          return res.status(400).json({ msg: 'User not Found!' });
        }
        knex('users').where('id', req.params.id)
          .del().then(function () {
            res.json({ msg: 'User Removed!' });
          })
        } else {
          res.status(401);
          return res.send("Access Rejected, Not Authorized");
        }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
})

module.exports = router;
