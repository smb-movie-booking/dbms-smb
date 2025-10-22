const seatModel = require('../models/seatModel');

exports.getSeatsByShowId = async (req, res) => {
  const showId = req.params.showid;
  

  try {
    const seatsSelected = await seatModel.fetchSeatsByShowId(showId);
    //console.log(seats);

 
  if (!seatsSelected || seatsSelected.length === 0) return {};

  // Group seats by type
  const seatTypeMap = {};

  seatsSelected.forEach(seat => {
    const type = seat.seatType;
    if (!seatTypeMap[type]) seatTypeMap[type] = {price:seat.price,arr:[]};
    seatTypeMap[type].arr.push({
      seatId: seat.seatId,
      seatStatus: seat.status,
      seatName: seat.seatName // use 'seatName' as per your required format
    });
  });

  // Assemble the final response
  const seats = Object.keys(seatTypeMap).map(type => ({
    type: type,
    price:seatTypeMap[type].price,
    count: seatTypeMap[type].arr.length,
    value: seatTypeMap[type].arr
  }));

  console.log(seats);

  const response= {
    showid: seatsSelected[0].ShowID,
    movieid: seatsSelected[0].MovieID,
    showDate:seatsSelected[0].showDate,
    startTime:seatsSelected[0].startTime,
    title: seatsSelected[0].Title,
    cinema:seatsSelected[0].Cinema_Name,
    seats: seats
  };


// Usage
// let result = transformRowsToGroupedSeats(yourDataArray);
// console.log(result);


  return res.status(200).json(response);
  } catch (error) {
    console.error('❌ Error fetching seats:', error);
    res.status(500).json({ error: 'Failed to retrieve seats' });
  }
};
