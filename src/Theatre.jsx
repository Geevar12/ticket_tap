import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Theatre = ({ theatreName, showtimes, seatPrices, price, movieId, movieName, bookedSeats: bookedSeatsFromDb }) => {
  const [selectedShowtime, setSelectedShowtime] = useState(showtimes[0] || '');
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [selectedSeatType, setSelectedSeatType] = useState(seatPrices && seatPrices.length > 0 ? seatPrices[0].type : '');
  const [seatTypePrice, setSeatTypePrice] = useState(seatPrices && seatPrices.length > 0 ? seatPrices[0].price : price);

  // Persist booked seats per theatre+showtime+movie for the session
  const bookedSeatsMapRef = useRef({});
  const navigate = useNavigate();

  useEffect(() => {
    // Reset seats when showtime or theatre changes
    setSelectedSeats([]);
  }, [selectedShowtime, theatreName, movieId]);

  useEffect(() => {
    if (seatPrices && seatPrices.length > 0) {
      const seatTypeObj = seatPrices.find(sp => sp.type === selectedSeatType);
      setSeatTypePrice(seatTypeObj ? seatTypeObj.price : price);
    }
  }, [selectedSeatType, seatPrices, price]);

  // Generate seat layout (10 rows, 10 seats each)
  const generateSeats = () => {
    const seats = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    for (let row of rows) {
      for (let seat = 1; seat <= 10; seat++) {
        const seatId = `${row}${seat}`;
        seats.push({
          id: seatId,
          row,
          number: seat,
          isBooked: false,
          isSelected: selectedSeats.includes(seatId)
        });
      }
    }
    // Use bookedSeats from DB if available
    let bookedSeatsArr = [];
    if (Array.isArray(bookedSeatsFromDb)) {
      bookedSeatsArr = bookedSeatsFromDb;
    } else {
      // Only generate booked seats once per movie+theatre+showtime per session (fallback)
      const key = `${movieId}_${theatreName}_${selectedShowtime}`;
      if (!bookedSeatsMapRef.current[key]) {
        const totalSeats = seats.length;
        const bookedCount = 10;
        const bookedIndexes = new Set();
        while (bookedIndexes.size < bookedCount) {
          bookedIndexes.add(Math.floor(Math.random() * totalSeats));
        }
        bookedSeatsMapRef.current[key] = Array.from(bookedIndexes).map(idx => seats[idx].id);
      }
      bookedSeatsArr = bookedSeatsMapRef.current[`${movieId}_${theatreName}_${selectedShowtime}`];
    }
    // Mark the seats as booked
    seats.forEach(seat => {
      if (bookedSeatsArr && bookedSeatsArr.includes(seat.id)) {
        seat.isBooked = true;
      }
    });
    return seats;
  };

  const seats = generateSeats();
  const totalPrice = selectedSeats.length * (seatTypePrice || price || 0);

  const handleSeatClick = (seatId) => {
    const seat = seats.find(s => s.id === seatId);
    if (!seat || seat.isBooked) return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleProceed = () => {
    navigate('/booking/payment', {
      state: {
        theatreName,
        showtime: selectedShowtime,
        seatType: selectedSeatType,
        seatTypePrice,
        selectedSeats,
        totalPrice,
        movieName,
        movieId, // this is usually id or _id
        _id: movieId // ensure _id is passed for MongoDB
      }
    });
  };

  return (
    <div className="theatre-block" style={{marginBottom: 40, background: '#fff', borderRadius: 10, boxShadow: '0 2px 12px rgba(0,0,0,0.07)', padding: 24}}>
      <h2 style={{marginBottom: 10}}>{theatreName}</h2>
      <div style={{marginBottom: 14}}>
        <label htmlFor="showtime" style={{fontWeight: 500, marginRight: 8}}>Showtime:</label>
        <select
          id="showtime"
          value={selectedShowtime}
          onChange={e => setSelectedShowtime(e.target.value)}
          style={{padding: '6px 14px', borderRadius: 6, border: '1px solid #ccc', fontSize: 16}}
        >
          {showtimes.map((time, idx) => (
            <option key={idx} value={time}>{time}</option>
          ))}
        </select>
      </div>
      {seatPrices && seatPrices.length > 0 ? (
        <div className="seat-type-selector" style={{marginBottom: 10}}>
          <label htmlFor="seatType" style={{fontWeight: 500, marginRight: 8}}>Seat Type:</label>
          <select
            id="seatType"
            value={selectedSeatType}
            onChange={e => setSelectedSeatType(e.target.value)}
            style={{padding: '6px 14px', borderRadius: 6, border: '1px solid #ccc', fontSize: 16}}
          >
            {seatPrices.map(sp => (
              <option key={sp.type} value={sp.type}>
                {sp.type} (₹{sp.price})
              </option>
            ))}
          </select>
          <span className="price" style={{marginLeft: 16, color: '#2d7a2d', fontWeight: 600}}>
            ₹{seatTypePrice} per ticket
          </span>
        </div>
      ) : (
        <p className="price" style={{color: '#2d7a2d', fontWeight: 600}}>₹{price} per ticket</p>
      )}

      <div className="seat-selection" style={{marginTop: 18}}>
        <div className="seat-legend" style={{display: 'flex', gap: 24, marginBottom: 18}}>
          <div className="legend-item" style={{display: 'flex', alignItems: 'center', gap: 6}}>
            <div className="seat available" style={{width: 22, height: 22, background: '#eaf1fb', borderRadius: 4, border: '1.5px solid #1a4fa3'}}></div>
            <span style={{fontSize: 15, color: '#23272f'}}>Available</span>
          </div>
          <div className="legend-item" style={{display: 'flex', alignItems: 'center', gap: 6}}>
            <div className="seat selected" style={{width: 22, height: 22, background: '#2d7a2d', borderRadius: 4, border: '1.5px solid #2d7a2d'}}></div>
            <span style={{fontSize: 15, color: '#23272f'}}>Selected</span>
          </div>
          <div className="legend-item" style={{display: 'flex', alignItems: 'center', gap: 6}}>
            <div className="seat booked" style={{width: 22, height: 22, background: '#e74c3c', borderRadius: 4, border: '1.5px solid #e74c3c'}}></div>
            <span style={{fontSize: 15, color: '#23272f'}}>Booked</span>
          </div>
        </div>
        <div className="screen" style={{
          background: '#eaf1fb',
          borderRadius: 8,
          textAlign: 'center',
          padding: '8px 0',
          marginBottom: 18,
          fontWeight: 600,
          color: '#1a4fa3',
          letterSpacing: 2
        }}>
          <div className="screen-text">SCREEN</div>
        </div>
        <div className="seat-grid" style={{display: 'flex', flexDirection: 'column', gap: 8}}>
          {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].map(row => (
            <div key={row} className="seat-row" style={{display: 'flex', alignItems: 'center', gap: 8}}>
              <div className="row-label" style={{width: 22, fontWeight: 500}}>{row}</div>
              <div className="row-seats" style={{display: 'flex', gap: 8}}>
                {seats
                  .filter(seat => seat.row === row)
                  .map(seat => (
                    <div
                      key={seat.id}
                      className={`seat ${
                        seat.isBooked ? 'booked' :
                        seat.isSelected ? 'selected' : 'available'
                      }`}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 6,
                        background: seat.isBooked
                          ? '#e74c3c'
                          : seat.isSelected
                            ? '#2d7a2d'
                            : '#eaf1fb',
                        color: seat.isBooked || seat.isSelected ? '#fff' : '#1a4fa3',
                        border: seat.isBooked
                          ? '2px solid #e74c3c'
                          : seat.isSelected
                            ? '2px solid #2d7a2d'
                            : '2px solid #1a4fa3',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 600,
                        fontSize: 15,
                        cursor: seat.isBooked ? 'not-allowed' : 'pointer',
                        transition: 'background 0.2s, border 0.2s'
                      }}
                      onClick={() => handleSeatClick(seat.id)}
                    >
                      {seat.number}
                    </div>
                  ))
                }
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="booking-summary" style={{
        background: '#f7f8fa',
        borderRadius: 10,
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
        padding: 18,
        marginTop: 24,
        maxWidth: 340
      }}>
        <h3 style={{fontSize: 18, marginBottom: 12, color: '#23272f'}}>Booking Summary</h3>
        <div className="summary-item" style={{marginBottom: 8, display: 'flex', justifyContent: 'space-between'}}>
          <span>Selected Seats:</span>
          <span style={{fontWeight: 500}}>{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</span>
        </div>
        <div className="summary-item" style={{marginBottom: 8, display: 'flex', justifyContent: 'space-between'}}>
          <span>Number of Tickets:</span>
          <span style={{fontWeight: 500}}>{selectedSeats.length}</span>
        </div>
        <div className="summary-item total" style={{marginBottom: 12, display: 'flex', justifyContent: 'space-between', fontWeight: 600}}>
          <span>Total Amount:</span>
          <span style={{color: '#2d7a2d'}}>₹{totalPrice}</span>
        </div>
        <button
          className={`btn btn-primary proceed-btn ${selectedSeats.length === 0 ? 'disabled' : ''}`}
          disabled={selectedSeats.length === 0}
          style={{
            width: '100%',
            padding: '10px 0',
            fontSize: 16,
            fontWeight: 600,
            background: selectedSeats.length === 0 ? '#ccc' : '#1a4fa3',
            color: '#fff',
            border: 'none',
            borderRadius: 8,
            cursor: selectedSeats.length === 0 ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s'
          }}
          onClick={handleProceed}
        >
          Proceed to Pay
        </button>
      </div>
    </div>
  );
};

export default Theatre;
