import { Link } from 'react-router-dom';

const categories = [
  {
    number: '01',
    title: 'Сообществам, объединяющим специалистов',
    subtitle: 'Профессиональные ассоциации и объединения',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/>
        <circle cx="9" cy="7" r="4"/>
        <path d="M23 21v-2a4 4 0 00-3-3.87"/>
        <path d="M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
    benefits: [
      'Вхождение в состав Экспертного совета Федерации',
      'Совместная разработка профессиональных стандартов',
      'Участие в формировании отраслевого законодательства',
      'Проведение совместных мероприятий и конференций',
      'Обмен экспертизой и лучшими практиками',
    ],
  },
  {
    number: '02',
    title: 'Центрам здоровья',
    subtitle: 'Wellness-центры, SPA, санатории, клиники',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
    benefits: [
      'Сертификация качества услуг',
      'Размещение в реестре проверенных организаций',
      'Повышение квалификации персонала',
      'Доступ к базе сертифицированных специалистов',
      'Маркетинговая поддержка через платформу Федерации',
    ],
  },
  {
    number: '03',
    title: 'Образовательным и научным организациям',
    subtitle: 'Университеты, НИИ, образовательные платформы',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 014 4v14a3 3 0 00-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 00-4 4v14a3 3 0 013-3h7z"/>
      </svg>
    ),
    benefits: [
      'Совместная разработка образовательных программ',
      'Аккредитация обучающих курсов',
      'Участие в научных исследованиях',
      'Публикация результатов на платформе Федерации',
      'Формирование стандартов образования в отрасли',
    ],
  },
  {
    number: '04',
    title: 'Производителям БАДов и спортивного питания',
    subtitle: 'Бренды, производители, дистрибьюторы',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="16.5" y1="9.4" x2="7.5" y2="4.21"/>
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/>
        <polyline points="3.27 6.96 12 12.01 20.73 6.96"/>
        <line x1="12" y1="22.08" x2="12" y2="12"/>
      </svg>
    ),
    benefits: [
      'Экспертная оценка продукции',
      'Знак качества Федерации',
      'Размещение в каталоге рекомендованных продуктов',
      'Доступ к сети специалистов для продвижения',
      'Консультации по нормативному регулированию',
    ],
  },
  {
    number: '05',
    title: 'Специалистам',
    subtitle: 'Врачи, нутрициологи, wellness-эксперты, диетологи',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
    benefits: [
      'Включение в реестр сертифицированных специалистов',
      'Подтверждение квалификации и сертификация',
      'Участие в профессиональных мероприятиях',
      'Доступ к образовательным материалам и программам',
      'Юридическая и информационная поддержка',
      'Продвижение через платформу Федерации',
    ],
  },
];

export default function CooperationPage() {
  return (
    <div className="page-cooperation">
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <span className="badge badge--light">Сотрудничество</span>
          <h1 className="page-header__title">Формы сотрудничества</h1>
          <p className="page-header__subtitle">
            Мы предлагаем различные формы сотрудничества для организаций и специалистов
            в сфере превентивного здоровья и здорового образа жизни
          </p>
        </div>
      </section>

      {/* Categories */}
      <section className="section section--light">
        <div className="container">
          <div className="cooperation-categories">
            {categories.map((cat, i) => (
              <div className="cooperation-card" key={i}>
                <div className="cooperation-card__header">
                  <div className="cooperation-card__number">{cat.number}</div>
                  <div className="cooperation-card__icon">{cat.icon}</div>
                  <div className="cooperation-card__titles">
                    <h2 className="cooperation-card__title">{cat.title}</h2>
                    <p className="cooperation-card__subtitle">{cat.subtitle}</p>
                  </div>
                </div>
                <ul className="cooperation-card__benefits">
                  {cat.benefits.map((benefit, j) => (
                    <li key={j}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section section--gradient">
        <div className="container">
          <div className="cta-block">
            <h2 className="h2 h2--white">Готовы начать сотрудничество?</h2>
            <p className="text-lg text--white-muted">
              Свяжитесь с нами для обсуждения условий партнерства и вступления в Федерацию
            </p>
            <div className="cta-block__buttons">
              <Link to="/register" className="btn btn--white">Вступить в Федерацию</Link>
              <Link to="/contacts" className="btn btn--white-outline">Связаться с нами</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
