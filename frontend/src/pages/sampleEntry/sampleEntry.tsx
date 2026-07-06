import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import VirtualKeyboard from '../../components/VirtualKeyboard';
import { ExperimentDataContext } from '../../store/Context/ExperimentDataContext';
import back from '../../assets/images/back.svg';
import scanner_blue from '../../assets/images/scanner_blue.svg';
import save from '../../assets/images/save.svg';

export const SampleEntry = () => {
  const { ExperimentData, dispatchExperimentData } = useContext(
    ExperimentDataContext,
  );
  const navigate = useNavigate();

  const [textFiledNumber, settextFiledNumber] = useState<number>(1);
  const [selectedWell, setSelectedWell] = useState<number>(1);
  const [sampleID, setSampleID] = useState<string>('');
  const [patientID, setPatientID] = useState<string>('');

  const SaveSample = () => {
    dispatchExperimentData({
      type: 'set_Samples',
      payload: {
        well_number: selectedWell,
        sample_id: sampleID,
        patient_id: patientID,
      },
    });
  };

  const SelectingWell = (well_Number: number) => {
    setSelectedWell(well_Number);

    const targetWell = (ExperimentData?.Samples || []).find(
      (s) => s.well_number === well_Number,
    );

    if (targetWell && targetWell.sample_id) {
      setSampleID(targetWell.sample_id);
    } else {
      setSampleID('');
    }

    if (targetWell && targetWell.patient_id) {
      setPatientID(targetWell.patient_id);
    } else {
      setPatientID('');
    }
  };

  const rightfunc = () => {
    navigate('/sample-preview');
  };

  const leftfunc = () => {
    navigate('/id-entry');
  };

  return (
    <div className="w-full h-full bg-[#F5F6F7] font-poppins flex flex-col justify-between">
      {/* Input Field: Works with physical keyboard naturally */}
      <div className="h-[400px] flex flex-col justify-end items-center">
        <div className="w-full px-7 py-5 flex flex-col gap-5 font-poppins">
          {/* Top Section */}
          <div className="flex items-center justify-between">
            {/* Left */}
            <div className="flex items-start gap-10 mt-[-5.5vh]">
              {/* Back Button */}
              <button
                onClick={leftfunc}
                className="h-[87px] w-[247px] flex justify-center items-center gap-4 border-2 border-[#163A72] text-[#1D34AF] px-8 rounded-full font-medium hover:bg-blue-700 hover:text-white transition text-[43px] cursor-pointer"
              >
                <img className="h-[38px]" src={back} alt="Back" />
                Back
              </button>

              {/* Instruction */}
              <div className="text-[38px] text-[#353940] max-w-[400px] leading-snug">
                Click on each well to add sample information below
              </div>
            </div>
            <div className="flex border-2 border-gray-400 rounded-[10px]">
              <div className=" rounded-[10px] p-4 grid grid-cols-4 gap-6">
                {(ExperimentData?.Samples || []).slice(0, 8).map((data, i) => (
                  <div
                    key={i + 1}
                    onClick={() => SelectingWell(i + 1)}
                    className={`w-[100px] h-[100px] flex items-center justify-center rounded-full cursor-pointer text-[38px] transition ${
                      selectedWell === i + 1
                        ? 'border-[3px] border-[#2441DA] text-white'
                        : 'text-gray-600'
                    } ${
                      data.sample_id
                        ? 'border-[3px] border-red-200 text-blue-600 bg-[#7C8DE9]'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
              <div className=" p-4 grid grid-cols-4 gap-6 bg-gray-400">
                {(ExperimentData?.Samples || []).slice(8, 16).map((data, i) => (
                  <div
                    key={i + 1}
                    // onClick={() => SelectingWell(i + 9)}
                    className={`w-[100px] h-[100px] flex items-center justify-center rounded-full cursor-not-allowed text-[38px] transition ${
                      selectedWell === i + 9
                        ? 'border-[3px] border-[#2441DA] text-white'
                        : 'text-gray-600'
                    } ${
                      data.sample_id
                        ? 'border-[3px] border-red-200 text-blue-600 bg-[#7C8DE9]'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {i + 9}
                  </div>
                ))}
              </div>
            </div>
            {/* Well Selector */}
          </div>

          {/* Bottom Inputs */}
          <div className="flex items-center gap-20">
            {/* Selected Well Indicator */}
            <div className="w-[90px] h-[90px] flex items-center justify-center rounded-full border-[3px] border-blue-600 text-blue-600 text-[45px]">
              {selectedWell}
            </div>

            {/* Sample ID */}
            <input
              type="text"
              value={sampleID}
              onClick={() => settextFiledNumber(1)}
              onChange={(e) => setSampleID(e.target.value)}
              placeholder="Enter Sample ID"
              className="w-[500px] h-[90px] rounded-[60px] border-[2px] border-[#828997] text-[45px] pl-10 outline-none focus:border-blue-400 text-[#353940]"
            />

            {/* Patient ID */}
            <input
              type="text"
              value={patientID}
              onClick={() => settextFiledNumber(2)}
              onChange={(e) => setPatientID(e.target.value)}
              placeholder="Enter Patient ID"
              className="w-[500px] h-[90px] rounded-[60px] border-[2px] border-[#828997] text-[45px] pl-10 outline-none focus:border-blue-400 text-[#353940]"
            />

            <div>
              <img
                onClick={SaveSample}
                className="h-[80px] cursor-pointer hover:scale-105 transition"
                src={save}
                alt="Save"
              />
            </div>

            {/* Scan ID */}
            <button
              onClick={() => console.log('Scan ID clicked')}
              className="h-[87px] w-[335px] flex justify-center items-center gap-4 border-2 border-[#163A72] text-[#1D34AF] px-8 rounded-full font-medium hover:bg-blue-700 hover:text-white transition text-[43px] cursor-pointer"
            >
              <img className="h-[38px]" src={scanner_blue} alt="Scanner" />
              Scan ID
            </button>
          </div>
        </div>
      </div>

      {/* Virtual Keyboard */}
      {textFiledNumber === 1 && (
        <VirtualKeyboard
          value={sampleID}
          onInputChange={(val) => setSampleID(val)}
          onNext={rightfunc}
        />
      )}

      {textFiledNumber === 2 && (
        <VirtualKeyboard
          value={patientID}
          onInputChange={(val) => setPatientID(val)}
          onNext={rightfunc}
        />
      )}
    </div>
  );
};

export default SampleEntry;
