import os
import smtplib
from datetime import datetime
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from dotenv import load_dotenv
from flask import Flask, jsonify, render_template, send_from_directory, request
from flask_cors import CORS

load_dotenv()

app = Flask(__name__, static_folder=".", static_url_path="")
CORS(app)

IMAGES_DIR = os.path.join(app.root_path, "images")
SMTP_HOST = os.environ.get("SMTP_HOST", "smtp.gmail.com")
SMTP_PORT = int(os.environ.get("SMTP_PORT", 587))
SMTP_USERNAME = os.environ.get("SMTP_USERNAME", "")
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD", "")
SMTP_FROM_EMAIL = os.environ.get("SMTP_FROM_EMAIL", SMTP_USERNAME)
RECIPIENTS = [r.strip() for r in os.environ.get("SEND_MAIL_TO", "").split(",") if r.strip()]
PERSON_A_NAME = os.environ.get("PERSON_A_NAME", "Akshit")
PERSON_B_NAME = os.environ.get("PERSON_B_NAME", "Aarzu")
# Valentine Week dates for 2026
VALENTINE_DAYS = {
    'rose': {'date': datetime(2026, 2, 7), 'name': 'Rose Day', 'emoji': '🌹'},
    'propose': {'date': datetime(2026, 2, 8), 'name': 'Propose Day', 'emoji': '💍'},
    'chocolate': {'date': datetime(2026, 2, 9), 'name': 'Chocolate Day', 'emoji': '🍫'},
    'teddy': {'date': datetime(2026, 2, 10), 'name': 'Teddy Day', 'emoji': '🧸'},
    'promise': {'date': datetime(2026, 2, 11), 'name': 'Promise Day', 'emoji': '🤝'},
    'hug': {'date': datetime(2026, 2, 12), 'name': 'Hug Day', 'emoji': '🤗'},
    'kiss': {'date': datetime(2026, 2, 13), 'name': 'Kiss Day', 'emoji': '💋'},
    'valentine': {'date': datetime(2026, 2, 14), 'name': 'Valentine\'s Day', 'emoji': '❤️'}
}

QUOTES = [
    "You are my everything.",
    "Every day with you is a blessing.",
    "Love you more than words can say.",
    "Forever and always.",
    "My heart beats for you."
]

DAY_IMAGES = {
    'rose': ['1.jpg', '2.jpg'],
    'propose': ['3.jpg', '4.jpg'],
    'chocolate': ['5.jpg', '6.jpg'],
    'teddy': ['7.jpg', '8.jpg'],
    'promise': ['9.jpg', '10.jpg'],
    'hug': ['11.jpg', '12.jpg'],
    'kiss': ['13.jpg', '14.jpg'],
    'valentine': ['15.jpg', '16.jpg']
}

def send_mail():
    if not (SMTP_USERNAME and SMTP_PASSWORD and SMTP_FROM_EMAIL and RECIPIENTS):
        raise RuntimeError("SMTP configuration missing in .env")

    msg = MIMEMultipart()
    msg["From"] = SMTP_FROM_EMAIL
    msg["To"] = ", ".join(RECIPIENTS)
    msg["Subject"] = f"ðŸ’ Official Valentine Agreement - {PERSON_A_NAME} & {PERSON_B_NAME}"

    date_str = datetime.now().strftime("%B %d, %Y")
    body = f"""
    <html>
    <body style="font-family: 'Arial', sans-serif; color: #333; line-height: 1.6; background-color: #fff5f6; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: white; padding: 40px; border-radius: 20px; border: 2px solid #ff6b81; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
            <h1 style="color: #ff4d6d; text-align: center; border-bottom: 2px solid #ffb3c1; padding-bottom: 10px;">Lover's Agreement</h1>
            <p style="text-align: right; font-weight: bold; color: #777;">Date: {date_str}</p>
            <p style="font-size: 1.1rem;">This agreement is made solemnly between:</p>
            <div style="background: #fff0f3; padding: 15px; border-radius: 10px; margin: 20px 0;">
                <p><strong>Party A:</strong> {PERSON_A_NAME}</p>
                <p><strong>Party B:</strong> {PERSON_B_NAME}</p>
            </div>
            <h3 style="color: #d63384;">Terms of Love:</h3>
            <ul>
                <li>The parties agree to love, cherish, and annoy each other forever.</li>
                <li>{PERSON_B_NAME} has officially said <strong>YES</strong> to being {PERSON_A_NAME}'s Valentine.</li>
                <li>{PERSON_A_NAME} promises to keep making {PERSON_B_NAME} happy and providing infinite hugs.</li>
            </ul>
            <div style="margin-top: 40px; border-top: 1px dashed #ffb3c1; padding-top: 20px; text-align: center;">
                <p style="font-style: italic; color: #ff6b81; font-size: 1.2rem;">"Signed with a Digital YES â¤ï¸"</p>
            </div>
            <p style="font-size: 0.8rem; color: #999; text-align: center; margin-top: 30px;">
                This is a legally binding contract in the Kingdom of Hearts.
            </p>
        </div>
    </body>
    </html>
    """

    msg.attach(MIMEText(body, "html"))

    server = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
    server.starttls()
    server.login(SMTP_USERNAME, SMTP_PASSWORD)
    server.sendmail(SMTP_FROM_EMAIL, RECIPIENTS, msg.as_string())
    server.quit()


@app.get("/")
def index():
    return render_template("index.html", person_a=PERSON_A_NAME, person_b=PERSON_B_NAME)


