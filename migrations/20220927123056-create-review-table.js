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
  db.createTable('reviews', {
    columns: {
      'id': {
        type: 'int',
        primaryKey: true,
        autoIncrement: true,
        unique: true
      },
      'rating': {
        type: 'real',
        notNull: true
      },
      'review': 'string',
      'date_reviewed': 'datetime',
      'book_id': {
        type: 'int',
        primaryKey: true,
        foreignKey: {
          name: 'review_book_id_fk',
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
          name: 'review_username_fk',
          table: 'users',
          rules: {
            onDelete: 'CASCADE',
            onUpdate: 'RESTRICT'
          },
          mapping: 'username'
        }
      }
    }
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('reviews', callback);
};

exports._meta = {
  "version": 1
};
