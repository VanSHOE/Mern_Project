import axios from "axios";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
const Profile = (props) => {
  const [details, setDetails] = useState([]);
  let email = localStorage.getItem("Auth");

  useEffect(() => {
    axios
      .post("http://localhost:4000/user/profile", { email: email }) // unimplemented
      .then((response) => {
        setDetails(response.data);
      })
      .catch(function (error) {
        console.log(error);
      });
  }, []);
  if (!email) {
    return <Navigate to="/login" />;
  }
  return <div>test</div>;
};

export default Profile;
