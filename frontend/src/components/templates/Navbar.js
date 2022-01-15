import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const Navbar = (props) => {
  const navigate = useNavigate();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ cursor: "pointer" }}
            onClick={() => navigate("/")}
          >
            Canteen Portal
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Button color="inherit" onClick={() => navigate("/users")}>
            Users
          </Button>
          {props.user ? null : (
            <Button color="inherit" onClick={() => navigate("/register")}>
              Register
            </Button>
          )}
          {props.user ? (
            <Button color="inherit" onClick={() => navigate("/logout")}>
              Logout
            </Button>
          ) : (
            <Button color="inherit" onClick={() => navigate("/login")}>
              Login
            </Button>
          )}
          <Button color="inherit" onClick={() => navigate("/profile")}>
            My Profile
          </Button>
          {props.user
            ? "Welcome " + props.user + "!, you are a " + props.userType
            : null}
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
