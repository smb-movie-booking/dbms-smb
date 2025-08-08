-- SQL Script to Clear All Data from All Tables
-- Temporarily disables foreign key checks to allow truncation in any order.

use smb;

SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE Payment;
TRUNCATE TABLE Show_Seat;
TRUNCATE TABLE Booking;
TRUNCATE TABLE Review;
TRUNCATE TABLE Movie_Show;
TRUNCATE TABLE Cinema_Seat;
TRUNCATE TABLE Cinema_Hall;
TRUNCATE TABLE Cinema;
TRUNCATE TABLE Movie;
TRUNCATE TABLE City;
TRUNCATE TABLE User;
TRUNCATE TABLE OTP;

SET FOREIGN_KEY_CHECKS = 1;

-- All tables are now empty.

-- SQL Data Population File (Corrected)

-- Use the 'smb' database
USE smb;

-- ### Data for City Table ###
-- Inserting 50 cities in India
INSERT INTO City (CityID, City_Name, City_State, ZipCode) VALUES
(1, 'Mumbai', 'Maharashtra', '400001'),
(2, 'Delhi', 'Delhi', '110001'),
(3, 'Bangalore', 'Karnataka', '560001'),
(4, 'Hyderabad', 'Telangana', '500001'),
(5, 'Chennai', 'Tamil Nadu', '600001'),
(6, 'Kolkata', 'West Bengal', '700001'),
(7, 'Pune', 'Maharashtra', '411001'),
(8, 'Ahmedabad', 'Gujarat', '380001'),
(9, 'Jaipur', 'Rajasthan', '302001'),
(10, 'Surat', 'Gujarat', '395001'),
(11, 'Lucknow', 'Uttar Pradesh', '226001'),
(12, 'Kanpur', 'Uttar Pradesh', '208001'),
(13, 'Nagpur', 'Maharashtra', '440001'),
(14, 'Indore', 'Madhya Pradesh', '452001'),
(15, 'Thane', 'Maharashtra', '400601'),
(16, 'Bhopal', 'Madhya Pradesh', '462001'),
(17, 'Visakhapatnam', 'Andhra Pradesh', '530001'),
(18, 'Pimpri-Chinchwad', 'Maharashtra', '411018'),
(19, 'Patna', 'Bihar', '800001'),
(20, 'Vadodara', 'Gujarat', '390001'),
(21, 'Ghaziabad', 'Uttar Pradesh', '201001'),
(22, 'Ludhiana', 'Punjab', '141001'),
(23, 'Agra', 'Uttar Pradesh', '282001'),
(24, 'Nashik', 'Maharashtra', '422001'),
(25, 'Faridabad', 'Haryana', '121001'),
(26, 'Meerut', 'Uttar Pradesh', '250001'),
(27, 'Rajkot', 'Gujarat', '360001'),
(28, 'Kalyan-Dombivli', 'Maharashtra', '421201'),
(29, 'Vasai-Virar', 'Maharashtra', '401202'),
(30, 'Varanasi', 'Uttar Pradesh', '221001'),
(31, 'Srinagar', 'Jammu and Kashmir', '190001'),
(32, 'Aurangabad', 'Maharashtra', '431001'),
(33, 'Dhanbad', 'Jharkhand', '826001'),
(34, 'Amritsar', 'Punjab', '143001'),
(35, 'Navi Mumbai', 'Maharashtra', '400701'),
(36, 'Allahabad', 'Uttar Pradesh', '211001'),
(37, 'Ranchi', 'Jharkhand', '834001'),
(38, 'Howrah', 'West Bengal', '711101'),
(39, 'Coimbatore', 'Tamil Nadu', '641001'),
(40, 'Jabalpur', 'Madhya Pradesh', '482001'),
(41, 'Gwalior', 'Madhya Pradesh', '474001'),
(42, 'Vijayawada', 'Andhra Pradesh', '520001'),
(43, 'Jodhpur', 'Rajasthan', '342001'),
(44, 'Madurai', 'Tamil Nadu', '625001'),
(45, 'Raipur', 'Chhattisgarh', '492001'),
(46, 'Kota', 'Rajasthan', '324001'),
(47, 'Guwahati', 'Assam', '781001'),
(48, 'Chandigarh', 'Chandigarh', '160001'),
(49, 'Solapur', 'Maharashtra', '413001'),
(50, 'Hubli-Dharwad', 'Karnataka', '580020');

