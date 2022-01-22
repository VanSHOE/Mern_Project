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
  const [Items, setItems] = useState([]);

  const [OP, setOP] = useState("");
  const [PO, setPO] = useState("");
  const [CO, setCO] = useState("");

  // console.log(a_sels);
  useEffect(() => {
    axios
      .get("http://localhost:4000/order/stats", {
        params: { v_email: props.user },
      })
      .then((response) => {
        setItems(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      <Grid container>
        <Grid item xs={4}>
          <List component="nav" aria-label="mailbox folders">
            <TextField
              id="filled-basic"
              label="Orders Placed"
              variant="filled"
              value={OP}
              disabled
              fullWidth
            />
          </List>
        </Grid>
        <Grid item xs={4}>
          <List component="nav" aria-label="mailbox folders">
            <TextField
              id="filled-basic"
              label="Pending Orders"
              variant="filled"
              value={PO}
              disabled
              fullWidth
            />
          </List>
        </Grid>
        <Grid item xs={4}>
          <List component="nav" aria-label="mailbox folders">
            <TextField
              id="filled-basic"
              label="Completed Orders"
              variant="filled"
              value={CO}
              disabled
              fullWidth
            />
          </List>
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12} md={9} lg={9}>
          <Paper>
            {" "}
            {Items.map((item) => (
              <Box sx={{ minWidth: 275 }}>
                <Card variant="outlined">
                  <React.Fragment>
                    <CardContent>
                      <Typography variant="h5" component="div">
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

                        {item.addons.map((addon) => (
                          <Chip
                            color="primary"
                            label={addon.name + ", " + addon.price + "$"}
                          />
                        ))}
                      </Typography>
                      <br />
                      <Rating
                        name="read-only"
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
