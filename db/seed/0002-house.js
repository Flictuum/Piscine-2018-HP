
exports.seed = (knex) => {
  // Deletes ALL existing entries
  return knex('HOUSES').del()
    .then(function () {
      // Inserts seed entries
      return knex('HOUSES').insert([
        {id: 1, name: 'Gryffondor', image: 'https://universharrypotter.com/wp-content/uploads/2016/11/Gryffondor.png', referent: 1},
        {id: 2, name: 'Poufsouffle', image: 'https://universharrypotter.com/wp-content/uploads/2016/11/Poufsouffle.png', referent: 1},
        {id: 3, name: 'Serdaigle', image: 'https://universharrypotter.com/wp-content/uploads/2016/11/Serdaigle.png', referent: 1},
        {id: 4, name: 'Serpentard', image: 'https://universharrypotter.com/wp-content/uploads/2016/11/Serpentard.png', referent: 1}
      ]);
    });
};
