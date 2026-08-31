"""Dev server for the portfolio.

Use this instead of `python -m http.server 8000`.

Plain http.server sends no Cache-Control, so the browser caches the .jsx files
and keeps showing an old build after you edit them. This sends no-store on
every response, so a normal refresh always picks up your latest changes.

    python serve.py            # http://localhost:8000
    python serve.py 8080       # different port
"""

import sys
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class NoCacheHandler(SimpleHTTPRequestHandler):
    # http.server has no mapping for .jsx and falls back to octet-stream.
    extensions_map = {
        **SimpleHTTPRequestHandler.extensions_map,
        ".jsx": "text/babel",
        ".js": "text/javascript",
        ".json": "application/json",
    }

    def end_headers(self):
        self.send_header("Cache-Control", "no-store, must-revalidate")
        self.send_header("Pragma", "no-cache")
        self.send_header("Expires", "0")
        super().end_headers()

    def log_message(self, fmt, *args):
        # Quieter: only report failures.
        if not str(args[1] if len(args) > 1 else "").startswith("2"):
            super().log_message(fmt, *args)


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    handler = partial(NoCacheHandler, directory=".")
    with ThreadingHTTPServer(("127.0.0.1", port), handler) as httpd:
        print(f"Portfolio OS  ->  http://localhost:{port}/   (no-cache; Ctrl+C to stop)")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nstopped")


if __name__ == "__main__":
    main()
