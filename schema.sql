CREATE SCHEMA `employee_tracker_db` ;

USE employee_tracker_db

CREATE TABLE employee_tracker_db.department (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(30) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX id_UNIQUE (id ASC));

  CREATE TABLE employee_tracker_db.role (
  id INT NOT NULL AUTO_INCREMENT,
  title VARCHAR(30) NOT NULL,
  salary DECIMAL NOT NULL,
  department_id INT NOT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX id_UNIQUE (id ASC));

  CREATE TABLE employee_tracker_db.employee (
  id INT NOT NULL AUTO_INCREMENT,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  role_id INT NOT NULL,
  manager_id INT NULL,
  PRIMARY KEY (id),
  UNIQUE INDEX id_UNIQUE (id ASC));


  INSERT INTO department (name)
VALUES ("Culinary");

  INSERT INTO department (name)
VALUES ("Human Resources");

  INSERT INTO department (name)
VALUES ("Finance");