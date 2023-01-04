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
  db.createTable('book_genres', {
    columns: {
      'book_id': {
        type: 'int',
        primaryKey: true,
        foreignKey: {
          name: 'book_genres_book_id_fk',
          table: 'books',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'RESTRICT'
          },
          mapping: 'id'
        }
      },
      'genre_id': {
        type: 'int',
        primaryKey: 'true',
        foreignKey: {
          name: 'genre_id_fk',
          table: 'genres',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'RESTRICT'
          },
          mapping: 'id'
        }
      }
    }
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('book_genres', callback);
};

exports._meta = {
  "version": 1
};
