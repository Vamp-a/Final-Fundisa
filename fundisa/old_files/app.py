from flask import Flask, request, jsonify
from disa_ai import DisaAI
from dotenv import load_dotenv
import os

load_dotenv()
app = Flask(__name__)
disa = DisaAI()

@app.route('/chat', methods=['POST'])
def chat():
    if 'file' in request.files:
        file = request.files['file']
        response = disa.process_input(None, file)
    else:
        text = request.json.get('text', '')
        response = disa.process_input(text)
    
    return jsonify({
        "response": response,
        "status": "success"
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)   