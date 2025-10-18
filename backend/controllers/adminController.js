const adminModel = require('../models/adminModel');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const { db } = require('../config/db');
require('dotenv').config();
const { parseSeatRanges } = require('../utils/parse');


exports.flushAllTables = async (req, res) => {
  try {
    const tables = await adminModel.extractTablesFromSQL();
    console.log('Tables found:', tables);

    if (!tables || tables.length === 0) {
      return res.status(400).json({ message: 'No tables found to truncate.' });
    }

    await adminModel.truncateTables(tables);
    res.json({ message: 'All tables truncated successfully.', tables });
  } catch (err) {
    console.error('Error flushing tables:', err.message || err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

// ... other functions

exports.createNewCity = (req, res) => {
    const user = req.session.user;
    // 1. Get all fields from the request body
    const { cityName, cityState, zipCode } = req.body;

    if (!user || !user?.isAdmin) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    if (!cityName || !cityName.trim() || !cityState || !cityState.trim() || !zipCode || !zipCode.trim()) {
        return res.status(400).json({ message: "City name, state, and zip code are all required." });
    }

    // 2. Pass ALL THREE arguments to your model function
    //    Also, match the variable names your model expects (name, state, code)
    adminModel.addCity(cityName, cityState, zipCode, (err, result) => {
        if (err) {
            console.log(err);
            // Check for duplicate city names if your DB has a UNIQUE constraint
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: "A city with this name already exists." });
            }
            return res.status(500).json({ message: "A database error occurred." });
        }
        
        if (result && result.inserted) {
            return res.status(201).json({ success: true, message: "City added successfully" });
        }
    });
};

// ... other functions

exports.getAllCities=(req,res)=>{
  const user=req.session.user;
  const isAdmin=req.session.user.isAdmin
  if(!user || !isAdmin)return res.status(400).json({message:"Not Authorized"});

  db.query('select * from City',(err,results)=>{
    if(err)return res.status(400).json({error:err});

    if(results)return res.status(200).json({success:true,cities:results.length>0?results:[]})

    
  })
}


exports.deleteCity=(req,res)=>{
  const user=req.session.user;
  const {id}=req.params;

  if(!id)return res.status(400).json({message:"Invalid req"});
  if(!user || !user?.isAdmin)return res.status(400).json({message:"Not Authorized"});

  adminModel.findCityById(id,(err,city)=>{
    if(err)return res.status(400).json({error:err});

    if(!city)return res.status(400).json({message:"No Such City exists"});

    db.query('DELETE FROM City WHERE CityID=?',[id],(err,result)=>{
      if(err){
        console.log(err);
        return res.status(400).json({message:"Couldnt Delete,Some error occured"})
      }
      console.log(result.affectedRows);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "City not found" });
      }
      return res.status(200).json({message:"City Deleted"})

    })
  })


}

exports.addNewCinemas=(req,res)=>{
    const user=req.session.user;
    const {name,cityId,facilities,cancellationAllowed}=req.body;

    if(!user || !user?.isAdmin)return res.status(400).json({message:"Unauthorized"});

    if(!name.trim())return res.status(400).json({message:"Cinema name is required"});
    if(!cityId) return res.status(400).json({message:"Please choose a city"});

    adminModel.findCityById(cityId,(err,city)=>{
      if(err){
        console.log(err);
        return res.status(401).json({message:"DB Error"});
      }
      if(!city)return res.status(401).json({message:"City doesn't exist"});

      db.query('SELECT MAX(CinemaID) as maxid from Cinema',(err,result)=>{
        if(err){
          console.log(err);
          return res.status(500).json({ message: "DB Error" });
        }
        const newCinemaId = (result[0].maxid || 0) + 1 ;
        const sql='INSERT INTO Cinema(CinemaID,Cinema_Name,CityID,Facilities,Cancellation_Allowed) values(?,?,?,?,?)'
        db.query(sql,[newCinemaId,name.trim(),cityId,facilities,cancellationAllowed],(err,result)=>{
          if(err){
            console.log(err);
            return res.status(500).json({error:"DB Error"});
          }
          console.log(result);
          return res.status(201).json({success:true,message:"Cinema added successfully"});
        })

      })

      
    })


}



