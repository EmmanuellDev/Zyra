import Beams from "../components/Beams";
import { useState, useEffect } from "react";
import { Upload, Calendar, Wallet, Zap, Shield, CheckCircle, AlertCircle, Link } from "lucide-react";
import Navbar from "../components/Navbar";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push } from "firebase/database";

export default function activity() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Bug");
  const [priority, setPriority] = useState("Medium");
  const [file, setFile] = useState<File | null>(null);
  const [walletAddress, setWalletAddress] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [ipfsHash, setIpfsHash] = useState("");

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

  // Detect wallet address from localStorage (set by Navbar)
  useEffect(() => {
    const savedAccount = localStorage.getItem('walletAddress');
    if (savedAccount) {
      setWalletAddress(savedAccount);
    }
  }, []);

  const timestamp = new Date().toLocaleString();

  // Pinata configuration
  const PINATA_API_KEY = "799b3380453b9bf273a7";
  const PINATA_SECRET_KEY = "d17d63948981886e15d51c040a67729fd63426887a1148787df9254033355fa8";

  const uploadToIPFS = async (file: File): Promise<string> => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const metadata = JSON.stringify({
        name: `DAO-Issue-${title || 'Untitled'}-${Date.now()}`,
        keyvalues: {
          category: category,
          priority: priority,
          timestamp: timestamp,
          walletAddress: walletAddress
        }
      });
      formData.append('pinataMetadata', metadata);

      const options = JSON.stringify({
        cidVersion: 0,
      });
      formData.append('pinataOptions', options);

      const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
        method: 'POST',
        headers: {
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_KEY,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('IPFS Upload Success:', result);
      return result.IpfsHash;
    } catch (error) {
      console.error('IPFS Upload Error:', error);
      throw new Error('Failed to upload file to IPFS');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Validate file size (10MB limit)
      if (selectedFile.size > 10 * 1024 * 1024) {
        alert("⚠️ File size must be less than 10MB");
        return;
      }

      // Validate file type
      const allowedTypes = ['image/png', 'image/jpeg', 'application/pdf', 'text/plain'];
      if (!allowedTypes.includes(selectedFile.type)) {
        alert("⚠️ Only PNG, JPG, PDF, and TXT files are allowed");
        return;
      }

      setFile(selectedFile);
      
      try {
        const hash = await uploadToIPFS(selectedFile);
        setIpfsHash(hash);
        alert("✅ File uploaded to IPFS successfully!");
      } catch (error) {
        alert("❌ Failed to upload file to IPFS. Please try again.");
        setFile(null);
        setIpfsHash("");
      }
    }
  };

  const handleSubmit = async () => {
    if (!agreed) {
      alert("⚠️ You must agree before submitting to DAO.");
      return;
    }

    if (!title.trim() || !description.trim()) {
      alert("⚠️ Please fill in all required fields.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare payload
      const payload = {
        title,
        description,
        category,
        priority,
        ipfsHash,
        timestamp: new Date().toLocaleString(),
      };

      // Store in Firebase under wallet address
      const userRef = ref(db, `logs/${walletAddress}`);
      await push(userRef, payload);
      alert("✅ Log submitted to Firebase!");

      // Reset form
      setTitle("");
      setDescription("");
      setCategory("Bug");
      setPriority("Medium");
      setFile(null);
      setIpfsHash("");
      setWalletAddress("");
      setAgreed(false);
      setIsSubmitting(false);
    } catch (error) {
      alert("❌ Failed to submit log to Firebase.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryIcons = {
    Bug: "🐞",
    Feature: "✨",
    Governance: "⚖️",
    Other: "📌"
  };

  const priorityColors = {
    Low: "bg-gray-100",
    Medium: "bg-gray-200",
    High: "bg-gray-300",
    Critical: "bg-gray-400"
  };

  return (
    <>
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
      
      <div className="relative w-full min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 z-0">
          <Beams
            beamWidth={3}
            beamHeight={20}
            beamNumber={15}
            lightColor="#666"
            speed={3}
            noiseIntensity={2}
            scale={0.3}
            rotation={15}
          />
        </div>

        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gray-300 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob"></div>
        <div className="absolute top-40 right-10 w-32 h-32 bg-gray-400 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-20 w-32 h-32 bg-gray-500 rounded-full mix-blend-multiply filter blur-xl opacity-40 animate-blob animation-delay-4000"></div>

        {/* Floating Navbar */}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-[95%] max-w-7xl z-30">
          <div className="bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-300">
            <Navbar />
          </div>
        </div>

        {/* Main Content */}
        <div className="relative z-20 flex items-center justify-center min-h-screen pt-24 pb-12 px-4">
          <div className="w-full max-w-4xl">
            {/* Header Section */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-800 rounded-full mb-6 shadow-lg">
                <AlertCircle className="text-white" size={32} />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                Raise an Issue
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
                Submit issues, feature requests, and governance proposals to the DAO community for review and resolution
              </p>
            </div>

            {/* Form Container */}
            <div className="bg-white/95 backdrop-blur-xl shadow-2xl rounded-3xl border border-gray-300 overflow-hidden">
              <div className="bg-gray-800 p-1">
                <div className="bg-white rounded-3xl p-8 md:p-12">
                  <div className="space-y-8">
                    {/* Form Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Left Column */}
                      <div className="space-y-6">
                        {/* Title */}
                        <div className="group">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Issue Title *
                          </label>
                          <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-gray-700 focus:outline-none transition-all duration-300 group-hover:border-gray-400"
                            placeholder="Enter a clear, descriptive title..."
                          />
                        </div>

                        {/* Category */}
                        <div className="group">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Category *
                          </label>
                          <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-gray-700 focus:outline-none transition-all duration-300 group-hover:border-gray-400"
                          >
                            {Object.entries(categoryIcons).map(([key, icon]) => (
                              <option key={key} value={key}>
                                {icon} {key}
                              </option>
                            ))}
                          </select>
                        </div>

                        {/* Priority */}
                        <div className="group">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Priority Level *
                          </label>
                          <select
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-gray-700 focus:outline-none transition-all duration-300 group-hover:border-gray-400"
                          >
                            <option value="Low">Low Priority</option>
                            <option value="Medium">Medium Priority</option>
                            <option value="High">High Priority</option>
                            <option value="Critical">Critical Priority</option>
                          </select>
                          <div className={`mt-2 px-3 py-1 rounded-full text-xs font-medium inline-block ${priorityColors[priority]}`}>
                            Current: {priority} Priority
                          </div>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-6">
                        {/* Description */}
                        <div className="group">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Detailed Description *
                          </label>
                          <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={6}
                            className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 focus:border-gray-700 focus:outline-none transition-all duration-300 group-hover:border-gray-400 resize-none"
                            placeholder="Provide a comprehensive description of the issue, including steps to reproduce, expected behavior, and any relevant context..."
                          />
                        </div>

                        {/* File Upload */}
                        <div className="group">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Supporting Files (IPFS Storage)
                          </label>
                          <div className="relative">
                            <input
                              type="file"
                              onChange={handleFileChange}
                              disabled={isUploading}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                            />
                            <div className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                              isUploading 
                                ? 'border-blue-400 bg-blue-50' 
                                : file 
                                  ? 'border-green-400 bg-green-50' 
                                  : 'border-gray-400 bg-gray-50 hover:border-gray-600 hover:bg-gray-100'
                            }`}>
                              {isUploading ? (
                                <div className="flex flex-col items-center">
                                  <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                                  <p className="text-blue-600 font-medium">Uploading to IPFS...</p>
                                  <p className="text-xs text-blue-500 mt-1">Please wait while we store your file</p>
                                </div>
                              ) : file ? (
                                <div className="space-y-3">
                                  <div className="flex items-center justify-center gap-2">
                                    <CheckCircle className="text-green-600" size={20} />
                                    <span className="text-green-800 font-medium">{file.name}</span>
                                  </div>
                                  {ipfsHash && (
                                    <div className="bg-white rounded-lg p-3 border border-green-200">
                                      <div className="flex items-center gap-2 mb-2">
                                        <Link className="text-green-600" size={16} />
                                        <span className="text-sm font-medium text-green-700">Stored on IPFS</span>
                                      </div>
                                      <div className="text-xs text-gray-600 break-all font-mono bg-gray-100 p-2 rounded">
                                        {ipfsHash}
                                      </div>
                                      <a 
                                        href={`https://gateway.pinata.cloud/ipfs/${ipfsHash}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-blue-600 hover:text-blue-800 underline mt-1 inline-block"
                                      >
                                        View on IPFS Gateway
                                      </a>
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div>
                                  <Upload className="mx-auto text-gray-500 mb-3" size={32} />
                                  <p className="text-gray-600 font-medium">
                                    Click to upload screenshots, logs, or documents
                                  </p>
                                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, PDF, TXT (Max 10MB)</p>
                                  <p className="text-xs text-blue-600 mt-2 font-medium">Files will be stored on IPFS</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Wallet Section */}
                    <div className="border-t border-gray-300 pt-8">
                      <div className="bg-gray-100 rounded-2xl p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <Wallet className="text-gray-700" size={24} />
                          <h3 className="text-lg font-semibold text-gray-900">Wallet Information</h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Algorand Wallet Address
                            </label>
                            <div className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 bg-gray-100 text-gray-700">
                              {walletAddress ? walletAddress : 'No wallet connected'}
                            </div>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Submission Timestamp
                            </label>
                            <div className="flex items-center gap-2 px-4 py-3 bg-white rounded-xl border-2 border-gray-300">
                              <Calendar className="text-gray-500" size={16} />
                              <span className="text-gray-700">{timestamp}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Agreement & Submit */}
                    <div className="border-t border-gray-300 pt-8">
                      <div className="space-y-6">
                        <div className="bg-gray-100 rounded-2xl p-6">
                          <div className="flex items-start gap-3">
                            <Shield className="text-gray-700 mt-0.5" size={20} />
                            <label className="flex-1 text-sm text-gray-700 cursor-pointer">
                              <input
                                type="checkbox"
                                checked={agreed}
                                onChange={(e) => setAgreed(e.target.checked)}
                                className="mr-3 w-4 h-4 text-gray-700 border-gray-400 rounded focus:ring-gray-500"
                              />
                              <span className="font-medium">
                                I agree to submit this issue for DAO governance and community resolution. 
                                I understand that all submissions are public and will be reviewed by DAO members.
                                Files uploaded to IPFS are permanently stored and publicly accessible.
                              </span>
                            </label>
                          </div>
                        </div>

                        <button
                          onClick={handleSubmit}
                          disabled={isSubmitting || !agreed || isUploading}
                          className="w-full bg-gray-800 text-white font-semibold py-4 px-8 rounded-2xl hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                        >
                          {isSubmitting ? (
                            <div className="flex items-center justify-center gap-3">
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Submitting to DAO...
                            </div>
                          ) : isUploading ? (
                            <div className="flex items-center justify-center gap-3">
                              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              Uploading to IPFS...
                            </div>
                          ) : (
                            <div className="flex items-center justify-center gap-3">
                              <Zap size={20} />
                              Submit Issue to DAO
                            </div>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Info */}
            <div className="text-center mt-12 text-gray-600">
              <p className="text-sm">
                Issues are reviewed by the DAO community. Files are stored permanently on IPFS for transparency and accessibility.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}