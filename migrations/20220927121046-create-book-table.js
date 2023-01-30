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
  db.createTable('books', {
    columns: {
      'id': {
        type: 'int',
        primaryKey: true,
        unique: true,
        autoIncrement: true
      },
      'title': {
        type: 'string',
        notNull: true
      },
      'description': {
        type: 'string',
        length: 3000,
      },
      'date_published': 'datetime',
      'photo': 'string',
    }
  }, callback);
};

exports.down = function(db, callback) {
  db.dropTable('books', callback);
};

exports._meta = {
  "version": 1
};
