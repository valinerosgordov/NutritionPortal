import { Link } from 'react-router-dom';

const directions = [
  'Развитие превентивного здоровья, нутрициологии и здорового образа жизни',
  'Содействие формированию профессиональных стандартов и этики специалистов',
  'Повышение уровня грамотности населения в области питания и ЗОЖ',
  'Развитие цивилизованного рынка wellness-услуг, БАД и функционального питания',
  'Доступ к проверенным специалистам с подтверждённой квалификацией',
  'Повышение качества и безопасности услуг в области ЗОЖ, питания, wellness и фитнеса',
  'Формирование стандартов образовательных программ для специалистов',
];

const values = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
        <polyline points="22 4 12 14.01 9 11.01"/>
      </svg>
    ),
    title: 'Доказательный подход',
    desc: 'Все решения и рекомендации основываются на научных данных и доказательной медицине',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0110 0v4"/>
      </svg>
    ),
    title: 'Защита потребителей',
    desc: 'Мы стоим на страже интересов потребителей, обеспечивая доступ к проверенным специалистам',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87"/>
        <path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
    title: 'Профессионализм',
    desc: 'Высокие стандарты квалификации и постоянное развитие компетенций специалистов',
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
      </svg>
    ),
    title: 'Открытость',
    desc: 'Прозрачность в работе, открытый диалог с профессиональным сообществом и обществом',
  },
];

export default function AboutPage() {
  return (
    <div className="page-about">
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <span className="badge badge--light">О Федерации</span>
          <h1 className="page-header__title">Федерация специалистов превентивного здоровья и питания</h1>
          <p className="page-header__subtitle">
            Профессиональное объединение специалистов и организаций в сфере превентивного здоровья
            и здорового образа жизни
          </p>
        </div>
      </section>

      {/* About Section */}
      <section className="section section--white">
        <div className="container">
          <div className="split-section">
            <div className="split-section__content">
              <h2 className="h2">О нас</h2>
              <p className="text-lg">
                Федерация — это профессиональное объединение специалистов и организаций в сфере
                превентивного здоровья и здорового образа жизни. Мы формируем
                экспертное сообщество, развиваем стандарты качества и объединяем науку, практику и бизнес.
              </p>
            </div>
            <div className="split-section__quote">
              <blockquote>
                <p>&laquo;Наша цель — устойчивое развитие отрасли и повышение доверия к специалистам с превентивным подходом к здоровью&raquo;</p>
                <footer>
                  <strong>Ирина Писарева</strong>
                  <span>Руководитель Федерации</span>
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Directions */}
      <section className="section section--light">
        <div className="container">
          <div className="section-header">
            <span className="badge">Направления</span>
            <h2 className="h2">Ключевые направления деятельности</h2>
          </div>
          <div className="about-directions">
            {directions.map((dir, i) => (
              <div className="about-direction-item" key={i}>
                <div className="about-direction-item__number">{String(i + 1).padStart(2, '0')}</div>
                <div className="about-direction-item__check">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                </div>
                <p className="about-direction-item__text">{dir}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section section--white">
        <div className="container">
          <div className="section-header">
            <span className="badge">Ценности</span>
            <h2 className="h2">Наши принципы</h2>
          </div>
          <div className="values-grid">
            {values.map((val, i) => (
              <div className="value-card" key={i}>
                <div className="value-card__icon">{val.icon}</div>
                <h3 className="value-card__title">{val.title}</h3>
                <p className="value-card__text">{val.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Legal Basis */}
      <section className="section section--light">
        <div className="container">
          <div className="legal-basis">
            <div className="legal-basis__icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                <polyline points="14 2 14 8 20 8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
            </div>
            <div className="legal-basis__content">
              <span className="badge">Нормативная основа</span>
              <h2 className="h2">Правовая база</h2>
              <p className="text-lg">
                Деятельность Федерации основывается на Указе Президента Российской Федерации
                от 8 декабря 2025 г. №896 о Стратегии развития здравоохранения Российской
                Федерации на период до 2030 года, а также на Федеральном законе о некоммерческих
                организациях и иных нормативных правовых актах.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section section--gradient">
        <div className="container">
          <div className="cta-block">
            <h2 className="h2 h2--white">Присоединяйтесь к нам</h2>
            <p className="text-lg text--white-muted">
              Станьте частью профессиональной экосистемы превентивного здоровья и здорового образа жизни
            </p>
            <div className="cta-block__buttons">
              <Link to="/register" className="btn btn--white">Вступить в Федерацию</Link>
              <Link to="/partnerstvo" className="btn btn--white-outline">Партнерство</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
