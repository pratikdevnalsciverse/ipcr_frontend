import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExperimentDataContext } from '../../store/Context/ExperimentDataContext';
import back from '../../assets/images/back.svg';
import homeIcon from '../../assets/images/home.svg';
import right_arrow from '../../assets/images/right_arrow.svg';

export const SampleType = () => {
  const { ExperimentData, dispatchExperimentData } = useContext(ExperimentDataContext);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const options = [
    'Whole Blood',
    'Sputum',
    'Ceribrospinal Fluid',
    'Saliva'
  ];

  const handleSelect = (value: string) => {
    dispatchExperimentData({ type: 'set_SampleType', payload: value });
    setOpen(false);
  };

  const handleBack = () => {
    navigate('/id-entry');
  };

  const handleContinue = () => {
    if (ExperimentData.SampleType) {
      navigate('/sample-entry');
    }
  };

  return (
    <div className="w-full h-full bg-[#F5F6F7] font-poppins px-5 py-8 flex flex-col justify-between">
      <div className="flex flex-col items-center">
        <div className="w-full flex flex-col items-center h-[70vh]">
          <h1 className="font-semibold text-[#353940] mt-[1vh] mb-[5.5vh] text-[50px]">
            Select Sample Type
          </h1>

          <div className="relative w-[1707px]">
            {/* Input Field */}
            <div
              onClick={() => setOpen(!open)}
              className="w-full h-[116px] flex items-center justify-between pl-10 pr-8 rounded-[100px] border-[2px] border-[#828997] text-[45px] text-[#353940] bg-white cursor-pointer select-none"
            >
              <span className={ExperimentData.SampleType ? '' : 'text-gray-400'}>
                {ExperimentData.SampleType || 'Select Sample Type'}
              </span>

              {/* Arrow */}
              <svg
                className={`w-10 h-10 transition-transform ${open ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </div>

            {/* Dropdown */}
            {open && (
              <div className="absolute top-[130px] w-full bg-white border-[2px] border-[#d1d5db] rounded-[20px] shadow-lg max-h-[402px] overflow-y-auto z-50">
                {options.map((item, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelect(item)}
                    className={`flex items-center justify-start px-10 py-1 text-[48px] h-[85px] cursor-pointer hover:bg-blue-100 ${
                      ExperimentData.SampleType === item ? 'bg-[#1D34AF] text-white' : 'text-[#353940]'
                    }`}
                  >
                    {item}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-32 w-full justify-center items-center">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="h-[116px] w-[500px] flex justify-center items-center gap-4 border-2 border-[#163A72] text-[#1D34AF] px-8 rounded-full font-semibold hover:bg-[#1d3bb3] hover:text-white transition text-[43px] cursor-pointer"
          >
            <img className="h-[38px]" src={back} alt="Back" />
            Back
          </button>

          {/* Home Icon */}
          <img
            onClick={() => navigate('/home')}
            className="ml-10 mr-10 w-[110px] cursor-pointer hover:scale-105 transition"
            src={homeIcon}
            alt="Home"
          />

          {/* Continue Button */}
          <button
            onClick={handleContinue}
            disabled={!ExperimentData.SampleType}
            className={`h-[116px] w-[500px] flex justify-center items-center gap-4 text-white px-8 py-3 rounded-full font-medium transition text-[43px] cursor-pointer ${
              ExperimentData.SampleType
                ? 'bg-[#1D34AF] hover:bg-[#1d3bb3]'
                : 'bg-gray-400 cursor-not-allowed opacity-50'
            }`}
          >
            <img className="h-[38px]" src={right_arrow} alt="Continue" />
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default SampleType;
