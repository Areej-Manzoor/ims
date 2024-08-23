import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useState } from 'react';

function Login() {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFormSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission

    try {
      const response = await axios.post('http://localhost:8000/admin/login', {
        userName: userName,
        password: password
      });

      if (response.status === 200) {
        alert('Login successful');
        // window.location.href = '/home'; // Redirect to home or another page
      } else {
        setErrorMessage(response.data.message); // Show error message from response
      }
    } catch (err) {
      console.error('Error during login:', err.response?.data?.message || err.message);
      setErrorMessage(err.response?.data?.message || 'An error occurred. Please try again.');
    }
  };

  return (
    <Box
      component="form"
      sx={{
        '& .MuiTextField-root': { m: 1, width: '41ch' },
      }}
      autoComplete="off"
      onSubmit={handleFormSubmit}
      method="post"
    >
      {errorMessage && (
        <p style={{ color: 'red' }}>{errorMessage}</p>
      )}

      <TextField
        type="text"
        label="User Name"
        name="user-name"
        required
        onChange={(e) => setUserName(e.target.value)}
      />
      <br />
      <TextField
        type="password"
        label="Password"
        name="password"
        required
        onChange={(e) => setPassword(e.target.value)}
      />
      <br /><br />
      <Button variant="contained" type="submit">
        Submit
      </Button>
    </Box>
  );
}

export default Login;
