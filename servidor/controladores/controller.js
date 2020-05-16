var con = require('../conexionbd');

function buscarCompetencias(req, res){
    // Esta función obtiene el ID y el nombre de cada competencia
    var sql = 'select * from competencia';
    con.query(sql, function(err, resp){
        if(err){
            console.log('Hubo un error en la consulta', err.message);
            return res.status(404).send('Hubo un error en la consulta');
        }
        var data = [];
        resp.forEach(comp => {
            var id = comp.id;
            var nombre = comp.nombre;
            var competencia = {
                'id': id,
                'nombre': nombre
            }
            data.push(competencia);
        });
        var respuesta = data;
        res.send(JSON.stringify(respuesta));
    });
}

module.exports = {
    buscarCompetencias
};