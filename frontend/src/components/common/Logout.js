const Logout = (props) => {
    localStorage.removeItem("Auth");
    props.onAuth("");
};

export default Logout;
