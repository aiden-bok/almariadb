CREATE DATABASE IF NOT EXISTS test;

CREATE USER IF NOT EXISTS 'test'@'%' IDENTIFIED BY 'test';
CREATE USER IF NOT EXISTS 'test'@'localhost' IDENTIFIED BY 'test';

GRANT ALL PRIVILEGES ON test.* TO 'test'@'%';
GRANT ALL PRIVILEGES ON test.* TO 'test'@'localhost';
FLUSH PRIVILEGES;

USE test;

CREATE TABLE IF NOT EXISTS plays (
    name VARCHAR(16),
    plays INT,
    wins INT
);
INSERT INTO plays VALUES 
    ("Jonh", 20, 5),
    ("Robert", 22, 8),
    ("Wanda", 32, 8),
    ("Susan", 17, 3);

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
