import Head from 'next/head';
import { useState } from 'react';

export default function Home() {
  const [fileName, setFileName] = useState('No file selected');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');
  const [url, setUrl] = useState('');

  const getRandomColor = () => {
    const colors = ['#ff4d4d', '#ffa64d', '#ffff4d', '#4dff4d', '#4da6ff', '#b34dff'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const uploadFile = () => {
    const fileInput = document.getElementById('fileInput');
    if (!fileInput.files.length) {
      alert('Please select a file to upload.');
      return;
    }

    const file = fileInput.files[0];
    if (file.size > 30 * 1024 * 1024) {
      alert('File size exceeds 30MB limit.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setResult('');

    fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
    .then(async response => {
      const contentType = response.headers.get("content-type") || "";
      if (!contentType.includes("application/json")) {
        throw new Error("Unexpected response format (non-JSON)");
      }
      return response.json();
    })
    .then(data => {
      setLoading(false);
      if (data.success) {
        const fullUrl = window.location.origin + data.url;
        setResult(fullUrl);
        setUrl(fullUrl);
      } else {
        setResult(`Error: ${data.error}`);
      }
    })
    .catch(err => {
      setLoading(false);
      setResult(`Error: ${err.message}`);
    });
  };

  const copyURL = () => {
    navigator.clipboard.writeText(url).then(() => {
      const button = document.getElementById('copyButton');
      const original = button.innerHTML;
      button.innerHTML = '<i class="fas fa-check"></i> Copied!';
      button.style.backgroundColor = '#4CAF50';
      setTimeout(() => {
        button.innerHTML = original;
        button.style.backgroundColor = '';
      }, 2000);
    });
  };

  return (
    <>
      <Head>
        <title>DYBY TECH URL CLOUD</title>
        <link rel="icon" href="https://files.catbox.moe/p2eeu3.jpg" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      </Head>
      <div className="container">
        <h1><i className="fas fa-cloud-upload-alt"></i> DYBY TECH URL CLOUD</h1>
        <div className="upload-box">
          <div className="file-input-wrapper">
            <label htmlFor="fileInput" className="file-input-label">
              <i className="fas fa-file-upload"></i> Choose a File
            </label>
            <input type="file" id="fileInput" onChange={(e) => setFileName(e.target.files[0]?.name || 'No file selected')} />
            <div className="file-name">{fileName}</div>
          </div>
          <button onClick={uploadFile}>
            <i className="fas fa-upload"></i> Upload and Generate URL
          </button>
          {loading && <div id="loading" className="loading-text" style={{ color: getRandomColor() }}>
            <i className="fas fa-spinner fa-spin"></i> Processing your file...
          </div>}
        </div>
        <div className="info-box">
          <div className="text-align">
            <div className="info-text"><i className="fas fa-weight-hanging"></i> Upload limit: 30MB</div>
            <div className="info-text"><i className="far fa-calendar-times"></i> No Expiring Date</div>
          </div>
          <div className="powered">POWERED BY DYBY TECH</div>
        </div>
        <p className="instruction">
          Welcome to DybyTech URL Cloud<br />
          Simply choose your file and click "Upload and Generate URL" to get a shareable link.
        </p>
        {result && <div id="result"><strong>Your file URL:</strong><br /><a href={url} target="_blank" rel="noreferrer">{url}</a></div>}
        {url && <button id="copyButton" onClick={copyURL}><i className="far fa-copy"></i> Copy URL</button>}
      </div>
    </>
  );
}
