const adminModel = require('../models/adminModel');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const { db } = require('../config/db');
require('dotenv').config();
const { parseSeatRanges } = require('../utils/parse');

// --- HELPER FUNCTION ---
// Helper to build a safe WHERE clause for complex queries
const buildWhereClause = (params, searchFields, filterFields) => {
    let whereClauses = [];
    let queryParams = [];
    
    // 1. Add search query (no change)
    const { search } = params;
    if (search && searchFields.length > 0) {
        // ... (same as before)
        const searchClauses = searchFields.map(field => {
            if (field.endsWith('ID') && !isNaN(search)) {
                queryParams.push(search);
                return `${field} = ?`;
            }
            queryParams.push(`%${search}%`);
            return `${field} LIKE ?`;
        });
        whereClauses.push(`(${searchClauses.join(' OR ')})`);
    }

    // 2. Add specific filters
    for (const [key, field] of Object.entries(filterFields)) {
        if (params[key] && params[key].length > 0) { // Check if param exists and is not empty
            
             // --- THIS IS THE UPDATED LOGIC ---
             if (key === 'facilities') {
                
                // Check if req.query.facilities is an array (multi-select)
                if (Array.isArray(params[key])) {
                    const facilitiesClauses = params[key].map(facility => {
                        queryParams.push(`%${facility}%`);
                        return `${field} LIKE ?`;
                    });
                    // Join with AND to find cinemas that have ALL selected facilities
                    whereClauses.push(`(${facilitiesClauses.join(' AND ')})`);
                
                // Else, it's a single string (or a single-item array, though less likely)
                } else {
                    whereClauses.push(`${field} LIKE ?`);
                    queryParams.push(`%${params[key]}%`);
                }
            // --- END OF UPDATED LOGIC ---

            } else if (key === 'cancellation') {
                // ... (same as before)
                whereClauses.push(`${field} = ?`);
                queryParams.push(params[key] === 'true' ? 1 : 0);
            } else if (key === 'minRating') {
                // ... (same as before)
                whereClauses.push(`${field} >= ?`);
                queryParams.push(params[key]);
            } else if (key === 'releaseDateStart') {
                 // ... (same as before)
                 whereClauses.push(`${field} >= ?`);
                queryParams.push(params[key]);
            } else if (key === 'releaseDateEnd') {
                // ... (same as before)
                whereClauses.push(`${field} <= ?`);
                queryParams.push(params[key]);
            } else {
                // ... (same as before)
                whereClauses.push(`${field} = ?`);
                queryParams.push(params[key]);
            }
        }
    }
    
    return {
        clause: whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '',
        params: queryParams
    };
};

// ... flushAllTables ...
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

// --- CITY FUNCTIONS ---
exports.createNewCity = (req, res) => {
    // ... (Your existing function is fine)
    const user = req.session.user;
    const { cityName, cityState, zipCode } = req.body;
    if (!user || !user?.isAdmin) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    if (!cityName || !cityName.trim() || !cityState || !cityState.trim() || !zipCode || !zipCode.trim()) {
        return res.status(400).json({ message: "City name, state, and zip code are all required." });
    }
    adminModel.addCity(cityName, cityState, zipCode, (err, result) => {
        if (err) {
            console.log(err);
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

exports.getAllCities = (req, res) => {
    const user = req.session.user;
    if (!user || !user?.isAdmin) return res.status(401).json({ message: "Not Authorized" });

    // 1. Get params from query
    const { search, sortKey = 'City_Name', sortOrder = 'ASC', page = 1, limit = 10 } = req.query;

    // 2. Build WHERE clause
    const { clause, params } = buildWhereClause(
        req.query,
        ['City_Name', 'ZipCode', 'CityID'], // Searchable fields
        {} // No special filters for cities
    );

    // 3. Whitelist sorting
    const allowedSortKeys = ['CityID', 'City_Name', 'City_State', 'ZipCode'];
    const safeSortKey = allowedSortKeys.includes(sortKey) ? sortKey : 'City_Name';
    const safeSortOrder = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    // 4. Calculate pagination
    const offset = (page - 1) * limit;
    const limitInt = parseInt(limit);

    // 5. Create queries
    const dataSql = `SELECT * FROM City ${clause} ORDER BY ${safeSortKey} ${safeSortOrder} LIMIT ? OFFSET ?`;
    const countSql = `SELECT COUNT(*) as total FROM City ${clause}`;
    
    // 6. Run queries
    db.query(countSql, params, (err, countResult) => {
        if (err) return res.status(500).json({ error: err });
        
        const total = countResult[0].total;
        const totalPages = Math.ceil(total / limitInt);
        
        db.query(dataSql, [...params, limitInt, offset], (err, results) => {
            if (err) return res.status(500).json({ error: err });
            
            res.status(200).json({
                success: true,
                cities: results.length > 0 ? results : [],
                pagination: {
                    total,
                    totalPages,
                    currentPage: parseInt(page),
                    limit: limitInt
                }
            });
        });
    });
};

exports.deleteCity = (req, res) => {
    // ... (Your existing function is fine)
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
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "City not found" });
            }
            return res.status(200).json({message:"City Deleted"})
        });
    });
};

exports.editCity = (req, res) => {
    const user = req.session.user;
    const { id } = req.params;
    const { City_Name, City_State, ZipCode } = req.body;

    if (!user || !user?.isAdmin) return res.status(401).json({ message: "Unauthorized" });
    if (!City_Name || !City_State || !ZipCode) return res.status(400).json({ message: "All fields are required" });

    const sql = "UPDATE City SET City_Name = ?, City_State = ?, ZipCode = ? WHERE CityID = ?";
    db.query(sql, [City_Name, City_State, ZipCode, id], (err, result) => {
        if (err) {
             if (err.code === 'ER_DUP_ENTRY') {
                return res.status(409).json({ message: "A city with this name already exists." });
            }
            return res.status(500).json({ message: "Database error" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "City not found" });
        }
        res.status(200).json({ success: true, message: "City updated successfully" });
    });
};

