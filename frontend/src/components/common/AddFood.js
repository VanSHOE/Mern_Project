import * as React from "react";
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
import { refType } from "@mui/utils";
import Rating from "@mui/material/Rating";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { styled } from "@mui/material/styles";
import Paper from "@mui/material/Paper";
import Chip from "@mui/material/Chip";
const AddFood = (props) => {
  const [Name, setName] = useState("");
  const [Price, setPrice] = useState("");
  const [RatingT, setRating] = useState(0);
  const [Type, setType] = useState("");
  const [Vendor, setVendor] = useState("");
  const [Vendor_email, setVEmail] = useState("");
  const [Addons, setAddons] = useState([]);
  const [Tags, setTags] = useState([1, 2, 2]);

  const onChangeName = (event) => {
    setName(event.target.value);
  };

  const onChangePrice = (event) => {
    setPrice(event.target.value);
  };
  const onChangeRating = (event) => {
    setRating(event.target.value);
  };

  const onChangeType = (event) => {
    setType(event.target.value);
  };

  const onChangeVendor = (event) => {
    setVendor(event.target.value);
  };

  const onChangeVE = (event) => {
    setVEmail(event.target.value);
  };

  const onChangeAddons = (event) => {
    setAddons([...Addons, event.target.value]);
  };

  const onChangeTags = (event) => {
    setTags([...Tags, event.target.value]);
  };

  const resetInputs = () => {
    setName("");
    setPrice("");
    setRating(0);
    setType("");
    setVendor("");
    setVEmail("");
    setAddons([]);
    setTags([]);
  };

  const onSubmit = (event) => {
    event.preventDefault();

    const newFood = {
      name: Name,
      price: Price,
      rating: Rating,
      type: Type,
      addons: Addons,
      Tags: Tags,
      vendor: Vendor,
      vendor_email: Vendor_email,
    };

    axios.post("http://localhost:4000/item/add", newFood).then((response) => {
      alert("Created item");
      console.log(response.data);
    });

    resetInputs();
  };
  const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));
  return (
    <Grid container justify="center" align={"center"} spacing={2}>
      <Grid item xs={12}>
        <TextField
          label="Name"
          variant="outlined"
          value={Name}
          onChange={onChangeName}
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Price"
          variant="outlined"
          type="Number"
          value={Price}
          onChange={onChangePrice}
        />
      </Grid>
      <Grid item xs={12}>
        <Box sx={{ minWidth: 120 }}>
          <FormControl sx={{ m: 1, minWidth: 80 }}>
            <InputLabel id="demo-simple-select-label">Type</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={Type}
              label="Type"
              //autoWidth
              onChange={onChangeType}
            >
              <MenuItem value={"veg"}>Veg</MenuItem>
              <MenuItem value={"non_Veg"}>Non-Veg</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Grid>
      <Grid item xs={12}>
        <Rating
          name="simple-controlled"
          value={RatingT}
          size="large"
          onChange={(event, newValue) => {
            setRating(newValue);
          }}
        />
      </Grid>
      <Grid item xs={12}>
        {Tags.map((tag) => (
          <Chip label={tag} />
        ))}
      </Grid>
    </Grid>
  );
};

export default AddFood;
