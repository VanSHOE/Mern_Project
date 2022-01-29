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
import { v4 as uuidv4 } from "uuid";
const AddFood = (props) => {
  const [Name, setName] = useState("");
  const [Price, setPrice] = useState("");
  const [RatingT, setRating] = useState(0);
  const [Type, setType] = useState("");
  const [Vendor, setVendor] = useState("");
  const [Vendor_email, setVEmail] = useState("");
  const [cur_addon, setCAddon] = useState("");
  const [cur_addonP, setCAddonP] = useState("");
  const [Addons, setAddons] = useState([]);
  const [cur_tag, setCTag] = useState("");
  const [Tags, setTags] = useState([]);
  const [uploadedFile, setUploadedFile] = useState("");
  const [fileTitle, setFileTitle] = useState("");
  const [filePath, setFilePath] = useState("");
  function handleFormSubmittion(e) {
    e.preventDefault();

    let form = document.getElementById("form");
    let formData = new FormData(form);
    console.log(form);
    axios.post("http://localhost:4000/item/upload", formData).then((res) => {
      console.log(res);
      setFilePath(res.data.path);
      console.log("Form submitted");
    });
  }

  function handleFileTitle(e) {
    setFileTitle(e.target.value);
  }

  function handleUploadedFile(e) {
    setUploadedFile(e.target.value);
  }
  const onChangeName = (event) => {
    setName(event.target.value);
  };

  const onChangePrice = (event) => {
    setPrice(event.target.value);
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
  const onChangeCTag = (event) => {
    setCTag(event.target.value);
  };

  const onChangeCAddon = (event) => {
    setCAddon(event.target.value);
  };
  const onChangeCAddonP = (event) => {
    setCAddonP(event.target.value);
  };
  const onAddAddons = () => {
    if (Addons.some((addon) => addon == cur_addon)) return;
    if (!cur_addon || !cur_addonP) return;
    setAddons([...Addons, { name: cur_addon, price: cur_addonP }]);
    setCAddon("");
    setCAddonP("");
  };
  const onDelAddons = () => {
    setAddons([]);
  };
  const onAddTags = () => {
    if (Tags.some((tag) => tag == cur_tag)) return;

    setTags([...Tags, cur_tag]);
    setCTag("");
  };
  const onDelTags = () => {
    setTags([]);
  };
  const resetInputs = () => {
    setName("");
    setPrice("");
    setRating(0);
    setType("");
    setVendor("");
    setVEmail("");
    setCAddon("");
    setCTag("");
    setAddons([]);
    setTags([]);
  };

  const onSubmit = (event) => {
    event.preventDefault();
    let email_cur = props.user;
    let vendor_cur;
    let shop_name;
    axios
      .post("http://localhost:4000/user/profile", { email: email_cur }) // unimplemented
      .then((response) => {
        // console.log(response.data);
        vendor_cur = response.data.name;
        shop_name = response.data.shop_name;
        const newFood = {
          name: Name,
          price: Price,
          type: Type,
          addons: Addons,
          tags: Tags,
          vendor: vendor_cur,
          vendor_email: email_cur,
          shop: shop_name,
          img: filePath,
          id: uuidv4(),
        };
        console.log(newFood);
        axios
          .post("http://localhost:4000/item/add", newFood)
          .then((response) => {
            alert("Created item");
            //  console.log(response.data);
          });

        resetInputs();
      })
      .catch(function (error) {
        console.log(error);
      });
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
        {" "}
        <form
          encType="multipart/form-data"
          onSubmit={handleFormSubmittion}
          id="form"
        >
          <input
            type="file"
            name="uploadedFile"
            value={uploadedFile}
            onChange={handleUploadedFile}
            required
          />
          <br />
          <br />
          <button type="submit">Upload photo</button>{" "}
        </form>
      </Grid>

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
              <MenuItem value={"non_veg"}>Non-Veg</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Grid>
      <Grid item xs={12}>
        {Addons.map((addon) => (
          <Chip label={addon.name + ", " + addon.price + "$"} />
        ))}
      </Grid>
      <Grid item xs={12}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            label="Addons"
            variant="outlined"
            value={cur_addon}
            onChange={onChangeCAddon}
          />
          <TextField
            label="Price"
            variant="outlined"
            value={cur_addonP}
            onChange={onChangeCAddonP}
          />
          <Button variant="contained" color="success" onClick={onAddAddons}>
            Add
          </Button>
          <Button variant="contained" color="error" onClick={onDelAddons}>
            Reset
          </Button>
        </div>
      </Grid>
      <Grid item xs={12}>
        {Tags.map((tag) => (
          <Chip label={tag} />
        ))}
      </Grid>
      <Grid item xs={12}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TextField
            label="Tags"
            variant="outlined"
            value={cur_tag}
            onChange={onChangeCTag}
          />
          <Button variant="contained" color="success" onClick={onAddTags}>
            Add
          </Button>
          <Button variant="contained" color="error" onClick={onDelTags}>
            Reset
          </Button>
        </div>
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="success" onClick={onSubmit}>
          SUBMIT
        </Button>
      </Grid>
    </Grid>
  );
};

export default AddFood;
