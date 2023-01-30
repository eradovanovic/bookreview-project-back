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
  const sql = "INSERT INTO users (username, password, type, name, surname, email, photo) values " +
      "('admin', 'Passw0rd!', 1, null, null, null, null)," +
      "('jane', 'Passw0rd!', 2, 'Jane', 'Doe', 'jane@gmail.com', 'https://randomuser.me/api/portraits/women/79.jpg')," +
      "('john', 'Passw0rd!', 2, 'John', 'Doe', 'john@gmail.com', 'https://randomuser.me/api/portraits/men/62.jpg')"
  db.runSql(sql, callback)
};

exports.down = function(db, callback) {
  const sql = "DELETE FROM users"
  db.runSql(sql, callback)
};

exports._meta = {
  "version": 1
};
