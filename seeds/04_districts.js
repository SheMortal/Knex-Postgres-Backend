
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('districts').del()
    .then(function () {
      // Inserts seed entries
      return knex('districts').insert([
        {district: 'Cape Town District'},
        {district: 'Bellville District'},
        {district: 'Mitchels Plain District'}
      ]).then(() => console.log('District successfully added!'))
      .catch(error => console.log(`Error adding district: ${error}`))
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