-- ### Data for Cinema Table ###
-- Inserting 50 cinemas across various cities
INSERT INTO Cinema (CinemaID, Cinema_Name, TotalCinemaHalls, CityID, Facilities, Cancellation_Allowed) VALUES
(1, 'PVR Icon', 5, 1, 'Parking,Dolby,Recliner', 1),
(2, 'INOX Insignia', 4, 2, 'Parking,Dolby,Recliner,Cafe', 1),
(3, 'Cinepolis VIP', 6, 3, 'Parking,IMAX,4DX,Recliner', 1),
(4, 'Miraj Cinemas', 3, 4, 'Parking,Dolby', 0),
(5, 'SPI Cinemas', 8, 5, 'Parking,Dolby Atmos,Recliner', 1),
(6, 'Carnival Cinemas', 4, 6, 'Parking,Cafe', 0),
(7, 'City Pride', 5, 7, 'Parking,Dolby', 1),
(8, 'Mukta A2 Cinemas', 3, 8, 'Parking', 0),
(9, 'Raj Mandir Cinema', 1, 9, 'Heritage,Cafe', 0),
(10, 'PVR Cinemas', 7, 10, 'Parking,Dolby,Recliner', 1),
(11, 'Wave Cinemas', 5, 11, 'Parking,Dolby,Recliner', 1),
(12, 'INOX', 4, 12, 'Parking,Dolby', 1),
(13, 'Cinepolis', 6, 13, 'Parking,Dolby,4DX', 1),
(14, 'PVR', 5, 14, 'Parking,Dolby,Recliner', 1),
(15, 'INOX', 4, 15, 'Parking,Dolby', 1),
(16, 'Mukta Cinemas', 3, 16, 'Parking', 0),
(17, 'Jagadamba Cinemas', 2, 17, 'Dolby', 0),
(18, 'E-Square', 4, 18, 'Parking,Dolby', 1),
(19, 'Cinepolis', 5, 19, 'Parking,Dolby,Recliner', 1),
(20, 'INOX', 4, 20, 'Parking,Dolby', 1),
(21, 'PVR', 6, 21, 'Parking,IMAX,Recliner', 1),
(22, 'Cinepolis', 5, 22, 'Parking,Dolby', 1),
(23, 'Sarv Multiplex', 3, 23, 'Parking,Dolby', 0),
(24, 'Cinemax', 4, 24, 'Parking,Dolby', 1),
(25, 'INOX Crown', 4, 25, 'Parking,Dolby', 1),
(26, 'PVS Cinemas', 3, 26, 'Parking,Dolby', 0),
(27, 'Cosmo Multiplex', 4, 27, 'Parking,Cafe', 0),
(28, 'SM5 Multiplex', 5, 28, 'Parking,Dolby', 1),
(29, 'Fun Fiesta', 3, 29, 'Parking', 0),
(30, 'IP Sigra', 4, 30, 'Parking,Dolby', 1),
(31, 'INOX', 3, 31, 'Parking,Dolby', 1),
(32, 'PVR', 4, 32, 'Parking,Dolby,Recliner', 1),
(33, 'INOX', 3, 33, 'Parking,Dolby', 1),
(34, 'Cinepolis', 4, 34, 'Parking,Dolby', 1),
(35, 'PVR', 7, 35, 'Parking,IMAX,Recliner', 1),
(36, 'PVR Vinayak', 4, 36, 'Parking,Dolby', 1),
(37, 'PVR', 5, 37, 'Parking,Dolby,Recliner', 1),
(38, 'INOX', 4, 38, 'Parking,Dolby', 1),
(39, 'PVR', 6, 39, 'Parking,Dolby,Recliner', 1),
(40, 'INOX', 3, 40, 'Parking,Dolby', 1),
(41, 'Fun Cinemas', 4, 41, 'Parking,Dolby', 1),
(42, 'PVP Square', 5, 42, 'Parking,Dolby,Recliner', 1),
(43, 'INOX', 4, 43, 'Parking,Dolby', 1),
(44, 'Vetri Theatres', 2, 44, 'Dolby', 0),
(45, 'PVR', 5, 45, 'Parking,Dolby,Recliner', 1),
(46, 'INOX', 4, 46, 'Parking,Dolby', 1),
(47, 'PVR', 4, 47, 'Parking,Dolby', 1),
(48, 'PVR Centra', 5, 48, 'Parking,IMAX,Recliner', 1),
(49, 'INOX', 3, 49, 'Parking,Dolby', 1),
(50, 'Cinepolis', 4, 50, 'Parking,Dolby', 1);

-- ### Data for Cinema_Hall and Cinema_Seat Tables ###
-- This script will generate halls for each cinema and seats for each hall.
DELIMITER $$
CREATE PROCEDURE PopulateHallsAndSeats()
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE j INT DEFAULT 1;
    DECLARE k INT DEFAULT 1;
    DECLARE hall_id INT DEFAULT 1;
    DECLARE seat_id INT DEFAULT 1;
    DECLARE total_halls INT;
    DECLARE total_seats INT;

    WHILE i <= 50 DO
        SELECT TotalCinemaHalls INTO total_halls FROM Cinema WHERE CinemaID = i;
        SET j = 1;
        WHILE j <= total_halls DO
            SET total_seats = 100 + FLOOR(RAND() * 50); -- Random seats between 100 and 150
            INSERT INTO Cinema_Hall (CinemaHallID, Hall_Name, TotalSeats, CinemaID)
            VALUES (hall_id, CONCAT('Hall ', j), total_seats, i);

            SET k = 1;
            WHILE k <= total_seats DO
                INSERT INTO Cinema_Seat (CinemaSeatID, SeatNumber, Seat_Type, CinemaHallID)
                VALUES (seat_id, k, IF(k > total_seats - 20, 2, 1), hall_id); -- Last 20 seats are premium
                SET seat_id = seat_id + 1;
                SET k = k + 1;
            END WHILE;

            SET hall_id = hall_id + 1;
            SET j = j + 1;
        END WHILE;
        SET i = i + 1;
    END WHILE;
