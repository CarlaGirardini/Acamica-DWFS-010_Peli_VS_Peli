var con = require('../conexionbd');

function crearCompetencia(req, res){
    var nombreCompetencia = req.body.nombre;
    var idGenero = parseInt(req.body.genero);
    var idDirector = parseInt(req.body.director);
    var idActor = parseInt(req.body.actor);
    if(idGenero === 0) {idGenero = null}
    if(idDirector === 0) {idDirector = null}
    if(idActor === 0) {idActor = null}
    console.log('idGenero', idGenero);
    console.log('idDirector', idDirector);
    console.log('idActor', idActor);
    var sql = 'select nombre from competencia;';
    // Primero valido si el nombre existe
    con.query(sql, (err, resp) => {
        if(err){
            console.log('Hubo un error en la consulta', err.message);
            return res.status(404).send('Hubo un error en la consulta');
        }
        var pasoValidaciones = true;
        resp.forEach((competencia) => {
            if(competencia.nombre === nombreCompetencia){
                console.log('Esa competencia ya existe');
                pasoValidaciones = false;
                res.status(422).send('El nombre de la competencia ya existe');
                return pasoValidaciones;
            }
        })
        // Si pasó las validaciones, hago el post:
        if(pasoValidaciones){
            var sql2 = `insert into competencia (nombre, genero_id, director_id, actor_id) values ('${nombreCompetencia}', ${idGenero}, ${idDirector}, ${idActor})`;
            con.query(sql2, (err2, resp2) => {
                if(err2){
                    console.log('Hubo un error en la consulta', err2.message);
                    return res.status(404).send('Hubo un error en la consulta');
                }
                return res.status(200).send('Competencia creada');
            })
        }
    })
}

function votarPelicula(req, res){
    var idPeliculaVotada = parseInt(req.body.idPelicula);
    var idCompetencia = parseInt(req.params.idCompetencia);
    // La película que se está votando corresponde al último registro de películas mostradas:
    var sql = `insert into voto (pelicula_id, competencia_id) values (${idPeliculaVotada}, ${idCompetencia})`
    con.query(sql, (err, resp) => {
        if(err){
            console.log('Hubo un error en la consulta Y EL ERROR ES ESTE', err.message);
            return res.status(404).send('Hubo un error en la consulta');
        }
        res.send(JSON.stringify(resp.message));
    })
}

module.exports = {
    crearCompetencia,
    votarPelicula
};