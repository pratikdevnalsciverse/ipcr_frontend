import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import ipcr_text from '../assets/images/I-PCR_white.svg';
import bhat_biotech_icon from '../assets/images/BhatBioTechLogo.svg';
import plug_icon from '../assets/images/plug_icon.svg';
import wifi_icon from '../assets/images/wifi_icon.svg';

export const MainLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDate = (date: Date) => {
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  };

  const formatTime = (date: Date) => {
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    return `${hh}:${mm}`;
  };

  // Simple active tab logic
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/login':
        return 'Login';
      case '/home':
        return 'Home';
      case '/id-entry':
      case '/sample-type':
        return 'Step 1';
      case '/sample-entry':
        return 'Step 1';
      case '/sample-preview':
        return 'Confirm Details';
      case '/insert-cartridge':
        return 'Cartridge Setup';
      case '/run':
        return 'Testing';
      case '/ThermalProfilePage':
        return 'Thermal Graph';
      case '/ImpedenceProfile':
        return 'Impedance Graph';
      default:
        return 'I-PCR';
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-neutral-canvas text-neutral-heading">
      {/* Header */}
      <header className="w-full h-32 bg-primary grid grid-cols-11">
        <div className="col-span-4 flex items-center justify-start px-10">
          <img className="h-16 mx-4" src={ipcr_text} alt="" />
        </div>
        <div className="col-span-3 flex justify-center items-center">
          <h1 className="text-6xl font-semibold text-white">{getPageTitle()}</h1>
        </div>
        <div className="col-span-4 grid grid-cols-7">
          <div className="col-span-2 flex justify-center items-center gap-8">
            <img src={wifi_icon} alt="" />
            <img src={plug_icon} alt="" />
          </div>
          <div className="col-span-3 flex items-center justify-center">
            <p className="text-3xl font-normal text-white tracking-wider">
              {formatDate(currentDateTime)}
            </p>
          </div>
          <div className="col-span-2 flex items-center justify-center">
            <p className="text-3xl font-normal text-white tracking-wider">
              {formatTime(currentDateTime)}
            </p>
          </div>
        </div>
      </header>

      <main className="w-full flex-1 overflow-auto relative border">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
