
document.getElementById('fileInput').addEventListener('change', function(e) {
    const fileName = e.target.files[0] ? e.target.files[0].name : 'No file selected';
    document.getElementById('fileName').textContent = fileName;
});

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

    fetch('https://your-api-url.com/upload', { // Replace with your backend URL
        method: 'POST',
        body: formData,
    })
    .then(res => res.json())
    .then(data => {
        loadingText.style.display = 'none';
        if (data.success) {
            const fullURL = 'https://your-api-url.com' + data.url;
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