// --- CINEMA FUNCTIONS ---
exports.addNewCinemas = (req, res) => {
    // ... (Your existing function is fine)
    const user=req.session.user;
    const {name,cityId,facilities,cancellationAllowed}=req.body;
    if(!user || !user?.isAdmin)return res.status(400).json({message:"Unauthorized"});
    if(!name.trim())return res.status(400).json({message:"Cinema name is required"});
    if(!cityId) return res.status(400).json({message:"Please choose a city"});
    adminModel.findCityById(cityId,(err,city)=>{
      if(err){ console.log(err); return res.status(401).json({message:"DB Error"}); }
      if(!city)return res.status(401).json({message:"City doesn't exist"});
      db.query('SELECT MAX(CinemaID) as maxid from Cinema',(err,result)=>{
        if(err){ console.log(err); return res.status(500).json({ message: "DB Error" }); }
        const newCinemaId = (result[0].maxid || 0) + 1 ;
        const sql='INSERT INTO Cinema(CinemaID,Cinema_Name,CityID,Facilities,Cancellation_Allowed) values(?,?,?,?,?)'
        db.query(sql,[newCinemaId,name.trim(),cityId,facilities,cancellationAllowed],(err,result)=>{
          if(err){ console.log(err); return res.status(500).json({error:"DB Error"}); }
          return res.status(201).json({success:true,message:"Cinema added successfully"});
        });
      });
    });
};

exports.getAllCinemas = (req, res) => {
    const user = req.session.user;
    if (!user || !user?.isAdmin) return res.status(401).json({ message: "Not Authorized" });

    // 1. Get params
    const { cityId, search, facilities, cancellation, sortKey = 'Cinema_Name', sortOrder = 'ASC', page = 1, limit = 10 } = req.query;
    
    // **MUST** have a cityId
    if (!cityId) return res.status(400).json({ message: "cityId is required" });

    // 2. Build WHERE clause
    const { clause, params } = buildWhereClause(
        req.query,
        ['Cinema_Name', 'CinemaID'], // Searchable fields
        { 'facilities': 'Facilities', 'cancellation': 'Cancellation_Allowed' } // Filterable fields
    );

    // 3. Add the mandatory cityId to the clause
    const finalClause = clause ? `${clause} AND CityID = ?` : 'WHERE CityID = ?';
    const finalParams = [...params, cityId];

    // 4. Whitelist sorting
    const allowedSortKeys = ['CinemaID', 'Cinema_Name', 'Facilities', 'Cancellation_Allowed'];
    const safeSortKey = allowedSortKeys.includes(sortKey) ? sortKey : 'Cinema_Name';
    const safeSortOrder = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    // 5. Pagination
    const offset = (page - 1) * limit;
    const limitInt = parseInt(limit);

    // 6. Queries
    const dataSql = `SELECT * FROM Cinema ${finalClause} ORDER BY ${safeSortKey} ${safeSortOrder} LIMIT ? OFFSET ?`;
    const countSql = `SELECT COUNT(*) as total FROM Cinema ${finalClause}`;

    db.query(countSql, finalParams, (err, countResult) => {
        if (err) return res.status(500).json({ error: err });
        
        const total = countResult[0].total;
        const totalPages = Math.ceil(total / limitInt);
        
        db.query(dataSql, [...finalParams, limitInt, offset], (err, results) => {
            if (err) return res.status(500).json({ error: err });
            
            res.status(200).json({
                success: true,
                cinemas: results.length > 0 ? results : [],
                pagination: {
                    total,
                    totalPages,
                    currentPage: parseInt(page),
                    limit: limitInt
                }
            });
        });
    });
};

exports.deleteCinemas = (req, res) => {
    // ... (Your existing function is fine)
    const user=req.session.user;
    const {id}=req.params;
    if(!id)return res.status(400).json({message:"Invalid req"});
    if(!user || !user?.isAdmin)return res.status(400).json({message:"Not Authorized"});
    adminModel.findCinemaById(id,(err,cinema)=>{
        if(err)return res.status(400).json({error:err});
        if(!cinema)return res.status(400).json({message:"No Such Cinema exists"});
        db.query('DELETE FROM Cinema WHERE CinemaID=?',[id],(err,result)=>{
            if(err){ console.log(err); return res.status(400).json({message:"Couldnt Delete,Some error occured"}) }
            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Cinema not found" });
            }
            return res.status(200).json({message:"Cinema Deleted"})
        });
    });
};

exports.editCinema = (req, res) => {
    const user = req.session.user;
    const { id } = req.params;
    // Note: CityID is NOT editable, as that would be a complex move.
    const { Cinema_Name, Facilities, Cancellation_Allowed } = req.body; 

    if (!user || !user?.isAdmin) return res.status(401).json({ message: "Unauthorized" });
    if (!Cinema_Name) return res.status(400).json({ message: "Cinema Name is required" });

    const sql = "UPDATE Cinema SET Cinema_Name = ?, Facilities = ?, Cancellation_Allowed = ? WHERE CinemaID = ?";
    db.query(sql, [Cinema_Name, Facilities, Cancellation_Allowed, id], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" });
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Cinema not found" });
        }
        res.status(200).json({ success: true, message: "Cinema updated successfully" });
    });
};

// --- HALL FUNCTIONS ---
exports.addNewCinemaHall = (req, res) => {
    // ... (Your existing transactional function is correct)
    const user = req.session.user;
    const { hallName, cinemaId, seatConfig } = req.body;

    if (!user || !user?.isAdmin) return res.status(401).json({ message: "Unauthorized" });
    if (!hallName || !hallName.trim()) return res.status(400).json({ message: "Hall name is required" });
    if (!cinemaId) return res.status(400).json({ message: "Please choose a cinema" });
    if (!seatConfig || seatConfig.length === 0) return res.status(400).json({ message: "Seat configuration is required" });

    db.getConnection((err, connection) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Database connection error" });
        }
        connection.beginTransaction(err => {
            if (err) {
                console.log(err);
                connection.release();
                return res.status(500).json({ message: "Database transaction error" });
            }
            try {
                const { allSeats } = parseSeatRanges(seatConfig);
                if (allSeats.length === 0) {
                    throw new Error("Cannot create a hall with zero seats.");
                }
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
                
                connection.query('SELECT MAX(CinemaHallID) as maxid from Cinema_Hall', (err, result) => {
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
                                connection.commit(err => {
                                    if (err) return connection.rollback(() => {
                                        connection.release();
                                        throw err;
                                    });
                                    connection.release();
                                    return res.status(201).json({ success: true, message: "Hall and all seats added successfully" });
                                });
                            });
                        });
                    });
                });
            } catch (error) {
                connection.rollback(() => {
                    connection.release();
                    console.log(error);
                    return res.status(400).json({ message: error.message });
                });
            }
        });
    });
};

