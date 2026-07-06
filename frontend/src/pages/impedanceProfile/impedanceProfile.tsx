import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExperimentDataContext } from '../../store/Context/ExperimentDataContext';
import axiosInstance from '../../config/axiosInstance';
import running_test_gif from '../../assets/images/runnin_test.gif';
import Abort_Run_image from '../../assets/images/abort_icon.svg';
import back from '../../assets/images/back.svg';
import impedanceDummyData from './impedance_dummy_data.json';

export const ImpedanceProfilePage = () => {
  const { ExperimentData, dispatchExperimentData } = useContext(
    ExperimentDataContext,
  );
  const navigate = useNavigate();

  const [showAbortModal, setShowAbortModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const estimatedTime = ExperimentData.EstimatedTime || 1200; // default 20 mins
  const remainingTime = Math.max(0, estimatedTime - elapsedSeconds);

  // Canvas refs for drawing real-time graphs
  const impedanceCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Telemetry states for actual backend data
  const [impedanceData, setImpedanceData] = useState<number[]>([]);
  const [timePoints, setTimePoints] = useState<number[]>([]);
  const [dummyPoints, setDummyPoints] = useState<Array<{ elapsed_seconds: number; impedance: number }>>(
    (impedanceDummyData && Array.isArray(impedanceDummyData.points)) ? impedanceDummyData.points : []
  );

  // Load dummy data for simulation
  useEffect(() => {
    const isSimulated = true;
    if (!isSimulated) return;

    import('../../../wailsjs/go/main/App')
      .then((app) => {
        if (app && app.GetImpedanceDummyData) {
          app.GetImpedanceDummyData().then((jsonStr) => {
            try {
              const parsed = JSON.parse(jsonStr);
              if (parsed && Array.isArray(parsed.points)) {
                setDummyPoints(parsed.points);
              }
            } catch (err) {
              console.error('Error parsing dummy data:', err);
            }
          });
        }
      })
      .catch((err) => {
        console.log('Failed to import Wails GetImpedanceDummyData, might be in browser:', err);
      });
  }, []);

  // Telemetry effect: listens to Wails events or falls back to HTTP polling
  useEffect(() => {
    const isSimulated = true;
    if (isSimulated) return;

    let unsubscribeWails: (() => void) | undefined;

    try {
      import('../../../wailsjs/runtime/runtime').then((wails) => {
        if (wails && wails.EventsOn) {
          unsubscribeWails = wails.EventsOn('thermal_profile', (resp: any) => {
            if (resp && resp.data) {
              setImpedanceData(resp.data.tec_temp || []); // Plot tec_temp or impedance data
              setTimePoints(resp.data.time || []);
            }
          });
        }
      });
    } catch (e) {
      console.log('Wails EventsOn not available, falling back to polling:', e);
    }

    const interval = setInterval(async () => {
      try {
        const resp = await axiosInstance.get('/get_thermal_profile');
        if (resp.data?.code?.startsWith('S') && resp.data.data) {
          setImpedanceData(resp.data.data.tec_temp || []); // Plot tec_temp or impedance data
          setTimePoints(resp.data.data.time || []);
        }
      } catch (error) {
        console.log('Error fetching impedance profile:', error);
      }
    }, 2000);

    return () => {
      clearInterval(interval);
      if (unsubscribeWails) unsubscribeWails();
    };
  }, []);

  // Timer effect for progress bar and remaining time calculation
  useEffect(() => {
    const startTime = Number(localStorage.getItem('timer_start')) || Date.now();
    if (!localStorage.getItem('timer_start')) {
      localStorage.setItem('timer_start', startTime.toString());
    }

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      setElapsedSeconds(elapsed);

      const percent = Math.min(100, (elapsed / estimatedTime) * 100);
      if (percent >= 100) {
        setProgress(100);
        clearInterval(interval);
      } else {
        setProgress(percent);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [estimatedTime]);

  // Canvas drawing loop
  useEffect(() => {
    let animationFrameId: number;
    const startTime = Number(localStorage.getItem('timer_start')) || Date.now();

    const draw = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const isSimulated = import.meta.env.VITE_SIMULATE_DATA !== 'false';

      const impedanceCanvas = impedanceCanvasRef.current;
      if (impedanceCanvas) {
        const ctx = impedanceCanvas.getContext('2d');
        if (ctx) {
          const width = impedanceCanvas.width;
          const height = impedanceCanvas.height;
          ctx.clearRect(0, 0, width, height);

          // Draw Grid Lines
          ctx.strokeStyle = '#E2E8F0';
          ctx.lineWidth = 1;
          for (let i = 1; i <= 5; i++) {
            const y = (height / 6) * i;
            ctx.beginPath();
            ctx.moveTo(55, y);
            ctx.lineTo(width - 30, y);
            ctx.stroke();
          }

          // Draw Axis Lines
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(55, 20);
          ctx.lineTo(55, height - 40);
          ctx.lineTo(width - 30, height - 40);
          ctx.stroke();

          // Y-Axis Labels
          ctx.fillStyle = '#64748B';
          ctx.font = '18px sans-serif';
          ctx.fillText('1200', 10, 25);
          ctx.fillText('600', 15, height / 2);
          ctx.fillText('0', 25, height - 45);

          // Draw Legend
          ctx.fillStyle = 'rgba(124, 58, 237, 1)';
          ctx.fillRect(100, 10, 20, 12);
          ctx.fillStyle = '#475569';
          ctx.font = '16px sans-serif';
          ctx.fillText('Impedance (Z)', 130, 22);

          // Draw Impedance Curve (Purple)
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(124, 58, 237, 1)';
          ctx.lineWidth = 4;
          let moved = false;

          if (!isSimulated && impedanceData.length > 0) {
            for (let i = 0; i < impedanceData.length; i++) {
              const x =
                55 + ((timePoints[i] || 0) / estimatedTime) * (width - 95);
              const y =
                height - 40 - ((impedanceData[i] || 0) / 1200) * (height - 60);
              if (x < width - 30) {
                if (!moved) {
                  ctx.moveTo(x, y);
                  moved = true;
                } else {
                  ctx.lineTo(x, y);
                }
              }
            }
          } else if (isSimulated && dummyPoints.length > 0) {
            const limit = Math.min(dummyPoints.length, Math.floor(elapsed / 2) * 2);
            for (let i = 0; i < limit; i += 2) {
              const x = 55 + ((dummyPoints[i].elapsed_seconds || 0) / estimatedTime) * (width - 95);
              const y = height - 40 - ((dummyPoints[i].impedance || 0) / 1200) * (height - 60);
              if (x < width - 30) {
                if (!moved) {
                  ctx.moveTo(x, y);
                  moved = true;
                } else {
                  ctx.lineTo(x, y);
                }
              }
            }
          }
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationFrameId);
  }, [impedanceData, timePoints, dummyPoints, estimatedTime]);

  const handleAbort = async () => {
    try {
      const resp = await axiosInstance.post('/abort', { run_type: 'pcr' });
      if (resp.data?.code?.includes('S')) {
        localStorage.removeItem('timer_start');
        dispatchExperimentData({ type: 'RESET' });
        navigate('/home');
      } else {
        localStorage.removeItem('timer_start');
        dispatchExperimentData({ type: 'RESET' });
        navigate('/home');
      }
    } catch (error) {
      console.log('Error aborting test:', error);
      localStorage.removeItem('timer_start');
      dispatchExperimentData({ type: 'RESET' });
      navigate('/home');
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  };

  return (
    <div className="w-full h-full bg-[#F5F6F7] font-poppins px-5 py-8">
      <div className="w-full px-6 font-poppins">
        {/* Top Section: Icon, Text, and Button */}
        <div className="flex items-center justify-between mb-8 px-16">
          <div className="flex items-center gap-4">
            <div>
              <img className="" src={running_test_gif} alt="Running Test" />
            </div>

            <div className="flex flex-col items-start">
              <h2 className="text-[50px] font-bold text-slate-800 leading-tight">
                Running Tests
              </h2>
              <p className="text-[45px] font-medium text-slate-600">
                Do not Remove the inserted Cartridge
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowAbortModal(true)}
            className="px-15 py-2.5 w-[395px] h-[102px] bg-[#1D34AF] text-[38px] text-white font-medium rounded-full hover:bg-blue-900 transition-colors shadow-sm cursor-pointer"
          >
            Abort Test
          </button>
        </div>

        {/* Bottom Section: Timer and Progress Bar */}
        <div className="flex items-center gap-8 px-16 mb-4">
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[45px] font-medium text-slate-700 font-poppins">
              Time Remaining :
            </span>
            <span className="text-[45px] font-bold text-[#1D34AF] ml-2">
              {formatTime(remainingTime)}
            </span>
          </div>

          {/* Custom Gradient Progress Bar */}
          <div className="relative flex-1 h-[38px] bg-slate-100 border border-[#06205C] rounded-full overflow-hidden border-[2px]">
            <div
              className="absolute top-0 left-0 h-full transition-all duration-500 ease-out rounded-full"
              style={{
                width: `${progress}%`,
                background:
                  'linear-gradient(90deg, #1e3a8a 0%, #cbd5e1 50%, #1e3a8a 100%)',
              }}
            />
          </div>
        </div>
      </div>

      {/* Main Full Graph Block */}
      <div className="h-[550px] mx-16 border border-[#1D34AF] border-[4px] rounded-[32px] pt-[2vh] px-6 bg-white shadow-sm flex flex-col items-center relative">
        <div className="text-[36px] text-[#1D34AF] mb-2 font-bold flex justify-between w-full">
          <span>Impedance Graph</span>
          <span className="text-xl text-slate-600 font-normal">
            Experiment ID: {ExperimentData.ExperimentID || 'N/A'}
          </span>
        </div>
        <div className="w-full flex-1 flex items-center justify-center min-h-0 relative">
          <canvas
            ref={impedanceCanvasRef}
            className="w-full h-full"
            width={1500}
            height={380}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-20 justify-center items-center w-full mt-6">
        <button
          onClick={() => navigate('/run')}
          className="h-[116px] w-[349px] flex justify-center items-center gap-4 border-2 border-[#163A72] text-[#1D34AF] px-8 rounded-full font-semibold hover:bg-blue-700 hover:text-white transition text-[43px] cursor-pointer"
        >
          <img className="h-[38px]" src={back} alt="Back" />
          Back
        </button>

        <button
          onClick={() => navigate('/ThermalProfilePage')}
          className="h-[116px] w-[617px] flex justify-center items-center gap-4 border-2 border-[#163A72] text-[#1D34AF] px-8 rounded-full font-semibold hover:bg-blue-700 hover:text-white transition text-[43px] cursor-pointer"
        >
          Thermal Graph
        </button>

        <button
          onClick={() => setShowAbortModal(true)}
          className="h-[116px] w-[398px] flex justify-center items-center gap-4 text-white px-8 py-3 rounded-full font-medium transition text-[43px] bg-[#1D34AF] hover:bg-blue-700 cursor-pointer"
        >
          Abort Test
        </button>
      </div>

      {/* Abort Confirmation Modal */}
      {showAbortModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-white rounded-3xl p-10 max-w-[900px] w-full text-center shadow-2xl border border-gray-200 flex flex-col justify-center items-center gap-10">
            <img className="w-64 h-64" src={Abort_Run_image} alt="" />
            <h1 className="text-5xl text-[#1D34AF] mb-4 px-20 font-bold">
              Abort the Test?
            </h1>
            <h3 className="text-4xl text-slate-800 mb-4 px-30">
              Are you sure that you want to abort the test
            </h3>
            <div className="flex gap-6 justify-center">
              <button
                onClick={() => setShowAbortModal(false)}
                className="px-10 py-4 border-2 border-[#1D34AF] text-3xl font-normal text-slate-700 rounded-full hover:bg-gray-400 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAbort}
                className="px-10 py-4 bg-[#1D34AF] text-3xl font-normal text-white rounded-full hover:bg-red-700 transition cursor-pointer"
              >
                Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImpedanceProfilePage;
