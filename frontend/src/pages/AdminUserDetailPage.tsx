import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getUserCard } from '../api/adminApi';
import { API_BASE, formatMemberNumber } from '../utils/constants';
import type { UserProfile } from '../types/profile';

export default function AdminUserDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [photoError, setPhotoError] = useState(false);

  useEffect(() => {
    if (userId) {
      loadProfile(userId);
    }
  }, [userId]);

  const loadProfile = async (id: string) => {
    try {
      const { data } = await getUserCard(id);
      setProfile(data);
    } catch {
      setError('Пользователь не найден');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-admin">
        <div className="container">
          <div className="cabinet-loading">
            <div className="cabinet-loading__spinner" />
            <p>Загрузка карточки...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="page-admin">
        <section className="section">
          <div className="container">
            <div className="alert alert--error">{error || 'Пользователь не найден'}</div>
            <Link to="/admin" className="btn btn--outline">Назад к списку</Link>
          </div>
        </section>
      </div>
    );
  }

  const fullName = [profile.lastName, profile.firstName, profile.middleName]
    .filter(Boolean)
    .join(' ') || 'Имя не указано';

  return (
    <div className="page-admin">
      <section className="page-header">
        <div className="container">
          <Link to="/admin" className="page-header__back">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" style={{ marginRight: 6, verticalAlign: 'middle' }}>
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Назад к списку
          </Link>
          <div className="admin-detail-header">
            <h1 className="page-header__title">Карточка пользователя</h1>
            <div className="member-badge member-badge--hero">
              <span className="member-badge__label">Номер участника</span>
              <span className="member-badge__number">{formatMemberNumber(profile.memberNumber)}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {/* Profile Card */}
          <div className="cabinet-card">
            <div className="profile-layout">
              <div className="profile-photo-section">
                <div className="profile-photo">
                  {profile.photoUrl && !photoError ? (
                    <img
                      src={`${API_BASE}${profile.photoUrl}`}
                      alt="Фото профиля"
                      className="profile-photo__img"
                      onError={() => setPhotoError(true)}
                    />
                  ) : (
                    <div className="profile-photo__placeholder">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="64" height="64">
                        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              <div className="profile-fields">
                <div className="profile-fields__header">
                  <h2 className="profile-fields__name">{fullName}</h2>
                </div>

                <div className="profile-grid">
                  <ReadonlyField label="Email" value={profile.email} />
                  <ReadonlyField label="Телефон" value={profile.phone} />
                  <ReadonlyField label="Дата рождения" value={profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString('ru-RU') : null} />
                  <ReadonlyField label="Адрес" value={profile.address} fullWidth />
                  <ReadonlyField label="Образование (общее)" value={profile.education} fullWidth />
                  <ReadonlyField label="Место работы" value={profile.workplace} fullWidth />
                  <ReadonlyField label="О себе" value={profile.bio} fullWidth />
                </div>
              </div>
            </div>
          </div>

          {/* Education Section */}
          <div className="cabinet-card education-section">
            <div className="education-section__header">
              <div>
                <h2 className="education-section__title">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="28" height="28">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c0 1.657 2.686 3 6 3s6-1.343 6-3v-5" />
                  </svg>
                  Образование и дипломы
                </h2>
                <p className="education-section__subtitle">
                  Записи об образовании пользователя
                </p>
              </div>
            </div>

            {profile.educationEntries && profile.educationEntries.length > 0 ? (
              <div className="education-list">
                {profile.educationEntries.map((entry) => (
                  <div className="education-item" key={entry.id}>
                    <div className="education-item__main">
                      <div className="education-item__icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                          <path d="M6 12v5c0 1.657 2.686 3 6 3s6-1.343 6-3v-5" />
                        </svg>
                      </div>
                      <div className="education-item__details">
                        <h4 className="education-item__institution">{entry.institutionName}</h4>
                        <p className="education-item__specialty">{entry.specialty}</p>
                        <span className="education-item__year">Год окончания: {entry.graduationYear}</span>
                      </div>
                    </div>
                    <div className="education-item__actions">
                      {entry.diplomaUrl ? (
                        <a
                          href={`${API_BASE}${entry.diplomaUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="diploma-link"
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                          </svg>
                          Просмотреть диплом
                        </a>
                      ) : (
                        <span className="diploma-status diploma-status--missing">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                          </svg>
                          Диплом не загружен
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="education-empty">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" width="48" height="48">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                  <path d="M6 12v5c0 1.657 2.686 3 6 3s6-1.343 6-3v-5" />
                </svg>
                <p>У пользователя нет записей об образовании</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function ReadonlyField({ label, value, fullWidth }: { label: string; value: string | null; fullWidth?: boolean }) {
  return (
    <div className={`profile-field ${fullWidth ? 'profile-field--full' : ''}`}>
      <label className="profile-field__label">{label}</label>
      <p className="profile-field__value">{value || '---'}</p>
    </div>
  );
}
