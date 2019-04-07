DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  id VARCHAR(10) UNIQUE,
  product_name VARCHAR(50) NULL,
  department_name VARCHAR(50) NULL,
  price DECIMAL(10,2) NOT NULL default 0,
  stock_quantity INT(10) NOT NULL default 0,
  PRIMARY KEY (id)
);

INSERT INTO products (id, product_name, department_name, price, stock_quantity)
VALUES ("F1", "Golf Shoes", "Footwear", 100, 50),
("E1", "Woods", "Equipment", 400, 25),
("E2", "Irons", "Equipment", 900, 25),
("E3", "Wedges", "Equipment", 150, 50),
("E4", "Putter", "Equipment", 200, 50),
("E5", "Bag", "Equipment", 100, 25),
("E6", "Balls (dozen)", "Equipment", 50, 100),
("A1", "Hat", "Apparel", 25, 50),
("A2", "Polo", "Apparel", 50, 50),
("A3", "Shorts", "Apparel", 75, 50),
("X1", "Glove", "Extras", 20, 50)
;
