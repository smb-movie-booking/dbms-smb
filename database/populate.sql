-- SQL Script to Clear All Data from All Tables
-- Temporarily disables foreign key checks to allow truncation in any order.
USE smb;

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

select 'tables truncated' as message;

-- All tables are now empty.

-- ### Data for City Table ###
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
(10, 'Kochi', 'Kerala', '395001');

-- ### Data for Cinema Table (10 cinemas per city) ###
INSERT INTO Cinema (CinemaID, Cinema_Name, CityID, Facilities, Cancellation_Allowed) VALUES
-- Mumbai (CityID 1)
(1, 'PVR Mumbai Central', 1, 'Parking,Dolby,Recliner', 1),
(2, 'INOX Phoenix', 1, 'Parking,Dolby,Recliner,Cafe', 1),
(3, 'Cinepolis Mumbai', 1, 'Parking,IMAX,4DX,Recliner', 1),
(4, 'Carnival Mumbai', 1, 'Parking,Cafe', 0),
(5, 'Miraj Cinemas Mumbai', 1, 'Parking,Dolby', 1),
(6, 'City Pride Mumbai', 1, 'Parking,Dolby,Recliner', 1),
(7, 'Mukta A2 Mumbai', 1, 'Parking', 0),
(8, 'Raj Mandir Mumbai', 1, 'Heritage,Cafe', 0),
(9, 'PVR Juhu', 1, 'Parking,Dolby Atmos,Recliner', 1),
(10, 'INOX Worli', 1, 'Parking,Dolby', 1),

-- Delhi (CityID 2)
(11, 'PVR Saket', 2, 'Parking,Dolby,Recliner', 1),
(12, 'INOX Select Citywalk', 2, 'Parking,Dolby,Recliner,Cafe', 1),
(13, 'Cinepolis Delhi', 2, 'Parking,IMAX,4DX,Recliner', 1),
(14, 'Carnival Delhi', 2, 'Parking,Cafe', 0),
(15, 'Miraj Cinemas Delhi', 2, 'Parking,Dolby', 1),
(16, 'City Pride Delhi', 2, 'Parking,Dolby,Recliner', 1),
(17, 'Mukta A2 Delhi', 2, 'Parking', 0),
(18, 'Raj Mandir Delhi', 2, 'Heritage,Cafe', 0),
(19, 'PVR Connaught Place', 2, 'Parking,Dolby Atmos,Recliner', 1),
(20, 'INOX Vasant Kunj', 2, 'Parking,Dolby', 1),

-- Bangalore (CityID 3)
(21, 'PVR Bangalore Central', 3, 'Parking,Dolby,Recliner', 1),
(22, 'INOX Orion', 3, 'Parking,Dolby,Recliner,Cafe', 1),
(23, 'Cinepolis Bangalore', 3, 'Parking,IMAX,4DX,Recliner', 1),
(24, 'Carnival Bangalore', 3, 'Parking,Cafe', 0),
(25, 'Miraj Cinemas Bangalore', 3, 'Parking,Dolby', 1),
(26, 'City Pride Bangalore', 3, 'Parking,Dolby,Recliner', 1),
(27, 'Mukta A2 Bangalore', 3, 'Parking', 0),
(28, 'Raj Mandir Bangalore', 3, 'Heritage,Cafe', 0),
(29, 'PVR Whitefield', 3, 'Parking,Dolby Atmos,Recliner', 1),
(30, 'INOX MG Road', 3, 'Parking,Dolby', 1),

-- Hyderabad (CityID 4)
(31, 'PVR Hyderabad Central', 4, 'Parking,Dolby,Recliner', 1),
(32, 'INOX Hyderabad', 4, 'Parking,Dolby,Recliner,Cafe', 1),
(33, 'Cinepolis Hyderabad', 4, 'Parking,IMAX,4DX,Recliner', 1),
(34, 'Carnival Hyderabad', 4, 'Parking,Cafe', 0),
(35, 'Miraj Cinemas Hyderabad', 4, 'Parking,Dolby', 1),
(36, 'City Pride Hyderabad', 4, 'Parking,Dolby,Recliner', 1),
(37, 'Mukta A2 Hyderabad', 4, 'Parking', 0),
(38, 'Raj Mandir Hyderabad', 4, 'Heritage,Cafe', 0),
(39, 'PVR Gachibowli', 4, 'Parking,Dolby Atmos,Recliner', 1),
(40, 'INOX Banjara Hills', 4, 'Parking,Dolby', 1),

