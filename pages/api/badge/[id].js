import { generateBadge } from '../../../generateBadge.js';

export default async function handler(req, res) {
  const { id } = req.query;
  
  try {
    // Generate badge in memory for Vercel
    const badgeData = await generateBadge({
      userId: id,
      type: 'visiteur', // We don't need the actual user data here
      nom: 'Utilisateur',
      prenom: 'Test',
      email: 'test@example.com'
    });

    if (badgeData.type === 'pdf') {
      // Set appropriate headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=badge_${id}.pdf`);
      
      // Send the PDF bytes
      res.send(badgeData.data);
    } else {
      // For non-Vercel environments
      const badgePath = path.join(process.cwd(), '.tmp', 'badges', `${id}.pdf`);
      
      if (!fs.existsSync(badgePath)) {
        return res.status(404).json({ message: 'Badge non trouvé' });
      }

      const badgeData = fs.readFileSync(badgePath);
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=badge_${id}.pdf`);
      res.send(badgeData);
    }
  } catch (error) {
    console.error('Error serving badge:', error);
    res.status(500).json({ message: 'Erreur lors de l\'obtention du badge' });
  }
}
