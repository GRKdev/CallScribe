
# Next.js Frontend for Call Center Management System

This Next.js application serves as the frontend interface for a call center management system. It allows users to view, filter, and interact with conversation data retrieved from a backend service.

## Features

- **Dynamic Conversation Display**: Shows conversation cards with details such as sentiment, summary, and tags.
- **Interactive Filters**: Allows filtering conversations by time, status, and custom date.
- **Search Functionality**: Includes a search bar to find specific conversations.
- **Responsive Design**: Adapts to various screen sizes for optimal viewing.
- **Sentiment Analysis Visualization**: Displays counts of conversations categorized by sentiment (positive, negative, neutral).
- **Status Update**: Enables updating the status of conversations.

## Technology Stack

- React: For building the user interface.
- Next.js: A React framework that enables server-side rendering and generating static websites.
- Custom Hooks: For managing data fetching, search filtering, and debouncing user input.

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/GRKdev/CallScribe.git
   ```

2. **Install Dependencies**:
   Navigate to the project directory and run:
   ```bash
   npm install
   ```

## Running the Application

1. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   This will start the Next.js application in development mode.

2. **Open the Application**:
   Access the application at `http://localhost:3000`.

## Usage

- The homepage displays a list of conversation cards.
- Use the navbar to filter conversations by time, status, or search terms.
- Click on individual conversation cards to view detailed information.
- Update the status of conversations as needed.

## Environment Variables

Make sure to set up the necessary environment variables for backend API connections and any other sensitive information.

## Note

- Ensure the backend API (FastAPI) is running and accessible.
- Update the API endpoints in the code as necessary to match your backend configuration.

## Author

GRKdev