exports.getAllCinemaHalls = (req, res) => {
    // This function doesn't need pagination/search yet as the list is per-cinema
    // We will keep it as-is for now, but pass all params for future use
    const user = req.session.user;
    const { cinemaId, page = 1, limit = 100 } = req.query; // High limit, no pagination UI yet

    if (!user || !user?.isAdmin) return res.status(401).json({ message: "Not Authorized" });
    if (!cinemaId) return res.status(400).json({ message: "cinemaId is required" });

    const offset = (page - 1) * limit;
    const limitInt = parseInt(limit);

    let sql = 'SELECT * FROM Cinema_Hall WHERE CinemaID = ? LIMIT ? OFFSET ?';
    let countSql = 'SELECT COUNT(*) as total FROM Cinema_Hall WHERE CinemaID = ?';
    
    db.query(countSql, [cinemaId], (err, countResult) => {
        if (err) return res.status(500).json({ error: err });

        const total = countResult[0].total;
        const totalPages = Math.ceil(total / limitInt);

        db.query(sql, [cinemaId, limitInt, offset], (err, results) => {
            if (err) return res.status(500).json({ error: err });
            res.status(200).json({ 
                success: true, 
                halls: results.length > 0 ? results : [],
                pagination: {
                    total,
                    totalPages,
                    currentPage: parseInt(page),
                    limit: limitInt
                }
            });
        });
    });
};

exports.deleteCinemaHall = (req, res) => {
    // ... (Your existing function is fine)
    const user = req.session.user;
    const { id } = req.params;
    if (!user || !user?.isAdmin) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    if (!id) {
        return res.status(400).json({ message: "Cinema Hall ID is required" });
    }
    const sql = 'DELETE FROM Cinema_Hall WHERE CinemaHallID = ?';
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "Database error, could not delete hall." });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Cinema Hall not found" });
        }
        return res.status(200).json({ success: true, message: "Cinema Hall deleted successfully" });
    });
};

exports.editHall = (req, res) => {
    const user = req.session.user;
    const { id } = req.params;
    const { Hall_Name } = req.body; 
    // NOTE: Editing seat configuration is a complex task and is not
    // included here. This only updates the hall's name.

    if (!user || !user?.isAdmin) return res.status(401).json({ message: "Unauthorized" });
    if (!Hall_Name) return res.status(400).json({ message: "Hall Name is required" });

    const sql = "UPDATE Cinema_Hall SET Hall_Name = ? WHERE CinemaHallID = ?";
    db.query(sql, [Hall_Name, id], (err, result) => {
        if (err) return res.status(500).json({ message: "Database error" });
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Hall not found" });
        }
        res.status(200).json({ success: true, message: "Hall updated successfully" });
    });
};

exports.getCinemaSeats = (req, res) => {
    // ... (Your existing function is fine)
    const user = req.session.user;
    const { hallId } = req.query;
    if (!user || !user?.isAdmin) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    let sql = "SELECT * FROM Cinema_Seat";
    const params = [];
    if (hallId) {
        sql += ' WHERE CinemaHallID = ?';
        params.push(hallId);
    }
    db.query(sql, params, (err, results) => {
        if (err) {
            console.log(err);
            return res.status(500).json({ message: "DB Error" });
        }
        return res.status(200).json({ success: true, seats: results });
    });
};

// --- MOVIE FUNCTIONS ---
exports.addMovie = (req, res) => {
    // ... (Your existing function is fine)
    const { title, description, duration, language, releaseDate, genre, rating, ageFormat, trailerUrl, imageUrl } = req.body;
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
          [ newId, title, description, duration, language, releaseDate, country, genre, rating, ageFormat, trailerUrl, imageUrl ],
          (err) => {
            if (err) {
              console.error(err);
              return res.status(500).json({ message: "DB Error" });
            }
            return res.status(201).json({ success: true, message: "Movie added successfully" });
          }
        );
    });
};

exports.getMovies = (req, res) => {
    const user = req.session.user;
    if (!user || !user?.isAdmin) return res.status(401).json({ message: "Not Authorized" });

    // 1. Get params
    const { 
        search, genre, language, minRating, releaseDateStart, releaseDateEnd,
        sortKey = 'ReleaseDate', sortOrder = 'DESC', page = 1, limit = 5 
    } = req.query;

    // 2. Build WHERE
    const { clause, params } = buildWhereClause(
        req.query,
        ['m.Title', 'm.MovieID'], // Searchable fields (aliased 'm')
        { // Filterable fields
            'genre': 'm.Genre',
            'language': 'm.Movie_Language',
            'minRating': 'm.Rating',
            'releaseDateStart': 'm.ReleaseDate',
            'releaseDateEnd': 'm.ReleaseDate'
        }
    );
    
    // 3. Whitelist sorting
    const allowedSortKeys = ['m.MovieID', 'm.Title', 'm.ReleaseDate', 'm.Rating', 'm.Duration'];
    const safeSortKey = allowedSortKeys.includes(sortKey) ? sortKey : 'm.ReleaseDate';
    const safeSortOrder = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    // 4. Pagination
    const offset = (page - 1) * limit;
    const limitInt = parseInt(limit);

    // 5. Queries
    const dataSql = `
        SELECT 
            m.*,
            CASE 
                WHEN EXISTS (
                SELECT 1 FROM Movie_Show s 
                WHERE s.MovieID = m.MovieID AND s.EndTime > NOW()
                ) 
                THEN TRUE ELSE FALSE 
            END AS isActive
        FROM Movie m
        ${clause}
        ORDER BY ${safeSortKey} ${safeSortOrder} 
        LIMIT ? OFFSET ?
    `;
    const countSql = `SELECT COUNT(*) as total FROM Movie m ${clause}`;

    db.query(countSql, params, (err, countResult) => {
        if (err) { console.error(err); return res.status(500).json({ error: err }); }
        
        const total = countResult[0].total;
        const totalPages = Math.ceil(total / limitInt);
        
        db.query(dataSql, [...params, limitInt, offset], (err, results) => {
            if (err) { console.error(err); return res.status(500).json({ error: err }); }
            
            res.status(200).json({
                success: true,
                movies: results,
                pagination: {
                    total,
                    totalPages,
                    currentPage: parseInt(page),
                    limit: limitInt
                }
            });
        });
    });
};

