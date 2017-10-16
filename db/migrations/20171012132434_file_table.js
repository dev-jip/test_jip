
exports.up = function(knex, Promise) {
  return knex.schema.createTable('files', function (table) {
    table.increments();
    table.string('title');
    table.string('type');
    table.string('category');
    table.integer('size');
    table.string('links');
    table.jsonb('hash');
    table.timestamps();
  })
};

exports.down = function(knex, Promise) {
  
};
