import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { generateBadge } from '../../generateBadge.js';
import { sendBadgeEmail } from '../../sendEmail.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { type, ...userData } = req.body;
    const userId = uuidv4();
    
    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(dataDir)) {
      try {
        fs.mkdirSync(dataDir, { recursive: true });
      } catch (error) {
        throw new Error(`Impossible de créer le répertoire data: ${error.message}`);
      }
    }

    // Save user data
    const usersPath = path.join(dataDir, 'users.json');
    let users = [];
    try {
      if (fs.existsSync(usersPath)) {
        users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
      }
    } catch (error) {
      throw new Error(`Erreur lors de la lecture des données utilisateur: ${error.message}`);
    }

    const newUser = {
      id: userId,
      type,
      ...userData,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    try {
      fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
    } catch (error) {
      throw new Error(`Erreur lors de l'enregistrement des données utilisateur: ${error.message}`);
    }

    // Generate badge
    let badgePath;
    try {
      badgePath = await generateBadge({
        ...userData,
        userId,
        type
      });
    } catch (error) {
      throw new Error(`Erreur lors de la génération du badge: ${error.message}`);
    }

    // Send confirmation email with badge
    try {
      await sendBadgeEmail({
        ...userData,
        userId,
        badgeUrl: `/badges/${path.basename(badgePath)}`
      });
    } catch (error) {
      throw new Error(`Erreur lors de l'envoi de l'email: ${error.message}`);
    }

    res.status(200).json({ 
      message: 'Inscription réussie',
      userId,
      badgeUrl: `/badges/${path.basename(badgePath)}`
    });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}