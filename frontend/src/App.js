import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import "./App.css";
import { useState } from "react";
import UsersList from "./components/users/UsersList";
import Home from "./components/common/Home";
import Register from "./components/common/Register";
import AddFood from "./components/common/AddFood";
import Login from "./components/common/Login";
import Logout from "./components/common/Logout";
import Navbar from "./components/templates/Navbar";
import Profile from "./components/users/Profile";
import { Navigate } from "react-router-dom";
const Layout = (props) => {
  return (
    <div>
      <Navbar
        user={props.user}
        userType={props.userType}
        money={props.Wallet}
      />
      <div className="container">
        <Outlet />
      </div>
    </div>
  );
};

function App() {
  const [Authed, setAuthed] = useState("");
  const [AuthedType, setAuthedType] = useState("");
  const [Money, setWallet] = useState(0);
  if (localStorage.getItem("Auth") && !Authed) {
    setAuthed(localStorage.getItem("Auth"));
    setAuthedType(localStorage.getItem("AuthT"));
    setWallet(localStorage.getItem("Wallet"));
  }
  //console.log(Money);
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout user={Authed} userType={AuthedType} Wallet={Money} />
          }
        >
          <Route
            path="/"
            element={<Home user={Authed} userType={AuthedType} />}
          />
          <Route path="users" element={<UsersList />} />
          {Authed ? (
            <Route path="register" element={<Navigate to="/" />} />
          ) : (
            <Route
              path="register"
              element={<Register onAuth={setAuthed} onAuthT={setAuthedType} />}
            />
          )}
          {Authed ? (
            <Route
              path="logout"
              element={
                <Logout
                  onAuthW={setWallet}
                  onAuth={setAuthed}
                  onAuthT={setAuthedType}
                />
              }
            />
          ) : (
            <Route path="logout" element={<Navigate to="/login" />} />
          )}
          {Authed && AuthedType == "Vendor" ? (
            <Route path="item/add" element={<AddFood user={Authed} />} />
          ) : (
            <Route path="item/add" element={<Navigate to="/" />} />
          )}
          {Authed ? (
            <Route path="login" element={<Navigate to="/" />} />
          ) : (
            <Route
              path="login"
              element={
                <Login
                  onAuthW={setWallet}
                  onAuth={setAuthed}
                  onAuthT={setAuthedType}
                />
              }
            />
          )}

          <Route
            path="profile"
            element={
              <Profile
                onAuthW={setWallet}
                onAuth={setAuthed}
                onAuthT={setAuthedType}
              />
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
