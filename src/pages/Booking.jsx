import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
// import { movies, events } from '../data/mockData';
import './Booking.css';

const Booking = () => {
  const { type, id } = useParams();
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [item, setItem] = useState(null);
  const [selectedSeatType, setSelectedSeatType] = useState('');
  const [seatTypePrice, setSeatTypePrice] = useState(0);

  // Persist booked seats per movie for the session
  const bookedSeatsMapRef = useRef({});

  useEffect(() => {
    if (type === 'movie') {
      fetch('http://localhost:3001/api/movies')
        .then(res => res.json())
        .then(data => {
          const found = data.find(
            m => m._id === id || m.id?.toString() === id
          );
          setItem(found || null);
          // Set default seat type if available
          if (found && found.seatPrices && found.seatPrices.length > 0) {
            setSelectedSeatType(found.seatPrices[0].type);
            setSeatTypePrice(found.seatPrices[0].price);
          }
        })
        .catch(() => setItem(null));
    } else {
      setItem(null); // You can implement event fetching if needed
    }
    setSelectedSeats([]); // Reset selected seats when movie changes
  }, [type, id]);

  useEffect(() => {
    if (item && item.seatPrices && item.seatPrices.length > 0) {
      const seatTypeObj = item.seatPrices.find(sp => sp.type === selectedSeatType);
      setSeatTypePrice(seatTypeObj ? seatTypeObj.price : 0);
    }
  }, [selectedSeatType, item]);

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
    // Only generate booked seats once per movie per session
    if (item) {
      const movieKey = item._id || item.id;
      if (!bookedSeatsMapRef.current[movieKey]) {
        const totalSeats = seats.length;
        const bookedCount = 10;
        const bookedIndexes = new Set();
        while (bookedIndexes.size < bookedCount) {
          bookedIndexes.add(Math.floor(Math.random() * totalSeats));
        }
        bookedSeatsMapRef.current[movieKey] = Array.from(bookedIndexes).map(idx => seats[idx].id);
      }
      // Mark the seats as booked
      seats.forEach(seat => {
        if (bookedSeatsMapRef.current[movieKey].includes(seat.id)) {
          seat.isBooked = true;
        }
      });
    }
    return seats;
  };

  const seats = generateSeats();
  const totalPrice = selectedSeats.length * (seatTypePrice || item?.price || 0);

  const handleSeatClick = (seatId) => {
    const seat = seats.find(s => s.id === seatId);
    if (!seat || seat.isBooked) return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  if (!item) {
    return <div className="container">Item not found</div>;
  }

  return (
    <div className="booking">
      <div className="container">
        <div className="booking-header">
          <div className="item-info">
            <img src={item.poster} alt={item.title} className="item-poster" />
            <div className="item-details">
              <h1>{item.title}</h1>
              <p>{type === 'movie' ? item.genre : `${item.date} • ${item.venue}`}</p>
              {/* Seat type selector */}
              {item.seatPrices && item.seatPrices.length > 0 ? (
                <div className="seat-type-selector">
                  <label htmlFor="seatType">Seat Type:</label>
                  <select
                    id="seatType"
                    value={selectedSeatType}
                    onChange={e => setSelectedSeatType(e.target.value)}
                  >
                    {item.seatPrices.map(sp => (
                      <option key={sp.type} value={sp.type}>
                        {sp.type} (₹{sp.price})
                      </option>
                    ))}
                  </select>
                  <span className="price">₹{seatTypePrice} per ticket</span>
                </div>
              ) : (
                <p className="price">₹{item.price} per ticket</p>
              )}
            </div>
          </div>
        </div>

        <div className="booking-content">
          <div className="seat-selection">
            <h2>Select Your Seats</h2>
            
            <div className="seat-legend">
              <div className="legend-item">
                <div className="seat available"></div>
                <span>Available</span>
              </div>
              <div className="legend-item">
                <div className="seat selected"></div>
                <span>Selected</span>
              </div>
              <div className="legend-item">
                <div className="seat booked"></div>
                <span>Booked</span>
              </div>
            </div>

            <div className="screen">
              <div className="screen-text">SCREEN</div>
            </div>

            <div className="seat-grid">
              {['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'].map(row => (
                <div key={row} className="seat-row">
                  <div className="row-label">{row}</div>
                  <div className="row-seats">
                    {seats
                      .filter(seat => seat.row === row)
                      .map(seat => (
                        <div
                          key={seat.id}
                          className={`seat ${
                            seat.isBooked ? 'booked' : 
                            seat.isSelected ? 'selected' : 'available'
                          }`}
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

          <div className="booking-summary">
            <h3>Booking Summary</h3>
            <div className="summary-item">
              <span>Selected Seats:</span>
              <span>{selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</span>
            </div>
            <div className="summary-item">
              <span>Number of Tickets:</span>
              <span>{selectedSeats.length}</span>
            </div>
            <div className="summary-item total">
              <span>Total Amount:</span>
              <span>₹{totalPrice}</span>
            </div>
            
            <button 
              className={`btn btn-primary proceed-btn ${selectedSeats.length === 0 ? 'disabled' : ''}`}
              disabled={selectedSeats.length === 0}
            >
              Proceed to Pay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
