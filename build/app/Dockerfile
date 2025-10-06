# Utiliser l'image Node.js officielle
FROM node:18-alpine

# Créer un utilisateur non-root pour la sécurité
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install --only=production && npm cache clean --force

# Copier le code source
COPY . .

# Changer le propriétaire des fichiers
RUN chown -R nodejs:nodejs /app

# Passer à l'utilisateur non-root
USER nodejs

# Exposer le port
EXPOSE 3206

# Variables d'environnement
ENV NODE_ENV=production
ENV PORT=3206
ENV FLAG=CTF{prototype_pollution_bypass_auth_2024}

# Commande de démarrage
CMD ["npm", "start"]
