import formidable from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: { bodyParser: false },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, error: 'Only POST allowed' });
  }

  const uploadDir = path.join(process.cwd(), 'public', 'uploads');

  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const form = new formidable.IncomingForm({
    uploadDir,
    keepExtensions: true,
    maxFileSize: 30 * 1024 * 1024,
  });

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(500).json({ success: false, error: 'Upload failed' });
    }

    const uploaded = files.file?.[0] || files.file;
    const fileName = path.basename(uploaded.filepath);
    const url = `/uploads/${fileName}`;

    return res.status(200).json({ success: true, url });
  });
}
