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
  db.createTable('users', {
    columns: {
      'username': {
        type: 'string',
        primaryKey: true,
        notNull: true,
        unique: true
      },
      'password': {
        type: 'string',
        notNull: true
      },
      'name': 'string',
      'surname': 'string',
      'email': {
        type: 'string',
        unique: true
      },
      'photo': 'string',
      'type': {
        type: 'int',
        foreignKey: {
          name: 'user_type_role_id_fk',
          table: 'roles',
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
  db.dropTable('users', callback);
};

exports._meta = {
  "version": 1
};
