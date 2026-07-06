import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExperimentDataContext } from '../../store/Context/ExperimentDataContext';
import axiosInstance from '../../config/axiosInstance';
import random_graph from '../../assets/images/random_graph.svg';
import running_test_gif from '../../assets/images/runnin_test.gif';
import Abort_Run_image from '../../assets/images/abort_icon.svg';
import thermalDummyData from '../thermalProfile/dummy_data.json';
import impedanceDummyData from '../impedanceProfile/impedance_dummy_data.json';

export const RunPage = () => {
  const { ExperimentData, dispatchExperimentData } = useContext(
    ExperimentDataContext,
  );
  const navigate = useNavigate();

  const [showAbortModal, setShowAbortModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const estimatedTime = ExperimentData.EstimatedTime || 1200; // default 20 mins
  const remainingTime = Math.max(0, estimatedTime - elapsedSeconds);

  // Canvas refs for drawing real-time mock graphs
  const thermalCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const impedanceCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // Telemetry states for actual backend data
  const [lidTemps, setLidTemps] = useState<number[]>([]);
  const [tecTemps, setTecTemps] = useState<number[]>([]);
  const [impedanceData, setImpedanceData] = useState<number[]>([]);
  const [timePoints, setTimePoints] = useState<number[]>([]);
  const [dummyPoints, setDummyPoints] = useState<Array<{ lid_temp: number; tec_temp: number }>>(
    (thermalDummyData && Array.isArray(thermalDummyData.points)) ? thermalDummyData.points : []
  );
  const [dummyImpedancePoints, setDummyImpedancePoints] = useState<Array<{ elapsed_seconds: number; impedance: number }>>(
    (impedanceDummyData && Array.isArray(impedanceDummyData.points)) ? impedanceDummyData.points : []
  );

  // Load dummy data for simulation
  useEffect(() => {
    const isSimulated = true;
    if (!isSimulated) return;

    import('../../../wailsjs/go/main/App')
      .then((app) => {
        if (app && app.GetDummyData) {
          app.GetDummyData().then((jsonStr) => {
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
        if (app && app.GetImpedanceDummyData) {
          app.GetImpedanceDummyData().then((jsonStr) => {
            try {
              const parsed = JSON.parse(jsonStr);
              if (parsed && Array.isArray(parsed.points)) {
                setDummyImpedancePoints(parsed.points);
              }
            } catch (err) {
              console.error('Error parsing dummy impedance data:', err);
            }
          });
        }
      })
      .catch((err) => {
        console.log('Failed to import Wails GetDummyData, might be in browser:', err);
      });
  }, []);

  // Telemetry effect: listens to Wails events or falls back to HTTP polling
  useEffect(() => {
    const isSimulated = true;
    if (isSimulated) return;

    let unsubscribeWails: (() => void) | undefined;
    
    // 1. Dynamic Wails EventsOn import
    try {
      import('../../../wailsjs/runtime/runtime').then((wails) => {
        if (wails && wails.EventsOn) {
          unsubscribeWails = wails.EventsOn('thermal_profile', (resp: any) => {
            if (resp && resp.data) {
              setLidTemps(resp.data.lid_temp || []);
              setTecTemps(resp.data.tec_temp || []);
              setTimePoints(resp.data.time || []);
              setImpedanceData(resp.data.tec_temp || []); // Plot tec_temp or impedance data
            }
          });
        }
      });
    } catch (e) {
      console.log('Wails EventsOn not available, falling back to polling:', e);
    }

    // 2. HTTP Polling Fallback
    const interval = setInterval(async () => {
      try {
        const resp = await axiosInstance.get('/get_thermal_profile');
        if (resp.data && resp.data.data) {
          setLidTemps(resp.data.data.lid_temp || []);
          setTecTemps(resp.data.data.tec_temp || []);
          setTimePoints(resp.data.data.time || []);
          setImpedanceData(resp.data.data.tec_temp || []);
        }
      } catch (error) {
        console.log('Error polling telemetry:', error);
      }
    }, 2000);

    return () => {
      clearInterval(interval);
      if (unsubscribeWails) unsubscribeWails();
    };
  }, []);

  // Interval for updating progress and time remaining
  useEffect(() => {
    let startTime = Number(localStorage.getItem('timer_start'));
    if (!startTime) {
      startTime = Date.now();
      localStorage.setItem('timer_start', startTime.toString());
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const elapsed = Math.floor((now - startTime) / 1000);
      setElapsedSeconds(elapsed);

      const totalTimeMs = estimatedTime * 1000;
      const elapsedMs = now - startTime;
      const percent = (elapsedMs / totalTimeMs) * 100;

      if (percent >= 100) {
        setProgress(100);
        clearInterval(interval);
        localStorage.removeItem('timer_start');
      } else {
        setProgress(percent);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [estimatedTime]);

  // Real-time canvas drawing loop for mock graphs
  useEffect(() => {
    let animationFrameId: number;
    const startTime = Number(localStorage.getItem('timer_start')) || Date.now();

    const draw = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const isSimulated = import.meta.env.VITE_SIMULATE_DATA !== 'false';

      // Draw Thermal Graph
      const thermalCanvas = thermalCanvasRef.current;
      if (thermalCanvas) {
        const ctx = thermalCanvas.getContext('2d');
        if (ctx) {
          const width = thermalCanvas.width;
          const height = thermalCanvas.height;
          ctx.clearRect(0, 0, width, height);

          // Draw Grid Lines
          ctx.strokeStyle = '#E2E8F0';
          ctx.lineWidth = 1;
          for (let i = 1; i <= 5; i++) {
            const y = (height / 6) * i;
            ctx.beginPath();
            ctx.moveTo(40, y);
            ctx.lineTo(width - 20, y);
            ctx.stroke();
          }

          // Draw Axis Lines
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(40, 20);
          ctx.lineTo(40, height - 30);
          ctx.lineTo(width - 20, height - 30);
          ctx.stroke();

          // Y-Axis Labels
          ctx.fillStyle = '#64748B';
          ctx.font = '14px sans-serif';
          ctx.fillText('130°C', 5, 45);
          ctx.fillText('65°C', 10, height / 2);
          ctx.fillText('0°C', 15, height - 35);

          // Draw Legend
          ctx.fillStyle = 'rgba(255, 99, 132, 1)';
          ctx.fillRect(80, 10, 15, 10);
          ctx.fillStyle = '#475569';
          ctx.font = '14px sans-serif';
          ctx.fillText('Lid Temp', 105, 20);

          ctx.fillStyle = 'rgba(54, 162, 235, 1)';
          ctx.fillRect(180, 10, 15, 10);
          ctx.fillStyle = '#475569';
          ctx.fillText('TEC Temp', 205, 20);

          // Draw Lid Temp Curve (Red)
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(255, 99, 132, 1)';
          ctx.lineWidth = 3;
          let moved = false;

          if (!isSimulated && lidTemps.length > 0) {
            for (let i = 0; i < lidTemps.length; i++) {
              const x = 40 + ((timePoints[i] || 0) / estimatedTime) * (width - 60);
              const y = (height - 30) - ((lidTemps[i] || 0) / 130) * (height - 50);
              if (x < width - 20) {
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
              const x = 40 + (i / estimatedTime) * (width - 60);
              const y = (height - 30) - ((dummyPoints[i].lid_temp || 0) / 130) * (height - 50);
              if (x < width - 20) {
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

          // Draw TEC Temp Curve (Blue)
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(54, 162, 235, 1)';
          ctx.lineWidth = 3;
          moved = false;

          if (!isSimulated && tecTemps.length > 0) {
            for (let i = 0; i < tecTemps.length; i++) {
              const x = 40 + ((timePoints[i] || 0) / estimatedTime) * (width - 60);
              const y = (height - 30) - ((tecTemps[i] || 0) / 130) * (height - 50);
              if (x < width - 20) {
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
              const x = 40 + (i / estimatedTime) * (width - 60);
              const y = (height - 30) - ((dummyPoints[i].tec_temp || 0) / 130) * (height - 50);
              if (x < width - 20) {
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

      // Draw Impedance Graph
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
            ctx.moveTo(45, y);
            ctx.lineTo(width - 20, y);
            ctx.stroke();
          }

          // Draw Axis Lines
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(45, 20);
          ctx.lineTo(45, height - 30);
          ctx.lineTo(width - 20, height - 30);
          ctx.stroke();

          // Y-Axis Labels
          ctx.fillStyle = '#64748B';
          ctx.font = '14px sans-serif';
          ctx.fillText('1200', 10, 45);
          ctx.fillText('600', 15, height / 2);
          ctx.fillText('0', 25, height - 35);

          // Draw Legend
          ctx.fillStyle = 'rgba(124, 58, 237, 1)';
          ctx.fillRect(80, 10, 15, 10);
          ctx.fillStyle = '#475569';
          ctx.font = '14px sans-serif';
          ctx.fillText('Impedance (Z)', 105, 20);

          // Draw Impedance Curve (Purple)
          ctx.beginPath();
          ctx.strokeStyle = 'rgba(124, 58, 237, 1)';
          ctx.lineWidth = 3;
          let moved = false;

          if (!isSimulated && impedanceData.length > 0) {
            for (let i = 0; i < impedanceData.length; i++) {
              const x = 45 + ((timePoints[i] || 0) / estimatedTime) * (width - 65);
              const y = (height - 30) - ((impedanceData[i] || 0) / 1200) * (height - 50);
              if (x < width - 20) {
                if (!moved) {
                  ctx.moveTo(x, y);
                  moved = true;
                } else {
                  ctx.lineTo(x, y);
                }
              }
            }
          } else if (isSimulated && dummyImpedancePoints.length > 0) {
            const limit = Math.min(dummyImpedancePoints.length, Math.floor(elapsed / 2) * 2);
            for (let i = 0; i < limit; i += 2) {
              const x = 45 + ((dummyImpedancePoints[i].elapsed_seconds || 0) / estimatedTime) * (width - 65);
              const y = (height - 30) - ((dummyImpedancePoints[i].impedance || 0) / 1200) * (height - 50);
              if (x < width - 20) {
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
  }, [lidTemps, tecTemps, impedanceData, timePoints, estimatedTime, dummyPoints]);

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
              <img className="" src={running_test_gif} alt="Random Graph" />
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

      {/* Double Graphs Grid */}
      <div className="h-[600px] mt-[3.5vh] flex justify-evenly">
        <div
          onClick={() => navigate('/ThermalProfilePage')}
          className="w-[800px] h-[600px] ml-[-15px] border border-[#1D34AF] border-[4px] rounded-[32px] pt-[3vh] px-2 cursor-pointer font-medium flex flex-col items-center bg-white shadow-sm"
        >
          <div className="text-[36px] text-[#1D34AF] mb-2 font-bold">
            Thermal Graph
          </div>
          <div className="w-full flex-1 flex items-center justify-center min-h-0 relative">
            <canvas
              ref={thermalCanvasRef}
              className="w-full h-full"
              width={750}
              height={370}
            />
          </div>
        </div>

        <div
          onClick={() => navigate('/ImpedenceProfile')}
          className="w-[800px] h-[600px] mr-[-15px] border border-[#1D34AF] border-[4px] rounded-[32px] flex flex-col items-center cursor-pointer bg-white shadow-sm"
        >
          <div className="text-[36px] text-[#1D34AF] mt-[3vh] mb-2 font-bold">
            Impedance Graph
          </div>
          <div className="w-full flex-1 flex items-center justify-center min-h-0 relative">
            <canvas
              ref={impedanceCanvasRef}
              className="w-full h-full"
              width={750}
              height={370}
            />
          </div>
        </div>
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

export default RunPage;
