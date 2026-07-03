import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import settings_wheel from '../../assets/images/settings_wheel.svg';
import plus from '../../assets/images/plus.svg';
import help from '../../assets/images/help.svg';
import history from '../../assets/images/history.svg';

export const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('timer_start');
  }, []);

  return (
    <div className="w-full h-full bg-[#F5F6F7] font-poppins">
      {/* AI Hands Free Control placeholder if needed */}
      <div className="flex items-center"></div>

      {/* Main Buttons */}
      <div className="flex justify-between items-center mt-25.25 pl-35 pr-35">
        {/* Start Test */}
        <button
          onClick={() => navigate('/id-entry')}
          className="flex items-center gap-6 bg-primary hover:bg-primary-hover border border-primary-6 text-white text-nowrap text-[56px] font-semibold px-[129px] py-0 rounded-[60px] shadow-lg h-[200px] w-[740px] cursor-pointer"
        >
          <div>
            <img className="" src={plus} alt="Plus" />
          </div>
          Start New Test
        </button>

        {/* Run QC Test */}
        <button
          onClick={() => console.log('Run QC Test clicked')}
          className="flex justify-center items-center gap-3 text-[#616BE6] text-[56px] font-semibold rounded-[60px] border-6 border-[#616BE6] transition h-[200px] w-[740px] cursor-pointer shadow-lg"
        >
          Run QC Test
        </button>
      </div>

      {/* Bottom Menu */}
      <div className="flex justify-center gap-52 mt-[95px]">
        {/* History */}
        <div className="flex flex-col items-center cursor-pointer hover:scale-105 transition">
          <button className="w-[274px] h-[274px] border-4 border-gray-400 rounded-full flex items-center justify-center mb-3 shadow-xl">
            <div>
              <img
                className="h-[165px] w-[165px]"
                src={history}
                alt="History"
              />
            </div>
          </button>
          <span className="text-[#0B2E6F] text-[48px] font-poppins font-medium">
            History
          </span>
        </div>

        {/* Settings */}
        <div className="flex flex-col items-center cursor-pointer hover:scale-105 transition">
          <button className="w-[274px] h-[274px] border-4 border-gray-400 rounded-full flex items-center justify-center mb-3 shadow-xl">
            <div>
              <img
                className="h-[165px] w-[165px]"
                src={settings_wheel}
                alt="Settings"
              />
            </div>
          </button>
          <span className="text-[#0B2E6F] text-[48px] font-poppins font-medium">
            Settings
          </span>
        </div>

        {/* Help */}
        <div className="flex flex-col items-center cursor-pointer hover:scale-105 transition">
          <button className="w-[274px] h-[274px] border-4 border-gray-400 rounded-full flex items-center justify-center mb-3 shadow-xl">
            <div>
              <img className="h-[165px] w-[165px]" src={help} alt="Help" />
            </div>
          </button>
          <span className="text-[#0B2E6F] text-[48px] font-poppins font-medium">
            Help
          </span>
        </div>
      </div>
    </div>
  );
};

export default Home;