exports.deleteMovie = (req, res) => {
    // ... (Your existing function is fine)
    const {id}=req.params
    const user=req.session.user;
    if(!user || !user?.isAdmin)return res.status(400).json({message:"Unauthorized"});
    db.query("DELETE FROM Movie WHERE MovieID=?",[id],(err,results)=>{
        if(err){ console.log(err); return res.status(500).json({message:"DB Error"}); }
        if(results.affectedRows){
            return res.status(200).json({success:true,message:"Movie Deleted"})
        }
        return res.status(404).json({message:"Something Went wrong"})
    });
};

exports.editMovie = (req, res) => {
    const user = req.session.user;
    const { id } = req.params;
    const { 
        title, description, duration, language, releaseDate, 
        genre, rating, ageFormat, trailerUrl, imageUrl 
    } = req.body;

    if (!user || !user?.isAdmin) return res.status(401).json({ message: "Unauthorized" });
    if (!title) return res.status(400).json({ message: "Title is required" });
    
    // If imageUrl is not provided, it means we don't want to update it.
    // The poster file/URL is handled on the client; we only save the URL.
    
    let sql = `
        UPDATE Movie SET 
        Title = ?, Movie_Description = ?, Duration = ?, Movie_Language = ?,
        ReleaseDate = ?, Genre = ?, Rating = ?, Age_Format = ?, Trailer_URL = ?
    `;
    const params = [
        title, description, duration, language, releaseDate, 
        genre, rating, ageFormat, trailerUrl
    ];

    // Only add Poster_Image_URL to the query if a new one was provided
    if (imageUrl) {
        sql += ', Poster_Image_URL = ?';
        params.push(imageUrl);
    }

    sql += ' WHERE MovieID = ?';
    params.push(id);

    db.query(sql, params, (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Database error" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Movie not found" });
        }
        res.status(200).json({ success: true, message: "Movie updated successfully" });
    });
};

// --- SHOW FUNCTIONS ---
exports.getHallPlusCinemaName = (req, res) => {
    // ... (Your existing function is fine)
    const sql='SELECT CinemaID,CinemahallID,Hall_Name,Cinema_Name,Cancellation_Allowed from cinema_hall NATURAL JOIN cinema';
    db.query(sql,(err,results)=>{
        if(err){ console.log(err); return res.status(500).json({message:"DB error"}); }
        return res.status(200).json({result: results.length>0 ? results:[]})
    });
};

exports.getAllShows = (req, res) => {
    const user = req.session.user;
    if (!user || !user?.isAdmin) return res.status(401).json({ message: "Not Authorized" });

    // 1. Get params
    const { 
        hallId, movieId, date, language, status,
        sortKey = 'ms.StartTime', sortOrder = 'DESC', page = 1, limit = 10 
    } = req.query;

    if (!hallId) return res.status(400).json({ message: "hallId is required" });

    // 2. Build WHERE
    let whereClauses = ['ms.CinemaHallID = ?'];
    let params = [hallId];

    if (movieId) {
        whereClauses.push('ms.MovieID = ?');
        params.push(movieId);
    }
    if (date) {
        whereClauses.push('ms.Show_Date = ?');
        params.push(date);
    }
    if (language) {
        whereClauses.push('ms.Show_Language = ?');
        params.push(language);
    }
    if (status) {
        whereClauses.push('ms.isActive = ?');
        params.push(status === 'true' ? 1 : 0);
    }

    const clause = `WHERE ${whereClauses.join(' AND ')}`;

    // 3. Whitelist sorting
    const allowedSortKeys = ['ms.Show_Date', 'ms.StartTime', 'm.Title', 'ms.Format', 'ms.Show_Language'];
    const safeSortKey = allowedSortKeys.includes(sortKey) ? sortKey : 'ms.StartTime';
    const safeSortOrder = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    // 4. Pagination
    const offset = (page - 1) * limit;
    const limitInt = parseInt(limit);

    // 5. Queries
    const baseSql = `
        FROM Movie_Show ms
        JOIN Movie m ON ms.MovieID = m.MovieID
        ${clause}
    `;

    const dataSql = `
        SELECT 
            ms.*, 
            m.Title,
            (SELECT JSON_OBJECTAGG(cs.Seat_Type, ss.Price)
             FROM Show_Seat ss
             JOIN Cinema_Seat cs ON ss.CinemaSeatID = cs.CinemaSeatID
             WHERE ss.ShowID = ms.ShowID
             GROUP BY ss.ShowID
            ) AS prices
        ${baseSql}
        ORDER BY ${safeSortKey} ${safeSortOrder}
        LIMIT ? OFFSET ?
    `;
    
    const countSql = `SELECT COUNT(*) as total ${baseSql}`;

    db.query(countSql, params, (err, countResult) => {
        if (err) { console.error(err); return res.status(500).json({ error: err }); }
        
        const total = countResult[0].total;
        const totalPages = Math.ceil(total / limitInt);
        
        db.query(dataSql, [...params, limitInt, offset], (err, results) => {
            if (err) { console.error(err); return res.status(500).json({ error: err }); }
            
            res.status(200).json({
                success: true,
                shows: results.length > 0 ? results : [],
                pagination: {
                    total,
                    totalPages,
                    currentPage: parseInt(page),
                    limit: limitInt
                }
            });
        });
    });
};

