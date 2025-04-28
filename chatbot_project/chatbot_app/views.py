from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.utils import timezone
from .models import ChatMessage
import json
from django.shortcuts import render
import requests 

# Main chat API endpoint - handles both text and image messages
@csrf_exempt

def portfolio_view(request):
    return render(request, 'portfolio/portfolio.html')
def chat_api(request):
    if request.method == 'POST':
        try:
            # Handle image upload first
            
            
            # Handle text message - parse JSON body
            data = json.loads(request.body)
            user_message = data.get('message', '')
            
            # Bot response logic
            
            

            if 'name' in user_message:
                bot_response = "Hello! I'm Joshua, a passionate engineer-in-the-making who loves building smart solutions."

            elif 'specialize' in user_message or 'field' in user_message or 'expertise' in user_message:
                bot_response = "I specialize in machine learning, computer vision, web development, and AI-powered applications."

            elif 'machine learning' in user_message or 'ml' in user_message:
                bot_response = "Sure! I've worked on real-time plant disease detection projects using CNN and YOLO object detection models."

            elif 'yolo' in user_message:
                bot_response = "YOLO stands for 'You Only Look Once' — it's a fast, powerful object detection algorithm widely used in computer vision."

            elif 'projects' in user_message or 'worked on' in user_message:
                bot_response = "I developed an EV health monitoring dashboard using Python, MongoDB, and PyQt for real-time tracking."

            elif 'web technologies' in user_message or 'web development' in user_message:
                bot_response = "I'm skilled in Django, Flask, HTML, CSS, and building full-stack web applications with modern designs."

            elif 'donation' in user_message:
                bot_response = "Yes! I created a donation website using Django, complete with PDF donation receipts and admin panels."

            elif 'database' in user_message:
                bot_response = "I primarily work with MongoDB for NoSQL applications, and also have experience with PostgreSQL and SQLite."

            elif 'chatbot' in user_message or 'ai chatbot' in user_message:
                bot_response = "Definitely! I've created chatbots using Hugging Face models and fine-tuned them for custom conversations."

            elif 'hugging face' in user_message:
                bot_response = "Hugging Face is an open-source platform providing pre-trained machine learning models, especially for NLP and AI projects."

            elif 'document retrieval' in user_message:
                bot_response = "Yes, I built a voice-powered documentation assistant using FAISS and Hugging Face transformers."

            elif 'faiss' in user_message:
                bot_response = "FAISS is a library from Facebook for fast, efficient vector similarity search — great for large databases!"

            elif 'programming languages' in user_message or 'coding languages' in user_message:
                bot_response = "I'm most comfortable with Python, but also know JavaScript, C++, and shell scripting."

            elif 'frontend' in user_message or 'frontend development' in user_message:
                bot_response = "Yes! I have experience with HTML, CSS, TailwindCSS, and frontend integration with Django templates."

            elif 'streamlit' in user_message:
                bot_response = "Absolutely! I use Streamlit for building quick, interactive data apps and dashboards."

            elif 'desktop app' in user_message:
                bot_response = "I've developed desktop applications using PyQt and CustomTkinter for real-time data visualization."

            elif 'strength' in user_message:
                bot_response = "I'm detail-oriented, passionate about clean and efficient code, and always eager to learn new technologies."

            elif 'future' in user_message or 'goal' in user_message:
                bot_response = "I aim to become a top engineer who builds technologies that solve real-world problems and positively impact lives."

            elif 'improve' in user_message or 'skill' in user_message:
                bot_response = "I consistently take on new projects, participate in coding challenges, and stay updated with tech innovations."

            elif 'problem solving' in user_message:
                bot_response = "I believe in understanding the problem deeply first, then designing modular and scalable solutions."

            elif 'team' in user_message:
                bot_response = "Definitely! I enjoy collaborating with diverse teams and believe communication is key to success."

            elif 'internship' in user_message:
                bot_response = "Yes! I'm always excited for internships and learning opportunities where I can contribute and grow."

            elif 'freelance' in user_message:
                bot_response = "Yes! I love helping others bring their ideas to life through freelance development and consulting."

            elif 'deploy' in user_message or 'deployment' in user_message:
                bot_response = "Absolutely! I have deployed Django projects using services like Heroku and Railway."

            elif 'mobile app' in user_message:
                bot_response = "I'm currently learning mobile development with Flutter and React Native to expand my skills."

            elif 'project management' in user_message:
                bot_response = "I use Trello, Notion, and GitHub to organize my projects and track progress."

            elif 'api' in user_message:
                bot_response = "Yes! I've integrated APIs like payment gateways, OCR engines, and weather APIs."

            elif 'open source' in user_message:
                bot_response = "I'm beginning to contribute to open-source projects on GitHub."

            elif 'contact' in user_message or 'reach you' in user_message:
                bot_response = "You can reach me via email or through my portfolio website — I'm always excited to connect!"


            else:
                # Call Gemini AI for complex responses
                bot_response = make_api_request(user_message.lower())
            
            # Save conversation to database
            ChatMessage.objects.create(
                user_message=user_message,
                bot_response=bot_response
            )
            
            return JsonResponse({'response': bot_response})
        
        except Exception as e:
            # Error handling for bad requests
            return JsonResponse({'error': str(e)}, status=400)
    
    # Only POST requests allowed
    return JsonResponse({'error': 'Invalid request method'}, status=405)

# Render the chat interface
def chat_view(request):
    return render(request, 'chatbot_app/chat.html')

# Gemini AI API integration - generates intelligent responses
def make_api_request(question):
    # API configuration
    api_key = 'AIzaSyA0k4HtWNoRZf1OtMphpICXVL65YiwR2bI'
    
    if not api_key:
        return 'API key is missing'

    url = f'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key={api_key}'

    headers = {
        'Content-Type': 'application/json'
    }

    # Request payload for Gemini
    body = {
        'contents': [
            {
                'parts': [
                    {'text': question}
                ]
            }
        ]
    }

    try:
        # Make API call to Gemini
        response = requests.post(url, headers=headers, data=json.dumps(body))
        if response.status_code == 200:
            # Parse successful response
            response_data = response.json()
            generated_text = response_data['candidates'][0]['content']['parts'][0]['text']
            return generated_text.strip()
        else:
            # Handle API errors
            return f"Error: {response.status_code} - {response.text}"
    except Exception as e:
        # Handle connection/parsing errors
        return f"An error occurred: {str(e)}"