function PagamentoDAO (connection) {
	this._connection = connection;
}

PagamentoDAO.prototype.lista = (callback)=>{
	this._connection.query('select * from pagamentos', callback);
}

PagamentoDAO.prototype.buscaPorId = (id,callback)=> {
	this._connection.query('select * from pagamentos where id = ?',[id], callback);
}

PagamentoDAO.prototype.salva = (pagamento,callback)=>{
	this._connection.query('insert into pagamentos set ?', pagamento, callback);
}

PagamentoDAO.prototype.atualiza = (pagamento,callback)=>{
	this._connection.query('update pagamentos set status = ? where id = ?', [pagamento.status, pagamento.id], callback);
}

module.exports = ()=>{
	return PagamentoDAO;
}
