
exports.up = function(knex, Promise) {
  return knex.schema.table('files', function (table) {
    table.dropColumn('size');
  }).then(function() {
    return knex.schema.table('files', function (table) {
      table.string('size');
    });
  });
};

exports.down = function(knex, Promise) {
  
};
