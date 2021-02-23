
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('areas').del()
    .then(function () {
      // Inserts seed entries
      return knex('areas').insert([
        { area: 'Claremont'},
        { area: 'Cape Town CBD'},
        { area: 'Khayelitsha'}
      ]).then(() => console.log('Areas successfully added!'))
      .catch(error => console.log(`Error adding area: ${error}`))
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};