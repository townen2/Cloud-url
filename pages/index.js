
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>DYBY TECH URL CLOUD</title>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
        />
      </Head>
      <div className="container">
        <h1><i className="fas fa-cloud-upload-alt"></i> DYBY TECH URL CLOUD</h1>
        <div className="upload-box">
          <div className="file-input-wrapper">
            <label htmlFor="fileInput" className="file-input-label">
              <i className="fas fa-file-upload"></i> Choose a File
            </label>
            <input type="file" id="fileInput" accept="image/jpeg,image/png" />
            <div id="fileName" className="file-name">No file selected</div>
          </div>
          <button onClick={uploadFile}>
            <i className="fas fa-upload"></i> Upload and Generate URL
          </button>
          <div id="loading" className="loading-text">
            <i className="fas fa-spinner fa-spin"></i> Processing your file...
          </div>
        </div>
        <div id="result"></div>
        <button id="copyButton" onClick={copyURL} style={{ display: "none" }}>
          <i className="far fa-copy"></i> Copy URL
        </button>
        <style jsx>{`
          body {
            font-family: 'Segoe UI', sans-serif;
            background: #12141a;
            color: #f0f0f0;
            padding: 40px;
          }
          .container {
            max-width: 500px;
            margin: auto;
            text-align: center;
          }
          input[type="file"] {
            display: none;
          }
          .upload-box {
            background: #1a1d24;
            padding: 20px;
            border-radius: 10px;
            margin-top: 20px;
          }
          button {
            margin-top: 20px;
            background: #00e6e6;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            font-weight: bold;
            cursor: pointer;
          }
          #result {
            margin-top: 20px;
            word-wrap: break-word;
          }
        `}</style>
      </div>
    </>
  );
}

function uploadFile() {
  const fileInput = document.getElementById('fileInput');
  const loadingText = document.getElementById('loading');
  const result = document.getElementById('result');
  const copyButton = document.getElementById('copyButton');

  if (!fileInput.files.length) {
    alert('Please select a file to upload.');
    return;
  }

  const file = fileInput.files[0];
  const allowedTypes = ['image/jpeg', 'image/png'];
  if (!allowedTypes.includes(file.type)) {
    alert('Seuls les fichiers JPG et PNG sont autorisés.');
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  loadingText.style.display = 'block';

  fetch('/api/upload', {
    method: 'POST',
    body: formData,
  })
    .then(res => res.json())
    .then(data => {
      loadingText.style.display = 'none';
      if (data.success) {
        const fullURL = window.location.origin + data.url;
        result.innerHTML = '<strong>File URL:</strong><br><a href="' + fullURL + '" target="_blank">' + fullURL + '</a>';
        copyButton.style.display = 'inline-block';
        copyButton.setAttribute('data-url', fullURL);
      } else {
        result.textContent = 'Erreur : ' + data.error;
      }
    })
    .catch(err => {
      loadingText.style.display = 'none';
      result.textContent = 'Erreur : ' + err.message;
    });
}

function copyURL() {
  const copyButton = document.getElementById('copyButton');
  const url = copyButton.getAttribute('data-url');
  navigator.clipboard.writeText(url).then(() => {
    copyButton.innerHTML = '<i class="fas fa-check"></i> Copied!';
    setTimeout(() => {
      copyButton.innerHTML = '<i class="far fa-copy"></i> Copy URL';
    }, 2000);
  });
}
