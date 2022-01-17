import { useState, useEffect } from "react";
import axios from "axios";
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

  return Items.map((item) => (
    <div style={{ textAlign: "center" }}>Happy {item.name} Cosding</div>
  ));
};

export default Home;
