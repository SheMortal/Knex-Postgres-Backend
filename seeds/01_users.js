const { v4 } =  require('uuid');
const bcrypt = require('bcryptjs');
const salt = bcrypt.genSaltSync(10);
const hashPW = bcrypt.hashSync('test321', salt);

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('users').del()
    .then(function () {
      // Inserts seed entries
      return knex('users').insert([
        { 
          id: v4(),
          fullname: 'Admin',
          email: 'admin@gmail.com',
          password: hashPW
        },
        { 
          id: v4(),
          fullname: 'Khazi',
          email: 'khazi@gmail.com',
          password: hashPW
        },
        { 
          id: v4(),
          fullname: 'Sea',
          email: 'sea@gmail.com',
          password: hashPW
        },
      ]).then(() => console.log('User successfully added!'))
      .catch(error => console.log(`Error adding user: ${error}`))
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};