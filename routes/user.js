
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcryptjs');
const knex = require('../db/knex');
const { check, validationResult } = require('express-validator');

//@route Post api/user
//@desc Auth login user & get token
//@access Public
router.post('/', [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            const { email, password } = req.body;

            let user = await knex.select().from('users').where('email', email).then((user) => { return user[0] });
            if (!user) {
                return res.status(400).json({ msg: 'Invalid Credentials: Email' });
            }
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ msg: "Invalid Credentials: Password" });
            }

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
        } catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error');
        }
    })

module.exports = router;