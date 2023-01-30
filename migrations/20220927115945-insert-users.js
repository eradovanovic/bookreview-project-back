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
  // const promises = [];
  // promises.push([
  //     db.insert('users', { username : 'admin', password : 'Passw0rd!', type: 1 }),
  //     db.insert('users', { username : 'jane', name: 'Jane', surname: 'Doe', email:'jane@mail.com', password : 'Passw0rd!', type: 2 }),
  //
  // ])
  // return Promise.all(promises)
  const sql = "INSERT INTO users (username, password, type, name, surname, email, photo) values " +
      "('admin', 'Passw0rd!', 1, null, null, null, null)," +
      "('jane', 'Passw0rd!', 2, 'Jane', 'Doe', 'jane@gmail.com', null)," +
      "('john', 'Passw0rd!', 2, 'John', 'Doe', 'john@gmail.com', null)"
  db.runSql(sql, callback)
};

exports.down = function(db, callback) {
  const sql = "DELETE FROM users"
  db.runSql(sql, callback)
};

exports._meta = {
  "version": 1
};
