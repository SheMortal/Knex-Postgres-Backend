const express = require('express');
const router = express.Router();
const knex = require('../db/knex');
const { v4 } = require('uuid');
const auth = require('../middleware/auth');
const { validationResult } = require('express-validator');

//@route GET api/sites
//@desc getting sites
//@access Private
router.get('/', auth, async (req, res) => {
  try {
    let user = await knex.select().from('users').then((user) => { return user[0] });
      if (user.role === 'admin') {
        let sites = await knex.select().from('sites');
        res.send(sites);
      } else {
        res.status(401);
        return res.send("Access Rejected, Not Authorized");
      }
  } catch (err) {
    console.log(err.message);
    res.status(500).send("Server Error")
  }
})


//@route Post api/sites
//@desc Add new sites
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
        site,
        type,
      } = req.body;

      let exists = await knex.select().from('sites').where('site', site).then((site) => { return site[0] });
      if (exists) {
        return res.status(400).json({ msg: 'site exists!' });
      }
      else if (!exists) {
        const newSite = {
          id: v4(),
          site,
          type
        }
        knex('sites').insert(newSite)
          .then(function () {
            knex.select()
              .from('sites').then((sites) => {
                res.send(sites)
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


//@route update api/sites/:id
//@desc Update site by id
//@access Private
router.put('/:id', auth, async (req, res) => {
  try {
    let user = await knex.select().from('users').then((user) => { return user[0] });
    if (user.role === 'admin') {
      let {
        site,
        type,
        updated_at = new Date(),
      } = req.body;

      const updateSite = {};
      if (site) updateSite.site = site;
      if (type) updateSite.type = type;
      if (updated_at) updateSite.updated_at = updated_at;

      knex('sites').where('id', req.params.id)
        .update(updateSite).then(function () {
          knex.select()
            .from('sites').where('id', req.params.id).then((sites) => {
              res.send(sites[0])
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


//@route DELETE api/sites/:id
//@desc Delete sites
//@access Private
router.delete('/:id', auth, async (req, res) => {
  try {
    let user = await knex.select().from('users').then((user) => { return user[0] });
      if (user.role === 'admin') {
        let exists = await knex.select().from('sites').where('id', req.params.id).then((site) => { return site[0] });
        if (!exists) {
          return res.status(400).json({ msg: 'site not Found!' });
        }
        knex('sites').where('id', req.params.id)
          .del().then(function () {
            res.json({ msg: 'site Removed!' });
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
