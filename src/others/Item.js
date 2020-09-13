import React from "react";

const Item = (props) => {
  const { data, itemIndex } = props;
  const { src } = data;
  return (
    <div className="item">
      <img alt="" src={src} />
      <p className="legend">{`Legend ${parseInt(itemIndex) + 1}`}</p>
    </div>
  );
};

export default Item;
