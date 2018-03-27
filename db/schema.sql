use blogger;

  create table IF NOT EXISTS user(
    id int primary key auto_increment,
    user_email varchar(50) not null
   
);

  create table IF NOT EXISTS recipe_song(
    id int primary key auto_increment,
    user_id int not null,
    ingredient varchar(50) not null,
    artist varchar(50) not null,
    spoon_URL varchar(250) not null,
    spotify_URL varchar(250) not null,
    CONSTRAINT `recipe_song_user` FOREIGN KEY (`user_id`) REFERENCES `user` (`id`) 
);

   CREATE TABLE IF NOT EXISTS `Users` (`id` INTEGER NOT NULL auto_increment , `user_email` VARCHAR(255) NOT NULL, `createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB;