-- Chennai (CityID 5)
(41, 'PVR Chennai Central', 5, 'Parking,Dolby,Recliner', 1),
(42, 'INOX Chennai', 5, 'Parking,Dolby,Recliner,Cafe', 1),
(43, 'Cinepolis Chennai', 5, 'Parking,IMAX,4DX,Recliner', 1),
(44, 'Carnival Chennai', 5, 'Parking,Cafe', 0),
(45, 'Miraj Cinemas Chennai', 5, 'Parking,Dolby', 1),
(46, 'City Pride Chennai', 5, 'Parking,Dolby,Recliner', 1),
(47, 'Mukta A2 Chennai', 5, 'Parking', 0),
(48, 'Raj Mandir Chennai', 5, 'Heritage,Cafe', 0),
(49, 'PVR OMR', 5, 'Parking,Dolby Atmos,Recliner', 1),
(50, 'INOX T Nagar', 5, 'Parking,Dolby', 1),

-- Kolkata (CityID 6)
(51, 'PVR Kolkata', 6, 'Parking,Dolby,Recliner', 1),
(52, 'INOX Kolkata', 6, 'Parking,Dolby,Recliner,Cafe', 1),
(53, 'Cinepolis Kolkata', 6, 'Parking,IMAX,4DX,Recliner', 1),
(54, 'Carnival Kolkata', 6, 'Parking,Cafe', 0),
(55, 'Miraj Cinemas Kolkata', 6, 'Parking,Dolby', 1),
(56, 'City Pride Kolkata', 6, 'Parking,Dolby,Recliner', 1),
(57, 'Mukta A2 Kolkata', 6, 'Parking', 0),
(58, 'Raj Mandir Kolkata', 6, 'Heritage,Cafe', 0),
(59, 'PVR Salt Lake', 6, 'Parking,Dolby Atmos,Recliner', 1),
(60, 'INOX South City', 6, 'Parking,Dolby', 1),

-- Pune (CityID 7)
(61, 'PVR Pune Central', 7, 'Parking,Dolby,Recliner', 1),
(62, 'INOX Pune', 7, 'Parking,Dolby,Recliner,Cafe', 1),
(63, 'Cinepolis Pune', 7, 'Parking,IMAX,4DX,Recliner', 1),
(64, 'Carnival Pune', 7, 'Parking,Cafe', 0),
(65, 'Miraj Cinemas Pune', 7, 'Parking,Dolby', 1),
(66, 'City Pride Pune', 7, 'Parking,Dolby,Recliner', 1),
(67, 'Mukta A2 Pune', 7, 'Parking', 0),
(68, 'Raj Mandir Pune', 7, 'Heritage,Cafe', 0),
(69, 'PVR Hinjewadi', 7, 'Parking,Dolby Atmos,Recliner', 1),
(70, 'INOX Kalyani Nagar', 7, 'Parking,Dolby', 1),

-- Ahmedabad (CityID 8)
(71, 'PVR Ahmedabad', 8, 'Parking,Dolby,Recliner', 1),
(72, 'INOX Ahmedabad', 8, 'Parking,Dolby,Recliner,Cafe', 1),
(73, 'Cinepolis Ahmedabad', 8, 'Parking,IMAX,4DX,Recliner', 1),
(74, 'Carnival Ahmedabad', 8, 'Parking,Cafe', 0),
(75, 'Miraj Cinemas Ahmedabad', 8, 'Parking,Dolby', 1),
(76, 'City Pride Ahmedabad', 8, 'Parking,Dolby,Recliner', 1),
(77, 'Mukta A2 Ahmedabad', 8, 'Parking', 0),
(78, 'Raj Mandir Ahmedabad', 8, 'Heritage,Cafe', 0),
(79, 'PVR SG Highway', 8, 'Parking,Dolby Atmos,Recliner', 1),
(80, 'INOX Navrangpura', 8, 'Parking,Dolby', 1),

