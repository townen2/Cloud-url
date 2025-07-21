
import fs from 'fs';
import path from 'path';
import formidable from 'formidable';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  const form = new formidable.IncomingForm({
    uploadDir: path.join(process.cwd(), 'public/uploads'),
    keepExtensions: true,
    filename: (name, ext, part) => {
      const extName = path.extname(part.originalFilename);
      const baseName = path.basename(part.originalFilename, extName);
      return `dyby-cloud-${Date.now()}-${baseName}${extName}`;
    },
  });

  form.parse(req, (err, fields, files) => {
    if (err || !files.file) {
      return res.status(400).json({ success: false, error: 'Upload failed.' });
    }

    const filename = path.basename(files.file[0].filepath);
    return res.status(200).json({ success: true, url: `/uploads/${filename}` });
  });
}