exports.getAllCinemas=(req,res)=>{
  const user=req.session.user;
  if(!user || !user?.isAdmin)return res.status(400).json({message:"Not Authorized"});

  db.query('select * from Cinema',(err,results)=>{
    if(err)return res.status(400).json({error:err});

    if(results)return res.status(200).json({success:true,cinemas:results.length>0?results:[]})

    
  })
}


exports.deleteCinemas=(req,res)=>{
  const user=req.session.user;
  const {id}=req.params;

  if(!id)return res.status(400).json({message:"Invalid req"});
  if(!user || !user?.isAdmin)return res.status(400).json({message:"Not Authorized"});

  adminModel.findCinemaById(id,(err,cinema)=>{
    if(err)return res.status(400).json({error:err});

    if(!cinema)return res.status(400).json({message:"No Such Cinema exists"});

    db.query('DELETE FROM Cinema WHERE CinemaID=?',[id],(err,result)=>{
      if(err){
        console.log(err);
        return res.status(400).json({message:"Couldnt Delete,Some error occured"})
      }
      console.log(result.affectedRows);
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Cinema not found" });
      }
      return res.status(200).json({message:"Cinema Deleted"})

    })
  })


}


// Make sure you have the 'db' variable (your database connection)
// and the 'parseSeatRanges' function imported or defined here.

exports.addNewCinemaHall = (req, res) => {
    const user = req.session.user;
    const { hallName, cinemaId, seatConfig } = req.body;

    if (!user || !user?.isAdmin) return res.status(401).json({ message: "Unauthorized" });
    if (!hallName || !hallName.trim()) return res.status(400).json({ message: "Hall name is required" });
    if (!cinemaId) return res.status(400).json({ message: "Please choose a cinema" });
    if (!seatConfig || seatConfig.length === 0) return res.status(400).json({ message: "Seat configuration is required" });

    // 1. Get a connection from the POOL (db)
    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Database connection error" });
        }

        // 2. Start the transaction using the new 'connection' object
        connection.beginTransaction(err => {
            if (err) {
                console.log(err);
                connection.release(); // Must release connection on error
                return res.status(500).json({ message: "Database transaction error" });
            }

            try {
                // This synchronous logic is unchanged
                const { allSeats } = parseSeatRanges(seatConfig);
                if (allSeats.length === 0) {
                    throw new Error("Cannot create a hall with zero seats.");
                }

                // --- NEW LOGIC: SEAT NAME GENERATION (Unchanged) ---
                const seatsByType = allSeats.reduce((acc, seat) => {
                    if (!acc[seat.type]) acc[seat.type] = [];
                    acc[seat.type].push(seat);
                    return acc;
                }, {});
                const seatTypeOrder = seatConfig.map(config => config.type);
                const seatsWithNames = [];
                let rowLetterCode = 65;
                for (const seatType of seatTypeOrder) {
                    const seatsInThisType = seatsByType[seatType];
                    if (!seatsInThisType || seatsInThisType.length === 0) continue;
                    const count = seatsInThisType.length;
                    let seatsPerRow = (count >= 80) ? 20 : 10;
                    const rowCount = Math.ceil(count / seatsPerRow);
                    for (let i = 0; i < rowCount; i++) {
                        const start = i * seatsPerRow;
                        const end = start + seatsPerRow;
                        const rowOfSeats = seatsInThisType.slice(start, end);
                        const letter = String.fromCharCode(rowLetterCode);
                        rowOfSeats.forEach((seat, index) => {
                            const seatNumber = seat.number;
                            const seatName = `${letter}${seatNumber}`;
                            seatsWithNames.push({ ...seat, seatName: seatName });
                        });
                        rowLetterCode++;
                    }
                }
                // --- END OF NEW LOGIC ---
                
                // 3. All queries must use 'connection.query' (not 'db.query')
                connection.query('SELECT MAX(CinemaHallID) as maxid from Cinema_Hall', (err, result) => {
                    // 4. All rollbacks must use 'connection.rollback' and 'connection.release'
                    if (err) return connection.rollback(() => {
                        connection.release();
                        throw err; 
                    });
                    
                    const newCinemaHallId = (result[0].maxid || 0) + 1;
                    const hallSql = 'INSERT INTO Cinema_Hall(CinemaHallID, Hall_Name, CinemaID) VALUES (?, ?, ?)';
                    
                    connection.query(hallSql, [newCinemaHallId, hallName.trim(), cinemaId], (err, result) => {
                        if (err) return connection.rollback(() => {
                            connection.release();
                            throw err;
                        });

                        connection.query('SELECT MAX(CinemaSeatID) as maxid from Cinema_Seat', (err, result) => {
                            if (err) return connection.rollback(() => {
                                connection.release();
                                throw err;
                            });

                            let nextSeatId = (result[0].maxid || 0) + 1;
                            const seatValues = seatsWithNames.map(seat => {
                                return [
                                    nextSeatId++,
                                    seat.number,
                                    seat.type,
                                    newCinemaHallId,
                                    seat.seatName
                                ];
                            });
                            
                            const seatSql = 'INSERT INTO Cinema_Seat (CinemaSeatID, SeatNumber, Seat_Type, CinemaHallID, SeatName) VALUES ?';

                            connection.query(seatSql, [seatValues], (err, result) => {
                                if (err) return connection.rollback(() => {
                                    connection.release();
                                    throw err;
                                });

                                // 5. Commit using 'connection.commit'
                                connection.commit(err => {
                                    if (err) return connection.rollback(() => {
                                        connection.release();
                                        throw err;
                                    });
                                    
                                    // 6. Release the connection back to the pool on success
                                    connection.release();
                                    return res.status(201).json({ success: true, message: "Hall and all seats added successfully" });
                                });
                            });
                        });
                    });
                });
            } catch (error) {
                // 7. Rollback and release on synchronous errors
                connection.rollback(() => {
                    connection.release();
                    console.log(error);
                    return res.status(400).json({ message: error.message });
                });
            }
        });
    });
};

