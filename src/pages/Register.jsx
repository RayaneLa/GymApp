import { useState } from 'react';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Alert, Snackbar } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Register = () => {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Create a user document with a pending role
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        role: null, // Role will be assigned by admin
      });

      // Send email verification
      await sendEmailVerification(user, {
        url: window.location.origin,
        handleCodeInApp: true,
        i18n: {
          languageCode: i18n.language,
        },
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000); // Redirect to login page after 3 seconds
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        setError(t('emailAlreadyInUse'));
      } else if (error.code === 'auth/invalid-email') {
        setError(t('invalidEmail'));
      } else if (error.code === 'auth/weak-password') {
        setError(t('weakPassword'));
      } else if (error.code === 'permission-denied') {
        setError(t('permissionDenied'));
      } else {
        setError(error.message);
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {t('register')}
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleRegister}>
          <TextField
            label={t('email')}
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label={t('password')}
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Box mt={2}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              {t('register')}
            </Button>
          </Box>
        </form>
        <Box mt={2} textAlign="center">
          <Typography variant="body2">
            {t('alreadyHaveAccount')} <Link to="/login">{t('login')}</Link>
          </Typography>
        </Box>
      </Box>
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
      >
        <Alert onClose={() => setSuccess(false)} severity="success" sx={{ width: '100%' }}>
          {t('registrationSuccess')}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Register;