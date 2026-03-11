Driver Jobs

Driver Jobs is a full-stack web application designed to help truck drivers and companies manage job opportunities in the trucking industry. The platform allows users to create profiles, browse job listings, and manage job opportunities through a simple and intuitive dashboard.

The application was built as a final project to demonstrate backend development, authentication, database management, and server-side rendering.

⸻

Features

User Authentication
	•	User registration and login
	•	Secure session-based authentication using Passport.js
	•	Role-based access (Admin and User)

Driver Profiles
	•	Users can create and manage their own driver profiles
	•	Store important information such as:
	•	Name
	•	Experience
	•	Position type
	•	State
	•	Availability date

Job Listings
	•	Admin users can create job listings
	•	Jobs include:
	•	Company name
	•	Position title
	•	Hiring area
	•	Details URL
	•	Company image
	•	Users can browse job listings in a card-based layout

CRUD Operations

The application demonstrates full CRUD functionality:
	•	Create – Admin can create new job listings
	•	Read – Users can view job listings and profiles
	•	Update – Jobs and profiles can be edited
	•	Delete – Jobs and profiles can be removed

Search Functionality

Users can search job listings by:
	•	Company name
	•	Position title
	•	Hiring area

News Integration

The app includes a News section that displays the latest posts from the Truck Driver News website using the WordPress API.
	•	Displays the 10 latest posts
	•	News is shown as image cards
	•	Clicking a card opens the original article

Responsive Navigation
	•	Responsive navbar with mobile hamburger menu
	•	Admin-specific navigation options
	•	Clean dashboard layout

⸻

Tech Stack

Backend
	•	Node.js
	•	Express.js
	•	MongoDB
	•	Mongoose
	•	Passport.js (authentication)

Frontend
	•	EJS (Server Side Rendering)
	•	Bootstrap 5
	•	Custom CSS

Security & Middleware
	•	Express sessions
	•	Flash messages
	•	Helmet
	•	Rate limiting
	•	XSS protection
