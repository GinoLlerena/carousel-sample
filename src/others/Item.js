import React from "react";

const Item = (props) => {
  const { data } = props;
  const { src } = data;
  return (
    <div className="item">
      <img alt="" src={src} />
      <p className="legend">Legend 1</p>
    </div>
  );
};

export default Item;
