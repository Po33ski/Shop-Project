# 🛍️ E-Commerce Shop

A full-stack e-commerce application built with React, Vite, and JSON Server. Features shopping cart, favorites, and dynamic product browsing.

## ✨ Features

- 👕 Browse products by **gender** and **category** (Women, Men, Children)
- 🛒 **Shopping Cart** with quantity management
- ❤️ **Favorites** system
- 🧭 **Breadcrumb navigation**
- 📱 **Responsive design** based on Figma mockup
- 🎨 Modern UI with Accordion components

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite + React Router DOM
- **Backend**: JSON Server (REST API)
- **Deployment**: Docker + Nginx + Supervisor
- **Hosting**: Render.com ready

## 🚀 Quick Start

### Local Development

1. **Clone and install:**
```bash
git clone <repository-url>
cd Shop-Project
npm install
```

2. **Run the application:**
```bash
npm run dev
```

This starts both frontend (http://localhost:5173) and backend (http://localhost:3000).

### Other Commands

- `npm run front-end` - Run only frontend
- `npm run back-end` - Run only backend
- `npm run reset` - Reset database to original state

## 🐳 Docker Deployment

### Build and Run Locally

```bash
# Build Docker image
npm run docker:build

# Run container
npm run docker:run

# Or both in one command
npm run docker:dev
```

Visit: http://localhost:10000

### Deploy to Render.com

This project is configured for **one-click deployment** to Render.com using Docker.

📖 **[Complete Deployment Guide →](./RENDER_DEPLOYMENT.md)**

**Quick steps:**
1. Push to GitHub
2. Create Web Service on Render.com
3. Select this repository
4. Choose **Docker** runtime
5. Deploy!

## 📁 Project Structure

```
Shop-Project/
├── front-end/              # React application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── views/          # Page views
│   │   ├── api/            # API loaders/actions
│   │   └── contexts/       # React contexts
│   └── vite.config.js
├── back-end/               # JSON Server
│   ├── db.json             # Database
│   ├── backup/             # Database backup
│   └── public/             # Product photos
├── Dockerfile              # Multi-stage Docker build
├── nginx.conf              # Nginx configuration
├── supervisord.conf        # Process manager
└── start.sh                # Startup script
```

## 🔧 Configuration

### API Endpoints

Backend provides these endpoints:
- `GET /women` - Women's products
- `GET /men` - Men's products
- `GET /children` - Children's products
- `GET /products` - All products
- `GET /favourites` - User favorites

### Environment Detection

The app automatically detects environment:
- **Development**: API calls go to `http://localhost:3000`
- **Production**: API calls go to `/api` (proxied by Nginx)

## 🎯 How Docker Deployment Works

```
┌────────────────────────────────────┐
│      Docker Container              │
│                                    │
│  ┌──────────┐    ┌──────────────┐ │
│  │  Nginx   │◄──►│ JSON Server  │ │
│  │  :10000  │    │    :3000     │ │
│  └──────────┘    └──────────────┘ │
│       │                            │
│       ▼                            │
│  React App (Static)                │
└────────────────────────────────────┘
```

1. **Multi-stage build** creates optimized production image
2. **Nginx** serves frontend and proxies API requests
3. **JSON Server** handles backend API
4. **Supervisor** manages both processes

## 📊 Database

Uses JSON Server with a file-based database (`db.json`). 

**Note**: On free tier Render.com, database resets on container restart (ephemeral storage).

## 🌐 Live Demo

Deploy your own instance to Render.com in minutes!

[Deploy to Render](https://render.com) ← Click to start

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 👨‍💻 Author

Built as a learning project showcasing modern web development practices.
