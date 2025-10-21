# backend/app.py
import os
import io
from datetime import datetime, timezone
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from supabase import create_client, Client
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle
from reportlab.lib import colors

# ---------- Config ----------
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError("Please set SUPABASE_URL and SUPABASE_KEY environment variables.")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

# ---------- Helpers ----------
def iso(dt):
    if not dt:
        return None
    if isinstance(dt, str):
        return dt
    try:
        return dt.astimezone(timezone.utc).isoformat()
    except Exception:
        return str(dt)

def get_user(user_id):
    resp = supabase.table("users").select("*").eq("id", user_id).limit(1).execute()
    return resp.data[0] if resp.data else None

# ---------- API Routes ----------
@app.route("/api/health")
def health():
    try:
        r = supabase.table("users").select("id").limit(1).execute()
        return jsonify({"status": "ok", "supabase_connected": True, "sample": r.data}), 200
    except Exception as e:
        return jsonify({"status": "error", "error": str(e)}), 500

@app.route("/api/questions", methods=["GET"])
def get_questions():
    subject = request.args.get("subject")
    difficulty = request.args.get("difficulty")
    q = supabase.table("questions").select("*")
    if subject:
        q = q.eq("subject", subject)
    if difficulty:
        q = q.eq("difficulty", difficulty)
    res = q.order("id", desc=False).execute()
    return jsonify(res.data or [])

@app.route("/api/questions/<int:q_id>")
def get_question(q_id):
    res = supabase.table("questions").select("*").eq("id", q_id).limit(1).execute()
    if not res.data:
        return jsonify({"error": "not found"}), 404
    return jsonify(res.data[0])

@app.route("/api/attempts", methods=["POST"])
def create_attempt():
    data = request.json or {}
    quiz_id = data.get("quiz_id")
    student_id = data.get("student_id")
    if not quiz_id or not student_id:
        return jsonify({"error": "quiz_id and student_id required"}), 400
    now = datetime.utcnow().isoformat()
    attempt = {"quiz_id": quiz_id, "student_id": student_id, "started_at": now}
    r = supabase.table("attempts").insert(attempt).execute()
    return jsonify(r.data[0])

@app.route("/api/attempts/<int:attempt_id>/submit", methods=["POST"])
def submit_attempt(attempt_id):
    data = request.json or {}
    answers = data.get("answers", [])
    finished_at = datetime.utcnow().isoformat()
    inserted = []
    for a in answers:
        row = {
            "attempt_id": attempt_id,
            "question_id": a.get("question_id"),
            "answer_text": a.get("answer_text"),
            "created_at": datetime.utcnow().isoformat(),
        }
        r = supabase.table("responses").insert(row).execute()
        if r.data:
            inserted.append(r.data[0])
    supabase.table("attempts").update({"finished_at": finished_at}).eq("id", attempt_id).execute()
    return jsonify({"status": "submitted", "count": len(inserted)})

@app.route("/api/student/<int:student_id>")
def student_profile(student_id):
    user = get_user(student_id)
    if not user:
        return jsonify({"error": "not found"}), 404
    attempts = supabase.table("attempts").select("*").eq("student_id", student_id).order("started_at", desc=True).limit(10).execute()
    return jsonify({"user": user, "attempts": attempts.data})

@app.route("/api/teacher/<int:teacher_id>/stats")
def teacher_stats(teacher_id):
    quizzes = supabase.table("quizzes").select("*").eq("teacher_id", teacher_id).execute().data or []
    quiz_ids = [q["id"] for q in quizzes]
    attempts = supabase.table("attempts").select("*").in_("quiz_id", quiz_ids).execute().data or [] if quiz_ids else []
    total_students = len(set([a["student_id"] for a in attempts]))
    total_attempts = len(attempts)
    times = []
    for a in attempts:
        if a.get("started_at") and a.get("finished_at"):
            try:
                s = datetime.fromisoformat(a["started_at"])
                f = datetime.fromisoformat(a["finished_at"])
                times.append((f - s).total_seconds())
            except:
                pass
    avg_time_minutes = round(sum(times)/len(times)/60, 1) if times else 0
    return jsonify({
        "total_students": total_students,
        "active_quizzes": len(quizzes),
        "total_attempts": total_attempts,
        "avg_time_minutes": avg_time_minutes
    })

@app.route("/api/quiz/<int:quiz_id>/report.pdf")
def quiz_report_pdf(quiz_id):
    quiz = supabase.table("quizzes").select("*").eq("id", quiz_id).limit(1).execute().data
    quiz_code = quiz[0]["code"] if quiz else str(quiz_id)
    attempts = supabase.table("attempts").select("*").eq("quiz_id", quiz_id).execute().data or []
    rows = []
    for a in attempts:
        student = get_user(a.get("student_id"))
        resps = supabase.table("responses").select("*").eq("attempt_id", a["id"]).execute().data or []
        answers = "; ".join([f"Q{r['question_id']}: {r['answer_text']}" for r in resps])
        rows.append({
            "Student": student.get("name") if student else str(a["student_id"]),
            "Started At": a.get("started_at"),
            "Finished At": a.get("finished_at"),
            "Responses": answers
        })
    buf = io.BytesIO()
    styles = getSampleStyleSheet()
    doc = SimpleDocTemplate(buf, pagesize=A4)
    story = [Paragraph(f"Quiz Report — {quiz_code}", styles["Title"]), Spacer(1, 12)]
    data = [["Student", "Started At", "Finished At", "Responses"]] + [
        [r["Student"], r["Started At"], r["Finished At"], r["Responses"]] for r in rows
    ]
    t = Table(data)
    t.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,0), colors.HexColor("#6b73ff")),
        ("TEXTCOLOR", (0,0), (-1,0), colors.white),
        ("GRID", (0,0), (-1,-1), 0.5, colors.grey),
    ]))
    story.append(t)
    doc.build(story)
    buf.seek(0)
    return send_file(buf, as_attachment=True, download_name=f"quiz_{quiz_code}_report.pdf", mimetype="application/pdf")

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)))
