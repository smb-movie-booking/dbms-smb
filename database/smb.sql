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
    Facilities VARCHAR(255),  -- e.g., 'Parking,Dolby,Recliner'
    Cancellation_Allowed BOOLEAN DEFAULT FALSE,
    Created_At DATETIME DEFAULT CURRENT_TIMESTAMP,
    Updated_At DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
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
    Duration TIME,
    Movie_Language VARCHAR(16),
    ReleaseDate DATETIME,
    Country VARCHAR(64),
    Genre VARCHAR(50),
    Rating DECIMAL(2,1) CHECK (Rating >= 0.0 AND Rating <= 10.0),    -- e.g., 8.5
    Age_Format VARCHAR(8),  -- e.g., UA16, A, U
    Poster_Image_URL VARCHAR(255),
    Trailer_URL VARCHAR(255),
    IsActive BOOLEAN DEFAULT TRUE,
    Created_At DATETIME DEFAULT CURRENT_TIMESTAMP,
    Updated_At DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE Movie_Show (
    ShowID INT PRIMARY KEY,
    Show_Date DATETIME,
    StartTime DATETIME,
    EndTime DATETIME,
    CinemaHallID INT,
    MovieID INT,
    Format VARCHAR(16),     -- e.g., '2D', '3D', 'IMAX'
    Show_Language VARCHAR(16),   -- overrides Movie.Movie_Language if needed
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

CREATE TABLE Review (
    ReviewID INT PRIMARY KEY AUTO_INCREMENT,
    UserID INT,
    MovieID INT,
    Rating DECIMAL(2,1),
    Comment VARCHAR(512),
    Review_Timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UserID) REFERENCES User(UserID),
    FOREIGN KEY (MovieID) REFERENCES Movie(MovieID)
);

CREATE INDEX idx_movie_language ON Movie(Movie_Language);
CREATE INDEX idx_movie_genre ON Movie(Genre);
CREATE INDEX idx_movie_release ON Movie(ReleaseDate);

CREATE INDEX idx_show_movie ON Movie_Show(MovieID);
CREATE INDEX idx_show_cinema_hall ON Movie_Show(CinemaHallID);
CREATE INDEX idx_show_date_time ON Movie_Show(Show_Date, StartTime);
CREATE INDEX idx_show_format_lang ON Movie_Show(Format, Show_Language);  -- if columns added

CREATE INDEX idx_cinema_city ON Cinema(CityID);

CREATE INDEX idx_cinema_hall_cinema ON Cinema_Hall(CinemaID);

CREATE INDEX idx_cinema_seat_hall ON Cinema_Seat(CinemaHallID);

CREATE INDEX idx_show_seat_showid ON Show_Seat(ShowID);
CREATE INDEX idx_show_seat_bookingid ON Show_Seat(BookingID);

CREATE INDEX idx_booking_userid ON Booking(UserID);
CREATE INDEX idx_booking_showid ON Booking(ShowID);

CREATE INDEX idx_payment_bookingid ON Payment(BookingID);

CREATE INDEX idx_review_movieid ON Review(MovieID);
CREATE INDEX idx_review_userid ON Review(UserID);

CREATE INDEX idx_show_movie_date ON Movie_Show(MovieID, Show_Date);

DELIMITER $$

CREATE PROCEDURE PopulateShowSeats(
    IN inputShowID INT,
    IN inputCinemaHallID INT,
    IN inputDefaultPrice DECIMAL(10,2)
)
BEGIN
    INSERT INTO Show_Seat (Seat_Status, Price, CinemaSeatID, ShowID)
    SELECT 
        0 AS Seat_Status,
        inputDefaultPrice AS Price,
        cs.CinemaSeatID,
        inputShowID AS ShowID
    FROM Cinema_Seat cs
    WHERE cs.CinemaHallID = inputCinemaHallID;
END$$

DELIMITER ;

