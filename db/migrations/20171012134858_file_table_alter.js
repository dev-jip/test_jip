
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('files', function(table) {
    table.renameColumn('links', 'link');
  })
};

exports.down = function(knex, Promise) {
  
};
