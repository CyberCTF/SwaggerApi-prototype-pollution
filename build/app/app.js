const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const _ = require('lodash');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = process.env.PORT || 3206;

// Configuration de la session
app.use(session({
    secret: 'ctf-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, httpOnly: true }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuration Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'User Profile Management API',
      version: '1.0.0',
      description: 'API de gestion des profils utilisateurs avec authentification et autorisation',
      contact: {
        name: 'API Support',
        email: 'support@example.com'
      }
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Serveur de développement'
      }
    ],
    components: {
      schemas: {
        LoginRequest: {
          type: 'object',
          required: ['username', 'password'],
          properties: {
            username: {
              type: 'string',
              description: 'Nom d\'utilisateur',
              example: 'user1'
            },
            password: {
              type: 'string',
              description: 'Mot de passe',
              example: 'password123'
            }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              example: 'Connexion réussie'
            },
            user: {
              type: 'object',
              properties: {
                username: { type: 'string' },
                isAdmin: { type: 'boolean' },
                profile: { type: 'object' }
              }
            }
          }
        },
        ProfileUpdate: {
          type: 'object',
          properties: {
            email: { type: 'string' },
            fullName: { type: 'string' },
            preferences: { type: 'object' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              example: 'Message d\'erreur'
            }
          }
        }
      }
    }
  },
  apis: ['./app.js']
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Middleware pour logger les requêtes
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    console.log('Body:', JSON.stringify(req.body, null, 2));
    next();
});

// Route d'accueil - Redirection vers Swagger UI
app.get('/', (req, res) => {
    res.redirect('/api-docs');
});

// Base de données utilisateurs simulée
const users = {
    'user1': { 
        password: 'password123', 
        isAdmin: false, 
        email: 'alice.johnson@company.com',
        fullName: 'Alice Johnson',
        department: 'Sales',
        role: 'user'
    },
    'user2': { 
        password: 'password456', 
        isAdmin: false, 
        email: 'bob.smith@company.com',
        fullName: 'Bob Smith',
        department: 'Marketing',
        role: 'user'
    },
    'admin': { 
        password: '4dminTheB3st!', 
        isAdmin: true, 
        email: 'admin@company.com',
        fullName: 'Admin User',
        department: 'IT',
        role: 'admin'
    },
    'manager': { 
        password: 'ohMyGodYouGotMe', 
        isAdmin: false, 
        email: 'manager@company.com',
        fullName: 'Manager User',
        department: 'HR',
        role: 'manager'
    }
};

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Connexion utilisateur
 *     description: Authentifie un utilisateur avec son nom d'utilisateur et mot de passe
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Username et password requis
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Identifiants invalides
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
        return res.status(400).json({ error: 'Username et password requis' });
    }
    
    const user = users[username];
    if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Identifiants invalides' });
    }
    
    // Créer la session utilisateur
    req.session.user = {
        username: username,
        isAdmin: user.isAdmin,
        profile: {
            email: `${username}@example.com`,
            fullName: `User ${username}`,
            preferences: {
                theme: 'light',
                notifications: true
            }
        }
    };
    
    res.json({ 
        message: 'Connexion réussie', 
        user: req.session.user 
    });
});

/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Obtenir le profil utilisateur
 *     description: Récupère les informations du profil de l'utilisateur connecté
 *     tags: [Profile]
 *     responses:
 *       200:
 *         description: Profil utilisateur récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profil utilisateur
 *                 user:
 *                   type: object
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get('/profile', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Non authentifié' });
    }
    
    res.json({
        message: 'Profil utilisateur',
        user: req.session.user
    });
});

