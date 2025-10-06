# CTF Challenge - Prototype Pollution in Node.js

## 🎯 Challenge Description

This sophisticated CTF challenge demonstrates a critical **prototype pollution** vulnerability within a Node.js application leveraging Express.js and the lodash library. The primary objective involves exploiting this architectural weakness to circumvent authentication mechanisms and gain unauthorized access to privileged administrative resources.

## 🚀 Quick Start

### Using Docker (Recommended)

```bash
# Clone the repository
git clone https://github.com/CyberCTF/SwaggerApi-prototype-pollution
cd SwaggerApi-prototype-pollution

# Run with Docker Compose
docker compose -f build/deploy/docker-compose.dev.yml up -d --build

# Access the application
open http://localhost:3206
```

### Using Docker Hub

```bash
# Pull the pre-built image
docker pull cyberctf/swaggerapi-prototype-pollution:latest

# Run the container
docker run -d -p 3206:3206 --name prototype-pollution-ctf cyberctf/swaggerapi-prototype-pollution:latest

# Access the application
open http://localhost:3206
```

## 🎮 How to Play

1. **Access the Application**: Navigate to `http://localhost:3206`
2. **Explore the API**: Use the Swagger UI documentation at `/api-docs`
3. **Find the Vulnerability**: Look for prototype pollution in the profile update endpoint
4. **Exploit the Bug**: Use `__proto__` to pollute the Object prototype
5. **Gain Admin Access**: Access the admin endpoints to retrieve sensitive data

## 🔍 Challenge Details

### Available Endpoints

- `POST /login` - User authentication
- `GET /profile` - Get user profile
- `POST /update-profile` - Update user profile (vulnerable endpoint)
- `GET /admin/users` - Admin-only endpoint (target)

### Default Users

- **user1**: `password123` (regular user)
- **user2**: `password456` (regular user)
- **admin**: `4dminTheB3st!` (admin user)
- **manager**: `ohMyGodYouGotMe` (manager user)

### The Vulnerability

The application uses `lodash.merge()` without proper validation, allowing prototype pollution through the `__proto__` property. This can be exploited to modify the Object prototype and gain admin privileges.

## 🛠️ Development

### Local Development

```bash
# Install dependencies
cd build/app
npm install

# Start the application
npm run dev

# Run tests
npm test
```

### Testing the Exploit

```bash
# Run the comprehensive test suite
python build/app/tests/test_prototype_pollution.py

# Run simple tests
python build/app/tests/simple_test.py
```

## 🔒 Security Notes

This is a **CTF challenge** designed for educational purposes. The vulnerability is intentionally present to demonstrate prototype pollution attacks. Do not use this code in production environments.

## 📚 Learning Objectives

- Understand prototype pollution vulnerabilities
- Learn about JavaScript object prototypes
- Practice exploiting authentication bypasses
- Gain experience with Node.js security issues

## 🏆 Flag

The challenge flag is: `CTF{prototype_pollution_bypass_auth_2024}`

## 📖 Additional Resources

- [Prototype Pollution - OWASP](https://owasp.org/www-community/attacks/Prototype_Pollution)
- [Lodash Security Advisory](https://github.com/lodash/lodash/wiki/Security-Advice)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

## 🤝 Contributing

This is a CTF challenge repository. Contributions that improve the educational value or fix non-security issues are welcome.

## 📄 License

MIT License - See LICENSE file for details.