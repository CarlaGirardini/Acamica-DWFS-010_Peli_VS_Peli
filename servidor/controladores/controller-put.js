var con = require('../conexionbd');

function cambiarNombreCompetencia(req, res){
    var idCompetencia = parseInt(req.params.idCompetencia);
    var nuevoNombre = req.body.nombre;
    var sql = 'select nombre from competencia';
    con.query(sql, (err, resp) => {
        if(err){
            console.log('Hubo un error en la consulta', err.message);
            return res.status(404).send('Hubo un error en la consulta');
        }
        pasoValidaciones = true;

        resp.forEach(competencia => {
            if(competencia.nombre === nuevoNombre){
                res.status(422).send('Hubo un error en la consulta. Ese nombre ya existe')
                return pasoValidaciones = false;
            }
        })

        if(pasoValidaciones){
            sql2 = `UPDATE competencia SET nombre = '${nuevoNombre}' WHERE id = ${idCompetencia}`;
            con.query(sql2, (err2, resp2) => {
                if(err2){
                    console.log('Hubo un error en la consulta', err2.message);
                    return res.status(404).send('Hubo un error en la consulta');
                }
                return res.status(200).send('Se cambió el nombre de la competencia');
            })
        }
    })
}

module.exports = {
    cambiarNombreCompetencia
}