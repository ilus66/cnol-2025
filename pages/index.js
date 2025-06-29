import { useState, useEffect } from 'react';
import Layout from '../components/Layout';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si l'utilisateur est authentifié (à adapter selon votre système d'authentification)
    const token = localStorage.getItem('cnol-token');
    setIsAuthenticated(!!token);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Layout title="CNOL Online">
        <div className="container">
          <div className="flex items-center justify-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #004C91 60%, #F5C300 100%)',
      color: '#fff',
      fontFamily: 'sans-serif',
      padding: 20
    }}>
      <img
        src="/images/cnol-logo-blanc.png"
        alt="Logo CNOL"
        style={{ width: 200, marginBottom: 32 }}
      />
      <h1 style={{ fontSize: 32, fontWeight: 700, marginBottom: 16, textAlign: 'center' }}>
        Bienvenue sur l'application CNOL Online
      </h1>
      <p style={{ fontSize: 18, maxWidth: 420, textAlign: 'center', marginBottom: 32 }}>
        Gérez vos réservations et téléchargez vos badges pour le Congrès National d'Optique-Lunetterie.
      </p>
      <div style={{ display: 'flex', gap: 16 }}>
        <button
          style={{
            background: '#F5C300',
            color: '#004C91',
            border: 'none',
            borderRadius: 8,
            padding: '12px 28px',
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}
          onClick={() => window.location.href = '/inscription'}
        >
          S'inscrire
        </button>
        {isAuthenticated && (
          <button
            style={{
              background: '#fff',
              color: '#004C91',
              border: '2px solid #F5C300',
              borderRadius: 8,
              padding: '12px 28px',
              fontWeight: 600,
              fontSize: 16,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}
            onClick={() => window.location.href = '/badge'}
          >
            Télécharger mon badge
          </button>
        )}
        <button
          style={{
            background: '#fff',
            color: '#004C91',
            border: '2px solid #F5C300',
            borderRadius: 8,
            padding: '12px 28px',
            fontWeight: 600,
            fontSize: 16,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
          }}
          onClick={() => window.location.href = '/programme'}
        >
          Voir le programme
        </button>
      </div>
    </div>
  );
} 