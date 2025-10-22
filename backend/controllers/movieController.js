const movieModel = require('../models/movieModel');
const showModel = require('../models/showModel');
const { db } = require('../config/db');


const handleExplore = async(req,res) => {
    try{
        const {city, language, genre, format, theater, showDate, movie } = req.query;
        if (movie) {
            movieModel.getMovieDetails(movie, (err, details) => {
                if (err) {
                    return res.status(500).json({ error: "Failed to fetch movie details" });
                }
                return res.json(details);
            });
        }
        else if (theater && showDate) {
            movieModel.getMoviesByTheaterAndDate(theater, showDate, (err, movies) => {
                if (err) {
                    return res.status(500).json({ error: "Failed to fetch movies" });
                }

                //return res.status(201).json(movies);

                showModel.fetchShowsByTheaterAndDate(theater, showDate, (err2, shows) => {
                    if (err2) {
                        return res.status(500).json({ error: "Failed to fetch shows" });
                    }
                    const merged = movies.map(m => ({
                        ...m,
                        shows: shows.filter(s => s.MovieID === m.MovieID)
                    }));

                    return res.status(201).json(merged);
                });
            });
        }

        else if (city) {
        movieModel.getMoviesByCity(city, { language, genre, format }, (err, movies) => {
            if (err) {
            console.error(err);
            return res.status(500).json({ error: "Internal server error" });

            }
            return res.json(movies);
        });
        } else {
        return res.status(400).json({ error: "Invalid query params" });
        }

    }catch(err){
        console.error(err);
        res.status(500).json({error: "server error"});
    }
}

const getCities = (req, res) => {
  const sql = "SELECT CityID, City_Name, City_State, ZipCode FROM City ORDER BY City_Name ASC";

  db.query(sql, (err, results) => {
    if (err) {
      console.error("Error fetching cities:", err);
      return res.status(500).json({ error: "Database error" });
    }

    // send clean structured data
    const cities = results.map(r => ({
      id: r.CityID,
      name: r.City_Name,
      state: r.City_State,
      zipcode: r.ZipCode
    }));

    res.json(cities);
  });
};

const getMoviesBySearch=(req,res)=>{
    const {searchString}=req.query;
    let movieResult=[];
    let cinemaResult=[]
    if(!searchString.trim())return res.status(400).json({message:"Invalid query"});

    db.query('SELECT MovieID,Title from Movie where lower(Title) LIKE ? ',[`%${searchString.toLowerCase()}%`],(err,movie)=>{
        if(err){
            console.log(err);
            return res.status(500).json({message:"Db Error"});
        }

        movieResult=movie;
        

        db.query('SELECT CinemaID,Cinema_Name from Cinema where lower(Cinema_Name) LIKE ?',[`%${searchString.toLowerCase()}%`],(err,cinema)=>{
            if(err){
                console.log(err);
                return res.status(500).json({message:"Db Error"});
            }

            cinemaResult=cinema;
            const combined=[...movieResult,...cinemaResult];
            return res.status(200).json({movies:combined});
        })

       

    })
}
module.exports = { handleExplore , getCities,getMoviesBySearch};