exports.addNewShow = (req, res) => {
    // ... (Your existing transactional function is correct)
    const { MovieID, CinemaHallID, Show_Date, StartTime, Format, Show_Language, priceConfig } = req.body;
    const user = req.session.user;

    if (!user || !user?.isAdmin) return res.status(401).json({ message: "Unauthorized" });
    if (!MovieID || !CinemaHallID || !Show_Date || !StartTime || !Format || !Show_Language || !priceConfig) {
        return res.status(400).json({ message: "All fields, including price configuration, are required." });
    }
    db.getConnection((err, connection) => {
        if (err) {
            console.error("Error getting DB connection:", err);
            return res.status(500).json({ message: "Database connection error" });
        }
        connection.beginTransaction(err => {
            if (err) {
                connection.release();
                return res.status(500).json({ message: "Transaction Error" });
            }
            connection.query('SELECT Duration FROM Movie WHERE MovieID = ?', [MovieID], (err, movieResult) => {
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
                connection.query("SELECT max(ShowID) as maxid from Movie_Show", (err, result) => {
                    if (err) return connection.rollback(() => {
                        connection.release();
                        res.status(500).json({ message: "DB Error getting max ShowID" });
                    });
                    
                    const newID = (result[0].maxid || 0) + 1;
                    const sqlShow = 'INSERT INTO Movie_Show(ShowID, Show_Date, StartTime, EndTime, CinemaHallID, MovieID, Format, Show_Language, isActive) VALUES(?, ?, ?, ADDTIME(?, ?), ?, ?, ?, ?, TRUE)';
                    
                    connection.query(sqlShow, [newID, Show_Date, fullStartTime, fullStartTime, movieDuration, CinemaHallID, MovieID, Format, Show_Language], (err, result) => {
                        if (err) return connection.rollback(() => {
                            connection.release();
                            res.status(500).json({ message: "DB Error inserting show" });
                        });
                        
                        connection.query('CALL PopulateShowSeats(?, ?, 0)', [newID, CinemaHallID], (err, result) => {
                              if (err) {
                                  console.error("ERROR CALLING PopulateShowSeats:", err); 
                                  console.error("PARAMETERS USED:", { newID, CinemaHallID });
                                  return connection.rollback(() => {
                                      connection.release();
                                      res.status(500).json({ message: "DB Error populating seats", details: err.message });
                                  });
                              }
                            const priceUpdates = Object.entries(priceConfig).map(([type, price]) => {
                                return new Promise((resolve, reject) => {
                                    const updateSql = `
                                        UPDATE Show_Seat 
                                        SET Price = ? 
                                        WHERE ShowID = ? AND CinemaSeatID IN (
                                            SELECT CinemaSeatID FROM Cinema_Seat WHERE CinemaHallID = ? AND Seat_Type = ?
                                        )
                                    `;
                                    connection.query(updateSql, [price, newID, CinemaHallID, type], (err, updateResult) => {
                                        if (err) return reject(err);
                                        resolve(updateResult);
                                    });
                                });
                            });
                            Promise.all(priceUpdates)
                                .then(() => {
                                    connection.commit(err => {
                                        if (err) return connection.rollback(() => {
                                            connection.release();
                                            res.status(500).json({ message: "Commit failed" });
                                        });
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
    // ... (Your existing function is fine)
    const user = req.session.user;
    const { id } = req.params;
    if (!user || !user?.isAdmin) return res.status(401).json({ message: "Unauthorized" });
    if (!id) return res.status(400).json({ message: "Bad request, show ID is required" });
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
    // ... (Your existing transactional function is correct)
    const { id } = req.params;
    const { MovieID, CinemaHallID, Show_Date, StartTime, Format, Show_Language, priceConfig } = req.body;
    const user = req.session.user;
    if (!user || !user?.isAdmin) return res.status(401).json({ message: "Unauthorized" });
    if (!id || !MovieID || !CinemaHallID || !Show_Date || !StartTime || !Format || !Show_Language || !priceConfig) {
        return res.status(400).json({ message: "All fields, including price configuration, are required." });
    }
    db.getConnection((err, connection) => {
        if (err) {
            console.error("Error getting DB connection:", err);
            return res.status(500).json({ message: "Database connection error" });
        }
        connection.beginTransaction(err => {
            if (err) {
                connection.release();
                return res.status(500).json({ message: "Transaction Error" });
            }
            connection.query('SELECT Duration FROM Movie WHERE MovieID = ?', [MovieID], (err, movieResult) => {
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
                
                const sqlShowUpdate = `
                    UPDATE Movie_Show 
                    SET Show_Date = ?, StartTime = ?, EndTime = ADDTIME(?, ?), CinemaHallID = ?, 
                        MovieID = ?, Format = ?, Show_Language = ?
                    WHERE ShowID = ?
                `;
                connection.query(sqlShowUpdate, [Show_Date, fullStartTime, fullStartTime, movieDuration, CinemaHallID, MovieID, Format, Show_Language, id], (err, result) => {
                    if (err) return connection.rollback(() => {
                        connection.release();
                        res.status(500).json({ message: "DB Error updating show" });
                    });
                    const priceUpdates = Object.entries(priceConfig).map(([type, price]) => {
                        return new Promise((resolve, reject) => {
                            const updateSql = `
                                UPDATE Show_Seat 
                                SET Price = ? 
                                WHERE ShowID = ? AND CinemaSeatID IN (
                                    SELECT CinemaSeatID FROM Cinema_Seat WHERE CinemaHallID = ? AND Seat_Type = ?
                                )
                            `;
                            connection.query(updateSql, [price, id, CinemaHallID, type], (err, updateResult) => {
                                if (err) return reject(err);
                                resolve(updateResult);
                            });
                        });
                    });
                    Promise.all(priceUpdates)
                        .then(() => {
                            connection.commit(err => {
                                if (err) return connection.rollback(() => {
                                    connection.release();
                                    res.status(500).json({ message: "Commit failed" });
                                });
                                connection.release();
                                res.status(200).json({ success: true, message: "Show updated successfully" });
                            });
                        })
                        .catch(err => connection.rollback(() => {
                            console.error("Error during price updates:", err);
                            connection.release();
                            res.status(500).json({ message: "Failed to update seat prices", error: err.message });
                        }));
                });
            });
        });
    });
};

exports.updateShowStatus = (req, res) => {
    // ... (Your existing function is fine)
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

exports.getAllUsers = (req, res) => {
    const user = req.session.user;
    if (!user || !user?.isAdmin) return res.status(401).json({ message: "Not Authorized" });

    // 1. Get params
    const { search, sortKey = 'User_Name', sortOrder = 'ASC', page = 1, limit = 10 } = req.query;

    // 2. Build WHERE
    let whereClauses = [];
    let queryParams = [];
    if (search) {
        whereClauses.push('(User_Name LIKE ? OR Email LIKE ? OR Phone LIKE ?)');
        queryParams.push(`%${search}%`);
        queryParams.push(`%${search}%`);
        queryParams.push(`%${search}%`);
    }
    const clause = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : '';
    
    // 3. Whitelist sorting
    const allowedSortKeys = ['UserID', 'User_Name', 'Email', 'Phone', 'IsAdmin'];
    const safeSortKey = allowedSortKeys.includes(sortKey) ? sortKey : 'User_Name';
    const safeSortOrder = sortOrder.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    // 4. Pagination
    const offset = (page - 1) * limit;
    const limitInt = parseInt(limit);

    // 5. Queries
    // IMPORTANT: Never select the User_Password, even for an admin
    const dataSql = `
        SELECT UserID, User_Name, Email, Phone, IsAdmin 
        FROM User 
        ${clause}
        ORDER BY ${safeSortKey} ${safeSortOrder} 
        LIMIT ? OFFSET ?
    `;
    const countSql = `SELECT COUNT(*) as total FROM User ${clause}`;

    db.query(countSql, queryParams, (err, countResult) => {
        if (err) { console.error(err); return res.status(500).json({ error: err }); }
        
        const total = countResult[0].total;
        const totalPages = Math.ceil(total / limitInt);
        
        db.query(dataSql, [...queryParams, limitInt, offset], (err, results) => {
            if (err) { console.error(err); return res.status(500).json({ error: err }); }
            
            res.status(200).json({
                success: true,
                users: results,
                pagination: {
                    total,
                    totalPages,
                    currentPage: parseInt(page),
                    limit: limitInt
                }
            });
        });
    });
};

exports.toggleAdminStatus = (req, res) => {
    const user = req.session.user;
    const { id } = req.params;

    if (!user || !user?.isAdmin) return res.status(401).json({ message: "Not Authorized" });

    // Critical safety check: Prevent an admin from demoting themselves
    if (user.UserID === parseInt(id)) {
        return res.status(403).json({ message: "You cannot change your own admin status." });
    }

    const sql = "UPDATE User SET IsAdmin = NOT IsAdmin WHERE UserID = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Database error" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ success: true, message: "User admin status updated." });
    });
};

exports.getUserDetails = (req, res) => {
    const user = req.session.user;
    const { id } = req.params;
    if (!user || !user?.isAdmin) return res.status(401).json({ message: "Not Authorized" });

    const bookingsSql = `
        SELECT b.BookingID, b.Booking_Timestamp, b.Booking_Status, m.Title, ms.StartTime
        FROM Booking b
        JOIN Movie_Show ms ON b.ShowID = ms.ShowID
        JOIN Movie m ON ms.MovieID = m.MovieID
        WHERE b.UserID = ?
        ORDER BY b.Booking_Timestamp DESC
    `;
    
    const reviewsSql = `
        SELECT r.ReviewID, r.Rating, r.Comment, r.Review_Timestamp, m.Title
        FROM Review r
        JOIN Movie m ON r.MovieID = m.MovieID
        WHERE r.UserID = ?
        ORDER BY r.Review_Timestamp DESC
    `;

    Promise.all([
        db.promise().query(bookingsSql, [id]),
        db.promise().query(reviewsSql, [id])
    ])
    .then(([[bookings], [reviews]]) => {
        res.status(200).json({
            success: true,
            bookings: bookings,
            reviews: reviews
        });
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ message: "Database error fetching user details." });
    });
};

// --- (NEW) REVIEW MANAGEMENT FUNCTION ---

exports.deleteReview = (req, res) => {
    const user = req.session.user;
    const { id } = req.params; // This is the ReviewID
    if (!user || !user?.isAdmin) return res.status(401).json({ message: "Not Authorized" });

    // Your database trigger 'trg_after_review_delete' will
    // automatically recalculate the movie rating, so we just need to delete.
    const sql = "DELETE FROM Review WHERE ReviewID = ?";
    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Database error" });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Review not found" });
        }
        res.status(200).json({ success: true, message: "Review deleted successfully." });
    });
};

// ... (all your existing functions, including deleteReview)

// --- (NEW) BOOKING MANAGEMENT FUNCTIONS ---

exports.searchBookings = (req, res) => {
    const user = req.session.user;
    const { term } = req.query; // Search term (ID, email, or phone)
    if (!user || !user?.isAdmin) return res.status(401).json({ message: "Not Authorized" });
    if (!term) return res.status(400).json({ message: "Search term is required." });

    // This query is complex. It searches for:
    // 1. A direct match on BookingID
    // 2. A match on a User's Email, then finds their bookings
    // 3. A match on a User's Phone, then finds their bookings
    // It ONLY returns 'Confirmed' (Status=2) bookings, as those are the only ones to cancel.
    const sql = `
        SELECT 
            b.BookingID, b.NumberOfSeats, b.Booking_Timestamp, b.Booking_Status,
            u.User_Name, u.Email, u.Phone,
            m.Title,
            ms.StartTime,
            c.Cinema_Name,
            ch.Hall_Name,
            (SELECT SUM(ss.Price) FROM Show_Seat ss WHERE ss.BookingID = b.BookingID) AS TotalPrice,
            (SELECT GROUP_CONCAT(cs.SeatName SEPARATOR ', ') FROM Show_Seat ss JOIN Cinema_Seat cs ON ss.CinemaSeatID = cs.CinemaSeatID WHERE ss.BookingID = b.BookingID) AS SeatNames
        FROM Booking b
        LEFT JOIN User u ON b.UserID = u.UserID
        JOIN Movie_Show ms ON b.ShowID = ms.ShowID
        JOIN Movie m ON ms.MovieID = m.MovieID
        JOIN Cinema_Hall ch ON ms.CinemaHallID = ch.CinemaHallID
        JOIN Cinema c ON ch.CinemaID = c.CinemaID
        WHERE 
            b.Booking_Status = 2 AND (
                b.BookingID = ? 
                OR u.Email = ? 
                OR u.Phone = ?
            )
        ORDER BY b.Booking_Timestamp DESC
    `;

    db.query(sql, [term, term, term], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: "Database error." });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "No 'Confirmed' bookings found matching that ID, email, or phone number." });
        }
        
        // We are renaming the result for clarity on the frontend
        res.status(200).json({ success: true, bookings: results });
    });
};

