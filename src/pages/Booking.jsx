import { useState, useEffect } from "react";
import { db } from "../firebase";
import { addDoc, collection, getDocs, query, where } from "firebase/firestore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Container,
  Typography,
  Button,
  Grid,
  TextField,
  Paper,
  Box,
  Alert,
} from "@mui/material";

const Booking = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [time, setTime] = useState("");
  const [participants, setParticipants] = useState(1);
  const [maxParticipants, setMaxParticipants] = useState(10);
  const [availableTimes, setAvailableTimes] = useState([]);
  const [existingReservations, setExistingReservations] = useState([]);
  const [message, setMessage] = useState("");

  const formattedDate = selectedDate.toISOString().split("T")[0];

  // Fetch existing reservations for the selected date
  useEffect(() => {
    const fetchExistingReservations = async () => {
      const reservationsRef = collection(db, "reservations");
      const q = query(reservationsRef, where("date", "==", formattedDate));
      const querySnapshot = await getDocs(q);
      const reservations = querySnapshot.docs.map((doc) => doc.data());
      setExistingReservations(reservations);
    };

    fetchExistingReservations();
  }, [formattedDate]);

  // Generate available times
  useEffect(() => {
    const generateAvailableTimes = () => {
      const allTimes = [
        { label: "10:00 AM - 11:00 AM", value: "10:00 AM - 11:00 AM" },
        { label: "11:00 AM - 12:00 PM", value: "11:00 AM - 12:00 PM" },
        { label: "12:00 PM - 1:00 PM", value: "12:00 PM - 1:00 PM" },
        { label: "1:00 PM - 2:00 PM", value: "1:00 PM - 2:00 PM" },
        { label: "2:00 PM - 3:00 PM", value: "2:00 PM - 3:00 PM" },
      ];

      // Filter out times that are already reserved
      const reservedTimes = existingReservations.map((reservation) => reservation.time);
      const availableTimes = allTimes.filter((timeSlot) => !reservedTimes.includes(timeSlot.value));

      setAvailableTimes(availableTimes);
    };

    generateAvailableTimes();
  }, [existingReservations]);

  const handleBooking = async () => {
    if (!time) {
      setMessage("Please select a time slot.");
      return;
    }

    const reservationData = {
      date: formattedDate,
      time,
      participants,
      maxParticipants,
    };

    try {
      await addDoc(collection(db, "reservations"), reservationData);
      setMessage("Reservation successful!");
      // After booking, refresh the reservations list
      const updatedReservations = [...existingReservations, reservationData];
      setExistingReservations(updatedReservations);
    } catch (error) {
      console.error("Error making reservation:", error);
      setMessage("Error making reservation: " + error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Book Your Class
        </Typography>

        {/* Date Picker */}
        <Box display="flex" justifyContent="center" mb={4}>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            inline
          />
        </Box>

        {/* Available Times */}
        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            Select Time
          </Typography>
          <Grid container spacing={2}>
            {availableTimes.length > 0 ? (
              availableTimes.map((timeSlot, index) => (
                <Grid item xs={6} key={index}>
                  <Button
                    variant={time === timeSlot.value ? "contained" : "outlined"}
                    color="primary"
                    fullWidth
                    onClick={() => setTime(timeSlot.value)}
                  >
                    {timeSlot.label}
                  </Button>
                </Grid>
              ))
            ) : (
              <Typography color="textSecondary">No available times for this date.</Typography>
            )}
          </Grid>
        </Box>

        {/* Display Selected Time */}
        {time && (
          <Box mb={4}>
            <Typography variant="h6">Selected Time: {time}</Typography>
          </Box>
        )}

        {/* Participants & Max Participants */}
        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            Participants
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                type="number"
                value={participants}
                onChange={(e) => setParticipants(Number(e.target.value))}
                label="Participants"
                variant="outlined"
                fullWidth
                inputProps={{ min: 1, max: maxParticipants }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                type="number"
                value={maxParticipants}
                onChange={(e) => setMaxParticipants(Number(e.target.value))}
                label="Max Participants"
                variant="outlined"
                fullWidth
                inputProps={{ min: 1 }}
              />
            </Grid>
          </Grid>
        </Box>

        {/* Booking Button */}
        <Box display="flex" justifyContent="center" mb={4}>
          <Button
            variant="contained"
            color="success"
            onClick={handleBooking}
            fullWidth
          >
            Book Now
          </Button>
        </Box>

        {/* Message */}
        {message && (
          <Box mb={4}>
            <Alert severity={message.includes("successful") ? "success" : "error"}>
              {message}
            </Alert>
          </Box>
        )}

        {/* Existing Reservations */}
        <Box mt={8}>
          <Typography variant="h6" gutterBottom>
            Existing Reservations
          </Typography>
          <Grid container spacing={2}>
            {existingReservations.length > 0 ? (
              existingReservations.map((reservation, index) => (
                <Grid item xs={12} key={index}>
                  <Paper variant="outlined" className="p-2">
                    <Typography><strong>Time:</strong> {reservation.time}</Typography>
                    <Typography><strong>Participants:</strong> {reservation.participants}/{reservation.maxParticipants}</Typography>
                  </Paper>
                </Grid>
              ))
            ) : (
              <Typography color="textSecondary">No reservations for this date.</Typography>
            )}
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Booking;