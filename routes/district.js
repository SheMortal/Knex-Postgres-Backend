const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const { v4 } = require('uuid');
const auth = require('../middleware/auth');
const { validationResult } = require('express-validator');

//@route GET api/districts
//@desc getting districts
//@access Private
router.get('/', auth, async (req, res) => {
  try {
    let user = await knex.select().from('users').then((user) => { return user[0] });
      if (user.role === 'admin') {
        let districts = await knex.select().from('districts');
        res.send(districts);
      } else {
        res.status(401);
        return res.send("Access Rejected, Not Authorized");
      }
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error")
  }
})


//@route Post api/districts
//@desc Add new districts
//@access Private
router.post('/', auth, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {

    let user = await knex.select().from('users').then((user) => { return user[0] });
    if (user.role === 'admin') {
      const {
        district
      } = req.body;

      let exists = await knex.select().from('districts').where('district', district).then((district) => { return district[0] });
      if (exists) {
        return res.status(400).json({ msg: 'district exists!' });
      }
      else if (!exists) {
        const newDistrict = {
          id: v4(),
          district
        }
        knex('districts').insert(newDistrict)
          .then(function () {
            knex.select()
              .from('districts').then((districts) => {
                res.send(districts)
              });
          })
      } else {
        res.status(401);
        return res.send("Access Rejected, Not Authorized");
      }
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
})


//@route update api/districts/:id
//@desc Update district by id
//@access Private
router.put('/:id', auth, async (req, res) => {
  try {
    let user = await knex.select().from('users').then((user) => { return user[0] });
    if (user.role === 'admin') {
      let {
        district,
        updated_at = new Date(),
      } = req.body;

      const updatedDistrict = {};
      if (district) updatedDistrict.district = district;
      if (updated_at) updatedDistrict.updated_at = updated_at;

      knex('districts').where('id', req.params.id)
        .update(updatedDistrict).then(function () {
          knex.select()
            .from('districts').where('id', req.params.id).then((districts) => {
              res.send(districts[0])
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


//@route DELETE api/districts/:id
//@desc Delete districts
//@access Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let user = await knex.select().from('users').then((user) => { return user[0] });
      if (user.role === 'admin') {
        let exists = await knex.select().from('districts').where('id', req.params.id).then((district) => { return district[0] });
        if (!exists) {
          return res.status(400).json({ msg: 'district not Found!' });
        }
        knex('districts').where('id', req.params.id)
          .del().then(function () {
            res.json({ msg: 'district Removed!' });
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
