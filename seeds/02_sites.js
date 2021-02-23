
exports.seed = function(knex) {
  // Deletes ALL existing entries
  return knex('sites').del()
    .then(function () {
      // Inserts seed entries
      return knex('sites').insert([
        {
          type: 'Community',
          site: 'Cape Town Site'
        },
        {
          type: 'School',
          site: 'Wynberg High'
        },
        {
          type: 'School',
          site: 'Oaklands High'
        }
      ])
      .then(() => console.log('Sites successfully added!'))
      .catch(error => console.log(`Error adding site: ${error}`))
    })
    .catch(error => console.log(`Error seeding data: ${error}`));
};
