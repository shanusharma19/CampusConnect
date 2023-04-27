import React from "react";
import { Link } from "react-router-dom";
const Content = ({ Page }) => {
  return (
    <>
      <div className="content">
        <Page />
      </div>
    </>
  );
};

export default Content;
