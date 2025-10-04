import React from "react";

interface CardProps {
  icon: string;
  title: string;
  description: string;
}

const Card: React.FC<CardProps> = (props) => {
  return (
    <div className="bg-gray-200/10 border border-gray-300/20 p-6 rounded-lg shadow-lg text-center w-100 h-auto hover:scale-105 transition-transform duration-200">
      <img src={props.icon} alt="Icon" className="mx-auto mb-6 w-16 h-16" />
      <h2 className="text-2xl font-semibold mb-4">{props.title}</h2>
      <p className="text-base text-gray-400">{props.description}</p>
    </div>
  );
};

export default Card;
