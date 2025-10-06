# CTF Challenge - Prototype Pollution in Node.js

## Scenario
This sophisticated CTF challenge demonstrates a critical **prototype pollution** vulnerability within a Node.js application leveraging Express.js and the lodash library. The primary objective involves exploiting this architectural weakness to circumvent authentication mechanisms and gain unauthorized access to privileged administrative resources. The ultimate goal is to retrieve the manager account credentials through advanced prototype manipulation techniques.

## How to run
```bash
git clone https://github.com/CyberCTF/
cd SwaggerApi-prototype-pollution
docker compose -f build/deploy/docker-compose.dev.yml up -d --build
```

**Access**: http://localhost:3206