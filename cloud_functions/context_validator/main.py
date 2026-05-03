import functions_framework
from flask import jsonify

@functions_framework.http
def validate_context(request):
    """
    HTTP Cloud Function to validate and enrich user context.
    This demonstrates moving a core logic component to the backend via Google Cloud Functions.
    """
    request_json = request.get_json(silent=True)
    
    if not request_json:
        return jsonify({"error": "Invalid request format"}), 400

    context = request_json.get("context", {})
    progress_step = request_json.get("progress_step", 0)

    # Example enrichment logic
    is_valid_step = 0 <= progress_step <= 3
    enriched_location = context.get("city", "Unknown") if isinstance(context, dict) else "Unknown"

    return jsonify({
        "status": "success",
        "is_valid_step": is_valid_step,
        "enriched_location": enriched_location,
        "message": "Context validated securely via Cloud Function"
    }), 200
