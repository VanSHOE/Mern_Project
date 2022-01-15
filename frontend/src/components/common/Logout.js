import { Navigate } from "react-router-dom";
const Logout = (props) => {
  localStorage.removeItem("Auth");
  localStorage.removeItem("AuthT");
  props.onAuth("");
  props.onAuthT("");

  return <Navigate to="/" />;
};

export default Logout;
