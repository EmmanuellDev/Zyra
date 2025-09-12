import Beams from '../components/Beams';
import Navbar from '../components/Navbar';
import { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import { Calendar, AlertCircle, CheckCircle, FileText, ExternalLink } from 'lucide-react';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD83CMFYVBLvyeS8cXmyo23hkZfAmCetK8",
  authDomain: "zyra-frontend.firebaseapp.com",
  databaseURL: "https://zyra-frontend-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "zyra-frontend",
  storageBucket: "zyra-frontend.firebasestorage.app",
  messagingSenderId: "240931543189",
  appId: "1:240931543189:web:1aea784370b631e079a39c",
  measurementId: "G-DE34JMGWYV"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default function Logs() {
  const [issues, setIssues] = useState([]);
  const [walletAddress, setWalletAddress] = useState("");

  useEffect(() => {
    const savedAccount = localStorage.getItem('walletAddress');
    if (savedAccount) {
      setWalletAddress(savedAccount);
      // Fetch issues from Firebase
      const issuesRef = ref(db, `logs/${savedAccount}`);
      onValue(issuesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const issuesArray = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          setIssues(issuesArray);
        }
      });
    }
  }, []);

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Bug': return '🐞';
      case 'Feature': return '✨';
      case 'Governance': return '⚖️';
      case 'Other': return '📌';
      default: return '📝';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
        }}
      >
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

      {/* Issues List */}
      <div className="relative z-10 pt-32 pb-12 px-4 max-w-6xl mx-auto">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            <FileText className="text-gray-600" size={28} />
            Your Submitted Issues
          </h1>
          
          {issues.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <AlertCircle className="mx-auto mb-4" size={48} />
              <p>No issues submitted yet.</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {issues.map((issue) => (
                <div key={issue.id} className="border rounded-xl p-4 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold text-gray-800">{issue.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(issue.priority)}`}>
                        {issue.priority}
                      </span>
                      <span className="text-lg">{getCategoryIcon(issue.category)}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{issue.description}</p>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>{issue.timestamp}</span>
                    </div>
                    
                    {issue.ipfsHash && (
                      <a
                        href={`https://gateway.pinata.cloud/ipfs/${issue.ipfsHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
                      >
                        <ExternalLink size={16} />
                        View attached file
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}