import os
import uvicorn
import sys

try:
    from main import app
    print("Successfully imported app from main.py", flush=True)
except Exception as e:
    print(f"CRITICAL ERROR importing main.py: {e}", file=sys.stderr, flush=True)
    import traceback
    traceback.print_exc()
    sys.exit(1)

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    print(f"Starting server on 0.0.0.0:{port}...", flush=True)
    uvicorn.run(app, host="0.0.0.0", port=port)

