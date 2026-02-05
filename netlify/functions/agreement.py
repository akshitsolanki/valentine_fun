import os
import json
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime

def handler(event, context):
    # Only allow POST
    if event['httpMethod'] != 'POST':
        return {
            'statusCode': 405,
            'body': json.dumps({'message': 'Method Not Allowed'})
        }

    # Configuration from Environment Variables (Set these in Netlify UI)
    SMTP_HOST = os.environ.get("SMTP_HOST", "smtp.gmail.com")
    SMTP_PORT = int(os.environ.get("SMTP_PORT", 587))
    SMTP_USERNAME = os.environ.get("SMTP_USERNAME", "akshitsolanki2@gmail.com")
    SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD", "zruoepechmafcauw")
    SMTP_FROM_EMAIL = os.environ.get("SMTP_FROM_EMAIL", "akshitsolanki2@gmail.com")
    RECIPIENTS = os.environ.get("SEND_MAIL_TO", "akshitsolanki2@gmail.com,aarzu.dangi@gmail.com").split(",")

    try:
        msg = MIMEMultipart()
        msg['From'] = SMTP_FROM_EMAIL
        msg['To'] = ", ".join(RECIPIENTS)
        msg['Subject'] = "💍 Official Valentine Agreement - Akshit & Aarzu"

        date_str = datetime.now().strftime("%B %d, %Y")
        
        body = f"""
        <html>
        <body style="font-family: 'Arial', sans-serif; color: #333; line-height: 1.6; background-color: #fff5f6; padding: 20px;">
            <div style="max-width: 600px; margin: auto; background: white; padding: 40px; border-radius: 20px; border: 2px solid #ff6b81; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
                <h1 style="color: #ff4d6d; text-align: center; border-bottom: 2px solid #ffb3c1; padding-bottom: 10px;">Lover's Agreement</h1>
                
                <p style="text-align: right; font-weight: bold; color: #777;">Date: {date_str}</p>
                
                <p style="font-size: 1.1rem;">This agreement is made solemnly between:</p>
                
                <div style="background: #fff0f3; padding: 15px; border-radius: 10px; margin: 20px 0;">
                    <p><strong>Party A:</strong> Akshit Solanki</p>
                    <p><strong>Party B:</strong> Aarzu Dangi</p>
                </div>
                
                <h3 style="color: #d63384;">Terms of Love:</h3>
                <ul>
                    <li>The parties agree to love, cherish, and annoy each other forever.</li>
                    <li>Aarzu Dangi has officially said <strong>YES</strong> to being Akshit's Valentine.</li>
                    <li>Akshit Solanki promises to keep making her happy and providing infinite hugs.</li>
                </ul>
                
                <div style="margin-top: 40px; border-top: 1px dashed #ffb3c1; padding-top: 20px; text-align: center;">
                    <p style="font-style: italic; color: #ff6b81; font-size: 1.2rem;">"Signed with a Digital YES ❤️"</p>
                </div>
            </div>
        </body>
        </html>
        """
        
        msg.attach(MIMEText(body, 'html'))

        server = smtplib.SMTP(SMTP_HOST, SMTP_PORT)
        server.starttls()
        server.login(SMTP_USERNAME, SMTP_PASSWORD)
        server.sendmail(SMTP_FROM_EMAIL, RECIPIENTS, msg.as_string())
        server.quit()

        return {
            'statusCode': 200,
            'body': json.dumps({'status': 'success', 'message': 'Agreement sent!'}),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            }
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'body': json.dumps({'status': 'error', 'message': str(e)}),
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            }
        }
