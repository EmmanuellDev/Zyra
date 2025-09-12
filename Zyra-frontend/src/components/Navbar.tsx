import React, { useState, useEffect } from "react";
import { Home, List, Activity, Wallet } from "lucide-react";
import { PeraWalletConnect } from '@perawallet/connect';

const Navbar: React.FC = () => {
  const [account, setAccount] = useState<string | null>(null);
  // Load account from localStorage on mount
  useEffect(() => {
    const savedAccount = localStorage.getItem('walletAddress');
    if (savedAccount) {
      setAccount(savedAccount);
    }
  }, []);
  const peraWallet = new PeraWalletConnect();

  const connectWallet = async () => {
    try {
      const accounts = await peraWallet.connect();
      setAccount(accounts[0]);
      localStorage.setItem('walletAddress', accounts[0]);
    } catch (error) {
      console.error('Wallet connect error:', error);
    }
  };

  // Optional: Disconnect logic
  const disconnectWallet = async () => {
    await peraWallet.disconnect();
    setAccount(null);
    localStorage.removeItem('walletAddress');
  };

  return (
    <nav className="w-full px-6 py-1 bg-white rounded-4xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Left - Logo / Name */}
        <div className="text-2xl font-bold tracking-wide pl-6">Zyra</div>
        {/* Middle - Nav Links */}
        <div className="flex pl-66 space-x-8">
          <a
            href="/"
            className="relative flex items-center gap-2 text-black after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
          >
            <Home size={18} /> Home
          </a>
          <a
            href="/logs"
            className="relative flex items-center gap-2 text-black after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
          >
            <List size={18} /> Logs
          </a>
          <a
            href="/activity"
            className="relative flex items-center gap-2 text-black after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 after:bg-black after:transition-all after:duration-300 hover:after:w-full"
          >
            <Activity size={18} /> Activity
          </a>
        </div>
        {/* Right - Connect Wallet */}
        {account ? (
          <div className="flex items-center gap-2">
            <span className="bg-gray-100 text-black px-3 py-1 rounded-xl border border-black">{account.slice(0, 6)}...{account.slice(-4)}</span>
            <button
              className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition border border-black"
              onClick={disconnectWallet}
            >Disconnect</button>
          </div>
        ) : (
          <button
            className="flex items-center cursor-pointer gap-2 bg-black text-white px-3 py-1 rounded-xl hover:bg-white border-2 border-white hover:border-2 hover:border-black hover:text-black transition"
            onClick={connectWallet}
          >
            <Wallet className="hover:text-black" size={18} /> Connect Wallet
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;