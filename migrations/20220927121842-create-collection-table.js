'use strict';

var dbm;
var type;
var seed;

/**
  * We receive the dbmigrate dependency from dbmigrate initially.
  * This enables us to not have to rely on NODE_PATH.
  */
exports.setup = function(options, seedLink) {
  dbm = options.dbmigrate;
  type = dbm.dataType;
  seed = seedLink;
};

exports.up = function(db, callback) {
  db.createTable('collections', {
    columns: {
      'book_id': {
        type: 'int',
        primaryKey: true,
        foreignKey: {
          name: 'collection_book_id_fk',
          table: 'books',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'RESTRICT'
          },
          mapping: 'id'
        }
      },
      'username': {
        type: 'string',
        primaryKey: 'true',
        foreignKey: {
          name: 'collection_username_fk',
          table: 'users',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'RESTRICT'
          },
          mapping: 'username'
        }
      }
    }
  }, callback);};

exports.down = function(db, callback) {
  db.dropTable('collections', callback);
};

exports._meta = {
  "version": 1
};
