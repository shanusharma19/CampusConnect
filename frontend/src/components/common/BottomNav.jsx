import * as React from "react";
import { useEffect, useRef } from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import FolderIcon from "@mui/icons-material/Folder";
import HomeIcon from "@mui/icons-material/Home";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
} from "react-router-dom";

const BottomNav = () => {
  const home = useRef();
  const store = useRef();
  const partner = useRef();
  const hackathon = useRef();
  const [value, setValue] = React.useState("recents");
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  useEffect(() => {
          if(window.location.pathname=='/')
          home.current.click()

          if(window.location.pathname=='/store')
          store.current.click()

          if(window.location.pathname=='/partner')
          partner.current.click()

          if(window.location.pathname=='/hackathon')
          hackathon.current.click()
  }, []);

  return (
    <>
      <BottomNavigation
        style={{
          backgroundColor: "rgb(249,251,250)",
          position: "fixed",
          boxShadow: "0 -5px 10px 0 rgba(0,0,0,.06)",
          borderRadius: "15px 15px 0px 0px",
          top: "92.4%",
          width: "100%",
          zIndex: "10",
        }}
        sx={{ width: 500 }}
        value={value}
        onChange={handleChange}
      >
        {/* <Link style={{ textDecoration: "none" }} to="/"> */}
        <BottomNavigationAction
          ref={home}
          component={Link}
          to="/"
          label="Home"
          value="home"
          icon={<HomeIcon />}
        />
        {/* </Link> */}

        {/* <Link style={{ textDecoration: "none" }} to="/store"> */}
          <BottomNavigationAction
            ref={store}
            component={Link}
            to="/store"
            label="Store"
            value="store"
            icon={<LocalGroceryStoreIcon />}
          />
        {/* </Link> */}

        {/* <Link style={{ textDecoration: "none" }} to="/partner"> */}
          <BottomNavigationAction
            ref={partner}
            component={Link}
            to="/partner"
            label="Partner"
            value="partner"
            icon={<PeopleAltIcon />}
          />
        {/* </Link> */}

        {/* <Link style={{ textDecoration: "none" }} to="/hackathon"> */}
          <BottomNavigationAction
            ref={hackathon}
            component={Link}
            to="/hackathon"
            label="Hackathon"
            value="hackathon"
            icon={<EmojiEventsIcon />}
          />
        {/* </Link> */}
      </BottomNavigation>
    </>
  );
};

export default BottomNav;
// class="MuiBottomNavigationAction-label Mui-selected css-imwso6-MuiBottomNavigationAction-label"