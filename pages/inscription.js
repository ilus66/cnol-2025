import { useState } from 'react';
import Layout from '../components/Layout';

export default function Inscription() {
  const [type, setType] = useState('visiteur');
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    entreprise: '',
    poste: '',
    ville: '',
    pays: 'Maroc'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/inscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...formData, type }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'inscription');
      }
      
      const data = await response.json();
      alert('Inscription réussie ! Un email de confirmation vous a été envoyé.');
      window.location.href = '/';
    } catch (error) {
      console.error('Erreur:', error);
      alert(error.message);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <Layout title="Inscription - CNOL 2025">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-8 text-center">Inscription CNOL 2025</h1>

          <div className="mb-6 flex justify-center space-x-2">
            <button
              onClick={() => setType('visiteur')}
              className={`px-6 py-2 rounded-lg ${
                type === 'visiteur' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Visiteur
            </button>
            <button
              onClick={() => setType('exposant')}
              className={`px-6 py-2 rounded-lg ${
                type === 'exposant' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              Exposant
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nom</label>
                <input
                  type="text"
                  name="nom"
                  required
                  value={formData.nom}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  placeholder="Dupont"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Prénom</label>
                <input
                  type="text"
                  name="prenom"
                  required
                  value={formData.prenom}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  placeholder="Jean"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                placeholder="jean.dupont@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone</label>
              <input
                type="tel"
                name="telephone"
                required
                value={formData.telephone}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                placeholder="+212 6 XX XX XX XX"
              />
            </div>

            {type === 'exposant' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'entreprise</label>
                  <input
                    type="text"
                    name="entreprise"
                    required
                    value={formData.entreprise}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    placeholder="Nom de l'entreprise"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Poste</label>
                  <input
                    type="text"
                    name="poste"
                    required
                    value={formData.poste}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                    placeholder="Directeur commercial"
                  />
                </div>
              </>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ville</label>
                <input
                  type="text"
                  name="ville"
                  required
                  value={formData.ville}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  placeholder="Casablanca"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Pays</label>
                <select
                  name="pays"
                  value={formData.pays}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                >
                  <option value="Maroc">Maroc</option>
                  <option value="France">France</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
            </div>

            <div className="text-sm text-gray-500">
              En cliquant sur "S'inscrire", vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors duration-200"
            >
              S'inscrire
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}