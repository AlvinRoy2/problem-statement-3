import os
import uvicorn
import sys

if __name__ == "__main__":
    try:
        import main
        print("Successfully imported main.py", flush=True)
    except Exception as e:
        print(f"Error importing main.py: {e}", file=sys.stderr, flush=True)
        import traceback
        traceback.print_exc()

    port = int(os.environ.get("PORT", 8080))
    print(f"Starting server on port {port}...", flush=True)
    uvicorn.run("main:app", host="0.0.0.0", port=port)
