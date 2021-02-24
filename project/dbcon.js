var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'faegewf',
  password        : 'gskgjergj;ag',
  database        : 'afewgaweg'
});
module.exports.pool = pool;
