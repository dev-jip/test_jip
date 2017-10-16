
exports.up = function(knex, Promise) {
  return knex.schema.table('files', function (table) {
    table.dropColumn('location');
  }).then(function() {
    return knex.schema.table('files', function (table) {
      table.text('location').unique();
    });
  });
};

exports.down = function(knex, Promise) {
  
};