exports.getAllCinemaHalls=(req,res)=>{
  const user=req.session.user;
  if(!user || !user?.isAdmin)return res.status(400).json({message:"Not Authorized"});

  db.query('select * from Cinema_Hall',(err,results)=>{
    if(err)return res.status(400).json({error:err});

    if(results)return res.status(200).json({success:true,halls:results.length>0?results:[]})

    
  })
}

exports.getCinemaSeats = (req, res) => {
    const user = req.session.user;

    if (!user || !user?.isAdmin) {
        return res.status(401).json({ message: "Unauthorized" });
    }

    const sql = "SELECT * FROM Cinema_Seat";

    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "DB Error" });
        }
        return res.status(200).json({ success: true, seats: results });
    });
};

exports.deleteCinemaHall = (req, res) => {
    const user = req.session.user;
    const { id } = req.params; // Get the hall ID from the URL parameter

    // 1. Authorization Check
    if (!user || !user?.isAdmin) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    if (!id) {
        return res.status(400).json({ message: "Cinema Hall ID is required" });
    }

    // 2. SQL Query to Delete the Hall
    const sql = 'DELETE FROM Cinema_Hall WHERE CinemaHallID = ?';

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.log(err);
            // This could happen if other constraints exist that are not set to cascade
            return res.status(500).json({ message: "Database error, could not delete hall." });
        }

        // 3. Check if a row was actually deleted
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Cinema Hall not found" });
        }

        // 4. Send success response
        return res.status(200).json({ success: true, message: "Cinema Hall deleted successfully" });
    });
};

