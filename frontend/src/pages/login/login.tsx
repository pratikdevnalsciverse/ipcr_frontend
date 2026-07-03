import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VirtualKeyboard from '../../components/VirtualKeyboard';

export const Login = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [userID, setUserID] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleNextStep = () => {
    setError('');
    if (step === 1) {
      if (userID === 'admin') {
        setStep(2);
      } else {
        setError('Please provide valid data');
        setTimeout(() => setError(''), 3000);
      }
    } else {
      if (password === 'apwd') {
        navigate('/home');
      } else {
        setError('Please provide valid data');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col justify-between bg-[#F5F6F7] font-poppins relative">
      {/* Custom Error Toast */}
      {error && (
        <div className="absolute top-4 right-4 bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg text-2xl font-semibold z-50 animate-bounce">
          {error}
        </div>
      )}

      {/* Input Field Area */}
      <div className="flex-1 flex flex-col justify-center items-center pt-8">
        {step === 1 ? (
          <>
            <h1 className="font-semibold text-[#353940] mb-[5.5vh] text-[50px]">Enter User ID</h1>
            <input
              type="text"
              value={userID}
              onChange={(e) => setUserID(e.target.value)}
              placeholder="Enter User ID"
              className="w-[1707px] h-[116px] p-4 pl-10 rounded-[100px] border-[2px] border-[#828997] focus:border-blue-400 outline-none text-[45px] text-[#353940] mb-[5vh]"
              autoFocus
            />
          </>
        ) : (
          <>
            <h1 className="font-semibold text-[#353940] mb-[5.5vh] text-[50px]">Enter Password</h1>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              className="w-[1707px] h-[116px] p-4 pl-10 rounded-[100px] border-[2px] border-[#828997] focus:border-blue-400 outline-none text-[45px] text-[#353940] mb-[5vh]"
              autoFocus
            />
          </>
        )}
      </div>

      {/* Virtual Keyboard */}
      <VirtualKeyboard
        value={step === 1 ? userID : password}
        onInputChange={step === 1 ? setUserID : setPassword}
        onNext={handleNextStep}
      />
    </div>
  );
};

export default Login;
