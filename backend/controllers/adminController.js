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
    const {name,totalHalls,cityId}=req.body;

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
        const sql='INSERT INTO cinema values(?,?,?,?)'
        db.query(sql,[newCinemaId,name.trim(),totalHalls,cityId],(err,result)=>{
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
  const isAdmin=req.session.user.isAdmin
  if(!user || !isAdmin)return res.status(400).json({message:"Not Authorized"});

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