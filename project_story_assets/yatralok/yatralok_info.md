  <div align="center">

  # 🛡️ YatraLok - Tourist Safety Platform

  [![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://mysql.com/)
  [![Blockchain](https://img.shields.io/badge/Blockchain-Ethereum-627EEA?style=for-the-badge&logo=ethereum&logoColor=white)](https://ethereum.org/)
  [![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

  **A comprehensive tourist safety platform with blockchain-based digital IDs, real-time tracking, and emergency services**

  [🚀 Live Demo](#) • [📖 Documentation](#documentation) • [🐛 Report Bug](https://github.com/DeepanshuSinghal05/tourist-safety/issues) • [💡 Request Feature](https://github.com/DeepanshuSinghal05/tourist-safety/issues)

  ---

  </div>

  ## 📋 Table of Contents

  - [🎯 Problem Statement](#-problem-statement)
  - [💡 Solution Overview](#-solution-overview)
  - [✨ Features](#-features)
  - [🖥️ Frontend](#️-frontend)
  - [🔧 Backend](#-backend)
  - [🏗️ Architecture](#️-architecture)
  - [🚀 Getting Started](#-getting-started)
  - [📱 Screenshots](#-screenshots)
  - [🔐 Security](#-security)
  - [📊 API Documentation](#-api-documentation)
  - [🤝 Contributing](#-contributing)
  - [📄 License](#-license)

  ---

  ## 🎯 Problem Statement

  Tourism contributes significantly to global economies, but tourists face critical safety challenges:

  - **🔍 Identity Verification**: Complex document verification processes
  - **🚨 Emergency Response**: Delayed access to emergency services
  - **📍 Location Tracking**: Limited real-time location sharing capabilities
  - **📋 Trip Management**: Lack of centralized trip information systems
  - **🔒 Security Vulnerabilities**: Risk of fraud and identity theft

  ---

  ## 💡 Solution Overview

  YatraLok addresses these challenges through a comprehensive platform featuring:

  - **🔗 Blockchain Digital IDs**: Tamper-proof, secure identification
  - **📍 Real-time GPS Tracking**: Live location monitoring with Google Maps
  - **🚨 Emergency Panic System**: Instant SOS alerts to authorities
  - **📱 Mobile-First Design**: Cross-platform compatibility
  - **👮 Multi-Role Platform**: Separate interfaces for tourists and police

  ---

  ## ✨ Features

  ### 🎯 Core Features

  | Feature | Description | Status |
  |---------|-------------|--------|
  | 🔐 **Digital ID System** | Blockchain-based secure identification | ✅ Complete |
  | 📱 **Mobile App** | Cross-platform mobile application | ✅ Complete |
  | 🤖 **AI Safety Scoring** | Intelligent safety assessment | ✅ Complete |
  | 👮 **Police Dashboard** | Law enforcement monitoring interface | ✅ Complete |
  | ⌚ **IoT Integration** | Wearable device connectivity | 🚧 Planned |
  | 🌐 **Multi-language** | Internationalization support | 🚧 Planned |

  ### 🔧 Technical Features

  - **Real-time Location Tracking** with Google Maps API
  - **SMS-based OTP Verification** via Twilio
  - **MySQL Database** with optimized queries
  - **RESTful API Architecture**
  - **Responsive Web Design**
  - **Cross-browser Compatibility**

  ---

  ## 🖥️ Frontend

  ### 🛠️ Technology Stack

  ```
  Frontend Stack:
  ├── React 19.1.1          # Modern UI library
  ├── React Router DOM 7.8.2 # Client-side routing
  ├── Vite 7.1.2            # Build tool & dev server
  ├── Google Maps API       # Location services
  ├── Material Symbols      # Icon library
  └── CSS3                  # Styling & animations
  ```

  ### 🏗️ Component Architecture

  ```
  src/components/
  ├── 🏠 Landing Page
  │   ├── Hero Section
  │   ├── Core Features
  │   └── Navigation
  ├── 🔐 Authentication
  │   ├── Tourist Registration
  │   ├── Police Registration
  │   └── Login Systems
  └── 📱 Tourist Dashboard
      ├── 📊 Overview
      ├── 👤 Profile Management
      ├── 🗺️ Trip Management
      ├── 🆔 Digital ID System
      ├── 🛡️ Safety Features
      ├── 📍 Location Tracking
      └── 🚨 Emergency Contacts
  ```

  ### 🎨 Key Frontend Features

  #### 1. **Dashboard Overview**
  - Welcome interface with personalized greeting
  - Recent trips display with quick access
  - Safety score visualization (86% default)
  - Quick navigation to all sections

  #### 2. **Digital ID Management**
  ```javascript
  // OTP-based verification flow
  const handleSendOtp = async () => {
    const response = await fetch("http://localhost:8000/api/request-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone: mobile }),
    });
    // Handle OTP response
  };
  ```

  #### 3. **Real-time Location Tracking**
  - Google Maps integration
  - GPS permission management
  - Live location updates
  - Accuracy indicators

  #### 4. **Emergency Panic System**
  - One-touch SOS button
  - Instant alert to emergency contacts
  - Visual feedback system

  ---

  ## 🔧 Backend

  ### 🛠️ Technology Stack

  ```
  Backend Stack:
  ├── Node.js               # Runtime environment
  ├── Express.js 5.1.0      # Web framework
  ├── MySQL 3.14.5         # Database
  ├── Blockchain Integration
  │   ├── Ethers.js 6.15.0  # Ethereum interaction
  │   ├── Web3.js 4.16.0    # Blockchain connectivity
  │   ├── Truffle 5.11.5    # Smart contracts
  │   └── Ganache 7.9.2     # Local blockchain
  └── Twilio 5.9.0         # SMS services
  ```

  ### 🏗️ Service Architecture

  ```
  Backend Services:
  ├── 🗄️ Database Service (server/index.js)
  │   ├── User Management
  │   ├── Trip Management
  │   └── Emergency Contacts
  ├── ⛓️ Blockchain Service (backend/server/index.js)
  │   ├── Smart Contract Integration
  │   ├── Digital ID Minting
  │   └── OTP Verification
  └── 📱 SMS Service
      ├── Twilio Integration
      └── Message Templates
  ```

  ### 📊 Database Schema

  #### Core Tables

  ```sql
  -- Tourist Management
  CREATE TABLE tourist_table (
    Sno INT AUTO_INCREMENT PRIMARY KEY,
    TouristName VARCHAR(100) NOT NULL,
    EmailId VARCHAR(100) UNIQUE NOT NULL,
    PhoneNo VARCHAR(15) NOT NULL,
    Address TEXT,
    Gender ENUM('Male', 'Female', 'Other'),
    DOB DATE,
    Password VARCHAR(255) NOT NULL
  );

  -- Digital IDs with Blockchain Integration
  CREATE TABLE digital_ids (
    id INT AUTO_INCREMENT PRIMARY KEY,
    digital_id VARCHAR(255) UNIQUE NOT NULL,
    aadhaar VARCHAR(20) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    tourist_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  -- Trip Management
  CREATE TABLE trips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    origin VARCHAR(100) NOT NULL,
    destination VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    purpose VARCHAR(255),
    phone VARCHAR(15) NOT NULL,
    digital_id VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (digital_id) REFERENCES digital_ids(digital_id)
  );
  ```

  ### 🔗 Smart Contract Integration

  ```solidity
  // SPDX-License-Identifier: MIT
  contract DigitalID is ERC721 {
      uint256 public tokenCounter;
      mapping(uint256 => bytes32) public digitalIDs;

      function mintDigitalID(string memory phone, string memory aadhaar) 
          public returns (uint256) {
          uint256 tokenId = tokenCounter;
          bytes32 digitalIDHash = keccak256(abi.encodePacked(phone, aadhaar, tokenId));
          digitalIDs[tokenId] = digitalIDHash;
          _mint(msg.sender, tokenId);
          tokenCounter += 1;
          return tokenId;
      }
  }
  ```

  ---

  ## 🏗️ Architecture

  ```mermaid
  graph TB
      subgraph "Frontend Layer"
          A[React Web App] --> B[Mobile App - Capacitor]
      end
      
      subgraph "API Layer"
          C[Express.js Server] --> D[RESTful APIs]
      end
      
      subgraph "Database Layer"
          E[MySQL Database] --> F[User Data]
          E --> G[Trip Data]
          E --> H[Digital IDs]
      end
      
      subgraph "Blockchain Layer"
          I[Smart Contracts] --> J[Digital ID Minting]
          K[Ganache Network] --> I
      end
      
      subgraph "External Services"
          L[Google Maps API] --> M[Location Services]
          N[Twilio SMS] --> O[OTP Delivery]
      end
      
      A --> C
      C --> E
      C --> I
      A --> L
      C --> N
  ```

  ---

  ## 🚀 Getting Started

  ### 📋 Prerequisites

  - [Node.js](https://nodejs.org/) (v16 or higher)
  - [MySQL](https://mysql.com/) Server
  - [Google Maps API Key](https://developers.google.com/maps)
  - [Twilio Account](https://twilio.com/) (for SMS)
  - [Ganache](https://trufflesuite.com/ganache/) (for blockchain)

  ### ⚡ Quick Installation

  1. **Clone the repository**
  ```bash
  git clone https://github.com/DeepanshuSinghal05/tourist-safety.git
  cd tourist-safety
  ```

  2. **Install dependencies**
  ```bash
  # Frontend
  npm install

  # Backend Database Server
  cd server && npm install

  # Backend Blockchain Server
  cd ../backend && npm install
  ```

  3. **Database Setup**
  ```bash
  # Create database
  mysql -u root -p
  CREATE DATABASE yatralok;
  USE yatralok;
  SOURCE database_setup.sql;
  ```

  4. **Environment Configuration**
  ```bash
  # Create .env files
  cp .env.example .env
  # Configure your API keys and database credentials
  ```

  5. **Start the application**
  ```bash
  # Terminal 1: Database Server
  cd server && npm start

  # Terminal 2: Blockchain Server  
  cd backend && npm start

  # Terminal 3: Frontend
  npm run dev
  ```

  ### 🌐 Access Points

  - **Frontend**: http://localhost:5173
  - **Database API**: http://localhost:5000
  - **Blockchain API**: http://localhost:8000

  ---

  ## 📱 Screenshots

  <div align="center">

  ### 🏠 Landing Page
  ![Landing Page](docs/screenshots/landing.png)

  ### 📱 Tourist Dashboard
  ![Dashboard](docs/screenshots/dashboard.png)

  ### 🗺️ Location Tracking
  ![Tracking](docs/screenshots/tracking.png)

  ### 🆔 Digital ID Creation
  ![Digital ID](docs/screenshots/digital-id.png)

  </div>

  ---

  ## 🔐 Security

  ### 🛡️ Security Features

  | Feature | Implementation | Status |
  |---------|----------------|--------|
  | **Blockchain Security** | Immutable digital IDs | ✅ Active |
  | **OTP Verification** | SMS-based 2FA | ✅ Active |
  | **Data Encryption** | Secure API communication | ✅ Active |
  | **Access Control** | Role-based permissions | ✅ Active |
  | **Input Validation** | Comprehensive validation | ✅ Active |

  ### 🔒 Security Measures

  - **Smart Contract Verification**: Automated blockchain verification
  - **Cryptographic Hashing**: SHA-256 for digital ID generation
  - **Session Management**: Secure user authentication
  - **CORS Protection**: Cross-origin request security
  - **SQL Injection Prevention**: Parameterized queries

  ---

  ## 📊 API Documentation

  ### 🔐 Authentication Endpoints

  | Method | Endpoint | Description | Request Body |
  |--------|----------|-------------|--------------|
  | `POST` | `/api/tourist/register` | Tourist registration | `{name, email, phone, password}` |
  | `POST` | `/api/tourist/login` | Tourist authentication | `{email, password}` |
  | `POST` | `/api/police/register` | Police registration | `{policeId, name, email, password}` |
  | `POST` | `/api/police/login` | Police authentication | `{email, password}` |

  ### 🆔 Digital ID Endpoints

  | Method | Endpoint | Description |
  |--------|----------|-------------|
  | `POST` | `/api/digital-id/create` | Create digital ID |
  | `GET` | `/api/digital-id/tourist/:id` | Get tourist's digital ID |
  | `POST` | `/api/request-otp` | Request OTP for verification |
  | `POST` | `/api/verify-otp` | Verify OTP and mint ID |

  ### 🗺️ Trip Management Endpoints

  | Method | Endpoint | Description |
  |--------|----------|-------------|
  | `POST` | `/api/trips` | Create new trip |
  | `GET` | `/api/trips/tourist/:id` | Get tourist's trips |
  | `GET` | `/api/trips` | Get all trips |

  ### 🚨 Emergency Contact Endpoints

  | Method | Endpoint | Description |
  |--------|----------|-------------|
  | `POST` | `/api/emergency-contacts` | Add emergency contact |
  | `GET` | `/api/emergency-contacts/tourist/:id` | Get contacts |
  | `PUT` | `/api/emergency-contacts/:id` | Update contact |
  | `DELETE` | `/api/emergency-contacts/:id` | Delete contact |

  ---

  ## 🤝 Contributing

  We welcome contributions! Please follow these steps:

  1. **Fork the repository**
  2. **Create a feature branch**
    ```bash
    git checkout -b feature/amazing-feature
    ```
  3. **Commit your changes**
    ```bash
    git commit -m 'Add some amazing feature'
    ```
  4. **Push to the branch**
    ```bash
    git push origin feature/amazing-feature
    ```
  5. **Open a Pull Request**

  ### 📝 Contribution Guidelines

  - Follow the existing code style
  - Add tests for new features
  - Update documentation as needed
  - Ensure all tests pass
  - Use conventional commit messages

  ---

  ## 📄 License

  This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

  ---

  ## 📞 Support & Contact

  <div align="center">

  **Need help? We're here for you!**

  [📧 Email Support](mailto:deepanshusinghal05@gmail.com) • [💼 LinkedIn Profile](https://linkedin.com/in/deepanshu-singhal-b4320b251) • [🐙 GitHub Profile](https://github.com/DeepanshuSinghal05)

  **YatraLok** - Making tourism safer, one trip at a time! 🌍✈️🛡️

  ---

  [![Made with ❤️](https://img.shields.io/badge/Made%20with-❤️-red?style=for-the-badge)](https://github.com/DeepanshuSinghal05)
  [![Star this repo](https://img.shields.io/github/stars/DeepanshuSinghal05/tourist-safety?style=for-the-badge)](https://github.com/DeepanshuSinghal05/tourist-safety/stargazers)
  [![Fork this repo](https://img.shields.io/github/forks/DeepanshuSinghal05/tourist-safety?style=for-the-badge)](https://github.com/DeepanshuSinghal05/tourist-safety/network)

  </div>
