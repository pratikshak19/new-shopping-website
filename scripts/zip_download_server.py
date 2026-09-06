#!/usr/bin/env python3
"""Serve Trendora_For_Vercel.zip with a big Download button. Bind 0.0.0.0."""

from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ZIP = ROOT / "Trendora_For_Vercel.zip"
PORT = 8787
HOST = "0.0.0.0"

HTML = """<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Download Trendora ZIP</title>
  <style>
    body { margin:0; min-height:100vh; display:grid; place-items:center;
      font-family:system-ui,sans-serif; background:#120c10; color:#fff; }
    .card { width:min(520px,92vw); background:#1f1519; border:1px solid #3a2a30;
      border-radius:20px; padding:32px 28px; text-align:center; }
    h1 { margin:0 0 8px; font-size:26px; }
    p { color:#cfc4bf; line-height:1.5; }
    a.dl { display:block; margin-top:22px; background:#ff3f6c; color:#fff;
      text-decoration:none; font-weight:800; font-size:18px; padding:18px 16px;
      border-radius:14px; }
    small { display:block; margin-top:8px; font-weight:500; opacity:.9; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Trendora_For_Vercel.zip</h1>
    <p>Click the pink button. The ZIP (~13 MB) saves to your Downloads folder.</p>
    <a class="dl" href="/Trendora_For_Vercel.zip" download="Trendora_For_Vercel.zip">
      Download ZIP
      <small>Trendora_For_Vercel.zip · 13 MB</small>
    </a>
  </div>
</body>
</html>
"""


class Handler(BaseHTTPRequestHandler):
    def log_message(self, fmt, *args):
        print(fmt % args, flush=True)

    def do_GET(self):
        path = self.path.split("?", 1)[0]
        if path in ("/", "/index.html", "/vercel-zip.html", "/download.html"):
            body = HTML.encode("utf-8")
            self.send_response(200)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(body)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(body)
            return
        if path.endswith("Trendora_For_Vercel.zip") and ZIP.is_file():
            data = ZIP.read_bytes()
            self.send_response(200)
            self.send_header("Content-Type", "application/zip")
            self.send_header(
                "Content-Disposition",
                'attachment; filename="Trendora_For_Vercel.zip"',
            )
            self.send_header("Content-Length", str(len(data)))
            self.send_header("Cache-Control", "no-store")
            self.end_headers()
            self.wfile.write(data)
            return
        self.send_response(404)
        self.end_headers()


if __name__ == "__main__":
    if not ZIP.is_file():
        raise SystemExit(f"missing {ZIP}")
    httpd = ThreadingHTTPServer((HOST, PORT), Handler)
    print(f"zip download on http://{HOST}:{PORT}/", flush=True)
    httpd.serve_forever()
