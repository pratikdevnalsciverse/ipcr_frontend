import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import VirtualKeyboard from '../../components/VirtualKeyboard';
import { ExperimentDataContext } from '../../store/Context/ExperimentDataContext';
import back from '../../assets/images/back.svg';
import scanner from '../../assets/images/scanner.svg';

export const IDEntry = () => {
  const { ExperimentData, dispatchExperimentData } = useContext(ExperimentDataContext);
  const navigate = useNavigate();

  const handleNext = () => {
    navigate('/sample-type');
  };

  const handleBack = () => {
    navigate('/home');
  };

  return (
    <div className="w-full h-full bg-[#F5F6F7] font-poppins flex flex-col justify-between">
      {/* Input Field Area */}
      <div className="flex-1 flex flex-col justify-center items-center pt-8">
        <div className="flex w-full items-center justify-between px-[110px] mb-[5vh]">
          <button
            onClick={handleBack}
            className="h-[116px] w-[335px] flex justify-center items-center gap-4 border-2 border-[#1D34AF] text-[#1D34AF] rounded-full font-semibold hover:bg-[#1d3bb3] hover:text-white transition text-[43px] cursor-pointer"
          >
            <img className="h-[38px]" src={back} alt="Back" />
            Back
          </button>

          <div className="font-semibold text-[#353940] text-[50px]">Enter Cartridge Batch ID</div>

          <button
            onClick={() => console.log('Scan ID clicked')}
            className="h-[116px] w-[335px] flex justify-center items-center gap-4 border-2 border-[#163A72] text-[#F4F4F6] rounded-full font-semibold bg-[#1D34AF] hover:bg-[#1d3bb3] transition text-[43px] cursor-pointer"
          >
            <img className="h-[38px]" src={scanner} alt="Scanner" />
            Scan ID
          </button>
        </div>

        <input
          type="text"
          value={ExperimentData.CartridgeId}
          onChange={(e) => dispatchExperimentData({ type: 'set_CartridgeId', payload: e.target.value })}
          placeholder="Enter Cartridge Batch ID"
          className="w-[1707px] h-[116px] p-4 pl-10 rounded-[100px] border-[2px] border-[#828997] focus:border-blue-400 outline-none text-[45px] text-[#353940] mb-[5vh]"
          autoFocus
        />
      </div>

      {/* Virtual Keyboard */}
      <VirtualKeyboard
        value={ExperimentData.CartridgeId}
        onInputChange={(val) => dispatchExperimentData({ type: 'set_CartridgeId', payload: val })}
        onNext={handleNext}
      />
    </div>
  );
};

export default IDEntry;
