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

const Register = (props) => {
  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [phone, setPhone] = useState();

  const [age, setAge] = useState();
  const [batch, setBatch] = useState();

  const [s_name, setShop] = useState();
  const [start_time, setStart] = useState("");
  const [end_time, setEnd] = useState();

  const [type, setType] = useState();
  const onChangeUsername = (event) => {
    setName(event.target.value);
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
  const resetInputs = () => {
    setName();
    setEmail();
    // setDate(null);
  };

  const onSubmit = (event) => {
    event.preventDefault();

    const newUser = {
      name: name,
      email: email,
      date: Date.now(),
    };

    axios
      .post("http://localhost:4000/user/register", newUser)
      .then((response) => {
        alert("Created\t" + response.data.name);
        console.log(response.data);
      });

    resetInputs();
  };

  return (
    <Grid container align={"center"} spacing={2}>
      <Grid item xs={12}>
        <TextField
          label="Name"
          variant="outlined"
          value={name}
          onChange={onChangeUsername}
        />
      </Grid>
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
          label="Contact"
          variant="outlined"
          value={email}
          onChange={onChangeEmail}
        />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ minWidth: 120 }}>
          <FormControl sx={{ m: 1, minWidth: 80 }}>
            <InputLabel id="demo-simple-select-label">Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={type}
              label="Type"
              //autoWidth
              onChange={onChangeType}
            >
              <MenuItem value={"Vendor"}>Vendor</MenuItem>
              <MenuItem value={"Buyer"}>Buyer</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Grid>
      {type=="Buyer"?
      <Grid item xs={12}>
        <TextField
          label="Age"
          variant="outlined"
          value={age}
          onChange={onChangeAge}
        />
      </Grid>
      :""}
      {type=="Buyer"?
      <Grid item xs={12}>
        <Box sx={{ minWidth: 120 }}>
          <FormControl sx={{ m: 1, minWidth: 80 }}>
            <InputLabel id="demo-simple-select-label">Batch</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={batch}
              label="Batch"
              //autoWidth
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
      :""}
      {type=="Vendor"?
      <Grid item xs={12}>
        <TextField
          id="time"
          label="Start"
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
      :""}
      {type=="Vendor"?
      <Grid item xs={12}>
        <TextField
          id="time"
          label="End"
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
      :""}
      {type=="Vendor"?
      <Grid item xs={12}>
        <TextField
          label="Shop name"
          variant="outlined"
          value={s_name}
          onChange={onChangeShop}
        />
      </Grid>
      :""}
      <Grid item xs={12}>
        <Button variant="contained" onClick={onSubmit}>
          Register
        </Button>
      </Grid>
    </Grid>
  );
};

export default Register;
