import { Link } from 'react-router-dom';

const partnerTypes = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87"/>
        <path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
    title: 'Профессиональные сообщества',
    desc: 'Объединения врачей, нутрициологов, диетологов и других специалистов превентивного здоровья',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    title: 'Организации и бренды',
    desc: 'Клиники, центры здоровья, производители БАДов, wellness-центры и фитнес-клубы',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/>
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
      </svg>
    ),
    title: 'Образовательные организации',
    desc: 'Университеты, институты повышения квалификации и образовательные платформы',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    title: 'Индивидуальные специалисты',
    desc: 'Врачи, нутрициологи, wellness-эксперты с подтверждённой квалификацией',
  },
];

const benefits = [
  'Доступ к профессиональному реестру специалистов',
  'Участие в разработке отраслевых стандартов',
  'Продвижение через платформу Федерации',
  'Участие в профессиональных мероприятиях',
  'Сертификация и подтверждение квалификации',
  'Нетворкинг с лидерами отрасли',
  'Доступ к образовательным материалам',
  'Юридическая поддержка',
];

export default function PartnershipPage() {
  return (
    <div className="page-partnership">
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <span className="badge badge--light">Партнерство</span>
          <h1 className="page-header__title">Партнерство с Федерацией</h1>
          <p className="page-header__subtitle">
            Федерация объединяет специалистов, профессиональные сообщества, организации и бренды
            в сфере превентивного здоровья и здорового образа жизни
          </p>
        </div>
      </section>

      {/* Partner Types */}
      <section className="section section--white">
        <div className="container">
          <div className="section-header">
            <span className="badge">Кто может стать партнером</span>
            <h2 className="h2">Направления партнерства</h2>
          </div>
          <div className="partner-types-grid">
            {partnerTypes.map((type, i) => (
              <div className="partner-type-card" key={i}>
                <div className="partner-type-card__icon">{type.icon}</div>
                <h3 className="partner-type-card__title">{type.title}</h3>
                <p className="partner-type-card__text">{type.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section section--light">
        <div className="container">
          <div className="section-header">
            <span className="badge">Преимущества</span>
            <h2 className="h2">Что даёт партнерство</h2>
          </div>
          <div className="benefits-grid">
            {benefits.map((benefit, i) => (
              <div className="benefit-item" key={i}>
                <div className="benefit-item__check">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <span className="benefit-item__text">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Logos */}
      <section className="section section--white">
        <div className="container">
          <div className="section-header">
            <span className="badge">Наши партнеры</span>
            <h2 className="h2">Партнеры Федерации</h2>
          </div>
          <div className="partners-logos">
            {/* Partner logos will be added here as agreements are signed */}
            <a href="#" target="_blank" rel="noopener noreferrer" className="partners-logos__item">
              <img src="/partners/placeholder.png" alt="Партнер" />
            </a>
          </div>
          <p className="partners-logos__note">
            Раздел обновляется по мере заключения партнерских соглашений
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="section section--gradient">
        <div className="container">
          <div className="cta-block">
            <h2 className="h2 h2--white">Начните сотрудничество</h2>
            <p className="text-lg text--white-muted">
              Узнайте подробнее о формах сотрудничества и условиях партнерства с Федерацией
            </p>
            <div className="cta-block__buttons">
              <Link to="/sotrudnichestvo" className="btn btn--white">Формы сотрудничества</Link>
              <Link to="/contacts" className="btn btn--white-outline">Связаться с нами</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
