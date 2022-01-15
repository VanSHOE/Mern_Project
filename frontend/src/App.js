import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import "./App.css";
import { useState } from "react";
import UsersList from "./components/users/UsersList";
import Home from "./components/common/Home";
import Register from "./components/common/Register";
import Login from "./components/common/Login";
import Logout from "./components/common/Logout";
import Navbar from "./components/templates/Navbar";
import Profile from "./components/users/Profile";

const Layout = (props) => {
  return (
    <div>
      <Navbar user={props.user} />
      <div className="container">
        <Outlet />
      </div>
    </div>
  );
};

function App() {
  const [Authed, setAuthed] = useState("");
  if (localStorage.getItem("Auth") && !Authed) {
    setAuthed(localStorage.getItem("Auth"));
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout user={Authed} />}>
          <Route path="/" element={<Home />} />
          <Route path="users" element={<UsersList />} />
          {Authed ? null : (
            <Route path="register" element={<Register onAuth={setAuthed} />} />
          )}
          {Authed ? (
            <Route path="logout" element={<Logout onAuth={setAuthed} />} />
          ) : (
            <Route path="login" element={<Login onAuth={setAuthed} />} />
          )}
          <Route path="profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