@app.get("/images/<path:filename>")
def images_file(filename):
    return send_from_directory(IMAGES_DIR, filename)


@app.post("/send-agreement")
def send_agreement():
    try:
        send_mail()
        return jsonify({"status": "success", "message": "Agreement sent!"}), 200
    except Exception as exc:
        return jsonify({"status": "error", "message": str(exc)}), 500


@app.get("/home")
def home():
    is_admin = request.args.get('admin') == '5238'
    today = datetime.now()
    days = []
    for key, info in VALENTINE_DAYS.items():
        unlocked = is_admin or today >= info['date']
        days.append({
            'key': key,
            'name': info['name'],
            'emoji': info['emoji'],
            'unlocked': unlocked,
            'unlock_date': info['date'].strftime("%Y-%m-%dT%H:%M:%S")
        })
    return render_template("home.html", days=days, is_admin=is_admin)


def check_access(day_key):
    is_admin = request.args.get('admin') == '5238'
    if is_admin:
        return True, None, None
    today = datetime.now()
    if day_key not in VALENTINE_DAYS:
        return False, "Invalid day", None
    day_date = VALENTINE_DAYS[day_key]['date']
    if today < day_date:
        return False, f"This surprise will unlock on {day_date.strftime('%B %d')} â¤ï¸", day_date
    return True, None, None


@app.get("/rose")
def rose():
    access, message, unlock_date = check_access('rose')
    if not access:
        is_admin = request.args.get('admin') == '5238'
        return render_template("locked.html", message=message, unlock_date=unlock_date, is_admin=is_admin)
    is_admin = request.args.get('admin') == '5238'
    return render_template("day.html", day='rose', name='Rose Day', emoji='🌹', message="A rose for my love, as beautiful as you are.", images=DAY_IMAGES['rose'], quotes=QUOTES, is_admin=is_admin)


@app.get("/propose")
def propose():
    access, message, unlock_date = check_access('propose')
    if not access:
        is_admin = request.args.get('admin') == '5238'
        return render_template("locked.html", message=message, unlock_date=unlock_date, is_admin=is_admin)
    is_admin = request.args.get('admin') == '5238'
    return render_template("day.html", day='propose', name='Propose Day', emoji='💍', message="Will you be mine forever?", images=DAY_IMAGES['propose'], quotes=QUOTES, is_admin=is_admin)


@app.get("/chocolate")
def chocolate():
    access, message, unlock_date = check_access('chocolate')
    if not access:
        is_admin = request.args.get('admin') == '5238'
        return render_template("locked.html", message=message, unlock_date=unlock_date, is_admin=is_admin)
    is_admin = request.args.get('admin') == '5238'
    return render_template("day.html", day='chocolate', name='Chocolate Day', emoji='🍫', message="Sweet as chocolate, that's you!", images=DAY_IMAGES['chocolate'], quotes=QUOTES, is_admin=is_admin)


@app.get("/teddy")
def teddy():
    access, message, unlock_date = check_access('teddy')
    if not access:
        is_admin = request.args.get('admin') == '5238'
        return render_template("locked.html", message=message, unlock_date=unlock_date, is_admin=is_admin)
    is_admin = request.args.get('admin') == '5238'
    return render_template("day.html", day='teddy', name='Teddy Day', emoji='🧸', message="Cuddly like a teddy, but better.", images=DAY_IMAGES['teddy'], quotes=QUOTES, is_admin=is_admin)


@app.get("/promise")
def promise():
    access, message, unlock_date = check_access('promise')
    if not access:
        is_admin = request.args.get('admin') == '5238'
        return render_template("locked.html", message=message, unlock_date=unlock_date, is_admin=is_admin)
    is_admin = request.args.get('admin') == '5238'
    return render_template("day.html", day='promise', name='Promise Day', emoji='🤝', message="I promise to love you always.", images=DAY_IMAGES['promise'], quotes=QUOTES, is_admin=is_admin)


@app.get("/hug")
def hug():
    access, message, unlock_date = check_access('hug')
    if not access:
        is_admin = request.args.get('admin') == '5238'
        return render_template("locked.html", message=message, unlock_date=unlock_date, is_admin=is_admin)
    is_admin = request.args.get('admin') == '5238'
    return render_template("day.html", day='hug', name='Hug Day', emoji='🤗', message="Hugs from me to you, forever.", images=DAY_IMAGES['hug'], quotes=QUOTES, is_admin=is_admin)


@app.get("/kiss")
def kiss():
    access, message, unlock_date = check_access('kiss')
    if not access:
        is_admin = request.args.get('admin') == '5238'
        return render_template("locked.html", message=message, unlock_date=unlock_date, is_admin=is_admin)
    is_admin = request.args.get('admin') == '5238'
    return render_template("day.html", day='kiss', name='Kiss Day', emoji='💋', message="A kiss to seal our love.", images=DAY_IMAGES['kiss'], quotes=QUOTES, is_admin=is_admin)


@app.get("/valentine")
def valentine():
    access, message, unlock_date = check_access('valentine')
    if not access:
        is_admin = request.args.get('admin') == '5238'
        return render_template("locked.html", message=message, unlock_date=unlock_date, is_admin=is_admin)
    is_admin = request.args.get('admin') == '5238'
    return render_template("day.html", day='valentine', name='Valentine\'s Day', emoji='❤️', message="Happy Valentine's Day, my love!", images=DAY_IMAGES['valentine'], quotes=QUOTES, is_admin=is_admin)


if __name__ == "__main__":
    print("Valentine app running at http://localhost:5000")
    app.run(port=5000, debug=True)
