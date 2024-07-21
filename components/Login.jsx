"use client";

import { Stack, TextField, Typography, Grid, Button} from "@mui/material";
import { useTheme } from "@emotion/react";
import { signIn } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";
import Image from "next/image";
import Btn from '../components/custom/button/Btn'


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
        <Image
          id="hiking-image"
          src="/hiking.png"
          alt="hiking"
          width={0}
          height={0}
          sizes="100vw"
          style={{ width: '100%', height: 'auto' }}
        
        />
        <Image
          id="logo"
          src="/logo.png"
          alt="logo"
          width={110}
          height={70}
          style={{ position: "absolute", top: "16px", left: "35px" }}
        />
      </div>

      <div className="login-content">
        <Image
          id="logo-mobile-login"
          src="/logo.png"
          alt="logo"
          width={90}
          height={58}
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

            <Btn text="Login" type={"submit"} isLoading={isLoading} variant="contained" color={theme.green} />

            <Stack mb={1.5}>
          <Typography
              component="span"
              variant="span"
              width="100%"
              color="#2d7fb5"
              sx={{ cursor: "pointer", mt: 1.5 }}
              onClick={() => router.push("/reset-password")}>
             Forgot your password?
            </Typography>
            </Stack>
          
          </form>

          <Button variant="outlined" sx={{p: "12px", mb: 1.5}} onClick={loginWithGoogle}>
            <Stack
              width="235px"
              margin="0 auto"
              display={theme.flexBox}
              direction="row"
              alignItems={theme.center}
            >
              <Image
                src="/google.png"
                width={23}
                height={23}
                style={{ marginRight: "15px" }}
                alt="google"
              />
              Continue with Google
            </Stack>
          </Button>
          
          
          <Typography
            component="span"
            variant="span"
            width="100%"
            color="gray"
            mr={2}
            
          >
            No account?
            <Typography
              onClick={() => router.push("/register")}
              component="span"
              variant="span"
              color="#2d7fb5"
              sx={{ cursor: "pointer", marginLeft: "3px" }}
            >
              Register free
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
