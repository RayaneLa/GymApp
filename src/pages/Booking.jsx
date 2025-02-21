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
import { useTranslation } from "react-i18next"; // Import the useTranslation hook

const Booking = () => {
  const { t } = useTranslation(); // Initialize the translation function
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
        { label: t("timeSlot1"), value: "10:00 AM - 11:00 AM" },
        { label: t("timeSlot2"), value: "11:00 AM - 12:00 PM" },
        { label: t("timeSlot3"), value: "12:00 PM - 1:00 PM" },
        { label: t("timeSlot4"), value: "1:00 PM - 2:00 PM" },
        { label: t("timeSlot5"), value: "2:00 PM - 3:00 PM" },
      ];

      // Filter out times that are already reserved
      const reservedTimes = existingReservations.map((reservation) => reservation.time);
      const availableTimes = allTimes.filter((timeSlot) => !reservedTimes.includes(timeSlot.value));

      setAvailableTimes(availableTimes);
    };

    generateAvailableTimes();
  }, [existingReservations, t]);

  const handleBooking = async () => {
    if (!time) {
      setMessage(t("selectTimeSlot"));
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
      setMessage(t("reservationSuccess"));
      // After booking, refresh the reservations list
      const updatedReservations = [...existingReservations, reservationData];
      setExistingReservations(updatedReservations);
    } catch (error) {
      console.error("Error making reservation:", error);
      setMessage(t("reservationError") + ": " + error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {t("bookYourClass")}
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
            {t("selectTime")}
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
              <Typography color="textSecondary">{t("noAvailableTimes")}</Typography>
            )}
          </Grid>
        </Box>

        {/* Display Selected Time */}
        {time && (
          <Box mb={4}>
            <Typography variant="h6">{t("selectedTime")}: {time}</Typography>
          </Box>
        )}

        {/* Participants & Max Participants */}
        <Box mb={4}>
          <Typography variant="h6" gutterBottom>
            {t("participants")}
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                type="number"
                value={participants}
                onChange={(e) => setParticipants(Number(e.target.value))}
                label={t("participants")}
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
                label={t("maxParticipants")}
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
            {t("bookNow")}
          </Button>
        </Box>

        {/* Message */}
        {message && (
          <Box mb={4}>
            <Alert severity={message.includes(t("reservationSuccess")) ? "success" : "error"}>
              {message}
            </Alert>
          </Box>
        )}

        {/* Existing Reservations */}
        <Box mt={8}>
          <Typography variant="h6" gutterBottom>
            {t("existingReservations")}
          </Typography>
          <Grid container spacing={2}>
            {existingReservations.length > 0 ? (
              existingReservations.map((reservation, index) => (
                <Grid item xs={12} key={index}>
                  <Paper variant="outlined" className="p-2">
                    <Typography><strong>{t("time")}:</strong> {reservation.time}</Typography>
                    <Typography><strong>{t("participants")}:</strong> {reservation.participants}/{reservation.maxParticipants}</Typography>
                  </Paper>
                </Grid>
              ))
            ) : (
              <Typography color="textSecondary">{t("noReservationsForDate")}</Typography>
            )}
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Booking;