-- Jaipur (CityID 9)
(81, 'PVR Jaipur', 9, 'Parking,Dolby,Recliner', 1),
(82, 'INOX Jaipur', 9, 'Parking,Dolby,Recliner,Cafe', 1),
(83, 'Cinepolis Jaipur', 9, 'Parking,IMAX,4DX,Recliner', 1),
(84, 'Carnival Jaipur', 9, 'Parking,Cafe', 0),
(85, 'Miraj Cinemas Jaipur', 9, 'Parking,Dolby', 1),
(86, 'City Pride Jaipur', 9, 'Parking,Dolby,Recliner', 1),
(87, 'Mukta A2 Jaipur', 9, 'Parking', 0),
(88, 'Raj Mandir Jaipur', 9, 'Heritage,Cafe', 0),
(89, 'PVR MI Road', 9, 'Parking,Dolby Atmos,Recliner', 1),
(90, 'INOX Malviya Nagar', 9, 'Parking,Dolby', 1),

-- Kochi (CityID 10)
(91, 'PVR Kochi', 10, 'Parking,Dolby,Recliner', 1),
(92, 'INOX Kochi', 10, 'Parking,Dolby,Recliner,Cafe', 1),
(93, 'Cinepolis Kochi', 10, 'Parking,IMAX,4DX,Recliner', 1),
(94, 'Carnival Kochi', 10, 'Parking,Cafe', 0),
(95, 'Miraj Cinemas Kochi', 10, 'Parking,Dolby', 1),
(96, 'City Pride Kochi', 10, 'Parking,Dolby,Recliner', 1),
(97, 'Mukta A2 Kochi', 10, 'Parking', 0),
(98, 'Raj Mandir Kochi', 10, 'Heritage,Cafe', 0),
(99, 'PVR Marine Drive', 10, 'Parking,Dolby Atmos,Recliner', 1),
(100, 'INOX Lulu Mall', 10, 'Parking,Dolby', 1);

SELECT 'cities and cinema added' as message;


