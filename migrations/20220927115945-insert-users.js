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
  const promises = [];
  promises.push(db.insert('users', { username : 'admin', password : '1234', type: 1}))
  return Promise.all(promises)
};

exports.down = function(db, callback) {
  const sql = "DELETE FROM users"
  db.runSql(sql, callback)
};

exports._meta = {
  "version": 1
};