exports.cancelBooking = (req, res) => {
    const user = req.session.user;
    const { id } = req.params; // BookingID
    if (!user || !user?.isAdmin) return res.status(401).json({ message: "Not Authorized" });

    // Use a transaction to ensure both tables are updated or neither is
    db.getConnection((err, connection) => {
        if (err) return res.status(500).json({ message: "Database connection error." });

        connection.beginTransaction(err => {
            if (err) {
                connection.release();
                return res.status(500).json({ message: "Transaction start error." });
            }

            // 1. Check the booking status first
            connection.query('SELECT Booking_Status FROM Booking WHERE BookingID = ?', [id], (err, results) => {
                if (err) return connection.rollback(() => {
                    connection.release();
                    res.status(500).json({ message: "DB error checking status." });
                });

                if (results.length === 0) return connection.rollback(() => {
                    connection.release();
                    res.status(404).json({ message: "Booking not found." });
                });
                
                const currentStatus = results[0].Booking_Status;
                // Status 2 is 'Confirmed'
                if (currentStatus !== 2) {
                    return connection.rollback(() => {
                        connection.release();
                        res.status(400).json({ message: "Booking is not 'Confirmed' and cannot be cancelled." });
                    });
                }

                // 2. Update Booking table status (e.g., 3 = 'Cancelled by Admin')
                const bookingUpdateSql = "UPDATE Booking SET Booking_Status = 3 WHERE BookingID = ?";
                connection.query(bookingUpdateSql, [id], (err, result) => {
                    if (err) return connection.rollback(() => {
                        connection.release();
                        res.status(500).json({ message: "DB error updating Booking." });
                    });

                    // 3. Update Show_Seat table to free up the seats
                    const seatsUpdateSql = "UPDATE Show_Seat SET Seat_Status = 0, BookingID = NULL WHERE BookingID = ?";
                    connection.query(seatsUpdateSql, [id], (err, result) => {
                        if (err) return connection.rollback(() => {
                            connection.release();
                            res.status(500).json({ message: "DB error updating Show_Seat." });
                        });

                        // 4. Commit the transaction
                        connection.commit(err => {
                            if (err) return connection.rollback(() => {
                                connection.release();
                                res.status(500).json({ message: "Transaction commit error." });
                            });

                            connection.release();
                            res.status(200).json({ success: true, message: "Booking successfully cancelled." });
                        });
                    });
                });
            });
        });
    });
};

