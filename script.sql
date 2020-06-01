USE competencias; -- Este es el nombre de la base de datos creada a través del archivo dump_base_de_datos.sql

DROP TABLE IF EXISTS `voto`;
DROP TABLE IF EXISTS `competencia`;

CREATE TABLE `competencia`(
    `id` INT unsigned NOT NULL auto_increment,
    `nombre` VARCHAR(200),
    `genero_id` INT unsigned,
    `director_id` INT unsigned,
    `actor_id` INT unsigned,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`genero_id`) references `genero`(`id`),
    FOREIGN KEY (`director_id`) references `director`(`id`)
    FOREIGN KEY (`actor_id`) references `actor`(`id`)
);

INSERT INTO `competencia` (nombre, genero_id) VALUES ('¿Cuál es la mejor película?', null), ('¿Qué drama te hizo llorar más?', 8), ('¿Cuál es la peli más bizarra?', 5);

CREATE TABLE `voto`(
    `id` INT unsigned NOT NULL auto_increment,
    `pelicula_id` INT unsigned,
    `competencia_id` INT unsigned,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`pelicula_id`) references `pelicula`(`id`),
    FOREIGN KEY (`competencia_id`) references `competencia`(`id`)
);