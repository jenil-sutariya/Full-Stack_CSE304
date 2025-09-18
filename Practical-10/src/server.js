import express from "express";
import { readFile, writeFile } from "fs/promises";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3000;

const LOG_FILE = path.join(process.cwd(), "logs", "error.log");

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Helper function to format logs
function formatLogs(logData) {
  if (!logData.trim()) return "No logs available";
  
  return logData.split('\n')
    .filter(line => line.trim())
    .map(line => {
      // Color code different log levels
      if (line.includes('ERROR:')) {
        return `<span style="color: #dc3545; font-weight: bold;">${line}</span>`;
      } else if (line.includes('WARN:')) {
        return `<span style="color: #ffc107; font-weight: bold;">${line}</span>`;
      } else if (line.includes('SUCCESS:')) {
        return `<span style="color: #28a745; font-weight: bold;">${line}</span>`;
      } else if (line.includes('INFO:')) {
        return `<span style="color: #17a2b8; font-weight: bold;">${line}</span>`;
      }
      return line;
    })
    .join('\n');
}

// Main route - Display logs
app.get("/", async (req, res) => {
  try {
    const data = await readFile(LOG_FILE, "utf8");
    const formattedLogs = formatLogs(data);
    
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Error Logs Viewer</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 20px;
            background-color: #f8f9fa;
          }
          .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            overflow: hidden;
          }
          .header {
            background: #343a40;
            color: white;
            padding: 20px;
            text-align: center;
          }
          .header h1 {
            margin: 0;
            font-size: 2rem;
          }
          .controls {
            padding: 15px 20px;
            background: #e9ecef;
            border-bottom: 1px solid #dee2e6;
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
          }
          .btn {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            text-decoration: none;
            display: inline-block;
            font-size: 14px;
            transition: background-color 0.2s;
          }
          .btn-primary { background: #007bff; color: white; }
          .btn-danger { background: #dc3545; color: white; }
          .btn-success { background: #28a745; color: white; }
          .btn:hover { opacity: 0.9; }
          .log-container {
            padding: 20px;
          }
          .log-content {
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 4px;
            padding: 20px;
            font-family: 'Courier New', monospace;
            font-size: 14px;
            line-height: 1.5;
            white-space: pre-wrap;
            max-height: 600px;
            overflow-y: auto;
          }
          .stats {
            display: flex;
            gap: 20px;
            margin-bottom: 20px;
            flex-wrap: wrap;
          }
          .stat-card {
            background: #e9ecef;
            padding: 15px;
            border-radius: 4px;
            text-align: center;
            min-width: 120px;
          }
          .stat-number {
            font-size: 1.5rem;
            font-weight: bold;
            color: #495057;
          }
          .stat-label {
            font-size: 0.9rem;
            color: #6c757d;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📊 Error Logs Viewer</h1>
            <p>Real-time application monitoring and debugging</p>
          </div>
          
          <div class="controls">
            <a href="/" class="btn btn-primary">🔄 Refresh</a>
            <a href="/clear" class="btn btn-danger" onclick="return confirm('Are you sure you want to clear all logs?')">🗑️ Clear Logs</a>
            <a href="/download" class="btn btn-success">📥 Download Logs</a>
          </div>
          
          <div class="log-container">
            <div class="stats">
              <div class="stat-card">
                <div class="stat-number">${data.split('\n').filter(line => line.includes('ERROR:')).length}</div>
                <div class="stat-label">Errors</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">${data.split('\n').filter(line => line.includes('WARN:')).length}</div>
                <div class="stat-label">Warnings</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">${data.split('\n').filter(line => line.includes('SUCCESS:')).length}</div>
                <div class="stat-label">Success</div>
              </div>
              <div class="stat-card">
                <div class="stat-number">${data.split('\n').filter(line => line.includes('INFO:')).length}</div>
                <div class="stat-label">Info</div>
              </div>
            </div>
            
            <div class="log-content">${formattedLogs}</div>
          </div>
        </div>
        
        <script>
          // Auto-refresh every 30 seconds
          setTimeout(() => {
            window.location.reload();
          }, 30000);
        </script>
      </body>
      </html>
    `);
  } catch (err) {
    res.status(500).send(`
      <div style="text-align: center; padding: 50px; font-family: Arial, sans-serif;">
        <h2 style="color: #dc3545;">❌ Error: Could not read log file</h2>
        <p style="color: #6c757d;">Details: ${err.message}</p>
        <a href="/" style="color: #007bff;">Try Again</a>
      </div>
    `);
  }
});

// Clear logs endpoint
app.get("/clear", async (req, res) => {
  try {
    await writeFile(LOG_FILE, "", "utf8");
    res.redirect("/");
  } catch (err) {
    res.status(500).send(`Error clearing logs: ${err.message}`);
  }
});

// Download logs endpoint
app.get("/download", async (req, res) => {
  try {
    const data = await readFile(LOG_FILE, "utf8");
    res.setHeader('Content-Type', 'text/plain');
    res.setHeader('Content-Disposition', 'attachment; filename="error-logs.txt"');
    res.send(data);
  } catch (err) {
    res.status(500).send(`Error downloading logs: ${err.message}`);
  }
});

// API endpoint for JSON logs
app.get("/api/logs", async (req, res) => {
  try {
    const data = await readFile(LOG_FILE, "utf8");
    const logs = data.split('\n')
      .filter(line => line.trim())
      .map(line => {
        const match = line.match(/^\[([^\]]+)\] (\w+): (.+)$/);
        if (match) {
          return {
            timestamp: match[1],
            level: match[2],
            message: match[3]
          };
        }
        return { raw: line };
      });
    
    res.json({
      success: true,
      logs: logs,
      count: logs.length
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Error Logs Viewer running at http://localhost:${PORT}`);
  console.log(`📊 API endpoint available at http://localhost:${PORT}/api/logs`);
  console.log(`📁 Log file location: ${LOG_FILE}`);
});
