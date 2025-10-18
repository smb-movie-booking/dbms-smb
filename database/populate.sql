-- SQL Script to Clear All Data from All Tables
-- Temporarily disables foreign key checks to allow truncation in any order.
USE smb;
SET @start_time = NOW();

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
(1, 'PVR ICON, Phoenix Palladium', 1, 'Parking,Dolby,Recliner', 1),
(2, 'INOX, Malad (Inorbit Mall)', 1, 'Parking,Dolby,Recliner,Cafe', 1),
(3, 'Cinepolis, Viviana Mall, Thane', 1, 'Parking,IMAX,4DX,Recliner', 1),
(4, 'Regal Cinema, Colaba', 1, 'Heritage,Cafe', 0),
(5, 'Balaji Movieplex, Kopar Khairane', 1, 'Parking,Dolby', 1),
(6, 'PVR Maison, Jio World Drive, BKC', 1, 'Parking,Dolby,Recliner', 1),
(7, 'Plaza Dadar', 1, 'Parking', 0),
(8, 'Gaiety Galaxy, Bandra', 1, 'Heritage,Cafe', 0),
(9, 'PVR Dynamix, Juhu', 1, 'Parking,Dolby Atmos,Recliner', 1),
(10, 'INOX, Atria Mall, Worli', 1, 'Parking,Dolby', 1),

-- Delhi (CityID 2)
(11, 'PVR Directors Cut, Ambience Mall', 2, 'Parking,Dolby,Recliner', 1),
(12, 'INOX, Nehru Place', 2, 'Parking,Dolby,Recliner,Cafe', 1),
(13, 'Cinepolis, DLF Avenue, Saket', 2, 'Parking,IMAX,4DX,Recliner', 1),
(14, 'Amba Cinema, Shakti Nagar', 2, 'Parking,Cafe', 0),
(15, 'Miraj Cinemas, Subhash Nagar', 2, 'Parking,Dolby', 1),
(16, 'PVR ICON, Promenade Mall', 2, 'Parking,Dolby,Recliner', 1),
(17, 'Delite Cinema, Daryaganj', 2, 'Parking', 0),
(18, 'PVR Plaza, Connaught Place', 2, 'Heritage,Cafe', 0),
(19, 'PVR City Walk, Saket', 2, 'Parking,Dolby Atmos,Recliner', 1),
(20, 'INOX, Epicuria, Nehru Place', 2, 'Parking,Dolby', 1),

-- Bangalore (CityID 3)
(21, 'PVR, Orion Mall', 3, 'Parking,Dolby,Recliner', 1),
(22, 'INOX, Jayanagar', 3, 'Parking,Dolby,Recliner,Cafe', 1),
(23, 'Cinepolis, Forum Shantiniketan', 3, 'Parking,IMAX,4DX,Recliner', 1),
(24, 'Urvashi Cinema, Lalbagh Road', 3, 'Parking,Cafe', 0),
(25, 'Miraj Cinemas, Hegde Nagar', 3, 'Parking,Dolby', 1),
(26, 'PVR, The Forum Mall, Koramangala', 3, 'Parking,Dolby,Recliner', 1),
(27, 'Mukta A2 Cinemas, Kempfort Mall', 3, 'Parking', 0),
(28, 'Lavanya Theatre, St. Johns Road', 3, 'Heritage,Cafe', 0),
(29, 'PVR, Vega City Mall', 3, 'Parking,Dolby Atmos,Recliner', 1),
(30, 'INOX, Garuda Mall, Magrath Road', 3, 'Parking,Dolby', 1),

-- Hyderabad (CityID 4)
(31, 'PVR, RK Cineplex, Banjara Hills', 4, 'Parking,Dolby,Recliner', 1),
(32, 'INOX, GVK One, Banjara Hills', 4, 'Parking,Dolby,Recliner,Cafe', 1),
(33, 'Cinepolis, Manjeera Mall', 4, 'Parking,IMAX,4DX,Recliner', 1),
(34, 'Prasads Multiplex, NTR Gardens', 4, 'Parking,Cafe', 0),
(35, 'Miraj Cinemas, Balanagar', 4, 'Parking,Dolby', 1),
(36, 'AMB Cinemas, Gachibowli', 4, 'Parking,Dolby,Recliner', 1),
(37, 'Asian Cinemas, Uppal', 4, 'Parking', 0),
(38, 'Sudha Theatre, Lal Darwaza', 4, 'Heritage,Cafe', 0),
(39, 'PVR, Forum Sujana Mall', 4, 'Parking,Dolby Atmos,Recliner', 1),
(40, 'INOX, GS Galleria Mall, Attapur', 4, 'Parking,Dolby', 1),

