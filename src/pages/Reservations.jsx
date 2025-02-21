import { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Button,
  Alert,
} from "@mui/material";
import { useTranslation } from 'react-i18next'; // Import the useTranslation hook

const Reservations = ({ userId }) => {
  const { t } = useTranslation(); // Initialize the translation function
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [reservations, setReservations] = useState([]);
  const [userReservations, setUserReservations] = useState([]);
  const [message, setMessage] = useState("");
  const formattedDate = selectedDate.toISOString().split("T")[0];

  useEffect(() => {
    const fetchReservations = async () => {
      const reservationsRef = collection(db, "reservations");
      const q = query(reservationsRef, where("date", "==", formattedDate));
      const querySnapshot = await getDocs(q);
      const reservationsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setReservations(reservationsData);
    };

    fetchReservations();
  }, [formattedDate]);

  useEffect(() => {
    const fetchUserReservations = async () => {
      const reservationsRef = collection(db, "reservations");
      const q = query(reservationsRef, where("participantsList", "array-contains", userId));
      const querySnapshot = await getDocs(q);
      const userReservationsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUserReservations(userReservationsData);
    };

    fetchUserReservations();
  }, [userId]);

  const handleEnroll = async (reservationId) => {
    try {
      const reservationRef = doc(db, "reservations", reservationId);
      const reservation = reservations.find((res) => res.id === reservationId);

      if (reservation.participants >= reservation.maxParticipants) {
        setMessage(t("reservationFull"));
        return;
      }

      const updatedParticipantsList = reservation.participantsList ? [...reservation.participantsList, userId] : [userId];

      await updateDoc(reservationRef, {
        participants: reservation.participants + 1,
        participantsList: updatedParticipantsList,
      });

      setMessage(t("enrollmentSuccess"));
      setReservations((prev) =>
        prev.map((res) =>
          res.id === reservationId
            ? { ...res, participants: res.participants + 1, participantsList: updatedParticipantsList }
            : res
        )
      );
      setUserReservations((prev) => [...prev, { ...reservation, participants: reservation.participants + 1, participantsList: updatedParticipantsList }]);
    } catch (error) {
      console.error("Error enrolling in reservation:", error);
      setMessage(t("enrollmentError") + ": " + error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {t("viewReservations")}
        </Typography>

        {/* Date Picker */}
        <Box display="flex" justifyContent="center" mb={4}>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            inline
          />
        </Box>

        {/* Reservations List */}
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            {t("reservationsFor")} {formattedDate}
          </Typography>
          <Grid container spacing={2}>
            {reservations.length > 0 ? (
              reservations.map((reservation, index) => (
                <Grid item xs={12} key={index}>
                  <Paper variant="outlined" className="p-2">
                    <Typography><strong>{t("time")}:</strong> {reservation.time}</Typography>
                    <Typography><strong>{t("participants")}:</strong> {reservation.participants}/{reservation.maxParticipants}</Typography>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleEnroll(reservation.id)}
                      disabled={reservation.participants >= reservation.maxParticipants || (reservation.participantsList && reservation.participantsList.includes(userId))}
                    >
                      {t("enroll")}
                    </Button>
                  </Paper>
                </Grid>
              ))
            ) : (
              <Typography color="textSecondary">{t("noReservationsAvailable")}</Typography>
            )}
          </Grid>
        </Box>

        {/* Message */}
        {message && (
          <Box mt={4}>
            <Alert severity={message.includes(t("successfully")) ? "success" : "error"}>
              {message}
            </Alert>
          </Box>
        )}

        {/* User's Enrolled Reservations */}
        <Box mt={8}>
          <Typography variant="h6" gutterBottom>
            {t("yourEnrolledReservations")}
          </Typography>
          <Grid container spacing={2}>
            {userReservations.length > 0 ? (
              userReservations.map((reservation, index) => (
                <Grid item xs={12} key={index}>
                  <Paper variant="outlined" className="p-2">
                    <Typography><strong>{t("date")}:</strong> {reservation.date}</Typography>
                    <Typography><strong>{t("time")}:</strong> {reservation.time}</Typography>
                    <Typography><strong>{t("participants")}:</strong> {reservation.participants}/{reservation.maxParticipants}</Typography>
                  </Paper>
                </Grid>
              ))
            ) : (
              <Typography color="textSecondary">{t("noEnrolledReservations")}</Typography>
            )}
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default Reservations;