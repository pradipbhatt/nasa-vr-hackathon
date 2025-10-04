import React from "react";

interface CardDProps {
  icon: string;
  title: string;
  description: string;
}

const Card: React.FC<CardDProps> = (props) => {
  return (
    <div className="bg-gray-200/10 border border-gray-300/20 p-6 rounded-lg shadow-lg w-100 h-auto ">
      <div className="flex">
        <img src={props.icon} alt="Icon" className="mb-6 mr-6 w-auto h-8" />
        <h2 className="text-xl font-semibold mb-4">{props.title}</h2>
      </div>
      <p className="text-base text-gray-400">{props.description}</p>
    </div>
  );
};

export default Card;
