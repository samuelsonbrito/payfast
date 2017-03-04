var mysql = require('mysql');

var connectMYSQL = ()=>{
	return mysql.createConnection({
		host : 'localhost',
		user: 'root',
		password: '',
		database: 'payfast'
	});
};

//função wrapper
module.exports = ()=>{
	return connectMYSQL;
}
