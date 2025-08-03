CREATE DATABASE IF NOT EXISTS smb;
USE smb;

CREATE TABLE User (
    UserID INT AUTO_INCREMENT PRIMARY KEY,
    User_Name VARCHAR(64) NOT NULL,
    User_Password VARCHAR(255) NOT NULL,
    Email VARCHAR(64) UNIQUE,
    Phone VARCHAR(16) NOT NULL UNIQUE,
    IsAdmin BOOLEAN DEFAULT 0
);

SET time_zone = '+05:30';

CREATE TABLE OTP (
  Identifier VARCHAR(100) NOT NULL,  -- Can store either phone number or email
  OTP_Code VARCHAR(6) NOT NULL,
  Expires_At DATETIME NOT NULL,
  Verified BOOLEAN DEFAULT FALSE,
  PRIMARY KEY (Identifier)
);


CREATE TABLE City (
    CityID INT PRIMARY KEY,
    City_Name VARCHAR(64),
    City_State VARCHAR(64),
    ZipCode VARCHAR(16)
);

CREATE TABLE Cinema (
    CinemaID INT PRIMARY KEY,
    Cinema_Name VARCHAR(64),
    TotalCinemaHalls INT,
    CityID INT,
    FOREIGN KEY (CityID) REFERENCES City(CityID)
);

CREATE TABLE Cinema_Hall (
    CinemaHallID INT PRIMARY KEY,
    Hall_Name VARCHAR(64),
    TotalSeats INT,
    CinemaID INT,
    FOREIGN KEY (CinemaID) REFERENCES Cinema(CinemaID)
);

CREATE TABLE Cinema_Seat (
    CinemaSeatID INT PRIMARY KEY,
    SeatNumber INT,
    Seat_Type INT,  -- You can change this to ENUM if needed
    CinemaHallID INT,
    FOREIGN KEY (CinemaHallID) REFERENCES Cinema_Hall(CinemaHallID)
);

CREATE TABLE Movie (
    MovieID INT PRIMARY KEY,
    Title VARCHAR(256),
    Movie_Description VARCHAR(512),
    Duration DATETIME,
    Movie_Language VARCHAR(16),
    ReleaseDate DATETIME,
    Country VARCHAR(64),
    Genre VARCHAR(20)
);

CREATE TABLE Movie_Show (
    ShowID INT PRIMARY KEY,
    Show_Date DATETIME,
    StartTime DATETIME,
    EndTime DATETIME,
    CinemaHallID INT,
    MovieID INT,
    FOREIGN KEY (CinemaHallID) REFERENCES Cinema_Hall(CinemaHallID),
    FOREIGN KEY (MovieID) REFERENCES Movie(MovieID)
);

CREATE TABLE Booking (
    BookingID INT PRIMARY KEY,
    NumberOfSeats INT,
    Booking_Timestamp DATETIME,
    Booking_Status INT,
    UserID INT,
    ShowID INT,
    FOREIGN KEY (UserID) REFERENCES User(UserID),
    FOREIGN KEY (ShowID) REFERENCES Movie_Show(ShowID)
);


CREATE TABLE Show_Seat (
    ShowSeatID INT PRIMARY KEY,
    Seat_Status INT,
    Price DECIMAL(10,2),
    CinemaSeatID INT,
    ShowID INT,
    BookingID INT,
    FOREIGN KEY (CinemaSeatID) REFERENCES Cinema_Seat(CinemaSeatID),
    FOREIGN KEY (ShowID) REFERENCES Movie_Show(ShowID),
    FOREIGN KEY (BookingID) REFERENCES Booking(BookingID)
);


CREATE TABLE Payment (
    PaymentID INT PRIMARY KEY,
    Amount DECIMAL(10,2),
    Payment_Timestamp DATETIME,
    DiscountCouponID INT,
    RemoteTransactionID INT,
    PaymentMethod INT,  -- ENUM recommended for method
    BookingID INT,
    FOREIGN KEY (BookingID) REFERENCES Booking(BookingID)
);
