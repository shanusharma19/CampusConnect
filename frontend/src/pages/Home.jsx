import React,{useEffect, useState} from "react";
import UncontrolledExample from "../components/HomeComponents/UncontrolledExample";

const Home = () => {

  const [Name, setName] = useState();
  
  const init = async () => {
  const res = await fetch("http://localhost:3000/student/1").catch((err) => err);
  const data = await res.json();
  setName(data.name);
  }
  
  useEffect(() => {
    init();
  }, []);
  return (
    <>
      <div>
        <h2 className="primary">Hello,</h2>
        <h2 className="primary">{Name}</h2>
      </div>
      <UncontrolledExample></UncontrolledExample>
    </>
  );
};

export default Home;
