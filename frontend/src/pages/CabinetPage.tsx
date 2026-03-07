import { useEffect, useState } from 'react';
import { getProfile, updateProfile, uploadPhoto, addEducation, deleteEducation, uploadDiploma } from '../api/profileApi';
import { API_BASE, formatMemberNumber } from '../utils/constants';
import type { UserProfile, UpdateProfileRequest, AddEducationRequest } from '../types/profile';

export default function CabinetPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [photoError, setPhotoError] = useState(false);

  const [form, setForm] = useState<UpdateProfileRequest>({
    firstName: null,
    lastName: null,
    middleName: null,
    phone: null,
    dateOfBirth: null,
    address: null,
    education: null,
    workplace: null,
    bio: null,
  });

  // Education form state
  const [eduForm, setEduForm] = useState<AddEducationRequest>({
    institutionName: '',
    specialty: '',
    graduationYear: new Date().getFullYear(),
  });
  const [eduAdding, setEduAdding] = useState(false);
  const [showEduForm, setShowEduForm] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const { data } = await getProfile();
      setProfile(data);
      setForm({
        firstName: data.firstName,
        lastName: data.lastName,
        middleName: data.middleName,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth,
        address: data.address,
        education: data.education,
        workplace: data.workplace,
        bio: data.bio,
      });
    } catch {
      setError('Ошибка загрузки профиля');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      const { data } = await updateProfile(form);
      setProfile(data);
      setEditing(false);
      setSuccess('Профиль успешно обновлён');
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Ошибка сохранения профиля');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const { data } = await uploadPhoto(file);
      setProfile((prev) => prev ? { ...prev, photoUrl: data.photoUrl } : null);
      setPhotoError(false);
      setSuccess('Фото загружено');
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Ошибка загрузки фото');
    }
  };

  const handleAddEducation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eduForm.institutionName.trim() || !eduForm.specialty.trim()) return;

    setEduAdding(true);
    setError('');
    try {
      const { data: newEntry } = await addEducation(eduForm);
      setProfile((prev) => prev ? {
        ...prev,
        educationEntries: [...prev.educationEntries, newEntry],
      } : null);
      setEduForm({ institutionName: '', specialty: '', graduationYear: new Date().getFullYear() });
      setShowEduForm(false);
      setSuccess('Образование добавлено');
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Ошибка добавления образования');
    } finally {
      setEduAdding(false);
    }
  };

  const handleDeleteEducation = async (id: string) => {
    if (!confirm('Удалить запись об образовании?')) return;
    setError('');
    try {
      await deleteEducation(id);
      setProfile((prev) => prev ? {
        ...prev,
        educationEntries: prev.educationEntries.filter((e) => e.id !== id),
      } : null);
      setSuccess('Запись удалена');
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Ошибка удаления записи');
    }
  };

  const handleDiplomaUpload = async (educationId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    try {
      const { data } = await uploadDiploma(educationId, file);
      setProfile((prev) => prev ? {
        ...prev,
        educationEntries: prev.educationEntries.map((entry) =>
          entry.id === educationId ? { ...entry, diplomaUrl: data.diplomaUrl } : entry
        ),
      } : null);
      setSuccess('Диплом загружен');
      setTimeout(() => setSuccess(''), 3000);
    } catch {
      setError('Ошибка загрузки диплома');
    }
  };

  const updateField = (field: keyof UpdateProfileRequest, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value || null }));
  };

  if (loading) {
    return (
      <div className="page-cabinet">
        <div className="container">
          <div className="cabinet-loading">
            <div className="cabinet-loading__spinner" />
            <p>Загрузка профиля...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-cabinet">
      <section className="page-header">
        <div className="container">
          <div className="cabinet-header">
            <div>
              <h1 className="page-header__title">Личный кабинет</h1>
              <p className="page-header__subtitle">Управление профилем и документами</p>
            </div>
            {profile && (
              <div className="member-badge member-badge--hero">
                <span className="member-badge__label">Номер участника</span>
                <span className="member-badge__number">{formatMemberNumber(profile.memberNumber)}</span>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          {error && <div className="alert alert--error">{error}</div>}
          {success && <div className="alert alert--success">{success}</div>}

          {/* Profile Card */}
          <div className="cabinet-card">
            <div className="profile-layout">
              <div className="profile-photo-section">
                <div className="profile-photo">
                  {profile?.photoUrl && !photoError ? (
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
                <label className="btn btn--outline btn--sm profile-photo__upload">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" style={{ marginRight: 6 }}>
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                  </svg>
                  Загрузить фото
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp"
                    onChange={handlePhotoUpload}
                    hidden
                  />
                </label>
                <p className="profile-photo__hint">JPG, PNG, WebP. Макс. 5 МБ</p>
              </div>

              <div className="profile-fields">
                <div className="profile-fields__header">
                  <h2>Моя карточка</h2>
                  {!editing ? (
                    <button className="btn btn--primary btn--sm" onClick={() => setEditing(true)}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" style={{ marginRight: 6 }}>
                        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                      </svg>
                      Редактировать
                    </button>
                  ) : (
                    <div className="profile-fields__actions">
                      <button className="btn btn--primary btn--sm" onClick={handleSave} disabled={saving}>
                        {saving ? 'Сохранение...' : 'Сохранить'}
                      </button>
                      <button className="btn btn--outline btn--sm" onClick={() => setEditing(false)}>
                        Отмена
                      </button>
                    </div>
                  )}
                </div>

                <div className="profile-grid">
                  <ProfileField label="Фамилия" value={form.lastName} field="lastName" editing={editing} onChange={updateField} />
                  <ProfileField label="Имя" value={form.firstName} field="firstName" editing={editing} onChange={updateField} />
                  <ProfileField label="Отчество" value={form.middleName} field="middleName" editing={editing} onChange={updateField} />
                  <ProfileField label="Email" value={profile?.email ?? ''} field="" editing={false} onChange={() => {}} />
                  <ProfileField label="Телефон" value={form.phone} field="phone" editing={editing} onChange={updateField} />
                  <ProfileField label="Дата рождения" value={form.dateOfBirth} field="dateOfBirth" editing={editing} onChange={updateField} type="date" />
                  <ProfileField label="Адрес" value={form.address} field="address" editing={editing} onChange={updateField} fullWidth />
                  <ProfileField label="Образование (общее)" value={form.education} field="education" editing={editing} onChange={updateField} fullWidth />
                  <ProfileField label="Место работы" value={form.workplace} field="workplace" editing={editing} onChange={updateField} fullWidth />
                  <ProfileField label="О себе" value={form.bio} field="bio" editing={editing} onChange={updateField} fullWidth textarea />
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
                  Добавьте информацию об образовании и загрузите копии дипломов
                </p>
              </div>
              {!showEduForm && (
                <button className="btn btn--primary btn--sm" onClick={() => setShowEduForm(true)}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" style={{ marginRight: 6 }}>
                    <line x1="12" y1="5" x2="12" y2="19" />
                    <line x1="5" y1="12" x2="19" y2="12" />
                  </svg>
                  Добавить
                </button>
              )}
            </div>

            {/* Add Education Form */}
            {showEduForm && (
              <form className="education-form" onSubmit={handleAddEducation}>
                <h3 className="education-form__title">Новая запись об образовании</h3>
                <div className="education-form__grid">
                  <div className="form-group">
                    <label className="form-label">Учебное заведение</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Название вуза или колледжа"
                      value={eduForm.institutionName}
                      onChange={(e) => setEduForm((prev) => ({ ...prev, institutionName: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Специальность</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Специальность / направление"
                      value={eduForm.specialty}
                      onChange={(e) => setEduForm((prev) => ({ ...prev, specialty: e.target.value }))}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Год окончания</label>
                    <input
                      type="number"
                      className="form-input"
                      min={1950}
                      max={2040}
                      value={eduForm.graduationYear}
                      onChange={(e) => setEduForm((prev) => ({ ...prev, graduationYear: parseInt(e.target.value, 10) || 0 }))}
                      required
                    />
                  </div>
                </div>
                <div className="education-form__actions">
                  <button type="submit" className="btn btn--primary btn--sm" disabled={eduAdding}>
                    {eduAdding ? 'Добавление...' : 'Добавить запись'}
                  </button>
                  <button type="button" className="btn btn--outline btn--sm" onClick={() => setShowEduForm(false)}>
                    Отмена
                  </button>
                </div>
              </form>
            )}

            {/* Education List */}
            {profile && profile.educationEntries.length > 0 ? (
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
                          Диплом
                        </a>
                      ) : (
                        <label className="diploma-upload">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                          Загрузить диплом
                          <input
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png,.webp"
                            onChange={(e) => handleDiplomaUpload(entry.id, e)}
                            hidden
                          />
                        </label>
                      )}
                      <button
                        className="btn btn--outline btn--xs education-item__delete"
                        onClick={() => handleDeleteEducation(entry.id)}
                        title="Удалить запись"
                        aria-label="Удалить запись"
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              !showEduForm && (
                <div className="education-empty">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" width="48" height="48">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c0 1.657 2.686 3 6 3s6-1.343 6-3v-5" />
                  </svg>
                  <p>Записи об образовании ещё не добавлены</p>
                  <button className="btn btn--outline btn--sm" onClick={() => setShowEduForm(true)}>
                    Добавить образование
                  </button>
                </div>
              )
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

function ProfileField({
  label, value, field, editing, onChange, type = 'text', fullWidth, textarea,
}: {
  label: string;
  value: string | null;
  field: string;
  editing: boolean;
  onChange: (field: keyof UpdateProfileRequest, value: string) => void;
  type?: string;
  fullWidth?: boolean;
  textarea?: boolean;
}) {
  return (
    <div className={`profile-field ${fullWidth ? 'profile-field--full' : ''}`}>
      <label className="profile-field__label">{label}</label>
      {editing && field ? (
        textarea ? (
          <textarea
            className="form-input form-input--textarea"
            value={value ?? ''}
            onChange={(e) => onChange(field as keyof UpdateProfileRequest, e.target.value)}
            rows={3}
          />
        ) : (
          <input
            type={type}
            className="form-input"
            value={value ?? ''}
            onChange={(e) => onChange(field as keyof UpdateProfileRequest, e.target.value)}
          />
        )
      ) : (
        <p className="profile-field__value">{value || '---'}</p>
      )}
    </div>
  );
}
