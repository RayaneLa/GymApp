import { useState } from 'react';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if the user has a role assigned
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists() && userDoc.data().role) {
        navigate('/');
      } else {
        setError(t('accountPendingApproval'));
        await auth.signOut();
      }
    } catch (error) {
      setError(error.message);
    }
  };

  const handlePasswordReset = async () => {
    try {
      await sendPasswordResetEmail(auth, email);
      setResetEmailSent(true);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {t('login')}
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {resetEmailSent && <Alert severity="success">{t('resetEmailSent')}</Alert>}
        <form onSubmit={handleLogin}>
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
              {t('login')}
            </Button>
          </Box>
        </form>
        <Box mt={2} textAlign="center">
          <Button onClick={handlePasswordReset} color="primary">
            {t('forgotPassword')}
          </Button>
        </Box>
        <Box mt={2} textAlign="center">
          <Typography variant="body2">
            {t('dontHaveAccount')} <Link to="/register">{t('register')}</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default Login;