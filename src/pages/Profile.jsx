import { useState, useEffect } from 'react';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { updatePassword } from 'firebase/auth';
import { Container, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUserProfile = async () => {
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setEmail(userData.email);
          setName(userData.name || '');
          setRole(userData.role || '');
        }
      }
    };

    fetchUserProfile();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      if (user) {
        await setDoc(doc(db, 'users', user.uid), {
          email,
          name,
          role,
        });
        if (password) {
          await updatePassword(user, password);
        }
        setSuccess(t('profileUpdateSuccess'));
      }
    } catch (error) {
      setError(t('profileUpdateError') + ': ' + error.message);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box my={4}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          {t('profile')}
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">{success}</Alert>}
        <form onSubmit={handleUpdateProfile}>
          <TextField
            label={t('email')}
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled
          />
          <TextField
            label={t('name')}
            type="text"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <TextField
            label={t('role')}
            type="text"
            fullWidth
            margin="normal"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            disabled
          />
          <TextField
            label={t('password')}
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled
          />
          <Box mt={2}>
            <Button type="submit" variant="contained" color="primary" fullWidth>
              {t('updateProfile')}
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default Profile;