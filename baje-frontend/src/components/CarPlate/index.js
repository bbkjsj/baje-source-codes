import React from "react";
import "./carplate.css";

const CarPlate = ({
  plaque1 = 76,
  plaque2 = "ق",
  plaque3 = 688,
  plaque4 = 77,
}) => {
  return (
    <div class="carplate-codepen-wrapper">
      <div class="carplate-registration-ui">
        <div class="carplate-plate-1">
          <span>{plaque3}</span>
          <span>{plaque2}</span>
          <span>{plaque1}</span>
        </div>
        <span class="carplate-plate-2">{plaque4}</span>
      </div>
    </div>
  );
};

export default CarPlate;
