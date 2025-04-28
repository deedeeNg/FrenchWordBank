from flask import Flask, request, jsonify
from deep_translator import GoogleTranslator
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/translate', methods=['POST'])
def translate():
    data = request.json
    text = data.get('text', '')
    source_lang = data.get('source', 'auto')
    target_lang = data.get('target', 'en')

    if not text:
        return jsonify({'error': 'No text provided'}), 400

    try:
        translation = GoogleTranslator(source=source_lang, target=target_lang).translate(text)
        return jsonify({'translatedText': translation})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)