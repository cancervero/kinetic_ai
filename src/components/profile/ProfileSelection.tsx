import { useState, useEffect } from 'react';
import {
  getAllProfiles,
  createProfile,
  setCurrentProfile,
  type UserProfile,
} from '@/lib/storage/profile-storage';

interface ProfileSelectionProps {
  onProfileSelected: (profile: UserProfile) => void;
}

export function ProfileSelection({ onProfileSelected }: ProfileSelectionProps) {
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [newAlias, setNewAlias] = useState('');
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = () => {
    const allProfiles = getAllProfiles();
    setProfiles(allProfiles);
    setShowCreateForm(allProfiles.length === 0);
  };

  const handleSelectProfile = (profile: UserProfile) => {
    setCurrentProfile(profile.alias);
    onProfileSelected(profile);
  };

  const handleCreateProfile = () => {
    setError('');

    if (!newAlias.trim()) {
      setError('Por favor ingresa un alias');
      return;
    }

    if (newAlias.length < 2) {
      setError('El alias debe tener al menos 2 caracteres');
      return;
    }

    if (newAlias.length > 20) {
      setError('El alias debe tener máximo 20 caracteres');
      return;
    }

    try {
      const profile = createProfile(newAlias.trim());
      setCurrentProfile(profile.alias);
      onProfileSelected(profile);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear perfil');
    }
  };

  return (
    <div className="profile-selection">
      <div className="profile-card">
        <h1>Kinetic AI</h1>
        <p className="subtitle">Contador de repeticiones con IA</p>

        {!showCreateForm && profiles.length > 0 && (
          <div className="profile-list">
            <h2>Selecciona tu perfil</h2>
            {profiles.map((profile) => (
              <button
                key={profile.alias}
                className="profile-button"
                onClick={() => handleSelectProfile(profile)}
              >
                <span className="profile-alias">{profile.alias}</span>
                {profile.calibration && (
                  <span className="calibrated-badge">✓ Calibrado</span>
                )}
              </button>
            ))}
            <button
              className="create-new-button"
              onClick={() => setShowCreateForm(true)}
            >
              + Crear nuevo perfil
            </button>
          </div>
        )}

        {showCreateForm && (
          <div className="create-form">
            <h2>Crear perfil</h2>
            <input
              type="text"
              placeholder="Ingresa tu alias"
              value={newAlias}
              onChange={(e) => setNewAlias(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateProfile()}
              className="alias-input"
              maxLength={20}
              autoFocus
            />
            {error && <p className="error-message">{error}</p>}
            <div className="button-group">
              <button onClick={handleCreateProfile} className="primary-button">
                Continuar
              </button>
              {profiles.length > 0 && (
                <button
                  onClick={() => setShowCreateForm(false)}
                  className="secondary-button"
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
