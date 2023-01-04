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

exports.up = function(db) {
  const promises = [];
  promises.push(db.insert('roles', { name : 'admin'}))
  promises.push(db.insert('roles', { name : 'user'}))
  return Promise.all(promises)
  return null;
};

exports.down = function(db, callback) {
  const sql = "DELETE FROM roles"
  db.runSql(sql, callback)
};

exports._meta = {
  "version": 1
};