-- Chennai (CityID 5)
(41, 'PVR, Ampa Skywalk, Aminjikarai', 5, 'Parking,Dolby,Recliner', 1),
(42, 'INOX, The Marina Mall', 5, 'Parking,Dolby,Recliner,Cafe', 1),
(43, 'Cinepolis, BSR Mall, OMR', 5, 'Parking,IMAX,4DX,Recliner', 1),
(44, 'AGS Cinemas, T. Nagar', 5, 'Parking,Cafe', 0),
(45, 'Vetri Theatres, Chromepet', 5, 'Parking,Dolby', 1),
(46, 'PVR, VR Chennai, Anna Nagar', 5, 'Parking,Dolby,Recliner', 1),
(47, 'Kamala Cinemas, Vadapalani', 5, 'Parking', 0),
(48, 'Sathyam Cinemas, Royapettah', 5, 'Heritage,Cafe', 0),
(49, 'PVR, Grand Galada, Pallavaram', 5, 'Parking,Dolby Atmos,Recliner', 1),
(50, 'INOX, Citi Centre, Mylapore', 5, 'Parking,Dolby', 1),

-- Kolkata (CityID 6)
(51, 'PVR, Diamond Plaza, Nagerbazar', 6, 'Parking,Dolby,Recliner', 1),
(52, 'INOX, South City Mall', 6, 'Parking,Dolby,Recliner,Cafe', 1),
(53, 'Cinepolis, Acropolis Mall', 6, 'Parking,IMAX,4DX,Recliner', 1),
(54, 'Nandan Cinema, Rabindra Sadan', 6, 'Parking,Cafe', 0),
(55, 'Miraj Cinemas, Newtown', 6, 'Parking,Dolby', 1),
(56, 'PVR, Mani Square Mall', 6, 'Parking,Dolby,Recliner', 1),
(57, 'Menoka Cinema, Tollygunge', 6, 'Parking', 0),
(58, 'New Empire Cinema, Esplanade', 6, 'Heritage,Cafe', 0),
(59, 'PVR, Avani Riverside Mall, Howrah', 6, 'Parking,Dolby Atmos,Recliner', 1),
(60, 'INOX, Quest Mall', 6, 'Parking,Dolby', 1),

-- Pune (CityID 7)
(61, 'PVR, The Pavilion, SB Road', 7, 'Parking,Dolby,Recliner', 1),
(62, 'INOX, Amanora Mall', 7, 'Parking,Dolby,Recliner,Cafe', 1),
(63, 'Cinepolis, Westend Mall, Aundh', 7, 'Parking,IMAX,4DX,Recliner', 1),
(64, 'Victory Theatre, Camp', 7, 'Parking,Cafe', 0),
(65, 'Miraj Cinemas, Laxminarayan', 7, 'Parking,Dolby', 1),
(66, 'City Pride, Kothrud', 7, 'Parking,Dolby,Recliner', 1),
(67, 'Rahul Theatre, Shivajinagar', 7, 'Parking', 0),
(68, 'Westend Cinema, Camp', 7, 'Heritage,Cafe', 0),
(69, 'PVR, Kumar Pacific Mall', 7, 'Parking,Dolby Atmos,Recliner', 1),
(70, 'INOX, Elpro City Square, Chinchwad', 7, 'Parking,Dolby', 1),

-- Ahmedabad (CityID 8)
(71, 'PVR, Acropolis Mall', 8, 'Parking,Dolby,Recliner', 1),
(72, 'INOX, CG Road', 8, 'Parking,Dolby,Recliner,Cafe', 1),
(73, 'Cinepolis, Alpha One Mall', 8, 'Parking,IMAX,4DX,Recliner', 1),
(74, 'Sunset Drive-In Cinema', 8, 'Parking,Cafe', 0),
(75, 'Miraj Cinemas, Himalaya Mall', 8, 'Parking,Dolby', 1),
(76, 'PVR, Arved Transcube', 8, 'Parking,Dolby,Recliner', 1),
(77, 'Mukta A2 Cinemas, Gulmohar Park', 8, 'Parking', 0),
(78, 'Rajshree Cinema, Naroda', 8, 'Heritage,Cafe', 0),
(79, 'PVR, Motera', 8, 'Parking,Dolby Atmos,Recliner', 1),
(80, 'INOX, Rajhans Plex', 8, 'Parking,Dolby', 1),

-- Jaipur (CityID 9)
(81, 'PVR, Pink Square Mall', 9, 'Parking,Dolby,Recliner', 1),
(82, 'INOX, Crystal Palm', 9, 'Parking,Dolby,Recliner,Cafe', 1),
(83, 'Cinepolis, World Trade Park', 9, 'Parking,IMAX,4DX,Recliner', 1),
(84, 'Raj Mandir Cinema', 9, 'Parking,Cafe', 0),
(85, 'Miraj Cinemas, Jhotwara', 9, 'Parking,Dolby', 1),
(86, 'PVR, City Mall', 9, 'Parking,Dolby,Recliner', 1),
(87, 'First Cinema, Sitapura', 9, 'Parking', 0),
(88, 'Gem Cinema, MI Road', 9, 'Heritage,Cafe', 0),
(89, 'PVR, Elements Mall', 9, 'Parking,Dolby Atmos,Recliner', 1),
(90, 'INOX, GT Central Mall', 9, 'Parking,Dolby', 1),

