import * as React from "react";
import { useState, useEffect } from "react";
import axios from "axios";
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
  const [Items, setItems] = useState([]);
  const [details, setDetails] = useState([]);
  let email_cur = localStorage.getItem("Auth");
  useEffect(() => {
    axios
      .post("http://localhost:4000/user/profile", { email: email_cur }) // unimplemented
      .then((response) => {
        //console.log(response.data);
        axios
          .get("http://localhost:4000/item", {
            params: { vendor: response.data.name },
          })
          .then((response1) => {
            setItems(response1.data);
            // console.log(response1);
          });
      })
      .catch(function (error) {
        console.log(error);
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

  return (
    <Stack spacing={5}>
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
                <Typography sx={{ mb: 1.5 }} color="text.secondary">
                  {item.price}$
                </Typography>
                <Typography variant="body2">
                  <h4>Addons:</h4>
                  <Stack direction="row" spacing={1}>
                    {item.addons.map((addon) => (
                      <Item>{addon}</Item>
                    ))}
                  </Stack>
                </Typography>
                <br />
                <Rating name="read-only" value={item.rating} readOnly />
                <Typography variant="body2">
                  <h4>Tags:</h4>
                  <Stack direction="row" spacing={1}>
                    {item.tags.map((tag) => (
                      <Item>{tag}</Item>
                    ))}
                  </Stack>
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small">Edit</Button>
                <Button size="small">Delete</Button>
              </CardActions>
            </React.Fragment>
          </Card>
        </Box>
      ))}
    </Stack>
  );
};

export default Home;
