import * as React from "react";
// import 'bootstrap/dist/css/bootstrap.min.css';
// import $ from 'jquery';
// import Popper from 'popper.js';
// import 'bootstrap/dist/js/bootstrap.bundle.min';
import BottomNav from "./common/BottomNav.jsx";
import Home from "../pages/Home.jsx";
import Store from "../pages/Store.jsx";
import Partner from "../pages/Partner.jsx";
import Hackathon from "../pages/Hackathon.jsx";
import Content from "./common/Content.jsx";
import Navbar from "./common/Navbar.jsx";
import "../styles/App.css";
import "../styles/Content.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

const App = () => {
  return (
    <>
      <Router>
        <Navbar />
        <Switch>
          <Route exact path="/">
            <Content Page={Home}></Content>
          </Route>
          <Route path="/store">
            <Content Page={Store}></Content>
          </Route>
          <Route path="/partner">
            <Content Page={Partner}></Content>
          </Route>
          <Route path="/hackathon">
            <Content Page={Hackathon}></Content>
          </Route>
        </Switch>
        <BottomNav />
      </Router>
    </>
  );
};
export default App;
