var con = require('../conexionbd');

function cambiarNombreCompetencia(req, res){
    var idCompetencia = parseInt(req.params.idCompetencia);
    var nuevoNombre = req.body.nombre;
    var sql = 'select nombre from competencia';
    con.query(sql, (err, resp) => {
        if(err){
            console.log('Hubo un error en el servidor', err.message);
            return res.status(500).send('Hubo un error en el servidor');
        }
        pasoValidaciones = true;
        if(resp.length === 0){
            console.log('Hubo un error en la consulta. No existen elementos suficientes en la base de datos que cumplan los requisitos');
            res.status(404).send('Hubo un error en la consulta. No existen elementos suficientes en la base de datos que cumplan los requisitos');
            return pasoValidaciones = false
        }

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
                    console.log('Hubo un error en el servidor', err2.message);
                    return res.status(500).send('Hubo un error en el servidor');
                }
                return res.status(200).send('Se cambió el nombre de la competencia');
            })
        }
    })
}

module.exports = {
    cambiarNombreCompetencia
}