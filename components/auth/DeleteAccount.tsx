"use client";

import Image from "next/image";
import DeactiveIcon from "../svgIcon/DeactiveIcon";

const DeleteAccount = () => {
  return (
    <div className="bg-[#ffffff] p-8 lg:w-[30vw] space-y-6 rounded-xl">
      <div className="flex justify-center items-center py-2">
        <span className="text-xl font-bold tracking-wider text-gray-800 dark:text-white">
          PH <span className="text-violet-500">TASKS</span>
        </span>
      </div>
      <div className="flex justify-center">
        <DeactiveIcon />
      </div>
      <h1 className="text-gray-700 font-bold text-center">
        Account Deactivated
      </h1>
      <p className="flex items-center justify-center text-center text-sm px-6 text-[#a2b1ca]">
        Your account is currently deactive. Reactive now to regain access to all
        features and opportunities
      </p>

      <button className="w-full p-2 rounded-lg transition bg-yellow-500 text-white hover:bg-[#ffc500] duration-300 cursor-pointer">
        Reactive Now
      </button>
    </div>
  );
};

export default DeleteAccount;
