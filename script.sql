USE competencias; -- Este es el nombre de la base de datos creada a través del archivo dump_base_de_datos.sql

DROP TABLE IF EXISTS competencia;
CREATE TABLE `competencia`(
    `id` INT NOT NULL auto_increment,
    `nombre` VARCHAR(200),
    PRIMARY KEY (`id`)
);

INSERT INTO competencia (nombre) VALUES ('¿Cuál es la mejor película?'), ('¿Qué drama te hizo llorar más?'), ('¿Cuál es la peli más bizarra?');

CREATE TABLE `voto`(
    `id` INT unsigned NOT NULL auto_increment,
    `pelicula_id` INT unsigned,
    `competencia_id` INT,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`pelicula_id`) references `pelicula`(`id`),
    FOREIGN KEY (`competencia_id`) references `competencia`(`id`)
);