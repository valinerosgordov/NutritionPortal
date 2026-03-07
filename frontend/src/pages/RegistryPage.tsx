import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { searchSpecialists } from '../api/registryApi';
import { API_BASE, formatMemberNumber } from '../utils/constants';
import type { UserProfile } from '../types/profile';

function DefaultAvatar() {
  return (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="specialist-card__avatar-svg">
      <rect width="120" height="120" rx="60" fill="#edeae5" />
      <circle cx="60" cy="45" r="20" fill="#a2bb94" />
      <ellipse cx="60" cy="95" rx="35" ry="25" fill="#a2bb94" />
    </svg>
  );
}

export default function RegistryPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<UserProfile[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [brokenPhotos, setBrokenPhotos] = useState<Set<string>>(new Set());
  const searchRef = useRef<HTMLDivElement>(null);

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (query.trim().length < 2) {
      setError('Введите минимум 2 символа для поиска');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { data } = await searchSpecialists(query);
      setResults(data);
      setSearched(true);
    } catch {
      setError('Ошибка при поиске специалистов');
    } finally {
      setLoading(false);
    }
  };

  const scrollToSearch = () => {
    searchRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="page-registry">
      {/* Hero Section */}
      <section className="registry-hero">
        <div className="registry-hero__bg" />
        <div className="registry-hero__content">
          <span className="badge badge--light">Реестр Федерации</span>
          <h1 className="registry-hero__title registry-hero__title--large">
            Единый реестр сертифицированных нутрициологов и специалистов
            в области превентивного здоровья<span className="registry-hero__asterisk">*</span>
          </h1>
          <p className="registry-hero__footnote">* специалисты без медицинского образования</p>
        </div>
      </section>

      {/* CTA Cards */}
      <section className="section section--white">
        <div className="container">
          <div className="registry-cta-grid">
            <Link to="/register" className="registry-cta-card">
              <div className="registry-cta-card__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                  <circle cx="8.5" cy="7" r="4" />
                  <line x1="20" y1="8" x2="20" y2="14" />
                  <line x1="23" y1="11" x2="17" y2="11" />
                </svg>
              </div>
              <h2 className="registry-cta-card__title">Регистрация в реестре</h2>
              <p className="registry-cta-card__text">
                Вступите в Федерацию и станьте частью профессионального сообщества.
                Получите уникальный номер участника и подтвердите свою квалификацию
                для включения в реестр сертифицированных специалистов.
              </p>
              <span className="registry-cta-card__link">
                Зарегистрироваться
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </span>
            </Link>

            <div className="registry-cta-card registry-cta-card--search" onClick={scrollToSearch} role="button" tabIndex={0} onKeyDown={(e) => e.key === 'Enter' && scrollToSearch()}>
              <div className="registry-cta-card__icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
              </div>
              <h2 className="registry-cta-card__title">Найти специалиста</h2>
              <p className="registry-cta-card__text">
                Найдите проверенного специалиста в области нутрициологии и превентивного
                здоровья. Поиск по имени, специальности или месту работы среди
                сертифицированных членов Федерации.
              </p>
              <span className="registry-cta-card__link">
                Перейти к поиску
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <polyline points="19 12 12 19 5 12" />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="section section--light" ref={searchRef}>
        <div className="container">
          <div className="registry-search">
            <div className="registry-search__header">
              <h2 className="h2">Поиск специалиста</h2>
              <p className="text-lg">
                Введите имя, специальность или ключевое слово для поиска в реестре
              </p>
            </div>

            <form className="registry-search__form" onSubmit={handleSearch}>
              <div className="registry-search__input-wrapper">
                <svg className="registry-search__input-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  className="registry-search__input"
                  placeholder="Поиск по имени, специальности, месту работы..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
                <button type="submit" className="btn btn--primary registry-search__btn" disabled={loading}>
                  {loading ? 'Поиск...' : 'Найти'}
                </button>
              </div>
            </form>

            {error && <div className="alert alert--error">{error}</div>}

            {searched && (
              <div className="registry-search__results">
                <p className="registry-search__results-count">
                  {results.length === 0
                    ? 'Специалисты не найдены. Попробуйте изменить запрос.'
                    : `Найдено специалистов: ${results.length}`}
                </p>

                {results.length > 0 && (
                  <div className="registry-legend">
                    <span className="registry-legend__item">
                      <span className="registry-legend__star">★</span> — специалист без медицинского образования
                    </span>
                  </div>
                )}

                {results.length > 0 && (
                  <div className="specialist-grid">
                    {results.map((specialist) => (
                      <Link
                        to={`/specialist/${specialist.userId}`}
                        className="specialist-card specialist-card--clickable"
                        key={specialist.userId}
                      >
                        <div className="specialist-card__photo">
                          {specialist.photoUrl && !brokenPhotos.has(specialist.userId) ? (
                            <img
                              src={`${API_BASE}${specialist.photoUrl}`}
                              alt={`${specialist.firstName ?? ''} ${specialist.lastName ?? ''}`}
                              className="specialist-card__photo-img"
                              onError={() => setBrokenPhotos(prev => new Set(prev).add(specialist.userId))}
                            />
                          ) : (
                            <DefaultAvatar />
                          )}
                        </div>
                        <div className="specialist-card__info">
                          <span className="member-badge">
                            {formatMemberNumber(specialist.memberNumber)}
                          </span>
                          <h3 className="specialist-card__name">
                            {[specialist.lastName, specialist.firstName, specialist.middleName]
                              .filter(Boolean)
                              .join(' ') || 'Имя не указано'}
                            {(!specialist.educationEntries || specialist.educationEntries.length === 0) && (
                              <span className="specialist-card__no-med" title="Без медицинского образования"> ★</span>
                            )}
                          </h3>
                          {specialist.educationEntries && specialist.educationEntries.length > 0 && (
                            <div className="specialist-card__detail">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
                                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                                <path d="M6 12v5c0 1.657 2.686 3 6 3s6-1.343 6-3v-5" />
                              </svg>
                              <span>{specialist.educationEntries[0].institutionName}</span>
                            </div>
                          )}
                          {specialist.education && (
                            <div className="specialist-card__detail">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
                                <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                              </svg>
                              <span>{specialist.education}</span>
                            </div>
                          )}
                          {specialist.workplace && (
                            <div className="specialist-card__detail">
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" width="16" height="16">
                                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                                <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
                              </svg>
                              <span>{specialist.workplace}</span>
                            </div>
                          )}
                        </div>
                        {/* Verification Badge */}
                        <div className="specialist-card__verification" title="Верифицированный специалист">
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="specialist-card__verification-icon">
                            <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                            <polyline points="22 4 12 14.01 9 11.01"/>
                          </svg>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* CTA bottom */}
      <section className="section section--gradient">
        <div className="container">
          <div className="cta-block">
            <h2 className="h2 h2--white">Хотите попасть в реестр?</h2>
            <p className="text-lg text--white-muted">
              Зарегистрируйтесь в Федерации и подайте заявку на включение
              в реестр сертифицированных специалистов
            </p>
            <div className="cta-block__buttons">
              <Link to="/register" className="btn btn--white">Подать заявку</Link>
              <Link to="/contacts" className="btn btn--white-outline">Узнать подробнее</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
