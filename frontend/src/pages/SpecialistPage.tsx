import { useState, useEffect, useContext, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getSpecialist, addRating } from '../api/registryApi';
import { API_BASE, formatMemberNumber, formatDate } from '../utils/constants';
import type { UserProfile } from '../types/profile';

function DefaultAvatarLarge() {
  return (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="specialist-detail__avatar-svg">
      <rect width="200" height="200" rx="20" fill="#edeae5" />
      <circle cx="100" cy="75" r="35" fill="#a2bb94" />
      <ellipse cx="100" cy="155" rx="55" ry="40" fill="#a2bb94" />
    </svg>
  );
}

export default function SpecialistPage() {
  const { userId } = useParams<{ userId: string }>();
  const { user, isAuthenticated } = useContext(AuthContext);

  const [specialist, setSpecialist] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showContacts, setShowContacts] = useState(false);

  const [ratingComment, setRatingComment] = useState('');
  const [ratingSubmitting, setRatingSubmitting] = useState(false);
  const [ratingError, setRatingError] = useState('');
  const [ratingSuccess, setRatingSuccess] = useState('');

  const [photoError, setPhotoError] = useState(false);
  const diplomasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userId) return;
    setLoading(true);
    setError('');
    getSpecialist(userId)
      .then(({ data }) => setSpecialist(data))
      .catch(() => setError('Ошибка при загрузке данных специалиста'))
      .finally(() => setLoading(false));
  }, [userId]);

  const scrollToDiplomas = () => {
    diplomasRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmitRating = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !ratingComment.trim()) {
      setRatingError('Напишите отзыв');
      return;
    }
    setRatingSubmitting(true);
    setRatingError('');
    setRatingSuccess('');
    try {
      await addRating(userId, {
        score: 5,
        comment: ratingComment.trim(),
      });
      setRatingSuccess('Ваш отзыв успешно добавлен!');
      setRatingComment('');
      // Reload specialist to get updated ratings
      const { data } = await getSpecialist(userId);
      setSpecialist(data);
    } catch {
      setRatingError('Ошибка при отправке отзыва. Возможно, вы уже оставляли отзыв.');
    } finally {
      setRatingSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="page-specialist-detail">
        <div className="container">
          <div className="cabinet-loading">
            <div className="cabinet-loading__spinner" />
            <p>Загрузка...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !specialist) {
    return (
      <div className="page-specialist-detail">
        <section className="section section--light">
          <div className="container">
            <div className="alert alert--error">{error || 'Специалист не найден'}</div>
            <Link to="/reestr" className="btn btn--outline" style={{ marginTop: 16 }}>
              Вернуться к реестру
            </Link>
          </div>
        </section>
      </div>
    );
  }

  const fullName = [specialist.lastName, specialist.firstName, specialist.middleName]
    .filter(Boolean)
    .join(' ') || 'Имя не указано';

  const bioBullets = specialist.bio
    ? specialist.bio.split('. ').filter((s) => s.trim().length > 0)
    : [];

  return (
    <div className="page-specialist-detail">
      {/* Header */}
      <section className="page-header">
        <div className="container">
          <Link to="/reestr" className="page-header__back">
            &larr; Вернуться к реестру
          </Link>
          <h1 className="page-header__title">{fullName}</h1>
          <p className="page-header__subtitle">
            Член реестра {formatMemberNumber(specialist.memberNumber)}
          </p>
        </div>
      </section>

      {/* Main Card */}
      <section className="section section--white">
        <div className="container">
          <div className="specialist-detail">
            <div className="specialist-detail__card">
              {/* Photo */}
              <div className="specialist-detail__photo">
                {specialist.photoUrl && !photoError ? (
                  <img
                    src={`${API_BASE}${specialist.photoUrl}`}
                    alt={fullName}
                    className="specialist-detail__photo-img"
                    onError={() => setPhotoError(true)}
                  />
                ) : (
                  <DefaultAvatarLarge />
                )}
                <span className="member-badge specialist-detail__member-badge">
                  {formatMemberNumber(specialist.memberNumber)}
                </span>
              </div>

              {/* Info */}
              <div className="specialist-detail__info">
                <h2 className="specialist-detail__name">{fullName}</h2>
                <div className="specialist-detail__meta">
                  {specialist.dateOfBirth && (
                    <span className="specialist-detail__meta-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                        <line x1="16" y1="2" x2="16" y2="6" />
                        <line x1="8" y1="2" x2="8" y2="6" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      {formatDate(specialist.dateOfBirth)}
                    </span>
                  )}
                  {specialist.address && (
                    <span className="specialist-detail__meta-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                        <circle cx="12" cy="10" r="3" />
                      </svg>
                      {specialist.address}
                    </span>
                  )}
                </div>

                {bioBullets.length > 0 && (
                  <ul className="specialist-detail__bio-list">
                    {bioBullets.map((bullet, idx) => (
                      <li key={idx}>{bullet.endsWith('.') ? bullet : `${bullet}.`}</li>
                    ))}
                  </ul>
                )}

                {specialist.workplace && (
                  <div className="specialist-detail__workplace">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18">
                      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                      <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
                    </svg>
                    <span>{specialist.workplace}</span>
                  </div>
                )}

                {specialist.education && (
                  <div className="specialist-detail__education-text">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="18" height="18">
                      <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                    </svg>
                    <span>{specialist.education}</span>
                  </div>
                )}
              </div>

              {/* Verification Badge */}
              <div className="specialist-detail__verification">
                <div className="specialist-verification-badge">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="32" height="32">
                    <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                  <span className="specialist-verification-badge__label">Верифицирован</span>
                  <span className="specialist-verification-badge__text">Образование и деятельность соответствуют стандартам Федерации</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="specialist-detail__buttons">
              <button
                className="btn btn--primary specialist-detail__action-btn"
                onClick={() => setShowContacts(!showContacts)}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                  <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                </svg>
                СВЯЗАТЬСЯ СО СПЕЦИАЛИСТОМ
              </button>
              <button
                className="btn btn--primary specialist-detail__action-btn"
                onClick={scrollToDiplomas}
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="20" height="20">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="16" y1="13" x2="8" y2="13" />
                  <line x1="16" y1="17" x2="8" y2="17" />
                  <polyline points="10 9 9 9 8 9" />
                </svg>
                СЕРТИФИКАТЫ СПЕЦИАЛИСТА
              </button>
            </div>

            {/* Contact Info (toggleable) */}
            {showContacts && (
              <div className="specialist-detail__contacts">
                <h3 className="specialist-detail__contacts-title">Контактная информация</h3>
                <div className="specialist-detail__contacts-grid">
                  {specialist.phone && (
                    <div className="specialist-detail__contact-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
                        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                      </svg>
                      <a href={`tel:${specialist.phone}`}>{specialist.phone}</a>
                    </div>
                  )}
                  {specialist.email && (
                    <div className="specialist-detail__contact-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="20" height="20">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                      <a href={`mailto:${specialist.email}`}>{specialist.email}</a>
                    </div>
                  )}
                  {!specialist.phone && !specialist.email && (
                    <p className="specialist-detail__no-contacts">Контактная информация не указана</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Education Entries */}
      {specialist.educationEntries && specialist.educationEntries.length > 0 && (
        <section className="section section--light">
          <div className="container">
            <div className="specialist-detail__education">
              <h2 className="h2">Образование</h2>
              <div className="education-list">
                {specialist.educationEntries.map((entry) => (
                  <div className="education-item" key={entry.id}>
                    <div className="education-item__main">
                      <div className="education-item__icon">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                          <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                          <path d="M6 12v5c0 1.657 2.686 3 6 3s6-1.343 6-3v-5" />
                        </svg>
                      </div>
                      <div className="education-item__details">
                        <div className="education-item__institution">{entry.institutionName}</div>
                        <div className="education-item__specialty">{entry.specialty}</div>
                        <div className="education-item__year">Год выпуска: {entry.graduationYear}</div>
                      </div>
                    </div>
                    {entry.diplomaUrl && (
                      <div className="education-item__actions">
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
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Diplomas Section (scroll target) */}
      <div ref={diplomasRef}>
        <section className="section section--white">
          <div className="container">
            <div className="specialist-detail__diplomas">
              <h2 className="h2">Сертификаты и дипломы</h2>
              {specialist.educationEntries && specialist.educationEntries.some((e) => e.diplomaUrl) ? (
                <div className="specialist-detail__diplomas-grid">
                  {specialist.educationEntries
                    .filter((e) => e.diplomaUrl)
                    .map((entry) => (
                      <a
                        key={entry.id}
                        href={`${API_BASE}${entry.diplomaUrl}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="specialist-detail__diploma-card"
                      >
                        <div className="specialist-detail__diploma-icon">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="32" height="32">
                            <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                            <polyline points="14 2 14 8 20 8" />
                            <line x1="16" y1="13" x2="8" y2="13" />
                            <line x1="16" y1="17" x2="8" y2="17" />
                          </svg>
                        </div>
                        <div className="specialist-detail__diploma-info">
                          <span className="specialist-detail__diploma-name">{entry.institutionName}</span>
                          <span className="specialist-detail__diploma-specialty">{entry.specialty}, {entry.graduationYear}</span>
                        </div>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="18" height="18" className="specialist-detail__diploma-arrow">
                          <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      </a>
                    ))}
                </div>
              ) : (
                <div className="education-empty">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="48" height="48">
                    <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                  </svg>
                  <p>Сертификаты и дипломы пока не загружены</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Reviews Section */}
      <section className="section section--light">
        <div className="container">
          <div className="rating-section">
            <h2 className="h2">Отзывы о специалисте</h2>

            {/* Add Review Form */}
            {isAuthenticated && user?.userId !== specialist.userId ? (
              <div className="rating-section__form-wrapper">
                <h3 className="rating-section__form-title">Оставить отзыв</h3>
                <form className="rating-form" onSubmit={handleSubmitRating}>
                  <div className="form-group">
                    <label className="form-label">Ваш отзыв</label>
                    <textarea
                      className="form-input form-input--textarea"
                      placeholder="Поделитесь вашим опытом работы с данным специалистом..."
                      value={ratingComment}
                      onChange={(e) => setRatingComment(e.target.value)}
                      rows={4}
                      required
                    />
                  </div>
                  {ratingError && <div className="alert alert--error">{ratingError}</div>}
                  {ratingSuccess && <div className="alert alert--success">{ratingSuccess}</div>}
                  <button
                    type="submit"
                    className="btn btn--primary"
                    disabled={ratingSubmitting || !ratingComment.trim()}
                  >
                    {ratingSubmitting ? 'Отправка...' : 'Отправить отзыв'}
                  </button>
                </form>
              </div>
            ) : !isAuthenticated ? (
              <div className="rating-section__auth-notice">
                <p>
                  <Link to="/login">Войдите</Link> в систему, чтобы оставить отзыв о специалисте.
                </p>
              </div>
            ) : null}

            {/* Reviews List */}
            {specialist.ratings && specialist.ratings.filter(r => r.comment).length > 0 ? (
              <div className="rating-list">
                <h3 className="rating-list__title">
                  Отзывы ({specialist.ratings.filter(r => r.comment).length})
                </h3>
                {specialist.ratings.filter(r => r.comment).map((rating) => (
                  <div className="rating-list__item" key={rating.id}>
                    <div className="rating-list__item-content">
                      <p className="rating-list__item-comment">{rating.comment}</p>
                      <span className="rating-list__item-date">{formatDate(rating.createdAt)}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rating-section__empty">
                <p>Пока нет отзывов для этого специалиста.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="section section--gradient">
        <div className="container">
          <div className="cta-block">
            <h2 className="h2 h2--white">Найти другого специалиста?</h2>
            <p className="text-lg text--white-muted">
              Вернитесь к реестру для поиска других сертифицированных специалистов
            </p>
            <div className="cta-block__buttons">
              <Link to="/reestr" className="btn btn--white">Вернуться к реестру</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
