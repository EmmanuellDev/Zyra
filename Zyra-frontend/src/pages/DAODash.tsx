import Beams from '../components/Beams';
import { useState, useEffect } from 'react';
import AIChat from '../components/AIChat';

// Issue type definition
interface Issue {
  id: string;
  title: string;
  description: string;
  priority: string;
  category: string;
  votingStatus?: string;
  votes?: {
    approve?: number;
    reject?: number;
    voters?: string[];
  };
}
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, update } from "firebase/database";
import { Calendar, AlertCircle, CheckCircle, FileText, ExternalLink, Vote, ThumbsUp, ThumbsDown, Users } from 'lucide-react';
import DAONavbar from '../components/DAONav';

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

export default function DAODash() {
  // Modal state for AIChat
  const [showAIChat, setShowAIChat] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState<string | number | null>(null);

  // Handler for Ask AI Zyra button
  const handleAskAI = (issueId: string | number) => {
    setSelectedIssueId(issueId);
    setShowAIChat(true);
  };

  // Handler to close AIChat modal
  const handleCloseAIChat = () => {
    setShowAIChat(false);
    setSelectedIssueId(null);
  };
  const [issues, setIssues] = useState<Issue[]>([]);
  const [walletAddress, setWalletAddress] = useState("");
  const [votingStates, setVotingStates] = useState<{ [key: string]: boolean }>({});
  const [balance, setBalance] = useState(null);
  const [isLoadingBalance, setIsLoadingBalance] = useState(false);
  // Fetch balance from Algorand TestNet API
  const fetchBalance = async (address) => {
    setIsLoadingBalance(true);
    try {
      const response = await fetch(`https://testnet-api.algonode.cloud/v2/accounts/${address}`);
      if (!response.ok) throw new Error('Failed to fetch balance');
      const data = await response.json();
      const balanceInAlgos = data.amount / 1000000;
      setBalance(balanceInAlgos);
    } catch (error) {
      console.error('Error fetching balance:', error);
      setBalance(null);
    } finally {
      setIsLoadingBalance(false);
    }
  };

  useEffect(() => {
    const savedAccount = localStorage.getItem('walletAddress');
    if (savedAccount) {
      setWalletAddress(savedAccount);
      fetchBalance(savedAccount);
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

  const handleVote = async (issueId: string, voteType: 'approve' | 'reject') => {
    if (!walletAddress) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      setVotingStates(prev => ({ ...prev, [issueId]: true }));
      
      const issueRef = ref(db, `logs/${walletAddress}/${issueId}`);
      const currentIssue = issues.find(issue => issue.id === issueId);
      
      const votes = currentIssue.votes || { approve: 0, reject: 0, voters: [] };
      
      // Check if user already voted
      if (votes.voters && votes.voters.includes(walletAddress)) {
        alert('You have already voted on this issue');
        return;
      }

      // Update vote count based on user's balance
      const voteWeight = balance !== null ? Math.round(balance) : 1;
      if (voteType === 'approve') {
        votes.approve = (votes.approve || 0) + voteWeight;
      } else {
        votes.reject = (votes.reject || 0) + voteWeight;
      }
      
      // Add voter to prevent double voting
      votes.voters = votes.voters || [];
      votes.voters.push(walletAddress);
      
      // Update voting status
      const totalVotes = votes.approve + votes.reject;
      let status = 'pending';
      if (totalVotes >= 3) { // Minimum 3 votes required
        if (votes.approve > votes.reject) {
          status = 'approved';
        } else if (votes.reject > votes.approve) {
          status = 'rejected';
        }
      }

      await update(issueRef, {
        votes: votes,
        votingStatus: status,
        lastVoteTimestamp: new Date().toISOString()
      });

      // Show success message
      alert(`Vote ${voteType === 'approve' ? 'approved' : 'rejected'} successfully!`);
      
    } catch (error) {
      console.error('Error voting:', error);
      alert('Failed to submit vote. Please try again.');
    } finally {
      setVotingStates(prev => ({ ...prev, [issueId]: false }));
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800';
      case 'High': return 'bg-orange-100 text-orange-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Bug': return '🐞';
      case 'Feature': return '✨';
      case 'Governance': return '⚖️';
      case 'Other': return '📌';
      default: return '📝';
    }
  };

  const hasUserVoted = (issue: Issue) => {
    return issue.votes && issue.votes.voters && issue.votes.voters.includes(walletAddress);
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
          <DAONavbar />
        </div>
      </div>

      {/* Issues List */}
      <div className="relative z-10 pt-32 pb-12 px-4 max-w-6xl mx-auto">
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
              <FileText className="text-gray-600" size={28} />
              Submitted Issues
            </h1>
            {walletAddress && (
              <div className="flex items-center gap-2">
                <span className="text-gray-600">|</span>
                <span className="text-sm font-medium">
                  Your Voting Power = {isLoadingBalance ? (
                    <span className="inline-block animate-spin w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full"></span>
                  ) : (
                    `${balance !== null ? Math.round(balance) : 'N/A'} ALGO`
                  )}
                </span>
                <button
                  onClick={() => walletAddress && fetchBalance(walletAddress)}
                  className="text-blue-500 hover:text-blue-700 text-xs underline"
                  disabled={isLoadingBalance}
                >
                  {isLoadingBalance ? 'Updating...' : 'Refresh'}
                </button>
              </div>
            )}
          </div>
          
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
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold text-gray-800">{issue.title}</h3>
                      <button
                        className="ask-ai-zyra-btn"
                        style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', background: '#6c63ff', color: '#fff', border: 'none', cursor: 'pointer' }}
                        onClick={() => handleAskAI(issue.id)}
                      >
                        Ask AI Zyra
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(issue.priority)}`}>
                        {issue.priority}
                      </span>
                      <span className="text-lg">{getCategoryIcon(issue.category)}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{issue.description}</p>
                  
                  {/* Voting Status and Stats */}
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <Vote size={16} className="text-gray-600" />
                        <span className="text-sm font-medium text-gray-700">Voting Status:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(issue.votingStatus || 'pending')}`}>
                          {(issue.votingStatus || 'pending').charAt(0).toUpperCase() + (issue.votingStatus || 'pending').slice(1)}
                        </span>
                      </div>
                      {issue.votes && (
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-1 text-green-600">
                            <ThumbsUp size={14} />
                            <span>{issue.votes.approve || 0}</span>
                          </div>
                          <div className="flex items-center gap-1 text-red-600">
                            <ThumbsDown size={14} />
                            <span>{issue.votes.reject || 0}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <Users size={14} />
                            <span>{issue.votes.voters ? issue.votes.voters.length : 0}</span>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Voting Buttons */}
                    <div className="flex gap-2">
                      {hasUserVoted(issue) ? (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle size={16} className="text-green-600" />
                          <span>You have already voted on this issue</span>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => handleVote(issue.id, 'approve')}
                            disabled={votingStates[issue.id]}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <ThumbsUp size={16} />
                            {votingStates[issue.id] ? 'Voting...' : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleVote(issue.id, 'reject')}
                            disabled={votingStates[issue.id]}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <ThumbsDown size={16} />
                            {votingStates[issue.id] ? 'Voting...' : 'Reject'}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>{issue.timestamp}</span>
                    </div>
                    <span className="issue-id">{issue.id}</span>
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

      {/* AIChat Modal Overlay */}
      {showAIChat && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.5)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '16px',
            boxShadow: '0 4px 32px rgba(0,0,0,0.2)',
            padding: '2rem',
            maxWidth: '600px',
            width: '100%',
            position: 'relative',
          }}>
            <button
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'transparent',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
              }}
              onClick={handleCloseAIChat}
              aria-label="Close AI Chat"
            >
              &times;
            </button>
            <AIChat onBackToHome={handleCloseAIChat} />
          </div>
        </div>
      )}
    </div>
  );
}