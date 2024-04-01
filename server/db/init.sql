-- Drop existing tables in the correct sequence
DROP TABLE IF EXISTS VEHICLE_ENTRY;
DROP TABLE IF EXISTS STS_VEHICLE_ASSIGNMENT;
DROP TABLE IF EXISTS VEHICLE;
DROP TABLE IF EXISTS VEHICLE_TYPE;
DROP TABLE IF EXISTS LANDFILL_MANAGEMENT;
DROP TABLE IF EXISTS STS_MANAGEMENT;
DROP TABLE IF EXISTS PERMISSIONS;
DROP TABLE IF EXISTS PAGES;
DROP TABLE IF EXISTS STS;
DROP TABLE IF EXISTS LANDFILL;
DROP TABLE IF EXISTS PERSON;
DROP TABLE IF EXISTS USER_ROLE;


-- Create USER_ROLE table
CREATE TABLE USER_ROLE (
    role_id SERIAL PRIMARY KEY,
    role_name VARCHAR(50)
);

-- Create PERSON table
CREATE TABLE PERSON (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL,
    password TEXT NOT NULL,
    contact_no VARCHAR(20) NOT NULL,
    full_name TEXT NOT NULL,
    role_id INT NOT NULL, 
    FOREIGN KEY (role_id) REFERENCES USER_ROLE(role_id)
);

-- Create PAGES table
CREATE TABLE PAGES (
    page_id SERIAL PRIMARY KEY,
    page_title TEXT NOT NULL,
    page_description TEXT
);

-- Create PERMISSIONS table
CREATE TABLE PERMISSIONS (
    permission_id SERIAL PRIMARY KEY,
    page_id INT,
    role_id INT,
    FOREIGN KEY (page_id) REFERENCES PAGES(page_id),

    FOREIGN KEY (role_id) REFERENCES USER_ROLE(role_id)
);

-- Create LANDFILL table
CREATE TABLE LANDFILL (
    landfill_id SERIAL PRIMARY KEY,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    address VARCHAR(255) NOT NULL,
    landfill_capacity INT NOT NULL,
    current_waste INT DEFAULT 0,
    operation_time INTERVAL NOT NULL,
    creator_id INT NOT NULL, 
    FOREIGN KEY (creator_id) REFERENCES PERSON(id)
);

-- Create STS table
CREATE TABLE STS (
    sts_id SERIAL PRIMARY KEY,
    sts_capacity INT,
    current_waste INT DEFAULT 0,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    address TEXT,
    ward_no INT,
    landfill_id INT NOT NULL, 
    creator_id INT NOT NULL, 
    FOREIGN KEY (creator_id) REFERENCES PERSON(id),
    FOREIGN KEY (landfill_id) REFERENCES LANDFILL(landfill_id)
);

-- Create STS_MANAGEMENT table
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

-- Create LANDFILL_MANAGEMENT table
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

-- Create VEHICLE_TYPE table
CREATE TABLE VEHICLE_TYPE (
    id SERIAL PRIMARY KEY, 
    type TEXT NOT NULL,
    vehicle_capacity INT NOT NULL,
    loaded_cost NUMERIC(10, 2) NOT NULL,
    unloaded_cost NUMERIC(10, 2) NOT NULL
);

-- Create VEHICLE table
CREATE TABLE VEHICLE (
    registration_no TEXT PRIMARY KEY,
    type_id INT NOT NULL,
    model TEXT NOT NULL,
    FOREIGN KEY (type_id) REFERENCES VEHICLE_TYPE(id)
);

-- Create STS_VEHICLE_ASSIGNMENT table
CREATE TABLE STS_VEHICLE_ASSIGNMENT (
    id SERIAL PRIMARY KEY,
    registration_no TEXT NOT NULL,
    sts_id INT NOT NULL,
    assign_id INT NOT NULL, 
    FOREIGN KEY (assign_id) REFERENCES PERSON(id),
    FOREIGN KEY (sts_id) REFERENCES STS(sts_id), 
    FOREIGN KEY (registration_no) REFERENCES VEHICLE(registration_no)
);

-- Create VEHICLE_ENTRY table
CREATE TABLE VEHICLE_ENTRY (
    id SERIAL PRIMARY KEY,
    registration_no TEXT NOT NULL,
    location_id INT NOT NULL, 
    manager_id INT NOT NULL, 
    arrival_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    departure_time TIMESTAMP, 
    weight_of_waste NUMERIC(10, 2) NOT NULL, 
    estimated_distance NUMERIC(10, 2) NOT NULL,
    estimated_duration INTERVAL NOT NULL,
    arrived_at TEXT NOT NULL CHECK (arrived_at IN ('STS', 'Landfill')),
    FOREIGN KEY (registration_no) REFERENCES VEHICLE(registration_no),
    FOREIGN KEY (location_id) REFERENCES STS(sts_id) DEFERRABLE,
    FOREIGN KEY (location_id) REFERENCES LANDFILL(landfill_id) DEFERRABLE,
    FOREIGN KEY (manager_id) REFERENCES PERSON(id)
);

