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
(10, 'Kochi', 'Kerala', '395001');

-- ### Data for Cinema Table ###
-- Inserting 50 cinemas across various cities
INSERT INTO Cinema (CinemaID, Cinema_Name, TotalCinemaHalls, CityID, Facilities, Cancellation_Allowed) VALUES
(1, 'PVR Icon', 5, 10, 'Parking,Dolby,Recliner', 1),
(2, 'INOX Insignia', 4, 10, 'Parking,Dolby,Recliner,Cafe', 1),
(3, 'Cinepolis VIP', 6, 10, 'Parking,IMAX,4DX,Recliner', 1),
(4, 'Miraj Cinemas', 3, 10, 'Parking,Dolby', 0),
(5, 'SPI Cinemas', 8, 10, 'Parking,Dolby Atmos,Recliner', 1),
(6, 'Carnival Cinemas', 4, 10, 'Parking,Cafe', 0),
(7, 'City Pride', 5, 10, 'Parking,Dolby', 1),
(8, 'Mukta A2 Cinemas', 3, 10, 'Parking', 0),
(9, 'Raj Mandir Cinema', 1, 10, 'Heritage,Cafe', 0),
(10, 'PVR Cinemas', 7, 10, 'Parking,Dolby,Recliner', 1);

DROP PROCEDURE IF EXISTS PopulateHallsAndSeats;
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

    WHILE i <= 10 DO
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
(1, 'Kalki 2898 AD', 'A modern-day avatar of Vishnu, a Hindu god, who is believed to have descended to earth to protect the world from evil forces.', '03:01:00', 'Telugu', '2024-06-27 00:00:00', 'India', 'Sci-Fi', 8.5, 'UA', 'https://res.cloudinary.com/dwiphkazt/image/upload/v1758117747/kalki-2898-ad-et00352941-1718275859_sk9bgt.avif', 'https://www.youtube.com/watch?v=kQDd1Ahgp_s', 1),
(2, 'Jawan', 'A man is driven by a personal vendetta to rectify the wrongs in society, while keeping a promise made years ago.', '02:49:00', 'Hindi', '2023-09-07 00:00:00', 'India', 'Action', 7.8, 'UA', 'https://res.cloudinary.com/dwiphkazt/image/upload/v1758894102/jawan-et00330424-1693892482_fsodaz.avif', 'https://www.youtube.com/watch?v=COv52Qyctws', 1),
(3, 'Oppenheimer', 'The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.', '03:00:00', 'English', '2023-07-21 00:00:00', 'USA', 'Biography', 8.6, 'A', 'https://res.cloudinary.com/dwiphkazt/image/upload/v1758894100/oppenheimer-et00347867-1700808846_qq9uqc.avif', 'https://www.youtube.com/watch?v=uYPbbksJxIg', 1),
(4, 'Leo', 'Parthiban is a mild-mannered cafe owner in Kashmir, who fends off a gang of thugs and gains local fame. This brings him to the attention of a drug cartel who suspect that he was once a part of them.', '02:44:00', 'Tamil', '2023-10-19 00:00:00', 'India', 'Action', 7.9, 'UA', 'https://res.cloudinary.com/dwiphkazt/image/upload/v1758894100/leo-et00351731-1675663884_oqtdqi.avif', 'https://www.youtube.com/watch?v=Po3jStA673E', 1),
(5, 'Manjummel Boys', 'A group of friends from a small town named Manjummel get into a sticky situation when one of them gets stuck in the Guna Caves, a place where no one has ever returned from.', '02:15:00', 'Malayalam', '2024-02-22 00:00:00', 'India', 'Thriller', 8.3, 'U', 'https://res.cloudinary.com/dwiphkazt/image/upload/v1758894101/manjummel-boys-et00386670-1707452965_dlsfbx.avif', 'https://www.youtube.com/watch?v=50G3dhI-8xM', 1),
(6, 'Dune: Part Two', 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.', '02:46:00', 'English', '2024-03-01 00:00:00', 'USA', 'Sci-Fi', 8.8, 'UA', 'https://res.cloudinary.com/dwiphkazt/image/upload/v1758894101/dune-part-two-et00331567-1712646774_duzxlr.avif', 'https://www.youtube.com/watch?v=U2Qp5pL3ovA', 1),
(7, 'Guntur Kaaram', 'Years after his mother abandons him and remarries, a man is given an ultimatum to disown her to inherit his estranged grandfather''s wealth.', '02:39:00', 'Telugu', '2024-01-12 00:00:00', 'India', 'Action', 6.5, 'UA', 'https://res.cloudinary.com/dwiphkazt/image/upload/v1758894101/guntur-kaaram-et00310760-1686726453_ndrso6.avif', 'https://www.youtube.com/watch?v=grI_h96p_oA', 1),
(8, 'Salaar: Part 1 Ceasefire', 'The fate of a violently contested kingdom hangs on the fraught bond between two friends-turned-foes.', '02:55:00', 'Telugu', '2023-12-22 00:00:00', 'India', 'Action', 6.7, 'A', 'https://res.cloudinary.com/dwiphkazt/image/upload/v1758894101/salaar-cease-fire--part-1-et00301886-1702971289_nvg6rn.avif', 'https://www.youtube.com/watch?v=Math3Q1_M8w', 1),
(9, 'Animal', 'A son''s obsessive love for his father leads him to a path of crime and violence.', '03:24:00', 'Hindi', '2023-12-01 00:00:00', 'India', 'Action', 6.9, 'A', 'https://res.cloudinary.com/dwiphkazt/image/upload/v1758894101/animal-et00311762-1672646524_cjdake.avif', 'https://www.youtube.com/watch?v=Dydmpfo68DA', 1),
(10, 'Fighter', 'Top IAF aviators come together in the face of imminent danger, to form Air Dragons. They must now stand united to protect the nation.', '02:46:00', 'Hindi', '2024-01-25 00:00:00', 'India', 'Action', 7.5, 'UA', 'https://res.cloudinary.com/dwiphkazt/image/upload/v1758894101/fighter-et00304730-1704191105_kj9819.avif', 'https://www.youtube.com/watch?v=9wBnw-OiEaM', 1),
(11, 'Article 370', 'A young local field agent, is picked from the Prime Minister''s office for a top-secret mission to crack down on terrorism and the conflict economy by abrogating Article 370.', '02:40:00', 'Hindi', '2024-02-23 00:00:00', 'India', 'Thriller', 8.2, 'UA', 'https://res.cloudinary.com/dwiphkazt/image/upload/v1758894102/article-370-et00384444-1708669471_jtumy9.avif', 'https://www.youtube.com/watch?v=6y_pSA42S3c', 1),
(12, 'Hanu-Man', 'An imaginary place called Anjanadri where the protagonist gets the powers of Hanuman and fights for Anjanadri.', '02:38:00', 'Telugu', '2024-01-12 00:00:00', 'India', 'Fantasy', 8.1, 'UA', 'https://res.cloudinary.com/dwiphkazt/image/upload/v1758894102/hanu-man-et00311673-1704954533_hi8ias.avif', 'https://www.youtube.com/watch?v=Oqvly3MvlXA', 1),
(13, 'Godzilla x Kong: The New Empire', 'Two ancient titans, Godzilla and Kong, clash in an epic battle as humans unravel their intertwined origins and connection to Skull Island''s mysteries.', '01:55:00', 'English', '2024-03-29 00:00:00', 'USA', 'Action', 6.5, 'UA', 'https://res.cloudinary.com/dwiphkazt/image/upload/v1758894100/godzilla-x-kong-the-new-empire-et00358147-1714992384_lowk07.avif', 'https://www.youtube.com/watch?v=qqrpMRDuPfc', 1),
(14, 'Shaitaan', 'A man and his family''s fun weekend retreat takes a nightmarish turn when they let in a friendly, but mysterious stranger into their house.', '02:12:00', 'Hindi', '2024-03-08 00:00:00', 'India', 'Horror', 7.1, 'A', 'https://res.cloudinary.com/dwiphkazt/image/upload/v1758894100/shaitaan-et00384234-1706179766_pz2bxd.avif', 'https://www.youtube.com/watch?v=3-3s_4fBF0g', 1),
(15, 'Captain Miller', 'A renegade Captain and his unconventional outlaws execute a series of heists in British India.', '02:37:00', 'Tamil', '2024-01-12 00:00:00', 'India', 'Action', 7.6, 'UA', 'https://res.cloudinary.com/dwiphkazt/image/upload/v1758894100/captain-miller-et00333139-1688130090_lkyb9o.avif', 'https://www.youtube.com/watch?v=p4ECg0-dF0g', 1);
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
(20, 'Anita Shah', 'pass123', 'anita.shah@example.com', '9876543228', 0);

DROP PROCEDURE IF EXISTS PopulateBookingData;
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
        SET movie_id = 1 + FLOOR(RAND() * 15);
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
            SET user_id = 1 + FLOOR(RAND() * 20);
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
                    VALUES (
                        show_seat_id,
                        CASE FLOOR(RAND() * 3)
                            WHEN 0 THEN 0  -- Available
                            ELSE 2         -- Booked
                        END,
                        price,
                        seat_id_val,
                        show_id,
                        booking_id
                    );
                    SET show_seat_id = show_seat_id + 1;
                 END IF;
                 SET seat_num = seat_num + 1;
            END WHILE;


            INSERT INTO Payment (PaymentID, Amount, Payment_Timestamp, DiscountCouponID, RemoteTransactionID, PaymentMethod, BookingID)
            VALUES (payment_id, total_amount, NOW() - INTERVAL FLOOR(RAND() * 71) HOUR, NULL, FLOOR(1000000 + RAND() * 9000000), 1, booking_id);


            -- Create a review for the movie (not for every booking)
            IF RAND() > 0.5 AND review_id <= 100 THEN
                INSERT INTO Review (ReviewID, UserID, MovieID, Rating, Comment, Review_Timestamp)
                VALUES (review_id, user_id, movie_id,  LEAST(ROUND(5 + RAND() * 5, 1), 9.9), 'This was a great movie!', NOW() - INTERVAL FLOOR(RAND() * 24) HOUR);
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