/**
 * @swagger
 * /update-profile:
 *   post:
 *     summary: Mise à jour du profil
 *     description: Met à jour les informations du profil utilisateur
 *     tags: [Profile]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProfileUpdate'
 *           examples:
 *             normal_update:
 *               summary: Mise à jour normale
 *               value:
 *                 email: "newemail@example.com"
 *                 fullName: "New Name"
 *                 preferences:
 *                   theme: "dark"
 *             extended_update:
 *               summary: Mise à jour étendue
 *               description: "Exemple de mise à jour avec plusieurs champs"
 *               value:
 *                 email: "user@example.com"
 *                 fullName: "John Doe"
 *                 preferences:
 *                   theme: "dark"
 *                   notifications: false
 *     responses:
 *       200:
 *         description: Profil mis à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Profil mis à jour avec succès
 *                 profile:
 *                   type: object
 *                 user:
 *                   type: object
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post('/update-profile', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Non authentifié' });
    }
    
    const updates = req.body;
    
    try {
        // VULNÉRABILITÉ: Utilisation de lodash.merge sans validation des clés __proto__
        // Cette fonction peut être exploitée pour polluer le prototype Object
        
        // Créer un objet cible pour la pollution
        const targetObject = {};
        
        // VULNÉRABILITÉ: lodash.merge pollue le prototype si __proto__ est présent
        const mergedProfile = _.merge(targetObject, req.session.user.profile, updates);
        
        // Mise à jour du profil dans la session
        req.session.user.profile = mergedProfile;
        
        // Vérifier si la pollution de prototype a eu lieu
        // Vérifier si la propriété isAdmin a étéreponse ajoutée au prototype
        const isPolluted = targetObject.isAdmin === true || 
                          (targetObject.hasOwnProperty && targetObject.hasOwnProperty('isAdmin') && targetObject.isAdmin === true);
        
        // Si la pollution a eu lieu, mettre à jour le statut admin
        if (isPolluted) {
            req.session.user.isAdmin = true;
        }
        
        // Vérification alternative: si __proto__ était dans les updates
        const hasProtoPollution = updates.hasOwnProperty('__proto__') && updates.__proto__.isAdmin === true;
        if (hasProtoPollution) {
            req.session.user.isAdmin = true;
        }
        
        const finalPollutionDetected = isPolluted || hasProtoPollution;
        
        res.json({
            message: 'Profil mis à jour avec succès',
            profile: req.session.user.profile,
            user: {
                username: req.session.user.username,
                isAdmin: req.session.user.isAdmin,
                profile: req.session.user.profile
            },
            success: true
        });
    } catch (error) {
        console.error('Erreur lors de la mise à jour du profil:', error);
        
        // Vérifier si __proto__ était dans les updates même en cas d'erreur
        const hasProtoPollution = updates.hasOwnProperty('__proto__') && updates.__proto__.isAdmin === true;
        if (hasProtoPollution) {
            req.session.user.isAdmin = true;
        }
        
        res.json({
            message: 'Erreur lors de la mise à jour du profil',
            error: error.message,
            user: {
                username: req.session.user.username,
                isAdmin: req.session.user.isAdmin
            },
            success: false
        });
    }
});

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Liste des utilisateurs (Admin uniquement)
 *     description: Récupère la liste complète des utilisateurs avec leurs informations. Nécessite les privilèges administrateur
 *     tags: [Admin]
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Liste des utilisateurs récupérée avec succès
 *                 users:
 *                   type: object
 *                   description: Liste des utilisateurs avec leurs informations complètes
 *                 totalUsers:
 *                   type: number
 *                   example: 4
 *       401:
 *         description: Non authentifié
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       403:
 *         description: Accès refusé - Privilèges administrateur requis
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Accès refusé - Privilèges administrateur requis
 *                 isAdmin:
 *                   type: boolean
 *                   example: false
 */
app.get('/admin/users', (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({ error: 'Non authentifié' });
    }
    
    // Vérification du statut admin
    if (!req.session.user.isAdmin) {
        return res.status(403).json({ 
            error: 'Accès refusé - Privilèges administrateur requis',
            isAdmin: req.session.user.isAdmin 
        });
    }
    
    // Retourner tous les utilisateurs avec leurs informations complètes
    res.json({
        message: 'Liste des utilisateurs récupérée avec succès',
        users: users,
        totalUsers: Object.keys(users).length,
        requestedBy: req.session.user.username
    });
});



// Gestion des erreurs
app.use((err, req, res, next) => {
    console.error('Erreur:', err);
    res.status(500).json({ error: 'Erreur interne du serveur' });
});

app.listen(PORT, () => {
    console.log(`Serveur API démarré sur le port ${PORT}`);
    console.log(`Documentation API: http://localhost:${PORT}/api-docs`);
});
