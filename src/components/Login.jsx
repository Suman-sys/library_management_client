import React, { useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Alert from "@mui/material/Alert";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const BASE_URL = "http://localhost:5000";

const theme = createTheme();

export default function Login({ handleHaveAccount }) {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const data = {
      username: formData.get("username"),
      password: formData.get("password"),
    };
    try {
      const response = await axios({
        method: "post",
        url: BASE_URL + "/users/login",
        data: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
      });

      if (response.data) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("loggedInUser", response.data.user.name);
        localStorage.setItem("username", response.data.user.username);
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("role", response.data.user.role.toUpperCase());
        localStorage.setItem("userId", response.data.user._id);
        navigate("/");
      }
    } catch (err) {
      setError(true);
      setErrorMessage("Login Failed");
      setTimeout(() => setError(false), 5000);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 20,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          {error && <Alert severity="error">{errorMessage}</Alert>}
          <Typography component="h1" variant="h5">
            Login
          </Typography>
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="username"
                  label="Username"
                  name="username"
                  autoComplete="username"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  id="password"
                  autoComplete="new-password"
                />
              </Grid>
              <Grid
                container
                direction="row"
                sx={{ marginTop: 3, marginLeft: 5 }}
              >
                <Grid item xs={6}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        onChange={() => setShowPassword(!showPassword)}
                        value={showPassword}
                        color="primary"
                      />
                    }
                    label="Show Password"
                  />
                </Grid>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Login
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Button onClick={() => handleHaveAccount(false)}>
                  <Link href="#" variant="body2">
                    Don't have an account? Register
                  </Link>
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

<button onClick={() => localStorage.clear()}>Log Out</button>;
