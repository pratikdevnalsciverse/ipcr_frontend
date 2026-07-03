import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import vector_left from '../../assets/images/vector_left.svg';
import vector_right from '../../assets/images/vector_right.svg';
import ipcr_machine from '../../assets/images/IPCR_Machine.svg';
import bhat_biotech_icon from '../../assets/images/BhatBioTechLogo.svg';
import ipcr_text from '../../assets/images/I-PCR.svg';
export const Initialization = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full h-full flex flex-col justify-center items-center relative overflow-hidden">
      <div className="w-fit absolute top-0 left-0">
        <img src={vector_left} alt="vector_left" />
      </div>
      <div className="w-[1740px] h-235 z-10 rounded-4xl border border-white/40 bg-white/35 backdrop-blur-[18px] shadow-[0px_0px_7.7px_0px_rgba(0,0,0,0.10)] flex justify-center items-center">
        <div className="flex flex-col h-full gap-12 w-1/2 justify-center items-center">
          <img className="h-24" src={ipcr_text} alt="" />
          <div className="relative w-75 h-75 flex justify-center items-center">
            <div className="absolute w-full h-full rounded-full bg-[conic-gradient(#ffffff_0%,#f1faee_25%,#a8dadc_50%,#457b9d_75%,#1D34AF_100%)] [mask-image:radial-gradient(circle,transparent_67%,#000_68%)] [-webkit-mask-image:radial-gradient(circle,transparent_67%,#000_68%)] animate-[spin_1.5s_linear_infinite]"></div>
            <span className="absolute text-5xl font-medium text-[#333333] tracking-[0.5px]">
              Initializing
            </span>
          </div>
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="w-140 h-36 rounded-full bg-secondary text-white text-5xl font-medium hover:bg-secondary-hover"
          >
            System Check
          </button>
        </div>
        <div className="flex flex-col h-full gap-12 w-1/2 items-center justify-end pb-20 relative">
          <img
            className=" h-40 absolute right-10 top-10"
            src={bhat_biotech_icon}
            alt="Bhat BioTech Logo"
          />
          <img className="w-208 h-148" src={ipcr_machine} alt="ipcr machine" />
        </div>
      </div>
      <div className="w-fit absolute bottom-0 right-0">
        <img src={vector_right} alt="vector_right" />
      </div>
    </div>
  );
};

export default Initialization;