// ... (all your existing functions, including cancelBooking)

// --- (NEW) ANALYTICS FUNCTIONS ---

exports.getDashboardKPIs = async (req, res) => {
    const user = req.session.user;
    if (!user || !user?.isAdmin) return res.status(401).json({ message: "Not Authorized" });

    // Define time ranges
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date();
    todayEnd.setHours(23, 59, 59, 999);

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay()); // Start of current week (Sunday)
    weekStart.setHours(0, 0, 0, 0);

    const monthStart = new Date();
    monthStart.setDate(1); // Start of current month
    monthStart.setHours(0, 0, 0, 0);

    try {
        const [
            revenueTodayResult,
            revenueWeekResult,
            revenueMonthResult,
            bookingsTodayResult,
            occupancyResult,
            topMovieResult,
            topTheaterResult
        ] = await Promise.all([
            // 1. Revenue Today
            db.promise().query(
                `SELECT SUM(Amount) as total FROM Payment WHERE Payment_Timestamp >= ? AND Payment_Timestamp <= ?`,
                [todayStart, todayEnd]
            ),
            // 2. Revenue This Week
            db.promise().query(
                `SELECT SUM(Amount) as total FROM Payment WHERE Payment_Timestamp >= ?`,
                [weekStart]
            ),
            // 3. Revenue This Month
            db.promise().query(
                `SELECT SUM(Amount) as total FROM Payment WHERE Payment_Timestamp >= ?`,
                [monthStart]
            ),
            // 4. Bookings Today
            db.promise().query(
                `SELECT COUNT(BookingID) as count FROM Booking WHERE Booking_Timestamp >= ? AND Booking_Timestamp <= ? AND Booking_Status = 2`,
                [todayStart, todayEnd]
            ),
            // 5. Average Occupancy (approximate for recent shows)
            // This is complex. We'll simplify: % of booked seats in shows started in the last 7 days.
            db.promise().query(`
                SELECT AVG(booked_seats / total_seats) * 100 AS avg_occupancy
                FROM (
                    SELECT 
                        ms.ShowID,
                        (SELECT COUNT(*) FROM Cinema_Seat cs WHERE cs.CinemaHallID = ms.CinemaHallID) AS total_seats,
                        COUNT(ss.ShowSeatID) AS booked_seats
                    FROM Movie_Show ms
                    JOIN Show_Seat ss ON ms.ShowID = ss.ShowID
                    WHERE ms.StartTime >= DATE_SUB(NOW(), INTERVAL 7 DAY) AND ss.BookingID IS NOT NULL
                    GROUP BY ms.ShowID
                ) AS ShowOccupancy;
            `),
            // 6. Top Movie (Revenue, This Week)
            db.promise().query(`
                SELECT m.Title, SUM(p.Amount) as totalRevenue
                FROM Payment p
                JOIN Booking b ON p.BookingID = b.BookingID
                JOIN Movie_Show ms ON b.ShowID = ms.ShowID
                JOIN Movie m ON ms.MovieID = m.MovieID
                WHERE p.Payment_Timestamp >= ?
                GROUP BY m.MovieID, m.Title
                ORDER BY totalRevenue DESC
                LIMIT 1
            `, [weekStart]),
            // 7. Top Theater (Revenue, This Week)
            db.promise().query(`
                SELECT c.Cinema_Name, SUM(p.Amount) as totalRevenue
                FROM Payment p
                JOIN Booking b ON p.BookingID = b.BookingID
                JOIN Movie_Show ms ON b.ShowID = ms.ShowID
                JOIN Cinema_Hall ch ON ms.CinemaHallID = ch.CinemaHallID
                JOIN Cinema c ON ch.CinemaID = c.CinemaID
                WHERE p.Payment_Timestamp >= ?
                GROUP BY c.CinemaID, c.Cinema_Name
                ORDER BY totalRevenue DESC
                LIMIT 1
            `, [weekStart]),
        ]);

        res.status(200).json({
            success: true,
            kpis: {
                revenueToday: revenueTodayResult[0][0].total || 0,
                revenueWeek: revenueWeekResult[0][0].total || 0,
                revenueMonth: revenueMonthResult[0][0].total || 0,
                bookingsToday: bookingsTodayResult[0][0].count || 0,
                averageOccupancy: occupancyResult[0][0].avg_occupancy || 0,
                topMovieWeek: topMovieResult[0][0] || { Title: 'N/A', totalRevenue: 0 },
                topTheaterWeek: topTheaterResult[0][0] || { Cinema_Name: 'N/A', totalRevenue: 0 }
            }
        });

    } catch (err) {
        console.error("Error fetching KPIs:", err);
        res.status(500).json({ message: "Database error fetching dashboard KPIs." });
    }
};

