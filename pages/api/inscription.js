import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { generateBadge } from '../../generateBadge.js';
import { sendBadgeEmail } from '../../sendEmail.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log('Received registration data:', {
      type: req.body.type,
      name: req.body.nom,
      email: req.body.email
    });

    const { type, ...userData } = req.body;
    const userId = uuidv4();
    
    // For Vercel, use memory storage instead of file system
    const dataDir = process.env.VERCEL ? null : path.join(process.cwd(), 'data');
    
    if (dataDir) {
      console.log('Creating data directory:', dataDir);
      if (!fs.existsSync(dataDir)) {
        try {
          fs.mkdirSync(dataDir, { recursive: true });
          console.log('Data directory created');
        } catch (error) {
          throw new Error(`Impossible de créer le répertoire data: ${error.message}`);
        }
      }
    } else {
      console.log('Running on Vercel - using memory storage');
    }

    // Save user data
    let users = [];
    
    if (dataDir) {
      const usersPath = path.join(dataDir, 'users.json');
      console.log('Saving user data to:', usersPath);
      
      try {
        if (fs.existsSync(usersPath)) {
          users = JSON.parse(fs.readFileSync(usersPath, 'utf8'));
          console.log('Loaded existing users data');
        } else {
          console.log('Creating new users file');
          fs.writeFileSync(usersPath, JSON.stringify([]));
        }
      } catch (error) {
        console.error('Error reading users data:', error);
        throw new Error(`Erreur lors de la lecture des données utilisateur: ${error.message}`);
      }
    } else {
      console.log('Running on Vercel - storing users in memory');
    }

    const newUser = {
      id: userId,
      type,
      ...userData,
      createdAt: new Date().toISOString()
    };
    console.log('New user data:', {
      id: newUser.id,
      type: newUser.type,
      name: newUser.nom,
      email: newUser.email
    });

    users.push(newUser);
    
    if (dataDir) {
      try {
        const usersPath = path.join(dataDir, 'users.json');
        fs.writeFileSync(usersPath, JSON.stringify(users, null, 2));
        console.log('User data saved successfully');
      } catch (error) {
        console.error('Error saving user data:', error);
        throw new Error(`Erreur lors de l'enregistrement des données utilisateur: ${error.message}`);
      }
    } else {
      console.log('Running on Vercel - user data stored in memory');
    }

    // Generate badge
    let badgeData;
    try {
      badgeData = await generateBadge({
        ...userData,
        userId,
        type
      });
      
      if (process.env.VERCEL && badgeData.type === 'pdf') {
        // On Vercel, we store the PDF bytes in memory
        console.log('Badge generated successfully (in memory)');
      } else {
        console.log('Badge generated successfully:', badgeData);
      }
    } catch (error) {
      console.error('Error generating badge:', error);
      throw new Error(`Erreur lors de la génération du badge: ${error.message}`);
    }

    // Send confirmation email with badge
    try {
      const badgeUrl = process.env.VERCEL && badgeData.type === 'pdf' 
        ? `/api/badge/${badgeData.userId}`
        : `/badges/${path.basename(badgeData)}`;
      
      await sendBadgeEmail({
        ...userData,
        userId,
        badgeUrl
      });
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      throw new Error(`Erreur lors de l'envoi de l'email: ${error.message}`);
    }

    res.status(200).json({ 
      message: 'Inscription réussie',
      userId,
      badgeUrl: `/badges/${path.basename(badgePath)}`
    });
    console.log('Registration completed successfully');
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
}