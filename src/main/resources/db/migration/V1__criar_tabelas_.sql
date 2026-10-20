CREATE TABLE tb_category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE tb_user (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL -- Ex: ADMIN, USER
);
CREATE TABLE tb_client (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20)
);
CREATE TABLE tb_product (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    stock_quantity INT NOT NULL,
    category_id INT,
    CONSTRAINT fk_product_category FOREIGN KEY (category_id) REFERENCES tb_category(id)
);
CREATE TABLE tb_order (
    id SERIAL PRIMARY KEY,
    moment TIMESTAMP NOT NULL,
    status VARCHAR(50) NOT NULL,
    client_id INT,
    CONSTRAINT fk_order_client FOREIGN KEY (client_id) REFERENCES tb_client(id)
);