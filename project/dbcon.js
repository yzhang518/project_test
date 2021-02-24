var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_zhangyin',
  password        : '6395',
  database        : 'cs340_zhangyin'
});
module.exports.pool = pool;