exports.addMovie = (req, res) => {
  const { 
    title, 
    description, 
    duration, 
    language, 
    releaseDate, 
    genre, 
    rating, 
    ageFormat, 
    trailerUrl, 
    imageUrl 
  } = req.body;

  const country = "India";

  const user = req.session.user;
  if (!user || !user?.isAdmin)
    return res.status(400).json({ message: "Unauthorized" });

  db.query("SELECT MAX(MovieID) as maxid FROM Movie", (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "DB Error" });
    }

    const newId = (result[0].maxid || 0) + 1;

    const sql = `
      INSERT INTO Movie (
        MovieID, Title, Movie_Description, Duration, Movie_Language,
        ReleaseDate, Country, Genre, Rating, Age_Format, Trailer_URL, Poster_Image_URL
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      sql,
      [
        newId,
        title,
        description,
        duration,
        language,
        releaseDate,
        country,
        genre,
        rating,
        ageFormat,
        trailerUrl,
        imageUrl
      ],
      (err) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: "DB Error" });
        }
        return res
          .status(201)
          .json({ success: true, message: "Movie added successfully" });
      }
    );
  });
};


exports.getMovies = (req, res) => {
  const sql = `
    SELECT 
      m.MovieID, m.Title, m.Movie_Description, m.Duration, m.Movie_Language,
      m.ReleaseDate, m.Country, m.Genre, m.Rating, m.Age_Format,
      m.Trailer_URL, m.Poster_Image_URL,
      CASE 
        WHEN EXISTS (
          SELECT 1 FROM Movie_Show s 
          WHERE s.MovieID = m.MovieID AND s.EndTime > NOW()
        ) 
        THEN TRUE ELSE FALSE 
      END AS isActive
    FROM Movie m
    ORDER BY m.Created_At DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "DB Error" });
    }

    return res.status(200).json({ movies: results });
  });
};



exports.deleteMovie=(req,res)=>{
  const {id}=req.params
  const user=req.session.user;
  if(!user || !user?.isAdmin)return res.status(400).json({message:"Unauthorized"});

  db.query("DELETE FROM Movie WHERE MovieID=?",[id],(err,results)=>{
    if(err){
      console.log(err);
      return res.status(500).json({message:"DB Error"});
    }
    if(results.affectedRows){
      return res.status(200).json({success:true,message:"Movie Deleted"})
    }
    return res.status(404).json({message:"Something Went wrong"})
    

  })
}


exports.getHallPlusCinemaName=(req,res)=>{
  const sql='SELECT CinemaID,CinemahallID,Hall_Name,Cinema_Name,Cancellation_Allowed from cinema_hall NATURAL JOIN cinema';
  db.query(sql,(err,results)=>{
    if(err){
      console.log(err)
      return res.status(500).json({message:"DB error"});
    }
    
    return res.status(200).json({result: results.length>0 ? results:[]})
  })
}

exports.getAllShows = (req, res) => {
    const sql = `
        SELECT 
            ms.*, 
            m.Title,
            -- This subquery creates a JSON object of the prices for each show
            (SELECT JSON_OBJECTAGG(cs.Seat_Type, ss.Price)
             FROM Show_Seat ss
             JOIN Cinema_Seat cs ON ss.CinemaSeatID = cs.CinemaSeatID
             WHERE ss.ShowID = ms.ShowID
             GROUP BY ss.ShowID
            ) AS prices
        FROM 
            Movie_Show ms
        JOIN 
            Movie m ON ms.MovieID = m.MovieID
        ORDER BY 
            ms.Show_Date DESC, ms.StartTime DESC;
    `;
    
    db.query(sql, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "DB Error" });
        }
        return res.status(200).json({ shows: results.length > 0 ? results : [] });
    });
};

