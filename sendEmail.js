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
    
    // Configuration SMTP pour CNOL
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'mail.cnol.ma',
        port: parseInt(process.env.SMTP_PORT) || 465,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER || 'inscription@cnol.ma',
            pass: process.env.SMTP_PASS
        }
    });

    // Log SMTP configuration
    console.log('SMTP Configuration:', {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: process.env.SMTP_SECURE,
        user: process.env.SMTP_USER
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

    // Create the email content
    const mailOptions = {
        from: process.env.SMTP_FROM || 'inscription@cnol.ma',
        to: userData.email,
        subject: 'Votre badge CNOL 2025',
        html: `
            <h2>Bonjour ${userData.prenom} ${userData.nom},</h2>
            <p>Merci pour votre inscription au CNOL 2025. Vous pouvez télécharger votre badge ci-dessous.</p>
            <p><a href="${userData.badgeUrl}" target="_blank">Télécharger mon badge</a></p>
            <p>Cordialement,</p>
            <p>L'équipe CNOL</p>
        `
    };

    // Send the email
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw new Error(`Erreur lors de l'envoi de l'email: ${error.message}`);
    }
}