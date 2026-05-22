# RoamEase Travel Booking

RoamEase is a modern, responsive travel booking web application built with HTML, CSS, JavaScript, and a Python backend. It provides a seamless user experience for discovering, booking, and managing travel experiences, all assisted by an interactive AI chatbot.

## Features

- **Roamie AI Chatbot**: An intelligent, interactive travel assistant powered by the Groq API that helps you plan itineraries and manage budgets.
- **User Authentication**: Sign up and login functionality.
- **Search & Discovery**: Browse and search for trips and destinations.
- **Trip Details**: View detailed information about specific trips, including itineraries and pricing.
- **Booking Flow**: A streamlined booking process to reserve your spot.
- **Payment Processing**: Secure payment interface.
- **Booking Confirmation**: View your booking details and get confirmation.
- **Wishlist**: Save your favorite trips for later.
- **Reviews**: Read and leave reviews for travel experiences.

## Technologies Used

- HTML5
- CSS3 (Vanilla)
- JavaScript (Vanilla)
- Python (Flask, Flask-CORS) - Chatbot Backend
- Groq API - AI Chatbot Engine

## Getting Started

To run this application fully (including the AI chatbot), you will need Python installed on your system.

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge, etc.)
- Python 3.x
- pip (Python package installer)

### Running Locally

1. **Clone or Download** the repository to your local machine.
2. **Navigate** to the project directory:
   ```bash
   cd travel
   ```
3. **Set up the AI Chatbot Backend**:
   - Create a `.env` file in the root of the project and add your Groq API Key:
     ```
     GROQ_API_KEY=your_groq_api_key_here
     ```
   - Install the required Python packages:
     ```bash
     python -m pip install flask flask-cors groq
     ```
   - Run the Flask server (it will start on port 5000):
     ```bash
     python app.py
     ```
4. **Open the application**:
   - Leave the Python terminal running in the background.
   - Use a local development server like VS Code's "Live Server" extension, or run a simple Node.js server using `npx serve .` in a new terminal window to serve the HTML files.

## Project Structure

```text
travel/
├── index.html        # Main landing page
├── login.html        # User login
├── signup.html       # User registration
├── trip.html         # Trip details page
├── booking.html      # Booking process
├── payment.html      # Payment processing
├── confirmation.html # Booking confirmation
├── wishlist.html     # User wishlist
├── *.css             # Stylesheets (index.css, chatbot.css, etc.)
├── *.js              # JavaScript files (chatbot.js, trip.js, etc.)
├── app.py            # Python Flask backend for the AI Chatbot
├── requirements.txt  # Python dependencies
└── images/           # Image assets
```