exports.addNewShow = (req, res) => {
    const { MovieID, CinemaHallID, Show_Date, StartTime, Format, Show_Language, priceConfig } = req.body;
    const user = req.session.user;

    if (!user || !user?.isAdmin) return res.status(401).json({ message: "Unauthorized" });
    if (!MovieID || !CinemaHallID || !Show_Date || !StartTime || !Format || !Show_Language || !priceConfig) {
        return res.status(400).json({ message: "All fields, including price configuration, are required." });
    }

    // 1. Get a connection from the pool
    db.getConnection((err, connection) => {
        if (err) {
            console.error("Error getting DB connection:", err);
            return res.status(500).json({ message: "Database connection error" });
        }

        // 2. Start the transaction on the connection
        connection.beginTransaction(err => {
            if (err) {
                connection.release();
                return res.status(500).json({ message: "Transaction Error" });
            }

            // First, get the movie's duration to calculate EndTime
            // 3. Use connection.query for all operations
            connection.query('SELECT Duration FROM Movie WHERE MovieID = ?', [MovieID], (err, movieResult) => {
                // 4. Use connection.rollback for rollbacks
                if (err) return connection.rollback(() => {
                    connection.release();
                    res.status(500).json({ message: "DB error finding movie" });
                });
                if (movieResult.length === 0) return connection.rollback(() => {
                    connection.release();
                    res.status(404).json({ message: "Movie not found" });
                });

                const movieDuration = movieResult[0].Duration;
                const fullStartTime = `${Show_Date} ${StartTime}`;

                // Find new ShowID
                connection.query("SELECT max(ShowID) as maxid from Movie_Show", (err, result) => {
                    if (err) return connection.rollback(() => {
                        connection.release();
                        res.status(500).json({ message: "DB Error getting max ShowID" });
                    });
                    
                    const newID = (result[0].maxid || 0) + 1;
                    const sqlShow = 'INSERT INTO Movie_Show(ShowID, Show_Date, StartTime, EndTime, CinemaHallID, MovieID, Format, Show_Language, isActive) VALUES(?, ?, ?, ADDTIME(?, ?), ?, ?, ?, ?, TRUE)'; // Set isActive to TRUE
                    
                    // A. Insert the main show record
                    connection.query(sqlShow, [newID, Show_Date, fullStartTime, fullStartTime, movieDuration, CinemaHallID, MovieID, Format, Show_Language], (err, result) => {
                        if (err) return connection.rollback(() => {
                            connection.release();
                            res.status(500).json({ message: "DB Error inserting show" });
                        });
                        
                        // B. Call your procedure to populate seats
                        connection.query('CALL PopulateShowSeats(?, ?, 0)', [newID, CinemaHallID], (err, result) => {
                              if (err) {
                                  console.error("ERROR CALLING PopulateShowSeats:", err); 
                                  console.error("PARAMETERS USED:", { newID, CinemaHallID });
                                  return connection.rollback(() => {
                                      connection.release();
                                      res.status(500).json({ message: "DB Error populating seats", details: err.message });
                                  });
                              }

                            // C. Prepare to update prices for each seat type
                            const priceUpdates = Object.entries(priceConfig).map(([type, price]) => {
                                return new Promise((resolve, reject) => {
                                    const updateSql = `
                                        UPDATE Show_Seat 
                                        SET Price = ? 
                                        WHERE ShowID = ? AND CinemaSeatID IN (
                                            SELECT CinemaSeatID FROM Cinema_Seat WHERE CinemaHallID = ? AND Seat_Type = ?
                                        )
                                    `;
                                    // 5. Make sure queries inside Promises also use the 'connection'
                                    connection.query(updateSql, [price, newID, CinemaHallID, type], (err, updateResult) => {
                                        if (err) return reject(err);
                                        resolve(updateResult);
                                    });
                                });
                            });

                            // D. Run all price updates
                            Promise.all(priceUpdates)
                                .then(() => {
                                    // E. If all updates succeed, commit the transaction
                                    connection.commit(err => {
                                        if (err) return connection.rollback(() => {
                                            connection.release();
                                            res.status(500).json({ message: "Commit failed" });
                                        });
                                        // 6. Release connection on success
                                        connection.release();
                                        res.status(201).json({ success: true, message: "Show added successfully with custom prices" });
                                    });
                                })
                                .catch(err => connection.rollback(() => {
                                    console.error("Error during price updates:", err);
                                    connection.release();
                                    res.status(500).json({ message: "Failed to update seat prices" });
                                }));
                        });
                    });
                });
            });
        });
    });
};

