import React, { useState } from 'react';
import Backspace from '../assets/images/Backspace.svg';
import Shiftkey from '../assets/images/Shiftkey.svg';

interface VirtualKeyboardProps {
  value: string;
  onInputChange: (val: string) => void;
  onNext: () => void;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({
  value,
  onInputChange,
  onNext,
}) => {
  const [isUppercase, setIsUppercase] = useState(false);
  const [whatType, setwhatTypeer] = useState(true);

  // Handle standard key clicks
  const handleKeyClick = (key: string) => {
    onInputChange(value + key);
  };

  const handleBackspace = () => {
    onInputChange(value.slice(0, -1));
  };

  const handleSpace = () => {
    onInputChange(value + ' ');
  };

  const rows_letters = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
    ['shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'backspace'],
    ['?123', '#', 'space', 'next'],
  ];
  const rows_Numbers = [
    ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
    ['-', '/', ':', '(', ')', '*', '&', '@', '"'],
    ['shift', '.', ',', '?', '!', "'", 'backspace'],
    ['?123', '#', 'space', 'next'],
  ];

  // Helper to prevent input focus loss when clicking buttons
  const preventFocusLoss = (e: React.MouseEvent) => e.preventDefault();

  return (
    <>
      {whatType ? (
        <div className="bg-[#8e97a3] pt-[29px] pb-[29px] pr-[86px] pl-[86px] w-full h-[632px] select-none shadow-2xl font-poppins">
          <div className="flex flex-col gap-3">
            {rows_letters.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className={`flex justify-center gap-5 ${rowIndex === 1 ? 'px-4' : ''}`}
              >
                {row.map((key) => {
                  // Shift Key
                  if (key === 'shift') {
                    return (
                      <button
                        key={key}
                        onMouseDown={preventFocusLoss}
                        onClick={() => setIsUppercase(!isUppercase)}
                        className={`text-[70px] w-[246px] h-[110px] rounded-lg flex items-center justify-center transition-colors text-[30px] ${
                          isUppercase
                            ? 'bg-blue-400 text-white'
                            : 'bg-white/90 text-slate-700'
                        }`}
                      >
                        <img
                          className="h-[90px] w-[66px]"
                          src={Shiftkey}
                          alt="Shift"
                        />
                      </button>
                    );
                  }

                  // Backspace Key
                  if (key === 'backspace') {
                    return (
                      <button
                        key={key}
                        onMouseDown={preventFocusLoss}
                        onClick={handleBackspace}
                        className="text-[70px] w-[246px] h-[110px] bg-white/90 rounded-lg flex items-center justify-center text-slate-700"
                      >
                        <img
                          className="h-[90px] w-[66px]"
                          src={Backspace}
                          alt="Backspace"
                        />
                      </button>
                    );
                  }

                  // Numeric Toggle Placeholder
                  if (key === '?123') {
                    return (
                      <button
                        key={key}
                        onClick={() => setwhatTypeer(false)}
                        onMouseDown={preventFocusLoss}
                        className="text-[55px] w-[246px] h-[110px] bg-white/70 rounded-full text-[#1D1B20] text-[24px] font-semibold"
                      >
                        ? 123
                      </button>
                    );
                  }

                  // Hash symbol
                  if (key === '#') {
                    return (
                      <button
                        key={key}
                        onMouseDown={preventFocusLoss}
                        onClick={() => handleKeyClick('#')}
                        className="text-[70px] ml-[12px] w-[153px] h-[110px] bg-white rounded-lg text-slate-700 text-[55px]"
                      >
                        #
                      </button>
                    );
                  }

                  // Space Bar
                  if (key === 'space') {
                    return (
                      <button
                        key={key}
                        onMouseDown={preventFocusLoss}
                        onClick={handleSpace}
                        className="text-[70px] ml-[0px] w-[848px] h-[110px] bg-white rounded-lg"
                      />
                    );
                  }

                  // Next Button
                  if (key === 'next') {
                    return (
                      <button
                        key={key}
                        onMouseDown={preventFocusLoss}
                        onClick={onNext}
                        className="text-[55px] w-[424px] h-[110px]  bg-white rounded-full text-[#1D1B20] text-[55px] font-semibold flex items-center justify-center"
                      >
                        <p>Next</p>
                        <div className="w-30 flex justify-center items-center pb-4"><span className="text-[80px] flex justify-center items-center h-11/12">→</span></div>
                        
                      </button>
                    );
                  }

                  // Normal Character Keys
                  return (
                    <button
                      key={key}
                      onMouseDown={preventFocusLoss}
                      onClick={() =>
                        handleKeyClick(isUppercase ? key.toUpperCase() : key)
                      }
                      className="w-[153px] text-[70px] h-[110px] bg-white rounded-lg text-[#1D1B20] text-[24px] font-medium shadow-sm active:bg-gray-200 transition-colors mb-2"
                    >
                      {isUppercase ? key.toUpperCase() : key}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-[#8e97a3] pt-[29px] pb-[29px] pr-[86px] pl-[86px] w-[100vw] h-[632px] select-none shadow-2xl font-poppins">
          <div className="flex flex-col gap-3">
            {rows_Numbers.map((row, rowIndex) => (
              <div
                key={rowIndex}
                className={`flex justify-center gap-5 ${rowIndex === 1 ? 'px-4' : ''}`}
              >
                {row.map((key) => {
                  // Shift Key
                  if (key === 'shift') {
                    return (
                      <button
                        key={key}
                        onMouseDown={preventFocusLoss}
                        onClick={() => setIsUppercase(!isUppercase)}
                        className={`text-[70px] w-[246px] h-[110px] rounded-lg flex items-center justify-center transition-colors text-[30px] ${
                          isUppercase
                            ? 'bg-blue-400 text-white'
                            : 'bg-white/90 text-slate-700'
                        }`}
                      >
                        <img
                          className="h-[90px] w-[66px]"
                          src={Shiftkey}
                          alt="Shift"
                        />
                      </button>
                    );
                  }

                  // Backspace Key
                  if (key === 'backspace') {
                    return (
                      <button
                        key={key}
                        onMouseDown={preventFocusLoss}
                        onClick={handleBackspace}
                        className="text-[70px] w-[246px] h-[110px] bg-white/90 rounded-lg flex items-center justify-center text-slate-700"
                      >
                        <img
                          className="h-[90px] w-[66px]"
                          src={Backspace}
                          alt="Backspace"
                        />
                      </button>
                    );
                  }

                  // Numeric Toggle Placeholder
                  if (key === '?123') {
                    return (
                      <button
                        key={key}
                        onClick={() => setwhatTypeer(true)}
                        onMouseDown={preventFocusLoss}
                        className="text-[55px] w-[246px] h-[110px] bg-blue-400 text-white rounded-full text-[#1D1B20] text-[24px] font-semibold"
                      >
                        ?123
                      </button>
                    );
                  }

                  // Hash symbol
                  if (key === '#') {
                    return (
                      <button
                        key={key}
                        onMouseDown={preventFocusLoss}
                        onClick={() => handleKeyClick('#')}
                        className="text-[70px] ml-[12px] w-[153px] h-[110px] bg-white rounded-lg text-slate-700 text-[55px]"
                      >
                        #
                      </button>
                    );
                  }

                  // Space Bar
                  if (key === 'space') {
                    return (
                      <button
                        key={key}
                        onMouseDown={preventFocusLoss}
                        onClick={handleSpace}
                        className="text-[70px] ml-[0px] w-[848px] h-[110px] bg-white rounded-lg"
                      />
                    );
                  }

                  // Next Button
                  if (key === 'next') {
                    return (
                      <button
                        key={key}
                        onMouseDown={preventFocusLoss}
                        onClick={onNext}
                        className="text-[55px] w-[424px] h-[110px] bg-white rounded-full text-[#1D1B20] text-[55px] font-semibold flex items-center justify-center"
                      >
                        Next <span className="text-[50px]">→</span>
                      </button>
                    );
                  }

                  // Normal Character Keys
                  return (
                    <button
                      key={key}
                      onMouseDown={preventFocusLoss}
                      onClick={() =>
                        handleKeyClick(isUppercase ? key.toUpperCase() : key)
                      }
                      className="w-[153px] text-[70px] h-[110px] bg-white rounded-lg text-[#1D1B20] text-[24px] font-medium shadow-sm active:bg-gray-200 transition-colors mb-2"
                    >
                      {isUppercase ? key.toUpperCase() : key}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default VirtualKeyboard;
