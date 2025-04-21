
# SafeHaven - A Digital Shield for Children and Women

SafeHaven is a web application designed to provide a comprehensive safety solution for women and children. The application offers emergency SOS alerts, legal assistance, virtual counseling, and gamified educational activities to empower users with knowledge and resources for their protection.

## Project URL
Will be added after deployment (Currently in development)

## Key Features

### 1. Emergency SOS Alert
- One-tap SOS activation
- Location sharing with emergency contacts and nearby police
- Continuous alarm until safety is confirmed

### 2. User Authentication
- Secure signup/login system
- User type selection (woman/child) for personalized experience

### 3. Legal Assistance Chatbot
- Multilingual support
- Information on laws protecting women and children
- Voice input option for accessibility

### 4. Virtual Counseling
- Connect with professional counselors
- Book sessions through audio, video, or chat
- Profile information and availability management

### 5. Gamified Safety Activities
- **Safety Quest**: Scenario-based decision making
- **Brain Booster Quiz**: Test knowledge on safety, rights, and legal protection
- **Self-Defense Moves**: Learn basic self-defense techniques
- **Voice Challenge**: Practice emergency voice commands
- **Know Your Rights**: Memory game for rights awareness
- **Map Hunt**: Navigation practice to escape unsafe zones
- **Roleplay Adventure**: Understanding different perspectives in emergencies
- **Relaxation Zone**: Reduce stress through relaxation activities

## Technical Implementation

- **Frontend**: React with TypeScript
- **Styling**: Tailwind CSS with custom SafeHaven color palette
- **UI Components**: shadcn/ui library
- **Routing**: React Router for navigation
- **State Management**: React Context API for user authentication, location tracking, and SOS alerts
- **Notifications**: Toast messages for important alerts
- **Responsive Design**: Mobile-first approach for all screens

## Getting Started

1. Clone the repository
2. Install dependencies with `npm install`
3. Start the development server with `npm run dev`
4. Open a browser and navigate to `http://localhost:8080`

## Using the Application

1. **Sign up/login** to create an account
2. Select your **user type** (woman or child)
3. Navigate through the application using the top navigation bar
4. Access the **SOS button** from any screen in case of emergency
5. Explore the **legal assistance** chatbot for information on rights and legal protection
6. Book virtual counseling sessions with professionals
7. Participate in gamified activities to learn safety skills

## Note on AI Chatbot

The legal assistance chatbot currently uses mock AI responses for demonstration purposes. In a production environment, this would be connected to a proper AI API like OpenAI's GPT or a similar service to provide accurate legal information.