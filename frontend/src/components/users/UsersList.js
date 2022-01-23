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

const UsersList = (props) => {
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

  let SelectedFood = fuse.search(selectText);
  SelectedFood = SelectedFood.map((item) => item.item);
  if (!selectText) SelectedFood = Items;
  console.log(SelectedFood);
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
                <Grid item xs={12}>
                  Salary
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="standard-basic"
                    label="Enter Min"
                    fullWidth={true}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    id="standard-basic"
                    label="Enter Max"
                    fullWidth={true}
                  />
                </Grid>
              </Grid>
            </ListItem>
            <Divider />
            <ListItem divider>
              <Autocomplete
                id="combo-box-demo"
                options={users}
                getOptionLabel={(option) => option.name}
                fullWidth
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Select Names"
                    variant="outlined"
                  />
                )}
              />
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