exports.deleteShow = (req, res) => {
    const user = req.session.user;
    const { id } = req.params;
    if (!user || !user?.isAdmin) return res.status(401).json({ message: "Unauthorized" });
    if (!id) return res.status(400).json({ message: "Bad request, show ID is required" });

    // No need for a SELECT first, a direct DELETE is more efficient
    db.query('DELETE FROM Movie_Show WHERE ShowID=?', [id], (err, response) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "DB Error" });
        }
        if (response.affectedRows > 0) {
            return res.status(200).json({ success: true, message: "Show Deleted" });
        }
        return res.status(404).json({ message: "Show not found" });
    });
};

exports.editShow = (req, res) => {
    const { id } = req.params; // The ID of the show to edit
    const { MovieID, CinemaHallID, Show_Date, StartTime, Format, Show_Language, priceConfig } = req.body;
    const user = req.session.user;

    if (!user || !user?.isAdmin) return res.status(401).json({ message: "Unauthorized" });
    if (!id || !MovieID || !CinemaHallID || !Show_Date || !StartTime || !Format || !Show_Language || !priceConfig) {
        return res.status(400).json({ message: "All fields, including price configuration, are required." });
    }

    db.beginTransaction(err => {
        if (err) return res.status(500).json({ message: "Transaction Error" });

        // Get the movie's duration to recalculate EndTime
        db.query('SELECT Duration FROM Movie WHERE MovieID = ?', [MovieID], (err, movieResult) => {
            if (err) return db.rollback(() => res.status(500).json({ message: "DB error finding movie" }));
            if (movieResult.length === 0) return db.rollback(() => res.status(404).json({ message: "Movie not found" }));

            const movieDuration = movieResult[0].Duration;
            const fullStartTime = `${Show_Date} ${StartTime}`;
            
            // A. Update the main show record
            const sqlShowUpdate = `
                UPDATE Movie_Show 
                SET Show_Date = ?, StartTime = ?, EndTime = ADDTIME(?, ?), CinemaHallID = ?, 
                    MovieID = ?, Format = ?, Show_Language = ?
                WHERE ShowID = ?
            `;
            db.query(sqlShowUpdate, [Show_Date, fullStartTime, fullStartTime, movieDuration, CinemaHallID, MovieID, Format, Show_Language, id], (err, result) => {
                if (err) return db.rollback(() => res.status(500).json({ message: "DB Error updating show" }));

                // B. Prepare price updates for each seat type
                const priceUpdates = Object.entries(priceConfig).map(([type, price]) => {
                    return new Promise((resolve, reject) => {
                        const updateSql = `
                            UPDATE Show_Seat 
                            SET Price = ? 
                            WHERE ShowID = ? AND CinemaSeatID IN (
                                SELECT CinemaSeatID FROM Cinema_Seat WHERE CinemaHallID = ? AND Seat_Type = ?
                            )
                        `;
                        db.query(updateSql, [price, id, CinemaHallID, type], (err, updateResult) => {
                            if (err) return reject(err);
                            resolve(updateResult);
                        });
                    });
                });

                // C. Run all price updates
                Promise.all(priceUpdates)
                    .then(() => {
                        // D. If all updates succeed, commit the transaction
                        db.commit(err => {
                            if (err) return db.rollback(() => res.status(500).json({ message: "Commit failed" }));
                            res.status(200).json({ success: true, message: "Show updated successfully" });
                        });
                    })
                    .catch(err => db.rollback(() => res.status(500).json({ message: "Failed to update seat prices", error: err })));
            });
        });
    });
};

exports.updateShowStatus = (req, res) => {
    const { id } = req.params;
    const { isActive } = req.body;
        const user = req.session.user;

     if (!user || !user?.isAdmin) return res.status(401).json({ message: "Unauthorized" });

    if (typeof isActive !== 'boolean') {
        return res.status(400).json({ message: 'Request body must include an `isActive` boolean property.' });
    }

    const sql = "UPDATE Movie_Show SET isActive = ? WHERE ShowID = ?";
    
    db.query(sql, [isActive, id], (err, result) => {
        if (err) {
            console.error("Error updating show status:", err);
            return res.status(500).json({ message: "Database error while updating show status." });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Show not found." });
        }
        res.status(200).json({ message: "Show status updated successfully." });
    });
};