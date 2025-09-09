import React from "react";

// This is the component of the single flash card
export default function FlashCards({ data }) {
  const card = data;
  console.log("FLASH CARD: ", card);

  return (
    <div>
      {card.map((item) => (
        <div key={item.id}>
          <h3>{item.term}</h3>
          <p>{item.description}</p>
          <p>Area: {item.areaId}</p>
          <br />
        </div>
      ))}
      <h1>{data.term}</h1>
    </div>
  );
}
