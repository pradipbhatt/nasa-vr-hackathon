import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaLinkedin, FaGithub, FaFacebook } from "react-icons/fa";

type CardProps = {
  profile: string;
  name: string;
  role: string;
  description: string;
  linkedin: string;
  github: string;
  facebook: string;
};

const Card: React.FC<CardProps> = (props) => {
  return (
    <div className="bg-gray-200/10 border border-gray-300/20 p-4 rounded-lg shadow-md text-center w-80 h-82 relative flex flex-col justify-between hover:scale-105 transition-transform duration-200">
      <div className="flex flex-col items-center">
        <Image src={props.profile} alt="profile picture" width={120} height={120} className="rounded-full mx-auto mb-3 border-2 border-cyan-500" />
        <h2 className="text-lg font-semibold">{props.name}</h2>
        <p className="text-base text-cyan-200 bg-cyan-300/10 rounded-full w-fit h-6 grid place-items-center px-4 mb-3">{props.role}</p>
        <p className="text-base">{props.description}</p>
      </div>
      <div className="flex justify-center space-x-4 mt-4 text-gray-400 text-xl">
        <Link href={props.linkedin}>
          <FaLinkedin className="hover:text-[#0072b1] transition-colors duration-200" />
        </Link>
        <Link href={props.github}>
          <FaGithub className="hover:text-[#ffffff] transition-colors duration-200" />
        </Link>
        <Link href={props.facebook}>
          <FaFacebook className="hover:text-[#1877f2] transition-colors duration-200" />
        </Link>
      </div>
    </div>
  );
};

export default Card;
