-- Clear existing data (optional for clean test environment)
DELETE FROM Movie_Show;
DELETE FROM Movie;
DELETE FROM Cinema_Hall;
DELETE FROM Cinema;
DELETE FROM City;

-- City (used by Theater)
INSERT INTO City (CityID, City_Name, City_State, ZipCode)
VALUES (1, 'Testopolis', 'Testland', '123456');

-- Cinema (Theater with ID = 2)
INSERT INTO Cinema (CinemaID, Cinema_Name, TotalCinemaHalls, CityID, Facilities)
VALUES (2, 'Demo Theater', 1, 1, 'Parking,Dolby');

-- Cinema_Hall inside Cinema 2
INSERT INTO Cinema_Hall (CinemaHallID, Hall_Name, TotalSeats, CinemaID)
VALUES (21, 'Hall A', 150, 2);

-- Movie with ID = 1
INSERT INTO Movie (MovieID, Title, Movie_Description, Duration, Movie_Language, ReleaseDate, Country, Genre, Rating, Age_Format, Poster_Image_URL, Trailer_URL)
VALUES (
  1, 'Sample Movie', 'Just for API testing', '02:00:00', 'English', '2025-01-01',
  'USA', 'Drama', 7.5, 'UA', 'https://poster.test/sample.jpg', 'https://trailer.test/sample.mp4'
);

-- Shows for Test 1 (movieID = 1, theaterID = 2, date = 2025-08-09)
INSERT INTO Movie_Show (ShowID, Show_Date, StartTime, EndTime, CinemaHallID, MovieID, Format, Show_Language)
VALUES 
(501, '2025-08-09', '2025-08-09 13:00:00', '2025-08-09 15:00:00', 21, 1, '2D', 'English'),
(502, '2025-08-09', '2025-08-09 18:00:00', '2025-08-09 20:00:00', 21, 1, '2D', 'English');
