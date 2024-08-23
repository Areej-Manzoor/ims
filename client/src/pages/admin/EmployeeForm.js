import React, { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Button from '@mui/material/Button';
import axios from 'axios';

function EmployeeForm() {
    const [formState, setFormState] = useState({
        name: '',
        email: '',
        phone: '',
        gender: '', // Initialize with an empty string
        address: ''
    });
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        if (!formState.gender) {
            setErrorMessage('Please select a gender.');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8000/admin/employee-registeration', {
                form: formState
            });

            if (response.status === 200) {
                alert('Employee has been registered');
                setFormState({
                    name: '',
                    email: '',
                    phone: '',
                    gender: '',
                    address: ''
                });
            }
        } catch (err) {
            console.error('Error :', err);
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
                label="Name"
                name="name"
                value={formState.name}
                required
                onChange={handleChange}
            />
            <br />
            <TextField
                type="email"
                label="Email"
                name="email"
                value={formState.email}
                required
                onChange={handleChange}
            />
            <br />
            <TextField
                type="tel"
                label="Phone"
                name="phone"
                value={formState.phone}
                required
                onChange={handleChange}
            />
            <br />
            <FormControl sx={{ m: 1, width: '41ch' }} required>
                <InputLabel id="gender-label">Gender</InputLabel>
                <Select
                    labelId="gender-label"
                    label="Gender"
                    name="gender"
                    value={formState.gender} // Ensure this matches one of the options or is ''
                    onChange={handleChange}
                    displayEmpty
                >
                    <MenuItem value="">
                        <em>Select Gender</em>
                    </MenuItem>
                    <MenuItem value="male">Male</MenuItem>
                    <MenuItem value="female">Female</MenuItem>
                    <MenuItem value="other">Other</MenuItem>
                </Select>
            </FormControl>
            <br />
            <TextField
                label="Address"
                name="address"
                value={formState.address}
                required
                onChange={handleChange}
                multiline
                minRows={3}
                sx={{ m: 1, width: '41ch' }}
            />
            <br />
            <Button variant="contained" type="submit">
                Submit
            </Button>
        </Box>
    );
}

export default EmployeeForm;