END$$
DELIMITER ;

-- Execute the procedure
CALL PopulateHallsAndSeats();

-- ### Data for Movie Table ###
-- Inserting 50 movies
INSERT INTO Movie (MovieID, Title, Movie_Description, Duration, Movie_Language, ReleaseDate, Country, Genre, Rating, Age_Format, Poster_Image_URL, Trailer_URL, IsActive) VALUES
(1, 'Kalki 2898 AD', 'A modern-day avatar of Vishnu, a Hindu god, who is believed to have descended to earth to protect the world from evil forces.', '03:01:00', 'Telugu', '2024-06-27 00:00:00', 'India', 'Sci-Fi', 8.5, 'UA', 'https://example.com/kalki_poster.jpg', 'https://example.com/kalki_trailer.mp4', 1),
(2, 'Jawan', 'A man is driven by a personal vendetta to rectify the wrongs in society, while keeping a promise made years ago.', '02:49:00', 'Hindi', '2023-09-07 00:00:00', 'India', 'Action', 7.8, 'UA', 'https://example.com/jawan_poster.jpg', 'https://example.com/jawan_trailer.mp4', 1),
(3, 'Oppenheimer', 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.', '03:00:00', 'English', '2023-07-21 00:00:00', 'USA', 'Biography', 8.6, 'A', 'https://example.com/oppenheimer_poster.jpg', 'https://example.com/oppenheimer_trailer.mp4', 1),
(4, 'Leo', 'Parthiban is a mild-mannered cafe owner in Kashmir, who fends off a gang of thugs and gains local fame. This brings him to the attention of a drug cartel who suspect that he was once a part of them.', '02:44:00', 'Tamil', '2023-10-19 00:00:00', 'India', 'Action', 7.9, 'UA', 'https://example.com/leo_poster.jpg', 'https://example.com/leo_trailer.mp4', 1),
(5, 'Manjummel Boys', 'A group of friends from a small town named Manjummel get into a sticky situation when one of them gets stuck in the Guna Caves, a place where no one has ever returned from.', '02:15:00', 'Malayalam', '2024-02-22 00:00:00', 'India', 'Thriller', 8.3, 'U', 'https://example.com/manjummel_boys_poster.jpg', 'https://example.com/manjummel_boys_trailer.mp4', 1),
(6, 'Dune: Part Two', 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.', '02:46:00', 'English', '2024-03-01 00:00:00', 'USA', 'Sci-Fi', 8.8, 'UA', 'https://example.com/dune2_poster.jpg', 'https://example.com/dune2_trailer.mp4', 1),
(7, 'Guntur Kaaram', 'Years after his mother abandons him and remarries, a man is given an ultimatum to disown her to inherit his estranged grandfather''s wealth.', '02:39:00', 'Telugu', '2024-01-12 00:00:00', 'India', 'Action', 6.5, 'UA', 'https://example.com/guntur_kaaram_poster.jpg', 'https://example.com/guntur_kaaram_trailer.mp4', 1),
(8, 'Salaar: Part 1 – Ceasefire', 'The fate of a violently contested kingdom hangs on the fraught bond between two friends-turned-foes.', '02:55:00', 'Telugu', '2023-12-22 00:00:00', 'India', 'Action', 6.7, 'A', 'https://example.com/salaar_poster.jpg', 'https://example.com/salaar_trailer.mp4', 1),
(9, 'Animal', 'A son''s obsessive love for his father leads him to a path of crime and violence.', '03:24:00', 'Hindi', '2023-12-01 00:00:00', 'India', 'Action', 6.9, 'A', 'https://example.com/animal_poster.jpg', 'https://example.com/animal_trailer.mp4', 1),
(10, 'Fighter', 'Top IAF aviators come together in the face of imminent danger, to form Air Dragons. They must now stand united to protect the nation.', '02:46:00', 'Hindi', '2024-01-25 00:00:00', 'India', 'Action', 7.5, 'UA', 'https://example.com/fighter_poster.jpg', 'https://example.com/fighter_trailer.mp4', 1),
(11, 'Article 370', 'A young local field agent, is picked from the Prime Minister''s office for a top-secret mission to crack down on terrorism and the conflict economy by abrogating Article 370.', '02:40:00', 'Hindi', '2024-02-23 00:00:00', 'India', 'Thriller', 8.2, 'UA', 'https://example.com/article370_poster.jpg', 'https://example.com/article370_trailer.mp4', 1),
(12, 'Hanu-Man', 'An imaginary place called Anjanadri where the protagonist gets the powers of Hanuman and fights for Anjanadri.', '02:38:00', 'Telugu', '2024-01-12 00:00:00', 'India', 'Fantasy', 8.1, 'UA', 'https://example.com/hanuman_poster.jpg', 'https://example.com/hanuman_trailer.mp4', 1),
(13, 'Godzilla x Kong: The New Empire', 'Two ancient titans, Godzilla and Kong, clash in an epic battle as humans unravel their intertwined origins and connection to Skull Island''s mysteries.', '01:55:00', 'English', '2024-03-29 00:00:00', 'USA', 'Action', 6.5, 'UA', 'https://example.com/godzillaxkong_poster.jpg', 'https://example.com/godzillaxkong_trailer.mp4', 1),
(14, 'Shaitaan', 'A man and his family''s fun weekend retreat takes a nightmarish turn when they let in a friendly, but mysterious stranger into their house.', '02:12:00', 'Hindi', '2024-03-08 00:00:00', 'India', 'Horror', 7.1, 'A', 'https://example.com/shaitaan_poster.jpg', 'https://example.com/shaitaan_trailer.mp4', 1),
(15, 'Captain Miller', 'A renegade Captain and his unconventional outlaws execute a series of heists in British India.', '02:37:00', 'Tamil', '2024-01-12 00:00:00', 'India', 'Action', 7.6, 'UA', 'https://example.com/captain_miller_poster.jpg', 'https://example.com/captain_miller_trailer.mp4', 1),
(16, 'Aavesham', 'Three teens come to Bangalore for their engineering education and get involved in a fight with seniors. They befriend a local gangster to take revenge.', '02:37:00', 'Malayalam', '2024-04-11 00:00:00', 'India', 'Action', 8.0, 'UA', 'https://example.com/aavesham_poster.jpg', 'https://example.com/aavesham_trailer.mp4', 1),
(17, 'The Goat Life', 'The real-life story of an Indian migrant worker, Najeeb Muhammad, who goes to Saudi Arabia to earn money. However, he finds himself forced into slavery as a goatherd in the desert.', '02:52:00', 'Malayalam', '2024-03-28 00:00:00', 'India', 'Drama', 8.7, 'UA', 'https://example.com/the_goat_life_poster.jpg', 'https://example.com/the_goat_life_trailer.mp4', 1),
(18, 'Kung Fu Panda 4', 'After Po is tapped to become the Spiritual Leader of the Valley of Peace, he needs to find and train a new Dragon Warrior, while a wicked sorceress plans to re-summon all the master villains Po has vanquished to the spirit realm.', '01:34:00', 'English', '2024-03-08 00:00:00', 'USA', 'Animation', 6.9, 'U', 'https://example.com/kungfupanda4_poster.jpg', 'https://example.com/kungfupanda4_trailer.mp4', 1),
(19, 'Bade Miyan Chote Miyan', 'An elite soldier and his former protege are tasked with a mission to recover a stolen weapon from a vengeful scientist.', '02:44:00', 'Hindi', '2024-04-11 00:00:00', 'India', 'Action', 6.2, 'UA', 'https://example.com/bmcm_poster.jpg', 'https://example.com/bmcm_trailer.mp4', 1),
(20, 'Maidaan', 'The story of Syed Abdul Rahim, a pioneering football coach in India between 1952 and 1962.', '03:01:00', 'Hindi', '2024-04-10 00:00:00', 'India', 'Biography', 8.4, 'U', 'https://example.com/maidaan_poster.jpg', 'https://example.com/maidaan_trailer.mp4', 1),
(21, 'Lover', 'Following a six-year relationship, a couple starts to drift apart as they face the challenges of modern romance.', '02:29:00', 'Tamil', '2024-02-09 00:00:00', 'India', 'Romance', 7.5, 'UA', 'https://example.com/lover_poster.jpg', 'https://example.com/lover_trailer.mp4', 1),
(22, 'Teri Baaton Mein Aisa Uljha Jiya', 'An impossible love story between a man and a robot.', '02:21:00', 'Hindi', '2024-02-09 00:00:00', 'India', 'Romance', 6.8, 'UA', 'https://example.com/tbmauj_poster.jpg', 'https://example.com/tbmauj_trailer.mp4', 1),
(23, 'Laapataa Ladies', 'Two young brides get lost from a train. Their search leads to a series of comic errors and a journey of self-discovery.', '02:00:00', 'Hindi', '2024-03-01 00:00:00', 'India', 'Comedy', 8.6, 'U', 'https://example.com/laapataa_ladies_poster.jpg', 'https://example.com/laapataa_ladies_trailer.mp4', 1),
(24, 'Yodha', 'After a plane hijack, an off-duty soldier devises a strategy to defeat the hijackers and ensure the passengers'' survival.', '02:10:00', 'Hindi', '2024-03-15 00:00:00', 'India', 'Action', 6.7, 'UA', 'https://example.com/yodha_poster.jpg', 'https://example.com/yodha_trailer.mp4', 1),
(25, 'Ayalaan', 'A man who befriends an alien must stop a ruthless scientist from creating a deadly gas.', '02:35:00', 'Tamil', '2024-01-12 00:00:00', 'India', 'Sci-Fi', 6.4, 'U', 'https://example.com/ayalaan_poster.jpg', 'https://example.com/ayalaan_trailer.mp4', 1),
(26, 'The Beekeeper', 'One man''s brutal campaign for vengeance takes on national stakes after he is revealed to be a former operative of a powerful and clandestine organization known as "Beekeepers".', '01:45:00', 'English', '2024-01-12 00:00:00', 'USA', 'Action', 6.6, 'A', 'https://example.com/beekeeper_poster.jpg', 'https://example.com/beekeeper_trailer.mp4', 1),
(27, 'The Marvels', 'Carol Danvers, Kamala Khan, and Monica Rambeau team up to save the universe.', '01:45:00', 'English', '2023-11-10 00:00:00', 'USA', 'Action', 5.8, 'UA', 'https://example.com/the_marvels_poster.jpg', 'https://example.com/the_marvels_trailer.mp4', 0),
(28, 'Tiger 3', 'Tiger and Zoya are back to save the country and their family. This time it''s personal.', '02:36:00', 'Hindi', '2023-11-12 00:00:00', 'India', 'Action', 6.0, 'UA', 'https://example.com/tiger3_poster.jpg', 'https://example.com/tiger3_trailer.mp4', 0),
(29, '12th Fail', 'The real-life story of Manoj Kumar Sharma, who overcame extreme poverty to become an Indian Police Service officer.', '02:27:00', 'Hindi', '2023-10-27 00:00:00', 'India', 'Biography', 9.2, 'U', 'https://example.com/12thfail_poster.jpg', 'https://example.com/12thfail_trailer.mp4', 1),
(30, 'Jailer', 'A retired jailer goes on a manhunt to find his son''s killers. But the road leads him to a familiar, dark path.', '02:48:00', 'Tamil', '2023-08-10 00:00:00', 'India', 'Action', 7.1, 'UA', 'https://example.com/jailer_poster.jpg', 'https://example.com/jailer_trailer.mp4', 0),
(31, 'Gadar 2', 'During the Indo-Pakistani War of 1971, Tara Singh returns to Pakistan to bring his son, Charanjeet, back home.', '02:50:00', 'Hindi', '2023-08-11 00:00:00', 'India', 'Action', 5.9, 'UA', 'https://example.com/gadar2_poster.jpg', 'https://example.com/gadar2_trailer.mp4', 0),
(32, 'Rocky Aur Rani Kii Prem Kahaani', 'Flamboyant Punjabi Rocky and intellectual Bengali journalist Rani fall in love despite their differences. After facing family opposition, they decide to live with each other''s families for three months before getting married.', '02:48:00', 'Hindi', '2023-07-28 00:00:00', 'India', 'Romance', 6.8, 'UA', 'https://example.com/rrkpk_poster.jpg', 'https://example.com/rrkpk_trailer.mp4', 0),
(33, 'Bholaa', 'After 10 years of imprisonment, Bholaa is finally going home to meet his young daughter. His journey is interrupted when he gets arrested once again.', '02:24:00', 'Hindi', '2023-03-30 00:00:00', 'India', 'Action', 6.1, 'UA', 'https://example.com/bholaa_poster.jpg', 'https://example.com/bholaa_trailer.mp4', 0),
(34, 'Pathaan', 'An Indian RAW agent, Pathaan, gets to know about a major attack planned by a mercenary group in India. He has to team up with an ISI agent to stop them from executing the plan.', '02:26:00', 'Hindi', '2023-01-25 00:00:00', 'India', 'Action', 6.8, 'UA', 'https://example.com/pathaan_poster.jpg', 'https://example.com/pathaan_trailer.mp4', 0),
(35, 'Mission Raniganj', 'The story of Jaswant Singh Gill, a brave and diligent mining engineer from IIT Dhanbad who rescued 65 trapped miners at the Raniganj Coalfields in 1989.', '02:18:00', 'Hindi', '2023-10-06 00:00:00', 'India', 'Biography', 7.4, 'UA', 'https://example.com/mission_raniganj_poster.jpg', 'https://example.com/mission_raniganj_trailer.mp4', 1),
(36, 'Drishyam 2', '7 years after the case related to Vijay Salgaonkar and his family was closed, a series of unexpected events bring a truth to light that threatens to change everything for the Salgaonkars.', '02:33:00', 'Hindi', '2022-11-18 00:00:00', 'India', 'Thriller', 8.3, 'UA', 'https://example.com/drishyam2_poster.jpg', 'https://example.com/drishyam2_trailer.mp4', 0),
(37, 'Brahmastra Part One: Shiva', 'A DJ with a mysterious connection to fire, discovers his destiny as the Agni Astra in a world of ancient divine weapons.', '02:47:00', 'Hindi', '2022-09-09 00:00:00', 'India', 'Fantasy', 5.6, 'UA', 'https://example.com/brahmastra_poster.jpg', 'https://example.com/brahmastra_trailer.mp4', 0),
(38, 'K.G.F: Chapter 2', 'In the blood-soaked Kolar Gold Fields, Rocky''s name strikes fear into his foes. While his allies look up to him, the government sees him as a threat to law and order. Rocky must battle threats from all sides for unchallenged supremacy.', '02:48:00', 'Kannada', '2022-04-14 00:00:00', 'India', 'Action', 8.3, 'UA', 'https://example.com/kgf2_poster.jpg', 'https://example.com/kgf2_trailer.mp4', 0),
(39, 'RRR', 'A fictitious story about two legendary revolutionaries and their journey away from home before they started fighting for their country in the 1920s.', '03:07:00', 'Telugu', '2022-03-25 00:00:00', 'India', 'Action', 8.0, 'UA', 'https://example.com/rrr_poster.jpg', 'https://example.com/rrr_trailer.mp4', 0),
(40, 'Pushpa: The Rise - Part 1', 'A labourer named Pushpa makes enemies as he rises in the world of red sandalwood smuggling. However, violence erupts when the police attempt to bring down his illegal business.', '02:59:00', 'Telugu', '2021-12-17 00:00:00', 'India', 'Action', 7.6, 'UA', 'https://example.com/pushpa_poster.jpg', 'https://example.com/pushpa_trailer.mp4', 0),
(41, 'Sooryavanshi', 'DCP Veer Sooryavanshi, the chief of the Mumbai Anti-Terrorism Squad, and his team join forces with Inspector Sangram Bhalerao and DCP Bajirao Singham to stop a terrorist group planning to attack Mumbai.', '02:25:00', 'Hindi', '2021-11-05 00:00:00', 'India', 'Action', 6.5, 'UA', 'https://example.com/sooryavanshi_poster.jpg', 'https://example.com/sooryavanshi_trailer.mp4', 0),
(42, 'Master', 'An alcoholic professor is sent to a juvenile school, where he clashes with a gangster who uses the school children for criminal activities.', '02:59:00', 'Tamil', '2021-01-13 00:00:00', 'India', 'Action', 7.8, 'UA', 'https://example.com/master_poster.jpg', 'https://example.com/master_trailer.mp4', 0),
(43, 'Tanhaji: The Unsung Warrior', 'Tanhaji, a Maratha warrior, is Shivaji''s trusted lieutenant. When the Mughals invade and conquer the Kondhana fort, he sets out to reclaim it for his king and country.', '02:15:00', 'Hindi', '2020-01-10 00:00:00', 'India', 'Action', 7.6, 'UA', 'https://example.com/tanhaji_poster.jpg', 'https://example.com/tanhaji_trailer.mp4', 0),
(44, 'War', 'An Indian soldier is assigned to eliminate his former mentor who has gone rogue.', '02:34:00', 'Hindi', '2019-10-02 00:00:00', 'India', 'Action', 6.5, 'UA', 'https://example.com/war_poster.jpg', 'https://example.com/war_trailer.mp4', 0),
(45, 'Kabir Singh', 'A short-tempered house surgeon gets used to drugs and alcohol when his girlfriend is forced to marry another man.', '02:52:00', 'Hindi', '2019-06-21 00:00:00', 'India', 'Drama', 7.1, 'A', 'https://example.com/kabir_singh_poster.jpg', 'https://example.com/kabir_singh_trailer.mp4', 0),
(46, 'Uri: The Surgical Strike', 'Indian army special forces execute a covert operation to avenge the killing of fellow army men at their base by a terrorist group.', '02:18:00', 'Hindi', '2019-01-11 00:00:00', 'India', 'Action', 8.2, 'UA', 'https://example.com/uri_poster.jpg', 'https://example.com/uri_trailer.mp4', 0),
(47, 'Sanju', 'The controversial life of actor Sanjay Dutt: his film career, jail sentence, and personal life.', '02:41:00', 'Hindi', '2018-06-29 00:00:00', 'India', 'Biography', 7.7, 'UA', 'https://example.com/sanju_poster.jpg', 'https://example.com/sanju_trailer.mp4', 0),
(48, 'Padmaavat', 'Set in medieval Rajasthan, Queen Padmavati is married to a noble king and they live in a prosperous fortress with their subjects until an ambitious Sultan hears of Padmavati''s beauty and forms an obsessive love for the Queen of Mewar.', '02:43:00', 'Hindi', '2018-01-25 00:00:00', 'India', 'Drama', 7.0, 'UA', 'https://example.com/padmaavat_poster.jpg', 'https://example.com/padmaavat_trailer.mp4', 0),
(49, 'Tiger Zinda Hai', 'When a group of Indian and Pakistani nurses are held hostage in Iraq by a terrorist organization, a secret agent is drawn out of hiding to rescue them.', '02:41:00', 'Hindi', '2017-12-22 00:00:00', 'India', 'Action', 5.9, 'UA', 'https://example.com/tiger_zinda_hai_poster.jpg', 'https://example.com/tiger_zinda_hai_trailer.mp4', 0),
(50, 'Baahubali 2: The Conclusion', 'When Shiva, the son of Baahubali, learns about his heritage, he begins to look for answers. His story is juxtaposed with past events that unfolded in the Mahishmati Kingdom.', '02:47:00', 'Telugu', '2017-04-28 00:00:00', 'India', 'Action', 8.2, 'UA', 'https://example.com/baahubali2_poster.jpg', 'https://example.com/baahubali2_trailer.mp4', 0);

-- ### Data for User Table ###
-- Inserting 50 users
INSERT INTO User (UserID, User_Name, User_Password, Email, Phone, IsAdmin) VALUES
(1, 'Rohan Sharma', 'pass123', 'rohan.sharma@example.com', '9876543210', 0),
(2, 'Priya Patel', 'pass123', 'priya.patel@example.com', '9876543211', 0),
(3, 'Amit Singh', 'pass123', 'amit.singh@example.com', '9876543212', 0),
(4, 'Sneha Reddy', 'pass123', 'sneha.reddy@example.com', '9876543213', 0),
(5, 'Vikram Kumar', 'pass123', 'vikram.kumar@example.com', '9876543214', 0),
(6, 'Anjali Gupta', 'pass123', 'anjali.gupta@example.com', '9876543215', 0),
(7, 'Rahul Verma', 'pass123', 'rahul.verma@example.com', '9876543216', 0),
(8, 'Pooja Desai', 'pass123', 'pooja.desai@example.com', '9876543217', 0),
(9, 'Sandeep Nair', 'pass123', 'sandeep.nair@example.com', '9876543218', 0),
(10, 'Divya Iyer', 'pass123', 'divya.iyer@example.com', '9876543219', 0),
(11, 'Admin User', 'adminpass', 'admin@smb.com', '9999999999', 1),
(12, 'Kavita Joshi', 'pass123', 'kavita.joshi@example.com', '9876543220', 0),
(13, 'Manish Tiwari', 'pass123', 'manish.tiwari@example.com', '9876543221', 0),
(14, 'Geeta Chowdhury', 'pass123', 'geeta.chowdhury@example.com', '9876543222', 0),
(15, 'Harish Mehta', 'pass123', 'harish.mehta@example.com', '9876543223', 0),
(16, 'Sunita Menon', 'pass123', 'sunita.menon@example.com', '9876543224', 0),
(17, 'Rajesh Pillai', 'pass123', 'rajesh.pillai@example.com', '9876543225', 0),
(18, 'Deepa Rao', 'pass123', 'deepa.rao@example.com', '9876543226', 0),
(19, 'Suresh Yadav', 'pass123', 'suresh.yadav@example.com', '9876543227', 0),
(20, 'Anita Shah', 'pass123', 'anita.shah@example.com', '9876543228', 0),
(21, 'Arjun Das', 'pass123', 'arjun.das@example.com', '9876543229', 0),
(22, 'Meena Krishnan', 'pass123', 'meena.krishnan@example.com', '9876543230', 0),
(23, 'Varun Bhat', 'pass123', 'varun.bhat@example.com', '9876543231', 0),
(24, 'Lakshmi Murthy', 'pass123', 'lakshmi.murthy@example.com', '9876543232', 0),
(25, 'Gopal Krishna', 'pass123', 'gopal.krishna@example.com', '9876543233', 0),
(26, 'Rina Ghosh', 'pass123', 'rina.ghosh@example.com', '9876543234', 0),
(27, 'Vivek Anand', 'pass123', 'vivek.anand@example.com', '9876543235', 0),
(28, 'Nisha Agarwal', 'pass123', 'nisha.agarwal@example.com', '9876543236', 0),
(29, 'Sameer Jain', 'pass123', 'sameer.jain@example.com', '9876543237', 0),
(30, 'Tina Dsouza', 'pass123', 'tina.dsouza@example.com', '9876543238', 0),
(31, 'Alok Nath', 'pass123', 'alok.nath@example.com', '9876543239', 0),
(32, 'Bindu Sharma', 'pass123', 'bindu.sharma@example.com', '9876543240', 0),
(33, 'Chetan Bhagat', 'pass123', 'chetan.bhagat@example.com', '9876543241', 0),
(34, 'Dinesh Reddy', 'pass123', 'dinesh.reddy@example.com', '9876543242', 0),
(35, 'Esha Gupta', 'pass123', 'esha.gupta@example.com', '9876543243', 0),
(36, 'Farhan Khan', 'pass123', 'farhan.khan@example.com', '9876543244', 0),
(37, 'Gauri Singh', 'pass123', 'gauri.singh@example.com', '9876543245', 0),
(38, 'Himesh Reshammiya', 'pass123', 'himesh.reshammiya@example.com', '9876543246', 0),
(39, 'Irfan Pathan', 'pass123', 'irfan.pathan@example.com', '9876543247', 0),
(40, 'Juhi Chawla', 'pass123', 'juhi.chawla@example.com', '9876543248', 0),
(41, 'Karan Johar', 'pass123', 'karan.johar@example.com', '9876543249', 0),
(42, 'Lara Dutta', 'pass123', 'lara.dutta@example.com', '9876543250', 0),
(43, 'Malaika Arora', 'pass123', 'malaika.arora@example.com', '9876543251', 0),
(44, 'Nandita Das', 'pass123', 'nandita.das@example.com', '9876543252', 0),
(45, 'Om Puri', 'pass123', 'om.puri@example.com', '9876543253', 0),
(46, 'Preity Zinta', 'pass123', 'preity.zinta@example.com', '9876543254', 0),
(47, 'Rani Mukerji', 'pass123', 'rani.mukerji@example.com', '9876543255', 0),
(48, 'Sonu Nigam', 'pass123', 'sonu.nigam@example.com', '9876543256', 0),
(49, 'Tara Sharma', 'pass123', 'tara.sharma@example.com', '9876543257', 0),
(50, 'Urmila Matondkar', 'pass123', 'urmila.matondkar@example.com', '9876543258', 0);


-- ### Data for Movie_Show, Booking, Show_Seat, Payment, and Review Tables ###
-- This procedure will create a large set of interconnected data for shows, bookings, seats, payments, and reviews.
DELIMITER $$
CREATE PROCEDURE PopulateBookingData()
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE show_id INT DEFAULT 1;
    DECLARE booking_id INT DEFAULT 1;
    DECLARE payment_id INT DEFAULT 1;
    DECLARE review_id INT DEFAULT 1;
    DECLARE show_seat_id INT DEFAULT 1;

    DECLARE movie_id INT;
    DECLARE cinema_hall_id INT;
    DECLARE user_id INT;
    DECLARE num_seats INT;
    DECLARE show_date DATE;
    DECLARE start_time TIME;
    DECLARE price DECIMAL(10,2);
    DECLARE total_amount DECIMAL(10,2);
    DECLARE seat_num INT;
    DECLARE seat_id_val INT;
    
    -- Variables for correct time calculation
    DECLARE start_datetime DATETIME;
    DECLARE movie_duration TIME;


    -- Create 200 shows
    WHILE show_id <= 200 DO
        SET movie_id = 1 + FLOOR(RAND() * 50);
        SET cinema_hall_id = 1 + FLOOR(RAND() * (SELECT COUNT(*) FROM Cinema_Hall));
        SET show_date = CURDATE() + INTERVAL FLOOR(RAND() * 14) DAY;
        SET start_time = MAKETIME(10 + FLOOR(RAND() * 13), FLOOR(RAND() * 4) * 15, 0); -- Shows from 10:00 to 22:45
        
        -- *** FIX STARTS HERE ***
        -- Create the full StartTime DATETIME value
        SET start_datetime = CONCAT(show_date, ' ', start_time);
        -- Get the movie duration
        SELECT Duration INTO movie_duration FROM Movie WHERE MovieID = movie_id;

        INSERT INTO Movie_Show (ShowID, Show_Date, StartTime, EndTime, CinemaHallID, MovieID, Format, Show_Language)
        VALUES (
            show_id,
            show_date,
            start_datetime, -- Use the full DATETIME value
            ADDTIME(start_datetime, movie_duration), -- Calculate EndTime correctly, handling rollover
            cinema_hall_id,
            movie_id,
            CASE FLOOR(RAND() * 3)
                WHEN 0 THEN '2D'
                WHEN 1 THEN '3D'
                ELSE 'IMAX'
            END,
            (SELECT Movie_Language FROM Movie WHERE MovieID = movie_id)
        );
        -- *** FIX ENDS HERE ***

        -- Create 1 to 5 bookings for each show
        SET i = 1;
        WHILE i <= (1 + FLOOR(RAND() * 5)) AND booking_id <= 500 DO
            SET user_id = 1 + FLOOR(RAND() * 50);
            SET num_seats = 1 + FLOOR(RAND() * 5); -- 1 to 5 seats per booking
            SET price = 150 + FLOOR(RAND() * 200); -- Price between 150 and 350
            SET total_amount = num_seats * price;

            INSERT INTO Booking (BookingID, NumberOfSeats, Booking_Timestamp, Booking_Status, UserID, ShowID)
            VALUES (booking_id, num_seats, NOW() - INTERVAL FLOOR(RAND() * 72) HOUR, 1, user_id, show_id);

            -- Create Show_Seat entries for the booking
            SET seat_num = 1;
            WHILE seat_num <= num_seats DO
                 SELECT CinemaSeatID INTO seat_id_val FROM Cinema_Seat WHERE CinemaHallID = cinema_hall_id AND CinemaSeatID NOT IN (SELECT CinemaSeatID FROM Show_Seat WHERE ShowID = show_id) ORDER BY RAND() LIMIT 1;

                 IF seat_id_val IS NOT NULL THEN
                    INSERT INTO Show_Seat (ShowSeatID, Seat_Status, Price, CinemaSeatID, ShowID, BookingID)
                    VALUES (show_seat_id, 1, price, seat_id_val, show_id, booking_id);
                    SET show_seat_id = show_seat_id + 1;
                 END IF;
                 SET seat_num = seat_num + 1;
            END WHILE;


            INSERT INTO Payment (PaymentID, Amount, Payment_Timestamp, DiscountCouponID, RemoteTransactionID, PaymentMethod, BookingID)
            VALUES (payment_id, total_amount, NOW() - INTERVAL FLOOR(RAND() * 71) HOUR, NULL, FLOOR(1000000 + RAND() * 9000000), 1, booking_id);


            -- Create a review for the movie (not for every booking)
            IF RAND() > 0.5 AND review_id <= 100 THEN
                INSERT INTO Review (ReviewID, UserID, MovieID, Rating, Comment, Review_Timestamp)
                VALUES (review_id, user_id, movie_id, ROUND(5 + RAND() * 5, 1), 'This was a great movie!', NOW() - INTERVAL FLOOR(RAND() * 24) HOUR);
                SET review_id = review_id + 1;
            END IF;


            SET payment_id = payment_id + 1;
            SET booking_id = booking_id + 1;
            SET i = i + 1;
        END WHILE;

        SET show_id = show_id + 1;
    END WHILE;
END$$
DELIMITER ;


-- Execute the final data population procedure
CALL PopulateBookingData();

-- Clean up procedures
DROP PROCEDURE IF EXISTS PopulateHallsAndSeats;
DROP PROCEDURE IF EXISTS PopulateBookingData;