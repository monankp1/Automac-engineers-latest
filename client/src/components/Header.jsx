import React from "react";
import Logo from "./../resources/images/logo.jpg";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const naivgate = useNavigate();

  return (
    <div className="flex border p-4 ">
      <div className="flex  basis-2/4 items-center">
        <div className="">
          <img src={Logo} alt="Not available" width={100} height={100} />
        </div>
        <div className="ml-10 text-xl font-bold">
          <button onClick={() => naivgate("/")}>Home</button>
        </div>
      </div>
      <div className="flex justify-end basis-2/4">
        <div className="border p-2 rounded-lg text-white bg-black">
          <button>Add Data</button>
        </div>
        <div className="ml-4 border p-2 rounded-lg text-white bg-black">
          <button onClick={() => naivgate("/certificate")}>
            Create Certificate
          </button>
        </div>
      </div>
    </div>
  );
};

export default Header;
