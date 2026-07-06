import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExperimentDataContext } from '../../store/Context/ExperimentDataContext';
import back from '../../assets/images/back.svg';
import homeIcon from '../../assets/images/home.svg';
import right_arrow from '../../assets/images/right_arrow.svg';

export const SamplePreview = () => {
  const { ExperimentData } = useContext(ExperimentDataContext);
  const navigate = useNavigate();

  const leftfunc = () => {
    navigate('/sample-entry');
  };

  const rightfunc = () => {
    navigate('/insert-cartridge');
  };

  return (
    <div className="w-full h-full bg-[#F5F6F7] font-poppins px-5 py-8">
      <div className="grid grid-rows-12 gap-5 h-full">
        <div className="row-span-9 w-full flex flex-col items-center gap-10">
          <h1 className="font-semibold text-[#353940] text-[50px]">
            Confirm Sample Details
          </h1>

          <div className="w-10/12 h-fit max-h-5/6 overflow-y-auto rounded-[10px] bg-white shadow-sm border-2 border-[#353940]">
            {/* Header */}
            <div className="bg-[#a6abd6] border-b-2 border-gray-800 text-[40px] text-[#1a1a1a] sticky top-0 z-10 h-32 grid grid-cols-3 items-center text-center font-poppins">
              <div className="py-3 px-10 border-r-2 border-gray-800 h-full flex items-center justify-center font-bold">
                Well No.
              </div>
              <div className="py-3 px-10 border-r-2 border-gray-800 h-full flex items-center justify-center font-bold">
                Sample ID
              </div>
              <div className="py-3 px-10 h-full flex items-center justify-center font-bold">
                Patient ID
              </div>
            </div>

            {/* Body */}
            <div className="text-5xl text-[#353940]">
              {(ExperimentData?.Samples || []).map((row, index) =>
                row.sample_id ? (
                  <div
                    key={index}
                    className="border-b border-gray-800 h-28 grid grid-cols-3 items-center text-center"
                  >
                    <div className="py-3 px-10 border-r border-gray-800 h-full flex items-center justify-center">
                      {row.well_number.toString().padStart(2, '0')}
                    </div>
                    <div className="py-3 px-10 border-r border-gray-800 h-full flex items-center justify-center overflow-hidden">
                      <span className="truncate w-full block">{row.sample_id}</span>
                    </div>
                    <div className="py-3 px-10 h-full flex items-center justify-center overflow-hidden">
                      <span className="truncate w-full block">{row.patient_id}</span>
                    </div>
                  </div>
                ) : null,
              )}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="row-span-3 flex gap-32 justify-center items-center w-full">
          {/* Back Button */}
          <button
            onClick={leftfunc}
            className="h-29 w-125 flex justify-center items-center gap-4 border-2 border-[#163A72] text-[#1D34AF] px-8 rounded-full font-semibold hover:bg-blue-700 hover:text-white transition text-[43px] cursor-pointer"
          >
            <img className="h-9.5" src={back} alt="Back" />
            Back
          </button>

          {/* Home Button */}
          <img
            onClick={() => navigate('/home')}
            className="ml-10 mr-10 w-27.5 cursor-pointer hover:scale-105 transition"
            src={homeIcon}
            alt="Home"
          />

          {/* Continue Button */}
          <button
            onClick={rightfunc}
            className="h-29 w-125 flex justify-center items-center gap-4 text-white px-8 py-3 rounded-full font-medium transition text-[43px] bg-[#1D34AF] hover:bg-blue-700 cursor-pointer"
          >
            Continue
            <img className="h-9.5" src={right_arrow} alt="Continue" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SamplePreview;
