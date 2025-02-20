import { useState } from "react";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, sendSignInLinkToEmail } from "firebase/auth";
import { collection, addDoc } from "firebase/firestore";
import { Container, TextField, Button, Typography, Box } from "@mui/material";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [message, setMessage] = useState("");

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Send sign-in link to email
      const actionCodeSettings = {
        url: 'http://localhost:3000/finishSignUp?email=' + email,
        handleCodeInApp: true,
      };
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);

      // Save user role in Firestore
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        email: user.email,
        role: role,
      });

      setMessage("Sign-up successful! Please check your email to complete the sign-in process.");
    } catch (error) {
      console.error("Error signing up:", error);
      setMessage("Error signing up: " + error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Sign Up
        </Typography>
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          label="Role"
          type="text"
          fullWidth
          margin="normal"
          value={role}
          onChange={(e) => setRole(e.target.value)}
        />
        <Button variant="contained" color="primary" fullWidth onClick={handleSignUp}>
          Sign Up
        </Button>
        {message && (
          <Box mt={2}>
            <Typography color="textSecondary">{message}</Typography>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default SignUp;