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
import Plot from "react-plotly.js";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { v4 as uuidv4 } from "uuid";
import Fuse from "fuse.js";

const Stat = (props) => {
  const [users, setUsers] = useState([]);
  const [Items, setItems] = useState([]);

  const [batchY, setBY] = useState([]);

  const [ageX, setAX] = useState([]);
  const [ageY, setAY] = useState([]);

  const [OP, setOP] = useState("");
  const [PO, setPO] = useState("");
  const [CO, setCO] = useState("");

  //console.log(props.user);
  useEffect(() => {
    axios
      .get("/order/stats", {
        params: { v_email: props.user },
      })
      .then((response) => {
        console.log("test");
        setItems(response.data);
        setOP(response.data.num_orders);
        setPO(response.data.num_pen);
        setCO(response.data.num_comp);
        setBY(response.data.batch_y);
        setAX(response.data.age_x);
        setAY(response.data.age_y);
      })
      .catch((error) => {
        console.log(":(");
        console.log(error);
      });
  }, []);
  //console.log(Items);
  console.log(ageX);
  if (Items && Items.sorted && Items.sorted.length) {
    return (
      <div>
        <Grid container alignItems="center" justifyItems="center">
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
          <Grid item xs={12}>
            <Plot
              data={[
                {
                  type: "bar",
                  x: ["UG1", "UG2", "UG3", "UG4", "UG5"],
                  y: batchY,
                },
              ]}
              layout={{ title: "Batch-wise completed orders", autosize: true }}
              useResizeHandler="true"
              style={{ width: "100%", height: "100%" }}
            />
          </Grid>
          <Grid item xs={12}>
            <Plot
              data={[{ type: "bar", x: ageX, y: ageY }]}
              layout={{ title: "Age-wise completed orders", autosize: true }}
              useResizeHandler="true"
              style={{ width: "100%", height: "100%" }}
            />
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12} md={9} lg={9}>
            <Paper>
              {" "}
              {Items.sorted.map((item) => (
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
                        <Typography
                          sx={{ fontSize: 14 }}
                          color="text.primary"
                          gutterBottom
                        >
                          Times sold: {item.sold}
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
  } else return "";
};

export default Stat;
