"use client";

import { Stack, TextField, Typography, Grid } from "@mui/material";
import { useTheme } from "@emotion/react";
import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";


const Login = () => {
  const [loginData, setLoginData] = useState({});
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState("");

  const theme = useTheme();
  const router = useRouter();




  useEffect(() => {
    const registrationSuccess = localStorage.getItem('registrationSuccess');
    if (registrationSuccess === 'true') {
      setSuccess("Account created successfully. Please check your email to verify your account.");
      localStorage.removeItem('registrationSuccess');
    }
  }, []);



  const loginWithGoogle = () => {
    signIn("google", { callbackUrl: "/" });
  };

  const handleChange = (event) => {
    let { name, value } = event.target;
    setLoginData({ ...loginData, [name]: value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    setSuccess("")

    const response = await signIn("credentials", {
      email: loginData.email,
      password: loginData.password,
      redirect: false,
    });

    if (response?.error) {

      setError("Invalid email or password");
      setIsLoading(false);
    } else {

      setError(null)
      router.push('/')
      router.refresh()
      
      
    }

  };

  return (
    <Stack
      display={theme.flexBox}
      direction="row"
      justifyContent={theme.end}
      sx={{ overflowY: "hidden" }}
      width="100%"
    >
      <div className="login-img">
        <img
          id="hiking-image"
          src="/hiking.png"
          alt="hiking"
          width="100%"
          style={{ objectFit: "cover", height: "100vh" }}
        />
        <img
          id="logo"
          src="/logo.png"
          alt="logo"
          width="110px"
          height="70"
          style={{ position: "absolute", top: "16px", left: "35px" }}
        />
      </div>

      <div className="login-content">
        <img
          id="logo-mobile-login"
          src="/logo.png"
          alt="logo"
          width="90px"
          height="58"
          style={{ position: "absolute", top: "25px", left: "25px" }}
        />
        <div className="login-form" style={{backgroundColor: theme.palette.mode === "dark" ? "rgba(30, 30, 30, 0.9)" : null}}>
          <h1 className="login-text">Login</h1>
          <Typography
            component="span"
            variant="span"
            mb={3}
            width="100%"
            color="gray"
          >
            Welcome back! Please login to your account
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2} mb={2}>
              <Grid item xs={12}>
                <TextField
                  type="email"
                  label="Email"
                  name="email"
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  type="password"
                  label="Password"
                  name="password"
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
            </Grid>
            <button
              type="submit"
              className="login-button-regular"
              style={{ display: "flex", justifyContent: "center" }}
            >
              Log in
              {isLoading ? (
                <CircularProgress
                  color="inherit"
                  size={20}
                  sx={{ marginLeft: "15px" }}
                />
              ) : null}
            </button>

            <Stack mb={1.5}>
          <Typography
              component="span"
              variant="span"
              width="100%"
              color="#2d7fb5"
              sx={{ cursor: "pointer" }}
              onClick={() => router.push("/reset-password")}>
             Forgot your password?
            </Typography>
            </Stack>
          
          </form>

          <button className="login-button" onClick={loginWithGoogle}>
            <Stack
              width="235px"
              margin="0 auto"
              display={theme.flexBox}
              direction="row"
              alignItems={theme.center}
            >
              <img
                src="/google.png"
                width="23px"
                style={{ marginRight: "15px" }}
                alt="google"
              />
              Continue with Google
            </Stack>
          </button>
          
          
          <Typography
            component="span"
            variant="span"
            width="100%"
            color="gray"
            mr={2}
            
          >
            Don't have an account?
            <Typography
              onClick={() => router.push("/register")}
              component="span"
              
              variant="span"
              color="#2d7fb5"
              sx={{ cursor: "pointer", marginLeft: "3px" }}
            >
               Free Register
            </Typography>
          </Typography>

          {error ? <Stack mt={3}><Alert severity="error">{error}</Alert></Stack> : null}
          {success ? <Stack mt={2}><Alert severity="success">{success}</Alert></Stack> : null}
        </div>
      </div>
    </Stack>
  );
};

export default Login;
