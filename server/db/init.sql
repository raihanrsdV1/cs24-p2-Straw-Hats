DROP TABLE IF EXISTS demo_table;
DROP TABLE IF EXISTS LANDFILL_VEHICLE_ENTRY;
DROP TABLE IF EXISTS STS_VEHICLE_ENTRY;
DROP TABLE IF EXISTS STS_VEHICLE_ASSIGNMENT;
DROP TABLE IF EXISTS VEHICLE;
DROP TABLE IF EXISTS VEHICLE_TYPE;
DROP TABLE IF EXISTS LANDFILL_MANAGEMENT;
DROP TABLE IF EXISTS STS_MANAGEMENT;
DROP TABLE IF EXISTS STS;
DROP TABLE IF EXISTS LANDFILL; 
DROP TABLE IF EXISTS PERMISSIONS;
DROP TABLE IF EXISTS PAGES;
DROP TABLE IF EXISTS PERSON;
DROP TABLE IF EXISTS USER_ROLE; 

CREATE TABLE demo_table (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    age INT,
    email VARCHAR(255)
);

CREATE TABLE USER_ROLE (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50)
);

CREATE TABLE PERSON (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL,
    password TEXT NOT NULL,
    contact_no VARCHAR(20) NOT NULL,
    first_name TEXT NOT NULL,
		last_name TEXT NOT NULL,
    role_id INT, 
    FOREIGN KEY (role_id) REFERENCES USER_ROLE(role_id)
);



CREATE TABLE PAGES (
    page_id SERIAL PRIMARY KEY,
    page_title TEXT NOT NULL,
    page_description TEXT
);

CREATE TABLE PERMISSIONS(
    permission_id SERIAL PRIMARY KEY,
    page_id INT,
    role_id INT,
    FOREIGN KEY (page_id) REFERENCES PAGES(page_id),
    FOREIGN KEY (role_id) REFERENCES USER_ROLE(role_id)
);

CREATE TABLE LANDFILL (
    landfill_id SERIAL PRIMARY KEY,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    address VARCHAR(255) NOT NULL,
    landfill_capacity INT NOT NULL,
    operation_time INTERVAL NOT NULL,
    creator_id INT NOT NULL, 
    FOREIGN KEY (creator_id) REFERENCES PERSON(id)
);

CREATE TABLE STS (
    sts_id SERIAL PRIMARY KEY,
    sts_capacity INT,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    address TEXT,
    ward_no INT,
    landfill_id INT NOT NULL, 
    creator_id INT NOT NULL, 
    FOREIGN KEY (creator_id) REFERENCES PERSON(id),
    FOREIGN KEY (landfill_id) REFERENCES LANDFILL(landfill_id)
);


CREATE TABLE STS_MANAGEMENT (
    id SERIAL PRIMARY KEY,
    sts_id INT NOT NULL, 
    manager_id INT NOT NULL, 
    admin_id INT NOT NULL,
    CONSTRAINT sts_unique_const UNIQUE(sts_id, manager_id, admin_id),
    FOREIGN KEY (manager_id) REFERENCES PERSON(id),
    FOREIGN KEY (admin_id) REFERENCES PERSON(id),
    FOREIGN KEY (sts_id) REFERENCES STS(sts_id)
);

CREATE TABLE LANDFILL_MANAGEMENT (
    id SERIAL PRIMARY KEY,
    landfill_id INT NOT NULL, 
    manager_id INT NOT NULL, 
    admin_id INT NOT NULL,
    CONSTRAINT landfill_unique_const UNIQUE(landfill_id, manager_id, admin_id),
    FOREIGN KEY (manager_id) REFERENCES PERSON(id),
    FOREIGN KEY (admin_id) REFERENCES PERSON(id),
    FOREIGN KEY (landfill_id) REFERENCES LANDFILL(landfill_id)
);



CREATE TABLE VEHICLE_TYPE(
    id SERIAL PRIMARY KEY, 
    type TEXT NOT NULL,
    vehicle_capacity INT NOT NULL,
    loaded_cost NUMERIC(10, 2) NOT NULL,
    unloaded_cost NUMERIC(10, 2) NOT NULL
);



CREATE TABLE VEHICLE (
    registration_no TEXT PRIMARY KEY,
    type_Id INT NOT NULL,
    model TEXT NOT NULL,
    FOREIGN KEY (type_id) REFERENCES VEHICLE_TYPE(id)
);


CREATE TABLE STS_VEHICLE_ASSIGNMENT(
    id SERIAL PRIMARY KEY,
    registration_no TEXT NOT NULL,
    sts_id INT NOT NULL,
    assign_id INT NOT NULL, 
    FOREIGN KEY (assign_id) REFERENCES PERSON(id),
    FOREIGN KEY (sts_id) REFERENCES STS(sts_id), 
    FOREIGN KEY (registration_no) REFERENCES VEHICLE(registration_no)
);

CREATE TABLE STS_VEHICLE_ENTRY(
    id SERIAL PRIMARY KEY,
    registration_no TEXT NOT NULL,
    sts_id INT NOT NULL, 
    manager_id INT NOT NULL, 
    arrival_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    departure_time TIMESTAMP, 
    weight_of_waste NUMERIC(10, 2) NOT NULL, 
    FOREIGN KEY (registration_no) REFERENCES VEHICLE(registration_no),
    FOREIGN KEY (sts_id) REFERENCES STS(sts_id),
    FOREIGN KEY (manager_id) REFERENCES PERSON(id)
);

CREATE TABLE LANDFILL_VEHICLE_ENTRY(
    id SERIAL PRIMARY KEY,
    registration_no TEXT NOT NULL,
    landfill_id INT NOT NULL, 
    manager_id INT NOT NULL, 
    arrival_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    departure_time TIMESTAMP, 
    weight_of_waste NUMERIC(10, 2) NOT NULL, 
    FOREIGN KEY (registration_no) REFERENCES VEHICLE(registration_no),
    FOREIGN KEY (landfill_id) REFERENCES LANDFILL(landfill_id),
    FOREIGN KEY (manager_id) REFERENCES PERSON(id)
);



INSERT INTO USER_ROLE(role_name) VALUES('System Admin');


INSERT INTO PERSON(id, username, email, password, contact_no, first_name, last_name, role_id) 
Values(1, 'admin', 'admin@gmail.com', '$2b$10$K2uLTjOY1TG/IkFwn7dPXOrWSySMJxp/wi1j3Pj7UBNarsxqKOfIO', '1234567', 'Mohammad Raihan','Rashid', 1);

