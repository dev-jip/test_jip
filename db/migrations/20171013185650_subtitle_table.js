
exports.up = function(knex, Promise) {
  return knex.schema.table('files', function (table) {
    table.integer('parent_id');
  })
};

exports.down = function(knex, Promise) {
  
};
