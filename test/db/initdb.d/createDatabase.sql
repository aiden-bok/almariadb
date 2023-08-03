USE mysql;

DROP DATABASE IF EXISTS test;
CREATE DATABASE IF NOT EXISTS test;

DROP USER IF EXISTS 'test'@'%';
DROP USER IF EXISTS 'test'@'localhost';
CREATE USER IF NOT EXISTS 'test'@'%' IDENTIFIED BY 'test';
CREATE USER IF NOT EXISTS 'test'@'localhost' IDENTIFIED BY 'test';

REVOKE ALL PRIVILEGES, GRANT OPTION FROM 'test'@'%', 'test'@'localhost';
GRANT ALL PRIVILEGES ON test.* TO 'test'@'%';
GRANT ALL PRIVILEGES ON test.* TO 'test'@'localhost';
FLUSH PRIVILEGES;

USE test;

DROP TABLE IF EXISTS plays;
CREATE TABLE IF NOT EXISTS plays (
    name VARCHAR(16),
    plays INT,
    wins INT
);
INSERT INTO plays VALUES 
    ("John", 20, 5),
    ("Robert", 22, 8),
    ("Wanda", 32, 8),
    ("Susan", 17, 3);

DROP TABLE IF EXISTS a;
CREATE TABLE IF NOT EXISTS a (
    a_no INT,
    a_country VARCHAR(1)
);
INSERT INTO a VALUES
    (1, "A"),
    (2, "B"),
    (3, "C"),
    (4, "D"),
    (5, "E");

DROP TABLE IF EXISTS b;
CREATE TABLE IF NOT EXISTS b (
    b_no INT,
    a_no INT,
    b_city VARCHAR(2)
);
INSERT INTO b VALUES
    (1, 1, "AA"),
    (2, 2, "BB"),
    (3, 6, "FF"),
    (4, 7, "GG");

DROP TABLE IF EXISTS test;
CREATE TABLE IF NOT EXISTS test (
    id INT,
    name VARCHAR(20)
);

DROP PROCEDURE IF EXISTS simple_proc;
DELIMITER //
CREATE PROCEDURE IF NOT EXISTS simple_proc (
    IN param1 INT
)
BEGIN
    SELECT param1 * param1;
END;
//
DELIMITER;
