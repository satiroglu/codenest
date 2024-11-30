import { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Home() {
  const [code, setCode] = useState('');
  const [expiry, setExpiry] = useState('1hour');
  const [codeUrl, setCodeUrl] = useState('');

  const handleCodeSubmit = async () => {
    const res = await fetch('/api/saveCode', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ code, expiry }),
    });
  
    const data = await res.json();
    if (data.url) {
      setCodeUrl(data.url);
    } else {
      toast.error('Kod kaydedilemedi: ' + data.message);
    }
  };

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(codeUrl);
    toast.success('URL copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <h1 className="text-4xl text-slate-900 font-semibold mb-4">Share Your Code</h1>
      <textarea
        className="w-full max-w-2xl h-40 p-4 border border-slate-300 rounded-md mb-4 resize-none"
        placeholder="Paste your code here"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      
      <div className="mb-4">
        <select
          className="w-full max-w-xs p-2 border border-slate-300 rounded-md"
          value={expiry}
          onChange={(e) => setExpiry(e.target.value)}
        >
          <option value="1hour">1 Hour</option>
          <option value="3hour">3 Hours</option>
          <option value="6hour">6 Hours</option>
          <option value="12hour">12 Hours</option>
          <option value="24hour">24 Hours</option>
          <option value="1day">1 Day</option>
          <option value="3day">3 Days</option>
          <option value="7day">7 Days</option>
        </select>
      </div>

      <button
        onClick={handleCodeSubmit}
        className="bg-slate-600 text-white p-2 rounded-md mb-4 hover:bg-slate-500 transition"
      >
        Paste Code
      </button>

      {codeUrl && (
        <div className="text-slate-900">
          <p className="text-lg mb-2">Your code URL:</p>
          <div className="flex flex-col sm:flex-row items-center space-x-2 sm:space-x-4">
            <a
              href={codeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 break-words w-full sm:w-auto"
            >
              {codeUrl}
            </a>
            <button
              onClick={handleCopyUrl}
              className="bg-slate-600 text-white p-2 rounded-full mt-2 sm:mt-0 hover:bg-slate-500 transition"
            >
              Copy
            </button>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-center" autoClose={3000} hideProgressBar />
    </div>
  );
}