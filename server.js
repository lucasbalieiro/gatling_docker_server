import http from 'http';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mime from 'mime-types';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = 9091;

http.createServer(async (req, res) => {
  try {
    const targetDir = path.join(__dirname, 'target', 'gatling');
    const files = await fs.readdir(targetDir);
    const simulationDir = files.find(async (file) => (await fs.stat(path.join(targetDir, file))).isDirectory());

    if (!simulationDir) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('Simulation directory not found');
      return;
    }

    const simulationPath = path.join(targetDir, simulationDir);
    const filePath = path.join(simulationPath, req.url === '/' ? 'index.html' : req.url);
    
    // Check if the file exists
    try {
      const data = await fs.readFile(filePath);
      const contentType = mime.lookup(filePath) || 'application/octet-stream';

      res.writeHead(200, { 'Content-Type': contentType });
      res.end(data);
    } catch (err) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File not found');
    }
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
}).listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