// ... (after getDashboardKPIs)

// --- (NEW) DETAILED REPORT FUNCTIONS ---

exports.getRevenueOverTime = async (req, res) => {
    const user = req.session.user;
    if (!user || !user?.isAdmin) return res.status(401).json({ message: "Not Authorized" });

    // Get date range (default to last 30 days if not provided)
    const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();
    const startDate = req.query.startDate ? new Date(req.query.startDate) : new Date(new Date().setDate(endDate.getDate() - 30));
    endDate.setHours(23, 59, 59, 999); // Ensure end date includes the whole day
    startDate.setHours(0, 0, 0, 0);   // Ensure start date includes the whole day

    const sql = `
        SELECT 
            DATE(Payment_Timestamp) as date, 
            SUM(Amount) as dailyRevenue
        FROM Payment
        WHERE Payment_Timestamp >= ? AND Payment_Timestamp <= ?
        GROUP BY DATE(Payment_Timestamp)
        ORDER BY date ASC;
    `;

    try {
        const [results] = await db.promise().query(sql, [startDate, endDate]);
        res.status(200).json({ success: true, revenueData: results });
    } catch (err) {
        console.error("Error fetching revenue over time:", err);
        res.status(500).json({ message: "Database error fetching revenue data." });
    }
};

exports.getRevenueByMovie = async (req, res) => {
    const user = req.session.user;
    if (!user || !user?.isAdmin) return res.status(401).json({ message: "Not Authorized" });

    const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();
    const startDate = req.query.startDate ? new Date(req.query.startDate) : new Date(new Date().setDate(endDate.getDate() - 30));
    endDate.setHours(23, 59, 59, 999);
    startDate.setHours(0, 0, 0, 0);

    const sql = `
        SELECT 
            m.Title, 
            SUM(p.Amount) as totalRevenue
        FROM Payment p
        JOIN Booking b ON p.BookingID = b.BookingID
        JOIN Movie_Show ms ON b.ShowID = ms.ShowID
        JOIN Movie m ON ms.MovieID = m.MovieID
        WHERE p.Payment_Timestamp >= ? AND p.Payment_Timestamp <= ?
        GROUP BY m.MovieID, m.Title
        ORDER BY totalRevenue DESC
        LIMIT 15; -- Limit to top 15 for chart readability
    `;

    try {
        const [results] = await db.promise().query(sql, [startDate, endDate]);
        res.status(200).json({ success: true, movieRevenue: results });
    } catch (err) {
        console.error("Error fetching revenue by movie:", err);
        res.status(500).json({ message: "Database error fetching movie revenue data." });
    }
};

exports.getRevenueByTheater = async (req, res) => {
    const user = req.session.user;
    if (!user || !user?.isAdmin) return res.status(401).json({ message: "Not Authorized" });

    const endDate = req.query.endDate ? new Date(req.query.endDate) : new Date();
    const startDate = req.query.startDate ? new Date(req.query.startDate) : new Date(new Date().setDate(endDate.getDate() - 30));
    endDate.setHours(23, 59, 59, 999);
    startDate.setHours(0, 0, 0, 0);

    const sql = `
        SELECT 
            c.Cinema_Name, 
            SUM(p.Amount) as totalRevenue
        FROM Payment p
        JOIN Booking b ON p.BookingID = b.BookingID
        JOIN Movie_Show ms ON b.ShowID = ms.ShowID
        JOIN Cinema_Hall ch ON ms.CinemaHallID = ch.CinemaHallID
        JOIN Cinema c ON ch.CinemaID = c.CinemaID
        WHERE p.Payment_Timestamp >= ? AND p.Payment_Timestamp <= ?
        GROUP BY c.CinemaID, c.Cinema_Name
        ORDER BY totalRevenue DESC
        LIMIT 15; -- Limit to top 15
    `;

    try {
        const [results] = await db.promise().query(sql, [startDate, endDate]);
        res.status(200).json({ success: true, theaterRevenue: results });
    } catch (err) {
        console.error("Error fetching revenue by theater:", err);
        res.status(500).json({ message: "Database error fetching theater revenue data." });
    }
};

// ... (existing User/Booking/Review functions)