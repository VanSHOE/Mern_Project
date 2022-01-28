import * as React from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Rating from "@mui/material/Rating";
import { styled } from "@mui/material/styles";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

const Home = (props) => {
  const [EdID, setEDID] = useState("");

  const [Name, setName] = useState("");
  const [Price, setPrice] = useState("");
  const [RatingT, setRating] = useState(0);
  const [Type, setType] = useState("");
  const [Vendor, setVendor] = useState("");
  const [Vendor_email, setVEmail] = useState("");
  const [cur_addon, setCAddon] = useState("");
  const [Addons, setAddons] = useState([]);
  const [cur_tag, setCTag] = useState("");
  const [Tags, setTags] = useState([]);
  const [cur_addonP, setCAddonP] = useState("");
  const [uploadedFile, setUploadedFile] = useState("");
  const [fileTitle, setFileTitle] = useState("");
  const [filePath, setFilePath] = useState("");
  function handleFormSubmittion(e) {
    e.preventDefault();

    let form = document.getElementById("form");
    let formData = new FormData(form);
    console.log(form);
    axios
      .post("https://mernvendorbuyer.me:4000/item/upload", formData)
      .then((res) => {
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

  const onAddAddons = () => {
    if (Addons.some((addon) => addon == cur_addon)) return;
    if (!cur_addon || !cur_addonP) return;
    setAddons([...Addons, { name: cur_addon, price: cur_addonP }]);
    setCAddon("");
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
    setFilePath("");
    setUploadedFile("");
  };
  const setInputs = (item) => {
    setName(item.name);
    setPrice(item.price);
    setRating(item.ratings);
    setType(item.type);
    setVendor(item.vendor);
    setVEmail(item.vendor_email);
    setCAddon("");
    setCTag("");
    setAddons(item.addons);
    console.log(item.addons);
    setTags(item.tags);
  };
  console.log(Addons);
  const navigate = useNavigate();
  const [Items, setItems] = useState([]);
  const [cur_edit, setCEdit] = useState("");
  const [details, setDetails] = useState([]);

  let email_cur = props.user;
  useEffect(() => {
    axios
      .get("https://mernvendorbuyer.me:4000/item", {
        params: { vendor_email: email_cur },
      })
      .then((response) => {
        setItems(response.data);
      });
  }, []);
  console.log(Items);
  const bull = (
    <Box
      component="span"
      sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
    >
      •
    </Box>
  );

  const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));

  const onDelete = (item) => {
    const newFood = {
      id: item.id,
    };
    console.log(newFood);
    axios
      .post("https://mernvendorbuyer.me:4000/item/del", newFood)
      .then((response) => {
        axios
          .get("https://mernvendorbuyer.me:4000/item", {
            params: { vendor_email: email_cur },
          })
          .then((response) => {
            setItems(response.data);
          });
        console.log("Deleted");
      });
  };
  const onChangeCAddonP = (event) => {
    setCAddonP(event.target.value);
  };
  const onEdit = (item) => {
    setInputs(item);
    setEDID(item.id);
  };

  const onCancel = () => {
    resetInputs();
    setEDID("");
  };

  const onEditSubmit = (item) => {
    let email_cur = props.user;
    const newFood = {
      oldName: item.name,
      name: Name,
      price: Price,
      type: Type,
      addons: Addons,
      tags: Tags,
      vendor: item.vendor,
      vendor_email: email_cur,
      img: filePath,
      id: EdID,
    };

    axios
      .post("https://mernvendorbuyer.me:4000/item/update", newFood)
      .then((response) => {
        //alert("Edit " + response.data.email);
        //console.log(response);
        setItems(response.data);
      });
    onCancel();
  };
  console.log(EdID);

  let cur_user = props.user;
  let cur_user_type = props.userType;

  return props.user ? (
    props.userType == "Vendor" ? (
      <Stack spacing={2}>
        <Button
          variant="contained"
          color="success"
          onClick={() => navigate("/item/add")}
        >
          Add Item
        </Button>{" "}
        {Items.map((item) => (
          <div>
            {EdID == item.id ? (
              <Box sx={{ minWidth: 275 }}>
                <Card variant="outlined">
                  <React.Fragment>
                    <CardContent>
                      <Grid container spacing={2}>
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
                              <InputLabel id="demo-simple-select-label">
                                Type
                              </InputLabel>
                              <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                label="Type"
                                value={Type}
                                onChange={onChangeType}
                                //autoWidth
                              >
                                <MenuItem value={"veg"}>Veg</MenuItem>
                                <MenuItem value={"non_veg"}>Non-Veg</MenuItem>
                              </Select>
                            </FormControl>
                          </Box>
                        </Grid>
                        <Grid item xs={12}>
                          {" "}
                          <Grid item xs={12}>
                            {" "}
                            {Addons.map((addon) => (
                              <Chip
                                label={addon.name + ", " + addon.price + "$"}
                              />
                            ))}
                          </Grid>
                        </Grid>

                        <Grid item xs={12}>
                          <div
                            style={{
                              display: "flex",
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
                            <Button
                              variant="contained"
                              color="success"
                              onClick={onAddAddons}
                            >
                              Add
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              onClick={onDelAddons}
                            >
                              Reset
                            </Button>
                          </div>
                        </Grid>
                        <Grid item xs={12}>
                          {" "}
                          <Grid item xs={12}>
                            {" "}
                            {Tags.map((tag) => (
                              <Chip label={tag} />
                            ))}
                          </Grid>
                        </Grid>
                        <Grid item xs={12}>
                          <div
                            style={{
                              display: "flex",
                            }}
                          >
                            <TextField
                              label="Tags"
                              variant="outlined"
                              value={cur_tag}
                              onChange={onChangeCTag}
                            />

                            <Button
                              variant="contained"
                              color="success"
                              onClick={onAddTags}
                            >
                              Add
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              onClick={onDelTags}
                            >
                              Reset
                            </Button>
                          </div>
                        </Grid>
                      </Grid>
                    </CardContent>
                    <CardActions>
                      <Button onClick={() => onEditSubmit(item)} size="small">
                        Accept Changes
                      </Button>
                      <Button onClick={() => onCancel()} size="small">
                        Cancel
                      </Button>
                    </CardActions>
                  </React.Fragment>
                </Card>
              </Box>
            ) : (
              <Box sx={{ minWidth: 275 }}>
                <Card variant="outlined">
                  <React.Fragment>
                    <CardContent>
                      {item.img ? (
                        <Grid item xs={12}>
                          <img
                            src={"https://mernvendorbuyer.me:4000/" + item.img}
                            width="100"
                          />
                        </Grid>
                      ) : (
                        ""
                      )}
                      <Typography
                        sx={{ fontSize: 14 }}
                        color="text.secondary"
                        gutterBottom
                      >
                        {item.type}
                      </Typography>
                      <Typography variant="h5" component="div">
                        {item.name}
                      </Typography>
                      <Typography sx={{ mb: 1.5 }} color="green">
                        <em>{item.price}$</em>
                      </Typography>
                      <Typography variant="body2">
                        <h4>Addons:</h4>
                        <Stack direction="row" spacing={1}>
                          {item.addons.map((addon) => (
                            <Chip
                              label={addon.name + ", " + addon.price + "$"}
                            />
                          ))}
                        </Stack>
                      </Typography>
                      <br />
                      <Rating
                        name="read-only"
                        precision={0.1}
                        value={
                          item.num_ratings ? item.rating / item.num_ratings : 0
                        }
                        readOnly
                      />
                      <Typography variant="body2">
                        <h4>Tags:</h4>
                        <Stack direction="row" spacing={1}>
                          {item.tags.map((tag) => (
                            <Chip label={tag} />
                          ))}
                        </Stack>
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button onClick={() => onEdit(item)} size="small">
                        Edit
                      </Button>
                      <Button onClick={() => onDelete(item)} size="small">
                        Delete
                      </Button>
                    </CardActions>
                  </React.Fragment>
                </Card>
              </Box>
            )}
          </div>
        ))}
      </Stack>
    ) : (
      "Redirecting to buy page"
    )
  ) : (
    <div>
      <h1>
        Not Authenticated
        <br /> Dashboard Unavailable
      </h1>
    </div>
  );
};

export default Home;
