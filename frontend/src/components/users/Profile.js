import axios from "axios";
import * as React from "react";
import { useState, useEffect } from "react";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { Navigate } from "react-router-dom";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from "@mui/icons-material/Save";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import SendIcon from "@mui/icons-material/Send";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";

const Profile = (props) => {
  const [details, setDetails] = useState([]);
  let email_cur = localStorage.getItem("Auth");
  useEffect(() => {
    axios
      .post("http://localhost:4000/user/profile", {
        email: email_cur,
      }) // unimplemented
      .then((response) => {
        setDetails(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);
  // console.log(details);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const [age, setAge] = useState("");
  const [batch, setBatch] = useState("");

  const [s_name, setShop] = useState("");
  const [start_time, setStart] = useState("");
  const [end_time, setEnd] = useState("");

  const [money_in, setDep] = useState("");

  const [type, setType] = useState("");
  if (!type) setType(localStorage.getItem("AuthT"));
  const onChangeUsername = (event) => {
    setName(event.target.value);
  };

  const onChangePass = (event) => {
    setPassword(event.target.value);
  };

  const onChangeEmail = (event) => {
    setEmail(event.target.value);
  };

  const onChangePhone = (event) => {
    setPhone(event.target.value);
  };

  const onChangeAge = (event) => {
    setAge(event.target.value);
  };

  const onChangeBatch = (event) => {
    setBatch(event.target.value);
  };

  const onChangeShop = (event) => {
    setShop(event.target.value);
  };

  const onChangeStart = (event) => {
    setStart(event.target.value);
  };

  const onChangeEnd = (event) => {
    setEnd(event.target.value);
  };

  const onChangeType = (event) => {
    setType(event.target.value);
  };

  const onChangeDep = (event) => {
    setDep(event.target.value);
  };

  const resetInputs = () => {
    setName("");
    setPhone("");
    setEmail("");
    setPassword("");
    setAge("");
    setBatch("");
    setShop("");
    setStart("");
    setEnd("");
    setType("");
    setDep("");
  };

  if (!email_cur) {
    return <Navigate to="/login" />;
  }
  const onAdd = (event) => {
    event.preventDefault();
    console.log(money_in);
    const newUser = {
      email: details.email,
      wallet: money_in,
    };

    axios
      .post("http://localhost:4000/user/deposit", newUser)
      .then((response) => {
        if (money_in) alert("Added " + money_in);
        //console.log(response.data);
        props.onAuthW(response.data.wallet);
        localStorage.setItem("Wallet", response.data.wallet);
      })
      .catch((err) => {
        alert("Invalid money");
      });
    resetInputs();
  };
  const onSubmit = (event) => {
    event.preventDefault();

    const newUser = {
      type: type,
      name: name,
      email: details.email,
      password: password,
      phone: phone,
      age: age,
      batch: batch,

      s_name: s_name,
      start_time: start_time,
      end_time: end_time,
      date: Date.now(),
    };

    axios
      .post("http://localhost:4000/user/update", newUser)
      .then((response) => {
        alert("Edited " + response.data.email);
      });
    window.location.reload(true);
    resetInputs();
  };
  return (
    <Grid container align={"center"} spacing={1}>
      <Grid item xs={12}>
        <TextField
          helperText="Name"
          id="element2"
          label={details.name}
          variant="outlined"
          value={name}
          onChange={onChangeUsername}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          helperText="Email"
          label={details.email}
          variant="outlined"
          value={email}
          disabled
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
        <TextField
          helperText="Phone"
          label={details.contact}
          variant="outlined"
          value={phone}
          onChange={onChangePhone}
        />
      </Grid>
      {type == "Buyer" ? (
        <Grid item xs={12}>
          <TextField
            helperText="Age"
            label={details.age}
            variant="outlined"
            type="Number"
            value={age}
            onChange={onChangeAge}
          />
        </Grid>
      ) : (
        ""
      )}
      {type == "Buyer" ? (
        <Grid item xs={12}>
          <Box sx={{ minWidth: 120 }}>
            <FormControl sx={{ m: 1, minWidth: 80 }}>
              <InputLabel id="demo-simple-select-label">
                {"UG" + details.batch}
              </InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={batch}
                label={"UG" + details.batch}
                autoWidth
                onChange={onChangeBatch}
              >
                <MenuItem value={1}>UG1</MenuItem>
                <MenuItem value={2}>UG2</MenuItem>
                <MenuItem value={3}>UG3</MenuItem>
                <MenuItem value={4}>UG4</MenuItem>
                <MenuItem value={5}>UG5</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Grid>
      ) : (
        ""
      )}
      {type == "Vendor" ? (
        <Grid item xs={12}>
          <TextField
            helperText="Opening time"
            id="time"
            label={details.can_open}
            type="time"
            value={start_time}
            onChange={onChangeStart}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5 min
            }}
            sx={{ width: 150 }}
          />
        </Grid>
      ) : (
        ""
      )}
      {type == "Vendor" ? (
        <Grid item xs={12}>
          <TextField
            helperText="Closing time"
            id="time"
            label={details.can_close}
            type="time"
            value={end_time}
            onChange={onChangeEnd}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5 min
            }}
            sx={{ width: 150 }}
          />
        </Grid>
      ) : (
        ""
      )}
      {type == "Vendor" ? (
        <Grid item xs={12}>
          <TextField
            helperText="Shop Name"
            label={details.shop_name}
            variant="outlined"
            value={s_name}
            onChange={onChangeShop}
          />
        </Grid>
      ) : (
        ""
      )}
      <Grid item xs={12}>
        <Button variant="contained" onClick={onSubmit} endIcon={<SaveIcon />}>
          Save
        </Button>
      </Grid>
      {localStorage.getItem("AuthT") == "Buyer" ? (
        <Grid item xs={12}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <TextField
              id="outlined-required"
              label="Add Money"
              value={money_in}
              type="number"
              inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
              onChange={onChangeDep}
            />
            <Button
              size="large"
              variant="contained"
              color="success"
              onClick={onAdd}
            >
              Deposit
            </Button>
          </div>
        </Grid>
      ) : (
        ""
      )}
    </Grid>
  );
};

export default Profile;
