CREATE TABLE Buildings (
  OSEBuildingID INT AUTO_INCREMENT PRIMARY KEY,
  PrimaryPropertyType VARCHAR(255),
  BuildingInfo TEXT,
  BuildingLocation VARCHAR(255)
);

CREATE TABLE Buildings_gfa (
  id INT PRIMARY KEY,
  OSEBuildingID INT,
  PropertyUseTypeGFA INT,
--   PRIMARY KEY (OSEBuildingID, PropertyUseTypeGFA),
--   FOREIGN KEY (OSEBuildingID) REFERENCES Buildings(OSEBuildingID)
);

CREATE TABLE Metrics (
  id INT PRIMARY KEY,
  OSEBuildingID INT AUTO_INCREMENT PRIMARY KEY,
  Metric VARCHAR(255),
  Value INT,
);

CREATE TABLE Users (
  id INT PRIMARY KEY,
  Login VARCHAR(255) PRIMARY KEY,
  Password VARCHAR(255)
);