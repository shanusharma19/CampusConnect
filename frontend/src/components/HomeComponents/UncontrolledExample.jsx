import React, { useState, useEffect } from "react";

function UncontrolledExample() {
  const [CurrentIndex, setCurrentIndex] = useState(0);

  const slides = [
    {
      url: "https://srmap.edu.in/wp-content/uploads/2022/01/srm-hackthon-v1.jpg",
      title: "beach",
    },
    {
      url: "https://ub.ac.id/wp-content/uploads/2022/03/Flyer_Hackathon-2022.jpg",
      title: "boat",
    },
    {
      url: "https://prod.sairam.edu.in/wp-content/uploads/sites/12/2019/08/SIH-2021446.png",
      title: "forest",
    },
    {
      url: "https://149695847.v2.pressablecdn.com/wp-content/uploads/2021/10/2-768x432.jpg",
      title: "city",
    },
    {
      url: "https://i.ytimg.com/vi/JWxcEL4mg_Q/maxresdefault.jpg",
      title: "italy",
    },
  ];
  const containerStyles = {
    width: "100%",
    height: "20vh",
    margin: "25px auto",
  };
  const slideStyles = {
    width: "100%",
    height: "100%",
    borderRadius: "10px",
    backgroundSize: "cover",
    backgroundPosition: "center",
  };

  const rightArrowStyles = {
    position: "absolute",
    top: "50%",
    transform: "translate(0, -50%)",
    right: "32px",
    fontSize: "45px",
    color: "#fff",
    zIndex: 1,
    cursor: "pointer",
  };

  const leftArrowStyles = {
    position: "absolute",
    top: "50%",
    transform: "translate(0, -50%)",
    left: "32px",
    fontSize: "45px",
    color: "#fff",
    zIndex: 1,
    cursor: "pointer",
  };

  const sliderStyles = {
    position: "relative",
    height: "100%",
  };

  const dotsContainerStyles = {
    display: "flex",
    justifyContent: "center",
  };

  const dotStyle = {
    margin: "0 3px",
    cursor: "pointer",
    fontSize: "20px",
  };

  const goToPrevious = () => {
    const isFirstSlide = CurrentIndex === 0;
    const newIndex = isFirstSlide ? slides.length - 1 : CurrentIndex - 1;
    setCurrentIndex(newIndex);
  };
  const goToNext = () => {
    const isLastSlide = CurrentIndex === slides.length - 1;
    const newIndex = isLastSlide ? 0 : CurrentIndex + 1;
    setCurrentIndex(newIndex);
  };
  const goToSlide = (slideIndex) => {
    setCurrentIndex(slideIndex);
  };
  const slideStylesWidthBackground = {
    ...slideStyles,
    backgroundImage: `url(${slides[CurrentIndex].url})`,
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((CurrentIndex) => {
        if(CurrentIndex==4) return CurrentIndex-4;
        else return CurrentIndex + 1
      })
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <div style={containerStyles}>
        <div style={sliderStyles}>
          <div>
            <div onClick={goToPrevious} style={leftArrowStyles}>
              ❰
            </div>
            <div onClick={goToNext} style={rightArrowStyles}>
              ❱
            </div>
          </div>
          <div style={slideStylesWidthBackground}></div>
          <div style={dotsContainerStyles}>
            {slides.map((slide, slideIndex) => (
              <div
                style={dotStyle}
                key={slideIndex}
                onClick={() => goToSlide(slideIndex)}
              >
                ●
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default UncontrolledExample;

