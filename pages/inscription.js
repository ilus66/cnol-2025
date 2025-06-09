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
      <div className="container">
        <div className="max-w-2xl mx-auto">
          <div className="card">
            <h1 className="title">Inscription CNOL 2025</h1>
            
            <div className="flex justify-center mb-6">
              <button
                className={`px-6 py-2 rounded-l-lg ${type === 'visiteur' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                onClick={() => setType('visiteur')}
              >
                Visiteur
              </button>
              <button
                className={`px-6 py-2 rounded-r-lg ${type === 'exposant' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                onClick={() => setType('exposant')}
              >
                Exposant
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom</label>
                  <input
                    type="text"
                    name="nom"
                    required
                    value={formData.nom}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Prénom</label>
                  <input
                    type="text"
                    name="prenom"
                    required
                    value={formData.prenom}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                <input
                  type="tel"
                  name="telephone"
                  required
                  value={formData.telephone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {type === 'exposant' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Nom de l'entreprise</label>
                    <input
                      type="text"
                      name="entreprise"
                      required
                      value={formData.entreprise}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Poste</label>
                    <input
                      type="text"
                      name="poste"
                      required
                      value={formData.poste}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ville</label>
                  <input
                    type="text"
                    name="ville"
                    required
                    value={formData.ville}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Pays</label>
                  <select
                    name="pays"
                    value={formData.pays}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="Maroc">Maroc</option>
                    <option value="France">France</option>
                    <option value="Autre">Autre</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary w-full"
              >
                S'inscrire
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                En cliquant sur "S'inscrire", vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}