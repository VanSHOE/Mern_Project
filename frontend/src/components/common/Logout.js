import { Navigate } from "react-router-dom";
const Logout = (props) => {
  localStorage.removeItem("Auth");
  localStorage.removeItem("AuthT");
  localStorage.removeItem("Wallet");
  props.onAuth("");
  props.onAuthT("");
  props.onAuthW("");
  return <Navigate to="/" />;
};

export default Logout;
