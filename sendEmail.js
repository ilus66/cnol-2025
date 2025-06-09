// sendEmail.js - Send badge by email with nodemailer
import nodemailer from 'nodemailer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// userData: { email, name, userId, exposant, badgeUrl }
export async function sendBadgeEmail(userData) {
    console.log('Starting sendBadgeEmail for user:', userData.email);
    
    // Log SMTP configuration
    console.log('SMTP Configuration:', {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE,
        user: process.env.SMTP_USER
    });

    // Configure transporter (cnol.ma SMTP)
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    // Test SMTP connection
    try {
        await transporter.verify();
        console.log('SMTP server connection successful');
    } catch (error) {
        console.error('SMTP server connection failed:', error);
        throw new Error(`Erreur de connexion au serveur SMTP: ${error.message}`);
    }

    const badgePath = path.join(__dirname, '../public/badges-exposants', `${userData.userId}.pdf`);
    console.log('Looking for badge at:', badgePath);
    
    if (!fs.existsSync(badgePath)) {
        console.error('Badge not found at:', badgePath);
        throw new Error('Badge PDF non trouvé');
    }

    const mailOptions = {
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: userData.email,
        subject: `Votre badge CNOL 2025 – ${userData.exposant || ''}`,
        text: `Bonjour ${userData.name},\n\nVous trouverez ci-joint votre badge staff pour le CNOL 2025.\n\nLieu : Centre de conférences Fm6education, Rabat\nDates : 10-12 octobre 2025\n\nLien de téléchargement : ${userData.badgeUrl || ''}\n\nLe QR code est intégré dans le badge.\n\nCordialement,\nL'équipe CNOL`,
        attachments: [
            {
                filename: `${userData.userId}.pdf`,
                path: badgePath,
                contentType: 'application/pdf',
            },
        ],
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error(`Erreur lors de l'envoi de l'email: ${error.message}`);
    }
}