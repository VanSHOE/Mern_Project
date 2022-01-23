import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import Autocomplete from "@mui/material/Autocomplete";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Rating from "@mui/material/Rating";
import Chip from "@mui/material/Chip";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { v4 as uuidv4 } from "uuid";
import Fuse from "fuse.js";
import Checkbox from "@mui/material/Checkbox";
import Slider from "@mui/material/Slider";
import MuiInput from "@mui/material/Input";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const names = [
  "Oliver Hansen",
  "Van Henry",
  "April Tucker",
  "Ralph Hubbard",
  "Omar Alexander",
  "Carlos Abbott",
  "Miriam Wagner",
  "Bradley Wilkerson",
  "Virginia Andrews",
  "Kelly Snyder",
];
const UsersList = (props) => {
  const Input = styled(MuiInput)`
    width: 42px;
  `;

  const [users, setUsers] = useState([]);
  const [sortedUsers, setSortedUsers] = useState([]);
  const [sortName, setSortName] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [Items, setItems] = useState([]);
  const [favs, setfavs] = useState([]);
  const [a_sels, setasels] = useState([]);

  const [selectText, setSelect] = useState("");
  const fuse = new Fuse(Items, {
    keys: ["name"],
    includeScore: true,
  });
  const [SelectedFood, setself] = useState([]);
  useEffect(() => {
    console.log("huh");
    if (!selectText) setself(Items);
    else {
      setself(fuse.search(selectText).map((item) => item.item));
    }
  }, [selectText]);

  // console.log(SelectedFood);
  // console.log(a_sels);
  useEffect(() => {
    axios
      .get("http://localhost:4000/item", {
        params: {},
      })
      .then((response) => {
        axios
          .get("http://localhost:4000/user/get_fav", {
            params: { email: props.user },
          })
          .then((response2) => {
            setItems(response.data);
            setfavs(response2.data.favs);
          })
          .catch((error) => {
            console.log(error);
          });

        setSortedUsers(response.data);
        setSearchText("");
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  //  console.log(Items);
  //  console.log(favs);
  // console.log(a_sels);
  const sortChange = () => {
    let usersTemp = users;
    const flag = sortName;
    usersTemp.sort((a, b) => {
      if (a.date != undefined && b.date != undefined) {
        return (1 - flag * 2) * (new Date(a.date) - new Date(b.date));
      } else {
        return 1;
      }
    });
    setUsers(usersTemp);
    setSortName(!sortName);
  };

  const customFunction = (event) => {
    console.log(event.target.value);
    setSearchText(event.target.value);
  };
  const onFav = (id, ve) => {
    const fav_food = {
      email: props.user,
      id: id,
    };
    axios
      .post("http://localhost:4000/user/add_fav", fav_food)
      .then((response) => {
        setfavs(response.data.favs);
        console.log(response);
      });
  };

  const onDelFav = (id, ve) => {
    const fav_food = {
      email: props.user,
      id: id,
    };
    axios
      .post("http://localhost:4000/user/del_fav", fav_food)
      .then((response) => {
        setfavs(response.data.favs);
        console.log(response);
      });
  };
  const onChangeSel = (event) => {
    setSelect(event.target.value);
  };

  const Buy = (item) => {
    let qty = parseInt(+prompt("Please enter the quantity"));
    console.log(qty);

    let add = a_sels.filter((i) => i.id == item.id);
    add = add.map((el) => el.addon);
    console.log(add);
    const order = {
      food_id: item.id,
      add_ons: add,
      b_email: props.user,
      qty: qty,
      vendor_email: item.vendor_email,
      id: uuidv4(),
    };
    axios.post("http://localhost:4000/order/add", order).then((response) => {
      setasels([]);
      axios
        .get("http://localhost:4000/user/getWallet", {
          params: { email: props.user },
        })
        .then((response1) => {
          setasels([]);
          console.log(response1);
          props.onWalletChange(response1.data.money);
          localStorage.setItem("Wallet", response1.data.money);
          console.log(response);
        });
    });
  };

  const AddAddonBuy = (item, addon) => {
    let item_id = item.id;
    if (!a_sels.some((i) => i.id == item_id && i.addon.name == addon.name))
      setasels([...a_sels, { id: item_id, addon: addon }]);
  };

  const RemoveAddonBuy = (item, addon) => {
    let item_id = item.id;
    console.log("?");
    setasels(
      a_sels.filter((i) => i.id != item_id || i.addon.name != addon.name)
    );
  };
  const [value, setValue] = React.useState([20, 37]);

  function valueLabelFormat(value) {
    var hours = Math.floor(parseInt(value) / 60);
    var minutes = Math.floor(parseInt(value) % 60);
    if (parseInt(minutes) < 10) minutes = "0" + minutes;
    if (hours == 12) {
      return 12 + ":" + minutes + "PM";
    }
    let modHours = hours % 12;
    if (parseInt(modHours) < 10) modHours = "0" + modHours;
    return modHours + ":" + minutes + (hours > 11 ? " PM" : " AM");
  }

  function toTimeString(value) {
    var hours = Math.floor(parseInt(value) / 60);
    var minutes = Math.floor(parseInt(value) % 60);
    if (parseInt(minutes) < 10) minutes = "0" + minutes;
    if (parseInt(hours) < 10) hours = "0" + hours;
    // console.log(hours + ":" + minutes);
    return hours + ":" + minutes;
  }

  function FromTimeString(value) {
    //  console.log(value);
    let vals = value.split(":");
    //  console.log(vals);
    //  console.log(parseInt(vals[0]) * 60 + parseInt(vals[1]));
    return parseInt(vals[0]) * 60 + parseInt(vals[1]);
  }

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const OnSliderInputL = (event) => {
    setValue([FromTimeString(event.target.value), value[1]]);
  };

  const OnSliderInputR = (event) => {
    setValue([value[0], FromTimeString(event.target.value)]);
  };
  const [personName, setPersonName] = React.useState([]);
  console.log(SelectedFood);

  const PriceAsc = () => {
    const myData = []
      .concat(SelectedFood)
      .sort((a, b) => (a.itemM > b.itemM ? 1 : -1));
    setself(myData);
  };

  const PriceDesc = () => {
    const myData = []
      .concat(SelectedFood)
      .sort((a, b) => (a.itemM < b.itemM ? 1 : -1));
    setself(myData);
  };

  const handleChangeShop = (event) => {
    const {
      target: { value },
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };
  return (
    <div>
      <Grid container>
        <Grid item xs={12} md={3} lg={3}>
          <List component="nav" aria-label="mailbox folders">
            <ListItem text>
              <h1>Filters</h1>
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={12} md={9} lg={9}>
          <List component="nav" aria-label="mailbox folders">
            <TextField
              id="standard-basic"
              label="Search"
              fullWidth={true}
              value={selectText}
              onChange={onChangeSel}
              InputProps={{
                endAdornment: (
                  <InputAdornment>
                    <IconButton>
                      <SearchIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              // onChange={customFunction}
            />
          </List>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12} md={3} lg={3}>
          <List component="nav" aria-label="mailbox folders">
            <ListItem>
              <Grid container spacing={2}>
                <Grid item xs={3}>
                  Type
                </Grid>
                <Grid item xs={3}>
                  Veg
                  <Checkbox label="Top" labelPlacement="top" defaultChecked />
                </Grid>
                <Grid item xs={5}>
                  Non-Veg
                  <Checkbox label="Top" labelPlacement="top" defaultChecked />
                </Grid>
              </Grid>
            </ListItem>
            <Divider />
            <ListItem divider>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                  <Slider
                    getAriaLabel={() => "Temperature range"}
                    value={value}
                    onChange={handleChange}
                    min={0}
                    max={1439}
                    valueLabelFormat={valueLabelFormat}
                    valueLabelDisplay="auto"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="standard-basic"
                    label="Opening time"
                    fullWidth={true}
                    value={toTimeString(value[0])}
                    type="time"
                    onChange={OnSliderInputL}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment>
                          <IconButton>
                            <SearchIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="standard-basic"
                    label="Closing time"
                    fullWidth={true}
                    value={toTimeString(value[1])}
                    type="time"
                    onChange={OnSliderInputR}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment>
                          <IconButton>
                            <SearchIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </ListItem>
            <Divider />
            <ListItem>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-multiple-checkbox-label">
                      Tag
                    </InputLabel>
                    <Select
                      labelId="demo-multiple-checkbox-label"
                      id="demo-multiple-checkbox"
                      multiple
                      value={personName}
                      onChange={handleChangeShop}
                      input={<OutlinedInput label="Tag" />}
                      renderValue={(selected) => selected.join(", ")}
                      MenuProps={MenuProps}
                    >
                      {names.map((name) => (
                        <MenuItem key={name} value={name}>
                          <Checkbox checked={personName.indexOf(name) > -1} />
                          <ListItemText primary={name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </ListItem>
            <ListItem divider>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-multiple-checkbox-label">
                      Shops
                    </InputLabel>
                    <Select
                      labelId="demo-multiple-checkbox-label"
                      id="demo-multiple-checkbox"
                      multiple
                      value={personName}
                      onChange={handleChangeShop}
                      input={<OutlinedInput label="Tag" />}
                      renderValue={(selected) => selected.join(", ")}
                      MenuProps={MenuProps}
                    >
                      {names.map((name) => (
                        <MenuItem key={name} value={name}>
                          <Checkbox checked={personName.indexOf(name) > -1} />
                          <ListItemText primary={name} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </ListItem>
            <ListItem>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                  <h2>Price Sort</h2>
                </Grid>
                <Grid item xs={6}>
                  <Button onClick={PriceAsc} fullWidth variant="contained">
                    Ascending
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button onClick={PriceDesc} fullWidth variant="contained">
                    Descending
                  </Button>
                </Grid>
              </Grid>
            </ListItem>
            <ListItem divider>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                  <h2>Rating Sort</h2>
                </Grid>
                <Grid item xs={6}>
                  <Button fullWidth variant="contained">
                    Ascending
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button fullWidth variant="contained">
                    Descending
                  </Button>
                </Grid>
              </Grid>
            </ListItem>
            <Divider />
            <ListItem divider>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                  <Slider
                    getAriaLabel={() => "Temperature range"}
                    value={value}
                    onChange={handleChange}
                    min={0}
                    max={1439}
                    valueLabelFormat={valueLabelFormat}
                    valueLabelDisplay="auto"
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="standard-basic"
                    label="Minimum Price"
                    fullWidth={true}
                    value={value[0]}
                    onChange={OnSliderInputL}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment>
                          <IconButton>
                            <SearchIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="standard-basic"
                    label="Maximum Price"
                    fullWidth={true}
                    value={value[1]}
                    onChange={OnSliderInputR}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment>
                          <IconButton>
                            <SearchIcon />
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>
            </ListItem>
          </List>
          <Paper>
            <h2>Favourites</h2>
            {Items.map((item) =>
              favs.some((fav) => item.id == fav) ? (
                <Box sx={{ minWidth: 275 }}>
                  <Card variant="outlined">
                    <React.Fragment>
                      <CardContent>
                        <Typography variant="h5" component="div">
                          {favs.some((fav) => item.id == fav) ? (
                            <IconButton
                              onClick={() =>
                                onDelFav(item.id, item.vendor_email)
                              }
                              aria-label="delete"
                              size="large"
                            >
                              <StarIcon />
                            </IconButton>
                          ) : (
                            <IconButton
                              onClick={() => onFav(item.id, item.vendor_email)}
                              aria-label="delete"
                              size="large"
                            >
                              <StarBorderIcon />
                            </IconButton>
                          )}

                          {item.name}
                        </Typography>
                        <Typography sx={{ mb: 1.5 }} color="green">
                          <em>{item.price}$</em>
                        </Typography>
                        <Typography
                          sx={{ fontSize: 14 }}
                          color="text.secondary"
                          gutterBottom
                        >
                          {item.shop}
                        </Typography>
                        <Typography
                          sx={{ fontSize: 14 }}
                          color="text.secondary"
                          gutterBottom
                        >
                          {item.type}
                        </Typography>
                        <Typography variant="body2">
                          <h4>Addons:</h4>

                          {item.addons.map((addon) =>
                            a_sels.some(
                              (i) => i.id == item.id && i.addon == addon
                            ) ? (
                              <Chip
                                onClick={() => RemoveAddonBuy(item, addon)}
                                color="success"
                                label={addon.name + ", " + addon.price + "$"}
                              />
                            ) : (
                              <Chip
                                onClick={() => AddAddonBuy(item, addon)}
                                color="primary"
                                label={addon.name + ", " + addon.price + "$"}
                              />
                            )
                          )}
                        </Typography>
                        <br />
                        <Rating
                          name="read-only"
                          precision={0.1}
                          value={
                            item.num_ratings
                              ? item.rating / item.num_ratings
                              : 0
                          }
                          readOnly
                        />
                        <Typography variant="body2">
                          <h4>Tags:</h4>
                          {item.tags.map((tag) => (
                            <Chip label={tag} />
                          ))}
                        </Typography>
                      </CardContent>
                      <CardActions>
                        <Button size="small" onClick={() => Buy(item)}>
                          Buy
                        </Button>
                        <Button size="small">Delete</Button>
                      </CardActions>
                    </React.Fragment>
                  </Card>
                </Box>
              ) : (
                ""
              )
            )}
          </Paper>
        </Grid>
        <Grid item xs={12} md={9} lg={9}>
          <Paper>
            {" "}
            {SelectedFood.map((item) => (
              <Box sx={{ minWidth: 275 }}>
                <Card variant="outlined">
                  <React.Fragment>
                    <CardContent>
                      <Typography variant="h5" component="div">
                        {favs.some((fav) => item.id == fav) ? (
                          <IconButton
                            onClick={() => onDelFav(item.id, item.vendor_email)}
                            aria-label="delete"
                            size="large"
                          >
                            <StarIcon />
                          </IconButton>
                        ) : (
                          <IconButton
                            onClick={() => onFav(item.id, item.vendor_email)}
                            aria-label="delete"
                            size="large"
                          >
                            <StarBorderIcon />
                          </IconButton>
                        )}

                        {item.name}
                      </Typography>
                      <Typography sx={{ mb: 1.5 }} color="green">
                        <em>{item.price}$</em>
                      </Typography>
                      <Typography
                        sx={{ fontSize: 14 }}
                        color="text.secondary"
                        gutterBottom
                      >
                        {item.shop}
                      </Typography>
                      <Typography
                        sx={{ fontSize: 14 }}
                        color="text.secondary"
                        gutterBottom
                      >
                        {item.type}
                      </Typography>
                      <Typography variant="body2">
                        <h4>Addons:</h4>

                        {item.addons.map((addon) =>
                          a_sels.some(
                            (i) => i.id == item.id && i.addon == addon
                          ) ? (
                            <Chip
                              onClick={() => RemoveAddonBuy(item, addon)}
                              color="success"
                              label={addon.name + ", " + addon.price + "$"}
                            />
                          ) : (
                            <Chip
                              onClick={() => AddAddonBuy(item, addon)}
                              color="primary"
                              label={addon.name + ", " + addon.price + "$"}
                            />
                          )
                        )}
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

                        {item.tags.map((tag) => (
                          <Chip label={tag} />
                        ))}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" onClick={() => Buy(item)}>
                        Buy
                      </Button>
                      <Button size="small">Delete</Button>
                    </CardActions>
                  </React.Fragment>
                </Card>
              </Box>
            ))}
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default UsersList;