-- Kochi (CityID 10)
(91, 'PVR, Lulu Mall, Edapally', 10, 'Parking,Dolby,Recliner', 1),
(92, 'INOX, Centre Square Mall', 10, 'Parking,Dolby,Recliner,Cafe', 1),
(93, 'Cinepolis, Centre Square Mall', 10, 'Parking,IMAX,4DX,Recliner', 1),
(94, 'Q Cinemas, Gold Souk Grande', 10, 'Parking,Cafe', 0),
(95, 'Miraj Cinemas, Panvelil', 10, 'Parking,Dolby', 1),
(96, 'PVR, Forum Mall, Maradu', 10, 'Parking,Dolby,Recliner', 1),
(97, 'Vanitha & Vineetha Theatres', 10, 'Parking', 0),
(98, 'Sridar Theatre, MG Road', 10, 'Heritage,Cafe', 0),
(99, 'PVR, Oberon Mall', 10, 'Parking,Dolby Atmos,Recliner', 1),
(100, 'INOX, Karies, Marine Drive', 10, 'Parking,Dolby', 1);

SELECT 'cities and cinema added' as message;


DROP PROCEDURE IF EXISTS PopulateHallsAndSeats;
DELIMITER $$
CREATE PROCEDURE PopulateHallsAndSeats()
BEGIN
    DECLARE i INT DEFAULT 1;
    DECLARE j INT DEFAULT 1;
    DECLARE k INT DEFAULT 1;
    DECLARE hall_id INT DEFAULT 1;
    DECLARE seat_id INT DEFAULT 1;
    DECLARE total_halls_for_cinema INT;
    DECLARE seats_in_current_hall INT;

    -- NEW: Variables for seat name generation
    DECLARE layout_type INT;
    DECLARE current_seat_type VARCHAR(10);
    DECLARE generated_seat_name VARCHAR(10);
    
    -- NEW: Variables for pre-calculating totals for each type
    DECLARE total_standard, total_premium, total_recliner, total_sofa, total_box INT DEFAULT 0;
    
    -- NEW: Variables to count seats as we add them
    DECLARE current_standard_count, current_premium_count, current_recliner_count, current_sofa_count, current_box_count INT DEFAULT 1;
    
    -- NEW: Variables for row/seat number logic
    DECLARE total_for_current_type, seat_num_within_type, seats_per_row, seat_num_in_row INT;
    
    -- NEW: Row letter 'A'
    DECLARE row_letter_code INT DEFAULT 65;

    WHILE i <= 100 DO
        SET total_halls_for_cinema = 1 + FLOOR(RAND() * 4);
        SET j = 1;
        
        WHILE j <= total_halls_for_cinema DO
            SET seats_in_current_hall = 100 + FLOOR(RAND() * 50);
            INSERT INTO Cinema_Hall (CinemaHallID, Hall_Name, CinemaID)
            VALUES (hall_id, CONCAT('Hall ', j), i);

            -- NEW: Reset all counters for the new hall
            SET row_letter_code = 65; -- 'A'
            SET total_standard = 0, total_premium = 0, total_recliner = 0, total_sofa = 0, total_box = 0;
            SET current_standard_count = 1, current_premium_count = 1, current_recliner_count = 1, current_sofa_count = 1, current_box_count = 1;

            -- NEW: PRE-CALCULATION STEP
            -- We must know the *total* seats of each type *before* we can apply the 10/20 row logic.
            SET layout_type = FLOOR(1 + RAND(hall_id) * 5); -- Get the layout number
            
            -- This block mirrors your seat-type logic to calculate the totals in advance
            CASE layout_type
                -- Layout 1: Standard, Premium, Recliners
                WHEN 1 THEN 
                    SET total_recliner = 20;
                    SET total_premium = 30; -- (50 - 20)
                    SET total_standard = seats_in_current_hall - 50;
                -- Layout 2: Sofas, Premium, Standard
                WHEN 2 THEN 
                    SET total_sofa = 8;
                    SET total_premium = FLOOR(seats_in_current_hall / 2) - 8;
                    SET total_standard = seats_in_current_hall - FLOOR(seats_in_current_hall / 2);
                -- Layout 3: Box, Standard, Premium
                WHEN 3 THEN 
                    SET total_box = 4;
                    SET total_premium = 40;
                    SET total_standard = seats_in_current_hall - 44;
                -- Layout 4: All 5 types
                WHEN 4 THEN 
                    SET total_sofa = 4;
                    SET total_box = 4; -- (8 - 4)
                    SET total_recliner = 10;
                    SET total_premium = 20; -- (30 - 10)
                    SET total_standard = seats_in_current_hall - 38;
                -- Layout 5: Standard, Premium
                ELSE 
                    SET total_premium = 30;
                    SET total_standard = seats_in_current_hall - 30;
            END CASE;
            

            SET k = 1;
            WHILE k <= seats_in_current_hall DO
            
                -- 1. Determine the seat type (same logic as before)
                SET current_seat_type = (
                    CASE layout_type
                        WHEN 1 THEN 
                            CASE
                                WHEN k > seats_in_current_hall - 20 THEN 'Recliner'
                                WHEN k > seats_in_current_hall - 50 THEN 'Premium'
                                ELSE 'Standard'
                            END
                        WHEN 2 THEN 
                            CASE
                                WHEN k <= 8 THEN 'Sofa'
                                WHEN k <= seats_in_current_hall / 2 THEN 'Premium'
                                ELSE 'Standard'
                            END
                        WHEN 3 THEN 
                            CASE
                                WHEN k <= 4 THEN 'Box'
                                WHEN k > seats_in_current_hall - 40 THEN 'Premium'
                                ELSE 'Standard'
                            END
                        WHEN 4 THEN 
                            CASE
                                WHEN k <= 4 THEN 'Sofa'
                                WHEN k > 4 AND k <= 8 THEN 'Box'
                                WHEN k > seats_in_current_hall - 10 THEN 'Recliner'
                                WHEN k > seats_in_current_hall - 30 THEN 'Premium'
                                ELSE 'Standard'
                            END
                        ELSE 
                            CASE
                                WHEN k > seats_in_current_hall - 30 THEN 'Premium'
                                ELSE 'Standard'
                            END
                    END
                );

                -- 2. NEW: Get the total and current count for this seat's type
                CASE current_seat_type
                    WHEN 'Standard' THEN
                        SET total_for_current_type = total_standard;
                        SET seat_num_within_type = current_standard_count;
                    WHEN 'Premium' THEN
                        SET total_for_current_type = total_premium;
                        SET seat_num_within_type = current_premium_count;
                    WHEN 'Recliner' THEN
                        SET total_for_current_type = total_recliner;
                        SET seat_num_within_type = current_recliner_count;
                    WHEN 'Sofa' THEN
                        SET total_for_current_type = total_sofa;
                        SET seat_num_within_type = current_sofa_count;
                    WHEN 'Box' THEN
                        SET total_for_current_type = total_box;
                        SET seat_num_within_type = current_box_count;
                END CASE;

                -- 3. NEW: Apply your frontend logic to get seats_per_row
                IF total_for_current_type >= 80 THEN
                    SET seats_per_row = 20;
                ELSE
                    SET seats_per_row = 10;
                END IF;

                -- 4. NEW: Calculate the seat's number within its row (e.g., 1, 2, ... 10)
                SET seat_num_in_row = ((seat_num_within_type - 1) % seats_per_row) + 1;

                -- 5. NEW: Increment the row letter *if* this is the first seat of a new row
                -- (But not if it's the very first seat of the type)
                IF seat_num_in_row = 1 AND k > 1 THEN
                    SET row_letter_code = row_letter_code + 1;
                END IF;

                -- 6. NEW: Generate the final name
                SET generated_seat_name = CONCAT(CHAR(row_letter_code), seat_num_in_row);
                
                -- 7. NEW: Modified INSERT statement
                INSERT INTO Cinema_Seat (CinemaSeatID, SeatNumber, Seat_Type, CinemaHallID, SeatName)
                VALUES (
                    seat_id,
                    k,
                    current_seat_type,
                    hall_id,
                    generated_seat_name -- <-- The new name
                );

                -- 8. NEW: Increment the counter for the type we just added
                CASE current_seat_type
                    WHEN 'Standard' THEN SET current_standard_count = current_standard_count + 1;
                    WHEN 'Premium' THEN SET current_premium_count = current_premium_count + 1;
                    WHEN 'Recliner' THEN SET current_recliner_count = current_recliner_count + 1;
                    WHEN 'Sofa' THEN SET current_sofa_count = current_sofa_count + 1;
                    WHEN 'Box' THEN SET current_box_count = current_box_count + 1;
                END CASE;

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

            CREATE TEMPORARY TABLE IF NOT EXISTS SeatsToBook (
                ShowSeatID INT PRIMARY KEY,
                SeatPrice DECIMAL(10,2)
            );
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
                UPDATE Booking SET Booking_Status = 2 WHERE BookingID = booking_id;
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
SET @end_time = NOW();
SELECT TIMEDIFF(@end_time, @start_time) AS 'Total Execution Time';