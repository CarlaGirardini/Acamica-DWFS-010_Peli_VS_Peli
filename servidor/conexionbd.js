var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '',
    database: 'competencias',
    multipleStatements: true
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected!');
  });

  module.exports = connection;