-- ### Data for Cinema_Hall and Cinema_Seat Tables ###
DROP PROCEDURE IF EXISTS PopulateHallsAndSeats;
DELIMITER $$
CREATE PROCEDURE PopulateHallsAndSeats()
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE j INT DEFAULT 1;
    DECLARE k INT DEFAULT 1;
    DECLARE hall_id INT DEFAULT 1;
    DECLARE seat_id INT DEFAULT 1;
    DECLARE total_halls_for_cinema INT; -- Renamed to avoid confusion with total_seats
    DECLARE seats_in_current_hall INT; -- Variable to hold randomized seats for current hall

    WHILE i <= 100 DO
        SET total_halls_for_cinema = 1 + FLOOR(RAND() * 4); -- Random halls between 1 and 4 per cinema
        SET j = 1;
        WHILE j <= total_halls_for_cinema DO
            SET seats_in_current_hall = 100 + FLOOR(RAND() * 50); -- Random seats between 100 and 150 for this hall
            INSERT INTO Cinema_Hall (CinemaHallID, Hall_Name, CinemaID) -- Removed TotalSeats as per schema
            VALUES (hall_id, CONCAT('Hall ', j), i);

            SET k = 1;
            WHILE k <= seats_in_current_hall DO
                INSERT INTO Cinema_Seat (CinemaSeatID, SeatNumber, Seat_Type, CinemaHallID)
                VALUES (
                    seat_id,
                    k,
                    -- This logic creates one of 5 random layouts for each hall.
                    -- The layout is determined by the hall_id, so it's consistent for all seats in the same hall.
                    CASE FLOOR(1 + RAND(hall_id) * 5) -- Generates a random layout number (1 to 5) based on the hall
                        
                        -- Layout 1: Has Standard, Premium, and Recliners 🛋️
                        WHEN 1 THEN 
                            CASE
                                WHEN k > seats_in_current_hall - 20 THEN 'Recliner'
                                WHEN k > seats_in_current_hall - 50 THEN 'Premium'
                                ELSE 'Standard'
                            END

                        -- Layout 2: Has Standard, Premium, and Sofas in the front 🛋️
                        WHEN 2 THEN 
                            CASE
                                WHEN k <= 8 THEN 'Sofa'
                                WHEN k <= seats_in_current_hall / 2 THEN 'Premium'
                                ELSE 'Standard'
                            END

                        -- Layout 3: Has Standard, Premium, and a few exclusive Box seats 📦
                        WHEN 3 THEN 
                            CASE
                                WHEN k <= 4 THEN 'Box'
                                WHEN k > seats_in_current_hall - 40 THEN 'Premium'
                                ELSE 'Standard'
                            END

                        -- Layout 4: A luxury hall with all 5 seat types ✨
                        WHEN 4 THEN 
                            CASE
                                WHEN k <= 4 THEN 'Sofa'
                                WHEN k > 4 AND k <= 8 THEN 'Box'
                                WHEN k > seats_in_current_hall - 10 THEN 'Recliner'
                                WHEN k > seats_in_current_hall - 30 THEN 'Premium'
                                ELSE 'Standard'
                            END

                        -- Layout 5: The base case with only Standard and Premium seats ✅
                        ELSE 
                            CASE
                                WHEN k > seats_in_current_hall - 30 THEN 'Premium'
                                ELSE 'Standard'
                            END
                    END,
                    hall_id
                );
                SET seat_id = seat_id + 1;
                SET k = k + 1;
            END WHILE;

            SET hall_id = hall_id + 1;
            SET j = j + 1;
        END WHILE;
        IF (i % 10 = 0) THEN
            SELECT CONCAT('Progress: Processed cinema ', i, ' of 100...') AS message;
        END IF;
        SET i = i + 1;
    END WHILE;
END$$
DELIMITER ;

CALL PopulateHallsAndSeats();

