import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
  const { id } = req.query;
  
  try {
    // Get the badge path in the temp directory
    const badgePath = path.join(process.cwd(), '.tmp', 'badges', `${id}.pdf`);
    
    if (!fs.existsSync(badgePath)) {
      return res.status(404).json({ message: 'Badge non trouvé' });
    }

    // Read the badge file
    const badgeData = fs.readFileSync(badgePath);
    
    // Set appropriate headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=badge_${id}.pdf`);
    
    // Send the file
    res.send(badgeData);
  } catch (error) {
    console.error('Error serving badge:', error);
    res.status(500).json({ message: 'Erreur lors de l\'obtention du badge' });
  }
}
