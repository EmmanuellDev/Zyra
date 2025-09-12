import Shuffle from '../components/Shuffle';
import ShinyText from '../components/ShinyText';
import Beams from '../components/Beams';
import Navbar from '../components/Navbar';
import "../App.css"
import { useNavigate } from 'react-router-dom';

export default function Home() {

  const navigate = useNavigate();

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh', overflow: 'hidden' }}>
      {/* Background */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <Beams
          beamWidth={2}
          beamHeight={15}
          beamNumber={12}
          lightColor="#ffffff"
          speed={2}
          noiseIntensity={1.75}
          scale={0.2}
          rotation={0}
        />
      </div>

      {/* Floating Navbar */}
      <div className="absolute arvo top-6 left-1/2 transform -translate-x-1/2 w-[90%] max-w-6xl z-20">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg">
          <Navbar />
        </div>
      </div>

      {/* Foreground content */}
      <div className="flex flex-col items-center justify-center h-full relative z-10 text-center">
        <Shuffle
          text="Zyra DAO"
          shuffleDirection="right"
          duration={0.35}
          animationMode="evenodd"
          shuffleTimes={1}
          ease="power3.out"
          stagger={0.03}
          threshold={0.1}
          triggerOnce={true}
          triggerOnHover={true}
          respectReducedMotion={true}
          className="text-4xl font-bold text-white relative z-20"
        />

        <div className="mt-6">
          <ShinyText 
            text="AI Powered Decentralized Autonomous Organization" 
            disabled={false} 
            speed={3} 
            className="custom-class text-white" 
          />
          {/* Add buttons below the shiny text */}
          <div className="mt-8 flex gap-4 justify-center">
            <button
              className="px-6 py-2 bg-black border-2 border-white text-white rounded-lg shadow hover:bg-white transition hover:text-black cursor-pointer"
              onClick={() => navigate('/activity')}
            >
              Get Started
            </button>
            <button
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg shadow hover:bg-white transition cursor-pointer"
              onClick={() => navigate('/dao')}
            >
              Stack for DAO
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}