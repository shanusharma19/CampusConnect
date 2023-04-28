import React,{useEffect, useState} from "react";
import UncontrolledExample from "../components/HomeComponents/UncontrolledExample";

const Home = () => {

  const [Name, setName] = useState();
  
  const init = async () => {
  const res = await fetch("http://localhost:5000/").catch((err) => err);
  const {data} = await res.json();
  setName(data[0].name);
  console.log(data[0])
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
