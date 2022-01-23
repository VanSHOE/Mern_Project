import * as React from "react";
import { useNavigate } from "react-router-dom";
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

const Orders = (props) => {
  const [EdN, setEDN] = useState("");
  const [EdV, setEDV] = useState("");
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
  const [cur_rating, setRat] = useState(0);
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
    setAddons([...Addons, cur_addon]);
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
  };
  const toStatus = (val) => {
    let text = "";
    switch (val) {
      case 0:
        text = "PLACED";
        break;
      case 1:
        text = "ACCEPTED";
        break;
      case 2:
        text = "COOKING";
        break;
      case 3:
        text = "READY FOR PICKUP";
        break;
      case 4:
      case 5:
        text = "COMPLETED";
        break;
      case -1:
        text = "REJECTED";
        break;
    }
    return text;
  };

  const navigate = useNavigate();
  const [Items, setItems] = useState([]);
  const [cur_edit, setCEdit] = useState("");
  const [details, setDetails] = useState([]);

  let email_cur = props.user;
  useEffect(() => {
    axios
      .get("http://localhost:4000/order", {
        params: { b_email: email_cur },
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
  const onChangeRating = (item, event) => {
    const sendRateObj = {
      id: item.id,
      rating: event.target.value,
      food_id: item.food_id,
    };
    axios
      .post("http://localhost:4000/order/rate", sendRateObj)
      .then((response_outer) => {
        axios
          .get("http://localhost:4000/order", {
            params: { b_email: email_cur },
          })
          .then((response) => {
            setItems(response.data);
          });
      });
  };
  const Item = styled(Paper)(({ theme }) => ({
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: "center",
    color: theme.palette.text.secondary,
  }));
  console.log(cur_rating);

  let cur_user = props.user;
  let cur_user_type = props.userType;

  return props.user ? (
    props.userType == "Buyer" ? (
      <Stack spacing={2}>
        {Items.map((item) => (
          <div>
            <Box sx={{ minWidth: 275 }}>
              <Card variant="outlined">
                <React.Fragment>
                  <CardContent>
                    <Typography
                      sx={{ fontSize: 14 }}
                      color="text.secondary"
                      gutterBottom
                    >
                      {item.time}, {item.date}
                    </Typography>
                    <Typography variant="h5" component="div">
                      {item.items[0].name}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="green">
                      <em>{item.items[0].price}$</em>
                    </Typography>
                    <Typography variant="body2">
                      <h4>Addons:</h4>
                      <Stack direction="row" spacing={1}>
                        {item.add_ons.map((addon) => (
                          <Chip label={addon.name + ", " + addon.price + "$"} />
                        ))}
                      </Stack>
                    </Typography>
                    <br />
                    <Typography variant="h9">
                      Vendor Name: {item.items[0].vendor}
                    </Typography>
                    <br /> <br />
                    <Typography variant="h9">Quantity: {item.qty}</Typography>
                    <br /> <br />
                    <Typography variant="h9">
                      Status: {toStatus(item.status)}
                    </Typography>
                    <br /> <br />
                    {item.status == 4 ? (
                      <Rating
                        name="Rate"
                        value={2}
                        precision={0.1}
                        size="large"
                        onChange={(event) => onChangeRating(item, event)}
                      />
                    ) : (
                      ""
                    )}
                    {item.status != 4 ? (
                      <Rating
                        name="read-only"
                        value={item.rating}
                        precision={0.1}
                        size="small"
                        readOnly
                      />
                    ) : (
                      ""
                    )}
                  </CardContent>
                </React.Fragment>
              </Card>
            </Box>
          </div>
        ))}
      </Stack>
    ) : (
      "Vendor"
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

export default Orders;
