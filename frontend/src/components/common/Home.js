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
const Home = (props) => {
  const navigate = useNavigate();
  const [Items, setItems] = useState([]);
  const [details, setDetails] = useState([]);
  let email_cur = props.user;
  useEffect(() => {
    axios
      .get("http://localhost:4000/item", {
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

  const onDelete = (Name) => {
    console.log(Name + " " + props.user);
    let email_cur = props.user;
    let vendor_cur;

    const newFood = {
      name: Name,
      vendor_email: email_cur,
    };
    console.log(newFood);
    axios.post("http://localhost:4000/item/del", newFood).then((response) => {
      axios
        .get("http://localhost:4000/item", {
          params: { vendor_email: email_cur },
        })
        .then((response) => {
          setItems(response.data);
        });
      console.log("Deleted");
    });
  };

  return (
    <Stack spacing={2}>
      <Button
        variant="contained"
        color="success"
        onClick={() => navigate("/item/add")}
      >
        Add Item
      </Button>
      {Items.map((item) => (
        <Box sx={{ minWidth: 275 }}>
          <Card variant="outlined">
            <React.Fragment>
              <CardContent>
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
                      <Chip label={addon} />
                    ))}
                  </Stack>
                </Typography>
                <br />
                <Rating
                  name="read-only"
                  value={item.num_ratings ? item.rating / item.num_ratings : 0}
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
                <Button size="small">Edit</Button>
                <Button onClick={() => onDelete(item.name)} size="small">
                  Delete
                </Button>
              </CardActions>
            </React.Fragment>
          </Card>
        </Box>
      ))}
    </Stack>
  );
};

export default Home;
