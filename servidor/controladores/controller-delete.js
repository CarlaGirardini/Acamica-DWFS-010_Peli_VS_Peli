var con = require('../conexionbd');

function eliminarCompetencia(req, res){
    var idCompetencia = parseInt(req.params.idCompetencia);
    var sql = `select id from competencia;`;
    con.query(sql, (err, resp) => {
        if(err){
            console.log('Hubo un error en la consulta', err.message);
            return res.status(404).send('Hubo un error en la consulta');
        }
        // Primero verifico si la competencia existe
        var pasoValidaciones = true;
        resp.forEach(id => {
            if(id === idCompetencia){
                pasoValidaciones = false;
                res.status(422).send('Esa competencia no existe');
                return pasoValidaciones;
            }
        })

        // Si pasó las validaciones, elimino la competencia:
        if(pasoValidaciones){
            var sql2 = `delete from competencia where id = ${idCompetencia};`;
            con.query(sql2, (err2, resp2) => {
                if(err2){
                    console.log('Hubo un error en la consulta', err2.message);
                    return res.status(404).send('Hubo un error en la consulta');
                }
                return res.status(200).send('Competencia eliminada');
            })
        }
    })
}

function reiniciarCompetencia(req, res){
    var idCompetencia = parseInt(req.params.idCompetencia);
    var sql = `select id from competencia;`;
    con.query(sql, (err, resp) => {
        if(err){
            console.log('Hubo un error en la consulta', err.message);
            return res.status(404).send('Hubo un error en la consulta');
        }
        // Primero verifico si la competencia existe
        var pasoValidaciones = true;
        resp.forEach(id => {
            if(id === idCompetencia){
                pasoValidaciones = false;
                res.status(422).send('Esa competencia no existe');
                return pasoValidaciones;
            }
        })

        // Si pasa las validaciones, elimino los datos de la tabla:
        if(pasoValidaciones){
            var sql2 = `delete from voto where competencia_id = ${idCompetencia};`;
            con.query(sql2, (err2, resp2) => {
                if(err2){
                    console.log('Hubo un error en la consulta', err2.message);
                    return res.status(404).send('Hubo un error en la consulta');
                }
                return res.status(200).send('Competencia reiniciada');
            })
        }
    })
}

module.exports = {
    eliminarCompetencia,
    reiniciarCompetencia
};