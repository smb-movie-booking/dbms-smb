const adminModel = require('../models/adminModel');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const { db } = require('../config/db');
require('dotenv').config();


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

exports.createNewCity=(req,res)=>{
  try {
    const user=req.session.user;
    const isAdmin=req.session.user.isAdmin
    const {cityName,stateName,zip}=req.body;
    if(!user || !isAdmin)return res.status(400).json({message:"Not Authorized"});

    adminModel.findCityByName(cityName,(err,result)=>{
      if(err){
        return res.status(400).json({message:"Database Error"})
      }
      if(result){
        return res.status(400).json({message:"City already exists"})
      }
      adminModel.addCity(cityName,stateName,zip,(err,result)=>{
        if(err){
        return res.status(400).json({message:"Database Error"})
        }

        if(result?.inserted){
          console.log(result);
          return res.status(200).json({message:"city added",id:result?.cityId});
        }
        return res.status(400).json({message:"Couldnot add city"})
      })
    })

  } catch (error) {
    
  }
}

exports.getAllCities=(req,res)=>{
  const user=req.session.user;
  const isAdmin=req.session.user.isAdmin
  if(!user || !isAdmin)return res.status(400).json({message:"Not Authorized"});

  db.query('select * from city',(err,results)=>{
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

    db.query('DELETE FROM city WHERE CityID=?',[id],(err,result)=>{
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
    const {name,totalHalls,cityId,facilities,cancellationAllowed}=req.body;

    if(!user || !user?.isAdmin)return res.status(400).json({message:"Unauthorized"});

    if(!name.trim())return res.status(400).json({message:"Cinema name is required"});
    if(!cityId) return res.status(400).json({message:"Please choose a city"});
    if(!totalHalls)return res.status(400).json({message:"Give no of halls"});

    adminModel.findCityById(cityId,(err,city)=>{
      if(err){
        console.log(err);
        return res.status(401).json({message:"DB Error"});
      }
      if(!city)return res.status(401).json({message:"City doesn't exist"});

      db.query('SELECT MAX(CinemaID) as maxid from cinema',(err,result)=>{
        if(err){
          console.log(err);
          return res.status(500).json({ message: "DB Error" });
        }
        const newCinemaId = (result[0].maxid || 0) + 1 ;
        const sql='INSERT INTO cinema(CinemaID,Cinema_Name,TotalCinemaHalls,CityID,Facilities,Cancellation_Allowed) values(?,?,?,?,?,?)'
        db.query(sql,[newCinemaId,name.trim(),totalHalls,cityId,facilities,cancellationAllowed],(err,result)=>{
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

  db.query('select * from cinema',(err,results)=>{
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

    db.query('DELETE FROM cinema WHERE CinemaID=?',[id],(err,result)=>{
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



exports.addNewCinemaHall=(req,res)=>{
    const user=req.session.user;
    const {hallName,totalSeats,cinemaId}=req.body;
    //console.log(cinemaid)

    if(!user || !user?.isAdmin)return res.status(400).json({message:"Unauthorized"});

    if(!hallName.trim())return res.status(400).json({message:"hallName is required"});
    if(!cinemaId) return res.status(400).json({message:"Please choose a cinemas"});
    if(!totalSeats)return res.status(400).json({message:"Give no of seats"});

    adminModel.findCinemaById(cinemaId,(err,cinema)=>{
      if(err){
        console.log(err);
        return res.status(401).json({message:"DB Error"});
      }
      if(!cinema)return res.status(401).json({message:"Cinema doesn't exist"});

      //if(cinema?. TotalCinemaHalls)  

        db.query('SELECT count(*) as count from cinema_hall where CinemaID=?',[cinemaId],(err,result)=>{
          if(err){
            console.log(err);
            return res.status(500).json({ message: "DB Error" });
          }
          if(result){
            const currentHalls=result[0].count;
            if(currentHalls >= cinema?.TotalCinemaHalls)return res.status(401).json({message:"Hall Limit for the Theatre Reached"});


            adminModel.findCinemaHallByName(hallName,cinemaId,(err,existing)=>{
              if(err){
                console.log(err);
                return res.status(500).json({ message: "DB Error" });
              }
              if(existing)return res.status(401).json({message:"Screen already exists"});

              db.query('SELECT MAX(CinemaHallID) as maxid from cinema_hall',(err,result)=>{
              if(err){
                console.log(err);
                return res.status(500).json({ message: "DB Error" });
              }
              const newCinemaHallId = (result[0].maxid || 0) + 1 ;
              const sql='INSERT INTO cinema_hall(CinemaHallID,Hall_Name,TotalSeats,CinemaID) values(?,?,?,?)'
              db.query(sql,[newCinemaHallId,hallName.trim().toLowerCase(),totalSeats,cinemaId],(err,result)=>{
                if(err){
                  console.log(err);
                  return res.status(500).json({error:"DB Error"});
                }
                console.log(result);
                return res.status(201).json({success:true,message:"Hall added successfully"});
              })

            })

            })

           
          }
        })

      

      
    })


}

exports.getAllCinemaHalls=(req,res)=>{
  const user=req.session.user;
  if(!user || !user?.isAdmin)return res.status(400).json({message:"Not Authorized"});

  db.query('select * from cinema_hall',(err,results)=>{
    if(err)return res.status(400).json({error:err});

    if(results)return res.status(200).json({success:true,halls:results.length>0?results:[]})

    
  })
}


exports.addSeats = (req, res) => {
  const user = req.session.user;
  const { hallId, seatCount, seatType } = req.body;

  if (!user || !user?.isAdmin)
    return res.status(400).json({ message: "Unauthorized" });

  // 1) check if cinemaHall exists
  adminModel.findCinemaHallById(hallId, (err, hall) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: "DB Error" });
    }

    if (!hall) return res.status(400).json({ message: "Hall doesn't exist" });

    // 2) get currently occupied seats
    adminModel.getOccupiedSeats(hallId, (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "DB Error" });
      }

      const totalOccupied = Number(result.total_occupied) || 0;

      // 3) check if row exists for this seat_type
      const sqlCheck =
        "SELECT * FROM cinema_seat WHERE CinemaHallID=? AND Seat_Type=?";
      db.query(sqlCheck, [hallId, seatType], (err, rows) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ message: "DB Error" });
        }

        if (rows.length > 0) {
          // ✅ Row exists → update (override value)
          const oldSeatCount = Number(rows[0].SeatNumber);

          // recalc occupied seats: remove old, add new
          const newTotal = totalOccupied - oldSeatCount + Number(seatCount);

          if (newTotal > hall.TotalSeats)
            return res
              .status(401)
              .json({ message: "Couldn't update, Seat limit will be exceeded" });

          const sqlUpdate =
            "UPDATE cinema_seat SET SeatNumber=? WHERE CinemaHallID=? AND Seat_Type=?";
          db.query(sqlUpdate, [seatCount, hallId, seatType], (err, result) => {
            if (err) {
              console.log(err);
              return res.status(500).json({ message: "DB Error" });
            }
            return res
              .status(200)
              .json({ success: true, message: "Seats updated successfully" });
          });
        } else {
          // ✅ No row → insert new
          if (totalOccupied + Number(seatCount) > hall.TotalSeats)
            return res
              .status(401)
              .json({ message: "Couldn't add, Seat limit will be exceeded" });

          db.query(
            "SELECT MAX(CinemaSeatID) as maxid from cinema_seat",
            (err, results) => {
              if (err) {
                console.log(err);
                return res.status(500).json({ message: "DB Error" });
              }

              const newID = (results[0].maxid || 0) + 1;

              const sql =
                "INSERT INTO cinema_seat (CinemaSeatID,SeatNumber,Seat_Type,CinemaHallID) values(?,?,?,?)";
              db.query(
                sql,
                [newID, seatCount, seatType, hallId],
                (err, result) => {
                  if (err) {
                    console.log(err);
                    return res.status(500).json({ message: "DB Error" });
                  }
                  return res.status(201).json({
                    success: true,
                    message: "Seats added successfully",
                  });
                }
              );
            }
          );
        }
      });
    });
  });
};

