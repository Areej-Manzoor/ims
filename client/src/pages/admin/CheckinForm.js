import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import axios from 'axios';
import { useState, useRef } from 'react';

function CheckinForm() {
    const [state, setState] = useState({
        empId: '',
        savedId: '',
        isFormSubmitted: false,
        isStartTimeSaved: false,
        fullAttendanceMarked:false,
        errorMessage: ''
    });

    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    const startTime = async () => {
        const date = new Date();
        let imageCaptured = false;

        // Access the camera and start the video stream
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.play();

                // Wait for the video to start playing
                videoRef.current.onloadedmetadata = () => {
                    if (canvasRef.current) {
                        const canvas = canvasRef.current;
                        const context = canvas.getContext('2d');

                        // Set canvas dimensions to match video
                        canvas.width = videoRef.current.videoWidth;
                        canvas.height = videoRef.current.videoHeight;

                        // Draw the current frame of the video on the canvas
                        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

                        // Get image data URL
                        const imagePath = canvas.toDataURL('image/png');
                        alert("Image Path: " + imagePath);
                        imageCaptured = true;

                        // Optionally stop the video stream after capturing the image
                        const tracks = stream.getTracks();
                        tracks.forEach(track => track.stop());
                        alert(imageCaptured);
                        // Save the time only if the image is captured
                        if (imageCaptured) {
                            saveCheckInTime(date);
                        }
                    }
                };
            }
        } catch (err) {
            console.error('Error accessing the camera: ', err);
            setState((prevState) => ({
                ...prevState,
                errorMessage: 'Unable to access camera: ' + err.message
            }));
        }
    };

    const saveCheckInTime = async (date) => {
        try {
            const response = await axios.post('http://localhost:8000/employee/mark-checkin', {
                currentDate: date.toISOString().split('T')[0],
                currentTime: date.toTimeString().split(' ')[0],
                employeeId: state.savedId
            });

            if (response.data.isTimeSaved) {
                alert('Employee check-in time has been saved');
                setState((prevState) => ({
                    ...prevState,
                    isStartTimeSaved: true
                }));

                // Set a timer to reset the form after 5 seconds
                setTimeout(() => {
                    setState({
                        empId: '',
                        savedId: '',
                        isFormSubmitted: false,
                        isStartTimeSaved: false,
                        errorMessage: ''
                    });
                }, 5000); // 5000 milliseconds = 5 seconds
            }
        } catch (err) {
            console.error('Error:', err);
            setState((prevState) => ({
                ...prevState,
                errorMessage: err.response?.data?.message || 'An error occurred. Please try again.'
            }));
        }
    };

    const saveCheckOutTime = async () => {
        const date = new Date();

        try {
            const response = await axios.post('http://localhost:8000/employee/mark-checkout', {
                currentDate: date.toISOString().split('T')[0],
                currentTime: date.toTimeString().split(' ')[0],
                employeeId: state.savedId
            });

            if (response.data.isTimeSaved) {
                alert('Employee check-out time has been saved');

                // Set a timer to reset the form after 5 seconds
                setTimeout(() => {
                    setState({
                        empId: '',
                        savedId: '',
                        isFormSubmitted: false,
                        isStartTimeSaved: false,
                        errorMessage: ''
                    });
                }, 5000); // 5000 milliseconds = 5 seconds
            }

            setState((prevState) => ({
                ...prevState,
                errorMessage: response?.data?.message || 'An error occurred. Please try again.'
            }));
        } catch (err) {
            console.error('Error:', err);
            setState((prevState) => ({
                ...prevState,
                errorMessage: err.response?.data?.message || 'An error occurred. Please try again.'
            }));
        }
    };
    const handleChange = (e) => {
        const { name, value } = e.target;
        setState((prevState) => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/employee/check-in', {
                empId: state.empId
            });

            if (response.data.isVerified) {
                alert(response.data.message);
                console.log(response.data)
                if (response.data.fullAttendanceMarked) {
                    alert("You cannot mark attendance again");
                } else if (!response.data.fullAttendanceMarked && response.data.isStartTimeSaved){
                    setState((prevState) => ({
                        ...prevState,
                        savedId : response.data.id,
                        isFormSubmitted: true,
                        isStartTimeSaved: true
                    }));
                } else {
                    setState((prevState) => ({
                        ...prevState,
                        savedId: response.data.id,
                        isFormSubmitted: true
                    }));  
                }

            }

        } catch (err) {
            console.error('Error:', err);
            setState((prevState) => ({
                ...prevState,
                errorMessage: err.response?.data?.message || 'An error occurred. Please try again.'
            }));
        }
    };

    return (
        <>
            {state.errorMessage && (
                <p style={{ color: 'red' }}>{state.errorMessage}</p>
            )}
            {!state.isFormSubmitted || state.fullAttendanceMarked ? (
                // Render form box only if form is not submitted
                <Box
                    component="form"
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '41ch' },
                    }}
                    autoComplete="off"
                    onSubmit={handleFormSubmit}
                    method="post"
                >


                    <TextField
                        type="text"
                        label="Employee Id"
                        name="empId"
                        value={state.empId}
                        required
                        onChange={handleChange}
                    />
                    <br />
                    <br />
                    <Button variant="contained" type="submit">
                        Submit
                    </Button>
                </Box>
            ) : (
                // Render time start/end box if form is submitted
                <Box
                    sx={{
                        '& .MuiTextField-root': { m: 1, width: '41ch' },
                    }}
                >
                    <video ref={videoRef} style={{ display: 'none' }}></video>
                    <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                    <Button
                        variant="contained"
                        onClick={startTime}
                        disabled={state.isStartTimeSaved} // Disable button if start time is saved
                    >
                        Start Time
                    </Button>
                    <Button variant="contained" onClick={saveCheckOutTime} >
                        End Time
                    </Button>
                </Box>
            )}
        </>
    );
}

export default CheckinForm;
