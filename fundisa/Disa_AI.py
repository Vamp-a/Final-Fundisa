from transformers import pipeline
from PIL import Image
import torch

class DisaAI:
    def __init__(self):
        self.models = {
            # Document processing
            'document_qa': pipeline(
                "document-question-answering", 
                model="impira/layoutlm-document-qa"
            ),
            # South African languages
            'translator': pipeline(
                "translation", 
                model="facebook/nllb-200-distilled-600M",
                device=0 if torch.cuda.is_available() else -1
            ),
            # Conversational
            'chat': pipeline(
                "text-generation",
                model="microsoft/DialoGPT-medium"
            ),
            # Image understanding
            'image_reader': pipeline(
                "image-to-text",
                model="nlpconnect/vit-gpt2-image-captioning"
            )
        }
        self.lang_codes = {'zu': 'zul_Latn', 'xh': 'xho_Latn', 'af': 'afr_Latn'}

    def process_input(self, input, file=None):
        # Handle file uploads
        if file:
            if file.filename.endswith(('.png', '.jpg', '.jpeg')):
                img = Image.open(file.stream)
                return self.models['image_reader'](img)[0]['generated_text']
            else:  # PDF/DOCX
                return self._extract_document_text(file)

        # Handle text input
        detected_lang = self._detect_language(input)
        if detected_lang != 'en':
            translated = self.models['translator'](
                input,
                src_lang=self.lang_codes[detected_lang],
                tgt_lang='eng_Latn'
            )[0]['translation_text']
            response = self._generate_response(translated)
            return self.models['translator'](
                response,
                src_lang='eng_Latn',
                tgt_lang=self.lang_codes[detected_lang]
            )[0]['translation_text']
        return self._generate_response(input)

    def _detect_language(self, text):
        # Simple detection - extend with langdetect in production
        if any(word in text.lower() for word in ['ukuthi', 'ngokuba']):
            return 'zu'  # Zulu
        elif any(word in text.lower() for word in ['ukuba', 'indlela']):
            return 'xh'  # Xhosa
        return 'en'

    def _extract_document_text(self, file):
        # Implement with PyPDF2/docx for production
        return f"Processed document: {file.filename}"

    def _generate_response(self, text):
        return self.models['chat'](
            text, 
            max_length=100,
            pad_token_id=self.models['chat'].tokenizer.eos_token_id
        )[0]['generated_text']