-- Insert dummy data into USER_ROLE table
INSERT INTO USER_ROLE(role_name) VALUES('System Admin'), ('STS Manager'), ('Landfill Manager'), ('Unassigned');

-- Insert dummy data into PERSON table
INSERT INTO PERSON(username, email, password, contact_no, full_name, role_id) 
VALUES 
('admin', 'admin@gmail.com', '$2b$10$K2uLTjOY1TG/IkFwn7dPXOrWSySMJxp/wi1j3Pj7UBNarsxqKOfIO', '1234567', 'Mohammad Raihan Rashid', 1),
('sts_manager1', 'sts_manager1@example.com', '$2b$10$uWYaGh5s/wvzB.lw8ePUr.eP1UwA8QaTtNKKqHfA7D3gNK4V6qAOi', '1234567890', 'Alice Smith', 2),
('landfill_manager1', 'landfill_manager1@example.com', '$2b$10$uWYaGh5s/wvzB.lw8ePUr.eP1UwA8QaTtNKKqHfA7D3gNK4V6qAOi', '9876543210', 'Bob Johnson', 3),
('user1', 'user1@example.com', '$2b$10$uWYaGh5s/wvzB.lw8ePUr.eP1UwA8QaTtNKKqHfA7D3gNK4V6qAOi', '5555555555', 'Charlie Brown', 4);

-- Insert dummy data into VEHICLE_TYPE table
INSERT INTO VEHICLE_TYPE(type, vehicle_capacity, loaded_cost, unloaded_cost)
VALUES ('Open Truck', 3000, 50.00, 25.00),
       ('Dump Truck', 5000, 70.00, 35.00),
       ('Compactor', 5000, 70.00, 35.00),
       ('Container Carrier', 15000, 150.00, 75.00);

-- Insert dummy data into LANDFILL table
INSERT INTO LANDFILL(latitude, longitude, address, landfill_capacity, operation_time, creator_id)
VALUES (23.8058, 90.3727, '789 LMN St, Dhaka, Bangladesh', 20000, '12 hours', 1),
       (23.8067, 90.3789, '321 PQR St, Dhaka, Bangladesh', 25000, '14 hours', 1);

-- Insert dummy data into LANDFILL_MANAGEMENT table
INSERT INTO LANDFILL_MANAGEMENT(landfill_id, manager_id, admin_id)
VALUES (1, 3, 1),
       (2, 3, 1);

-- Insert dummy data into STS table
INSERT INTO STS(sts_capacity, latitude, longitude, address, ward_no, landfill_id, creator_id)
VALUES (5000, 23.8103, 90.4125, '123 ABC St, Dhaka, Bangladesh', 10, 1, 1),
       (7000, 23.8123, 90.4156, '456 XYZ St, Dhaka, Bangladesh', 12, 1, 1);

-- Insert dummy data into STS_MANAGEMENT table
INSERT INTO STS_MANAGEMENT(sts_id, manager_id, admin_id)
VALUES (1, 2, 1),
       (2, 2, 1);

-- Insert dummy data into VEHICLE table
INSERT INTO VEHICLE(registration_no, type_id, model)
VALUES ('ABC123', 1, 'Ford F150'),
       ('DEF456', 2, 'Chevrolet Express'),
       ('GHI789', 4, 'Volvo FH16');

-- Insert dummy data into STS_VEHICLE_ASSIGNMENT table
INSERT INTO STS_VEHICLE_ASSIGNMENT(registration_no, sts_id, assign_id)
VALUES ('ABC123', 1, 2),
       ('DEF456', 1, 2);
			 
 -- Insert dummy data into VEHICLE_ENTRY table
INSERT INTO VEHICLE_ENTRY(registration_no, location_id, manager_id, arrival_time, departure_time, weight_of_waste, estimated_distance, estimated_duration, arrived_at)
VALUES ('ABC123', 1, 2, '2024-03-31 09:00:00', '2024-03-31 10:30:00', 3000.00, 10.5, '1 hour', 'STS'),
       ('DEF456', 1, 2, '2024-03-31 10:00:00', '2024-03-31 11:30:00', 4000.00, 12.5, '1.5 hours', 'STS'),
       ('GHI789', 1, 3, '2024-03-31 11:30:00', '2024-03-31 13:00:00', 5000.00, 20.0, '1.5 hours', 'Landfill');



