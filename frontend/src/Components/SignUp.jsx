import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

import {
  TextField,
  Button,
  Typography,
  Container,
  Grid,
  Box,
} from "@mui/material";

function SignUp() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData); // Handle form submission here (e.g., send data to server)
    axios
      .post(`http://localhost:3000/sign-up`, formData)
      .then((response) => {
        // Set the success message
      })
      .catch((error) => {
        console.log(
          "Error occurred:",
          error.response?.data?.message || error.message
        ); // Log error
      });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh", // Full viewport height
        backgroundColor: "#f0f0f0", // Optional background color
      }}
    >
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          padding: 4,
          backgroundColor: "#fff",
          borderRadius: 2,
          boxShadow: 3, // Adds a shadow
        }}
      >
        <Typography variant="h4" align="center" gutterBottom>
          Sign Up
        </Typography>
        <Typography
          variant="body1"
          align="center"
          gutterBottom
          sx={{ marginBottom: 2, color: "#666" }}
        >
          Enter your information to create an account
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="firstName"
                name="firstName"
                label="First Name"
                value={formData.firstName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="lastName"
                name="lastName"
                label="Last Name"
                value={formData.lastName}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="password"
                name="password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ marginTop: 2 }}
          >
            Sign Up
          </Button>
        </form>
        <Typography align="center" sx={{ marginTop: 2 }}>
          Have an account? <Link to="/sign-in">Sign In</Link>
        </Typography>
      </Container>
    </Box>
  );
}

export default SignUp;
