import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../config/axiosInstance';
import { ExperimentDataContext } from '../../store/Context/ExperimentDataContext';
import back from '../../assets/images/back.svg';
import homeIcon from '../../assets/images/home.svg';
import open_lid from '../../assets/images/open_lid.svg';
import cartridge from '../../assets/images/cartridge.svg';
import ipcr_machine_image from '../../assets/images/ipcr_machine_image.svg';
import machine_lid from '../../assets/images/machine_lid.svg';

export const InsertCartridge = () => {
  const { ExperimentData, dispatchExperimentData } = useContext(
    ExperimentDataContext,
  );
  const navigate = useNavigate();

  const [flag2, setflag2] = useState(true);
  const [flag3, setflag3] = useState(false);
  const [isBusy, setIsBusy] = useState(true);

  const leftfunc = () => {
    navigate('/sample-preview');
  };

  const detectingCartridge = async () => {
    try {
      const resp = await axiosInstance.get('/get_endstops');
      if (resp.data?.code?.startsWith('S')) {
        if (resp.data.data && resp.data.data[0] && resp.data.data[0].Ejector) {
          setIsBusy(false);
          setflag2(false);
          setflag3(true);
        } else {
          setIsBusy(true);
          setflag2(true);
          setflag3(false);
        }
      } else {
        setIsBusy(true);
        setflag2(true);
        setflag3(false);
      }
    } catch (error) {
      console.log('Error detecting cartridge:', error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      detectingCartridge();
    }, 3000);

    // Run once initially
    detectingCartridge();

    return () => clearInterval(interval);
  }, []);

  const start_run = async () => {
    try {
      const resp = await axiosInstance.post('/start_workflow', {
        experiment_id: ExperimentData.ExperimentID || 'experiment_mock',
      });

      if (resp.data?.code?.includes('S')) {
        // Set the timer start timestamp to track progress
        localStorage.setItem('timer_start', Date.now().toString());
        navigate('/run');
      } else {
        // Fallback navigate to /run for mock testing if needed
        localStorage.setItem('timer_start', Date.now().toString());
        navigate('/run');
      }
    } catch (error) {
      console.log('Error starting workflow:', error);
      // Fallback navigate to /run for mock testing if error
      localStorage.setItem('timer_start', Date.now().toString());
      navigate('/run');
    }
  };

  // Developer mock helper to manually simulate detection
  const simulateDetection = () => {
    setIsBusy(false);
    setflag2(false);
    setflag3(true);
  };

  return (
    <div className="w-full h-full bg-[#F5F6F7] font-poppins px-5 py-8">
      <div className="flex flex-col items-center justify-between h-full">
        {/* Status Section */}
        {flag2 && (
          <div
            onClick={simulateDetection}
            className="w-full flex flex-col items-center h-[70vh] cursor-pointer gap-30"
            title="Click to simulate cartridge detection"
          >
            <div className="text-[50px] font-poppins font-semibold text-[#353940] mt-[2vh]">
              Insert Cartridge...
            </div>

            <div className="h-220 flex items-center justify-center">
              <img
                className="w-[60vw] max-h-[750px]"
                src={cartridge}
                alt="Cartridge"
              />
            </div>

            <div className="text-[50px] font-poppins font-semibold text-[#2A6DEA] animate-pulse">
              Status : Detecting Cartridge...
            </div>
          </div>
        )}

        {flag3 && (
          <div className="w-full flex flex-col items-center h-[70vh]">
            <div className="text-[50px] font-poppins font-semibold text-[#353940] mt-[2vh] text-center px-10">
              Cartridge Detected, press ‘Start Run’ to start the test...
            </div>

            <div className="h-[480px] flex items-center justify-center">
              <img
                className="w-[30vw] max-h-[450px]"
                src={machine_lid}
                alt="Machine Lid"
              />
            </div>

            <div className="text-[50px] font-poppins font-semibold text-[#16A34A]">
              Status : Cartridge Detected
            </div>
          </div>
        )}

        {/* Navigation / Action Buttons */}
        <div className="flex gap-32 justify-center items-center w-full mt-4">
          {/* Back Button */}
          <button
            onClick={leftfunc}
            className="h-[116px] w-[500px] flex justify-center items-center gap-4 border-2 border-[#163A72] text-[#1D34AF] px-8 rounded-full font-semibold hover:bg-blue-700 hover:text-white transition text-[43px] cursor-pointer"
          >
            <img className="h-[38px]" src={back} alt="Back" />
            Back
          </button>

          {/* Home Button */}
          <img
            onClick={() => navigate('/home')}
            className="ml-10 mr-10 w-[110px] cursor-pointer hover:scale-105 transition"
            src={homeIcon}
            alt="Home"
          />

          {/* Start Run Button */}
          <button
            onClick={start_run}
            className={`h-[116px] w-[500px] flex justify-center items-center gap-4 text-white px-8 py-3 rounded-full font-medium transition text-[43px] cursor-pointer ${
              isBusy ? 'bg-[#A6A6A6]' : 'bg-[#1D34AF] hover:bg-blue-700'
            }`}
          >
            <img className="h-[38px]" src={open_lid} alt="Open Lid" />
            Start Run
          </button>
        </div>
      </div>
    </div>
  );
};

export default InsertCartridge;
