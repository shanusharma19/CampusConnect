import React from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import "../../styles/Navbar.css";
import logo from "../../assets/images/logo3.png";

const Navbar = () => {
  return (
    <>
      <div className="nav">
        <div className="">
          <p
            style={{
              fontSize: "20px",
              margin: "-15px 0px 4px 0px",
              fontWeight: "600",
            }}
          >
            <img
              style={{ width: "60px", margin: "8px -7px 0px" }}
              src={logo}
            />
          </p>
        </div>

        <div className="icons">
          <div className="icon notify">
            <NotificationsIcon />
          </div>
          <div className="icon"></div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
