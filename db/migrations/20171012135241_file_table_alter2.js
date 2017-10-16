
exports.up = function(knex, Promise) {
  return knex.schema.alterTable('files', function(table) {
    table.renameColumn('title', 'originalname');
    table.renameColumn('type', 'mimetype');
    table.renameColumn('link', 'location');
  })
};

exports.down = function(knex, Promise) {
  
};