-- ### Data for Movie Table ###
INSERT INTO Movie (MovieID, Title, Movie_Description, Duration, Movie_Language, ReleaseDate, Country, Genre, Rating, Age_Format, Poster_Image_URL, Trailer_URL) VALUES
(1, 'Kalki 2898 AD', 'A modern-day avatar of Vishnu, a Hindu god, who is believed to have descended to earth to protect the world from evil forces.', '03:01:00', 'Telugu', '2024-06-27 00:00:00', 'India', 'Sci-Fi', 8.5, 'UA', 'https://res.cloudinary.com/dwiphkazt/image/upload/v1758117747/kalki-2898-ad-et00352941-1718275859_sk9bgt.avif', 'https://www.youtube.com/watch?v=kQDd1Ahgp_s'),
(2, 'Jawan', 'A man is driven by a personal vendetta to rectify the wrongs in society, while keeping a promise made years ago.', '02:49:00', 'Hindi', '2023-09-07 00:00:00', 'India', 'Action', 7.8, 'UA', 'https://res.cloudinary.com/dwiphkazt/image/upload/v1758894102/jawan-et00330424-1693892482_fsodaz.avif', 'https://www.youtube.com/watch?v=COv52Qyctws'),
(3, 'Oppenheimer', 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.', '03:00:00', 'English', '2023-07-21 00:00:00', 'USA', 'Biography', 8.6, 'A', 'https://res.cloudinary.com/dwiphkazt/image/upload/v1758894100/oppenheimer-et00347867-1700808846_qq9uqc.avif', 'https://www.youtube.com/watch?v=uYPbbksJxIg'),
(4, 'Leo', 'Parthiban is a mild-mannered cafe owner in Kashmir, who fends off a gang of thugs and gains local fame. This brings him to the attention of a drug cartel who suspect that he was once a part of them.', '02:44:00', 'Tamil', '2023-10-19 00:00:00', 'India', 'Action', 7.9, 'UA', 'https://res.cloudinary.com/dwiphkazt/image/upload/v1758894100/leo-et00351731-1675663884_oqtdqi.avif', 'https://www.youtube.com/watch?v=Po3jStA673E'),
(5, 'Manjummel Boys', 'A group of friends from a small town named Manjummel get into a sticky situation when one of them gets stuck in the Guna Caves, a place where no one has ever returned from.', '02:15:00', 'Malayalam', '2024-02-22 00:00:00', 'India', 'Thriller', 8.3, 'U', 'https://res.cloudinary.com/dwiphkazt/image/upload/v1758894101/manjummel-boys-et00386670-1707452965_dlsfbx.avif', 'https://www.youtube.com/watch?v=50G3dhI-8xM'),
(6, 'Dune: Part Two', 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.', '02:46:00', 'English', '2024-03-01 00:00:00', 'USA', 'Sci-Fi', 8.8, 'UA', 'https://res.cloudinary.com/dwiphkazt/image/upload/v1758894101/dune-part-two-et00331567-1712646774_duzxlr.avif', 'https://www.youtube.com/watch?v=U2Qp5pL3ovA'),
(7, 'Guntur Kaaram', 'Years after his mother abandons him and remarries, a man is given an ultimatum to disown her to inherit his estranged grandfather''s wealth.', '02:39:00', 'Telugu', '2024-01-12 00:00:00', 'India', 'Action', 6.5, 'UA', 'https://res.cloudinary.com/dwiphkazt/image/upload/v1758894101/guntur-kaaram-et00310760-1686726453_ndrso6.avif', 'https://www.youtube.com/watch?v=grI_h96p_oA'),
(8, 'Salaar: Part 1 Ceasefire', 'The fate of a violently contested kingdom hangs on the fraught bond between two friends-turned-foes.', '02:55:00', 'Telugu', '2023-12-22 00:00:00', 'India', 'Action', 6.7, 'A', 'https://res.cloudinary.com/dwiphkazt/image/upload/v1758894101/salaar-cease-fire--part-1-et00301886-1702971289_nvg6rn.avif', 'https://www.youtube.com/watch?v=Math3Q1_M8w'),
(9, 'Animal', 'A son''s obsessive love for his father leads him to a path of crime and violence.', '03:24:00', 'Hindi', '2023-12-01 00:00:00', 'India', 'Action', 6.9, 'A', 'https://res.cloudinary.com/dwiphkazt/image/upload/v1758894101/animal-et00311762-1672646524_cjdake.avif', 'https://www.youtube.com/watch?v=Dydmpfo68DA'),
(10, 'Fighter', 'Top IAF aviators come together in the face of imminent danger, to form Air Dragons. They must now stand united to protect the nation.', '02:46:00', 'Hindi', '2024-01-25 00:00:00', 'India', 'Action', 7.5, 'UA', 'https://res.cloudinary.com/dwiphkazt/image/upload/v1758894101/fighter-et00304730-1704191105_kj9819.avif', 'https://www.youtube.com/watch?v=9wBnw-OiEaM'),
(11, 'Article 370', 'A young local field agent, is picked from the Prime Minister''s office for a top-secret mission to crack down on terrorism and the conflict economy by abrogating Article 370.', '02:40:00', 'Hindi', '2024-02-23 00:00:00', 'India', 'Thriller', 8.2, 'UA', 'https://res.cloudinary.com/dwiphkazt/image/upload/v1758894102/article-370-et00384444-1708669471_jtumy9.avif', 'https://www.youtube.com/watch?v=6y_pSA42S3c'),
(12, 'Hanu-Man', 'An imaginary place called Anjanadri where the protagonist gets the powers of Hanuman and fights for Anjanadri.', '02:38:00', 'Telugu', '2024-01-12 00:00:00', 'India', 'Fantasy', 8.1, 'UA', 'https://res.cloudinary.com/dwiphkazt/image/upload/v1758894102/hanu-man-et00311673-1704954533_hi8ias.avif', 'https://www.youtube.com/watch?v=Oqvly3MvlXA'),
(13, 'Godzilla x Kong: The New Empire', 'Two ancient titans, Godzilla and Kong, clash in an epic battle as humans unravel their intertwined origins and connection to Skull Island''s mysteries.', '01:55:00', 'English', '2024-03-29 00:00:00', 'USA', 'Action', 6.5, 'UA', 'https://res.cloudinary.com/dwiphkazt/image/upload/v1758894100/godzilla-x-kong-the-new-empire-et00358147-1714992384_lowk07.avif', 'https://www.youtube.com/watch?v=qqrpMRDuPfc'),
(14, 'Shaitaan', 'A man and his family''s fun weekend retreat takes a nightmarish turn when they let in a friendly, but mysterious stranger into their house.', '02:12:00', 'Hindi', '2024-03-08 00:00:00', 'India', 'Horror', 7.1, 'A', 'https://res.cloudinary.com/dwiphkazt/image/upload/v1758894100/shaitaan-et00384234-1706179766_pz2bxd.avif', 'https://www.youtube.com/watch?v=3-3s_4fBF0g'),
(15, 'Captain Miller', 'A renegade Captain and his unconventional outlaws execute a series of heists in British India.', '02:37:00', 'Tamil', '2024-01-12 00:00:00', 'India', 'Action', 7.6, 'UA', 'https://res.cloudinary.com/dwiphkazt/image/upload/v1758894100/captain-miller-et00333139-1688130090_lkyb9o.avif', 'https://www.youtube.com/watch?v=p4ECg0-dF0g');

-- ### Data for User Table ###
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
(20, 'Anita Shah', 'pass123', 'anita.shah@example.com', '9876543228', 0);

select 'movie and users added' as message;

-- ### Procedure to Populate Bookings, Shows, etc. ###
DROP PROCEDURE IF EXISTS PopulateBookingData;
DELIMITER $$
CREATE PROCEDURE PopulateBookingData()
BEGIN
    -- == VARIABLE DECLARATIONS ==
    DECLARE show_id INT DEFAULT 1;
    DECLARE booking_id INT DEFAULT 1;
    DECLARE payment_id INT DEFAULT 1;
    DECLARE review_id INT DEFAULT 1;
    DECLARE i INT;
    DECLARE movie_id INT;
    DECLARE cinema_hall_id INT;
    DECLARE user_id INT;
    DECLARE num_seats INT;
    DECLARE show_date DATE;
    DECLARE start_time TIME;
    DECLARE start_datetime DATETIME;
    DECLARE movie_duration TIME;
    DECLARE booking_total_price DECIMAL(10,2);

    -- == MAIN LOOP TO CREATE SHOWS ==
    WHILE show_id <= 10000 DO
        -- 1. Create a Movie Show
        SET movie_id = 1 + FLOOR(RAND() * 15);
        SELECT CinemaHallID INTO cinema_hall_id FROM Cinema_Hall ORDER BY RAND() LIMIT 1;

        SET show_date = CURDATE() + INTERVAL FLOOR(RAND() * 7) DAY;
        SET start_time = MAKETIME(10 + FLOOR(RAND() * 13), FLOOR(RAND() * 4) * 15, 0);
        
        SET start_datetime = CONCAT(show_date, ' ', start_time);
        SELECT Duration INTO movie_duration FROM Movie WHERE MovieID = movie_id;

        INSERT INTO Movie_Show (ShowID, Show_Date, StartTime, EndTime, CinemaHallID, MovieID, Format, Show_Language, isActive)
        VALUES (
            show_id, show_date, start_datetime, ADDTIME(start_datetime, movie_duration),
            cinema_hall_id, movie_id,
            CASE FLOOR(RAND() * 3) WHEN 0 THEN '2D' WHEN 1 THEN '3D' ELSE 'IMAX' END,
            (SELECT Movie_Language FROM Movie WHERE MovieID = movie_id),
            ROUND(RAND())
        );

        -- STEP 1: Call your existing procedure to populate all seats with a default price.
        CALL PopulateShowSeats(show_id, cinema_hall_id, 0.00);

        -- STEP 2: Mimic the application logic by updating prices based on seat type.
        UPDATE Show_Seat ss
        JOIN Cinema_Seat cs ON ss.CinemaSeatID = cs.CinemaSeatID
        SET ss.Price = CASE cs.Seat_Type
            WHEN 'Sofa' THEN 750.00
            WHEN 'Box' THEN 600.00
            WHEN 'Recliner' THEN 500.00
            WHEN 'Premium' THEN 350.00
            ELSE 200.00 -- Standard
        END
        WHERE ss.ShowID = show_id AND cs.CinemaHallID = cinema_hall_id;

        -- == NESTED LOGIC: Create bookings FOR EACH show ==
        SET i = 1;
        WHILE i <= (1 + FLOOR(RAND() * 20)) DO
            SET user_id = 1 + FLOOR(RAND() * 20);
            SET num_seats = 1 + FLOOR(RAND() * 5);
            
            INSERT INTO Booking (BookingID, NumberOfSeats, Booking_Timestamp, Booking_Status, UserID, ShowID)
            VALUES (booking_id, num_seats, NOW() - INTERVAL FLOOR(RAND() * 72) HOUR, 1, user_id, show_id);

            CREATE TEMPORARY TABLE IF NOT EXISTS SeatsToBook (ShowSeatID INT, SeatPrice DECIMAL(10,2));
            TRUNCATE TABLE SeatsToBook;

            INSERT INTO SeatsToBook (ShowSeatID, SeatPrice)
            SELECT ShowSeatID, Price FROM Show_Seat
            WHERE ShowID = show_id AND Seat_Status = 0
            ORDER BY RAND()
            LIMIT num_seats;
            
            UPDATE Show_Seat ss JOIN SeatsToBook stb ON ss.ShowSeatID = stb.ShowSeatID
            SET ss.Seat_Status = 2, ss.BookingID = booking_id;

            SELECT IFNULL(SUM(SeatPrice), 0) INTO booking_total_price FROM SeatsToBook;
            DROP TEMPORARY TABLE SeatsToBook;

            IF booking_total_price > 0 THEN
                INSERT INTO Payment (PaymentID, Amount, Payment_Timestamp, RemoteTransactionID, PaymentMethod, BookingID)
                VALUES (payment_id, booking_total_price, NOW() - INTERVAL FLOOR(RAND() * 71) HOUR, FLOOR(1000000 + RAND() * 9000000), 1, booking_id);
                SET payment_id = payment_id + 1;
            END IF;

            IF RAND() > 0.5 AND review_id <= 100 THEN
                INSERT INTO Review (ReviewID, UserID, MovieID, Rating, Comment, Review_Timestamp)
                VALUES (
                    review_id, user_id, movie_id, LEAST(ROUND(5 + RAND() * 5, 1), 9.9),
                    ELT(FLOOR(RAND() * 5) + 1, 'Amazing movie!', 'Good story.', 'Outstanding!', 'Visuals were top-notch!', 'Could watch it again!'),
                    NOW() - INTERVAL FLOOR(RAND() * 24) HOUR
                );
                SET review_id = review_id + 1;
            END IF;
            SET booking_id = booking_id + 1;
            SET i = i + 1;
        END WHILE;

        -- ✅ CORRECTED Progress reporting block
        IF (show_id % 500 = 0) THEN
            SELECT CONCAT('Progress: Processed show ', show_id, ' of 10000...') AS status;
        END IF;

        SET show_id = show_id + 1;
    END WHILE;
END$$
DELIMITER ;


-- ### Execute Procedures and Clean Up ###
CALL PopulateBookingData();

DROP PROCEDURE IF EXISTS PopulateHallsAndSeats;
DROP PROCEDURE IF EXISTS PopulateBookingData;

select 'completed' as message;