import { useState } from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { GoogleLogin } from "react-google-login";

const clientId =
  "726973691384-q1qv7qeiqq2uqimid2ajotfmtea57gof.apps.googleusercontent.com";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showloginButton, setShowloginButton] = useState(true);
  const [showlogoutButton, setShowlogoutButton] = useState(false);
  const onChangeEmail = (event) => {
    setEmail(event.target.value);
  };
  const onLoginSuccess = (res) => {
    console.log("Login Success:", res.profileObj);
    const newUser = {
      email: res.profileObj.email,
      date: Date.now(),
    };

    axios
      .post("https://mernvendorbuyer.me:4000/user/glogin", newUser)
      .then((response) => {
        alert("Logged as " + response.data.email);
        props.onAuth(response.data.email);
        props.onAuthT(response.data.type);

        localStorage.setItem("Auth", response.data.email);
        localStorage.setItem("AuthT", response.data.type);
        if (response.data.type == "Buyer") {
          props.onAuthW(response.data.wallet);
          localStorage.setItem("Wallet", response.data.wallet);
        }
        console.log(response.data);
      });
  };
  const onLoginFailure = (res) => {
    console.log("Login Failed:", res);
  };
  const onChangePass = (event) => {
    setPassword(event.target.value);
  };

  const resetInputs = () => {
    setEmail("");
    setPassword("");
  };

  const onSubmit = (event) => {
    event.preventDefault();

    const newUser = {
      email: email,
      password: password,
      date: Date.now(),
    };

    axios
      .post("https://mernvendorbuyer.me:4000/user/login", newUser)
      .then((response) => {
        alert("Logged as " + response.data.email);
        props.onAuth(response.data.email);
        props.onAuthT(response.data.type);

        localStorage.setItem("Auth", response.data.email);
        localStorage.setItem("AuthT", response.data.type);
        if (response.data.type == "Buyer") {
          props.onAuthW(response.data.wallet);
          localStorage.setItem("Wallet", response.data.wallet);
        }
        console.log(response.data);
      });
    resetInputs();
  };

  return (
    <Grid container align={"center"} spacing={2}>
      <Grid item xs={12}>
        <TextField
          label="Email"
          variant="outlined"
          value={email}
          onChange={onChangeEmail}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Password"
          variant="outlined"
          value={password}
          type="password"
          onChange={onChangePass}
        />
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" onClick={onSubmit}>
          Login
        </Button>
      </Grid>
      <Grid item xs={12}>
        <GoogleLogin
          clientId={clientId}
          buttonText="Sign In"
          onSuccess={onLoginSuccess}
          onFailure={onLoginFailure}
          cookiePolicy={"none"}
        />
      </Grid>
    </Grid>
  );
};

export default Login;
