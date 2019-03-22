
exports.seed = function(knex, Promise) {
  // Deletes ALL existing entries
  return knex('cohorts')
  .truncate()
    .then(function () {
      // Inserts seed entries
      return knex('cohorts').insert([
        {name: 'WEBPT3'},
        {name: 'WEBPT4'},
        {name: 'WEBPT5'},
        {name: 'WEBFT1'}
      ]);
    });
};
