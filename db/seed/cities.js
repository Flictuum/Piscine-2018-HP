
exports.seed = (knex) => {
  // Deletes ALL existing entries
  return knex('CITIES').del()
    .then(function () {
      // Inserts seed entries
      return knex('CITIES').insert([
        {id: 1, name: 'Paris'},
        {id: 2, name: 'Bordeaux'},
        {id: 3, name: 'Lille'},
        {id: 4, name: 'Lyon'},
        {id: 5, name: 'Marseille'},
        {id: 6, name: 'Montpellier'},
        {id: 7, name: 'Nancy'},
        {id: 8, name: 'Nantes'},
        {id: 9, name: 'Nice'},
        {id: 10, name: 'Rennes'},
        {id: 11, name: 'Strasbourg'},
        {id: 12, name: 'Toulouse'},
        {id: 13, name: 'Saint Andre'},
        {id: 14, name: 'Barcelone'},
        {id: 15, name: 'Berlin'},
        {id: 16, name: 'Bruxelles'},
        {id: 17, name: 'Balkans'}
      ]);
    });
};
