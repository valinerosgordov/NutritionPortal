import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="page-home">
      {/* Hero */}
      <section className="hero">
        <div className="hero__bg" />
        <div className="hero__content">
          <h1 className="hero__title">
            Федерация специалистов<br />
            <span>превентивного здоровья и питания</span>
          </h1>
          <p className="hero__subtitle">
            Профессиональное сообщество, формирующее ответственную и научно-обоснованную
            культуру превентивного здоровья в России
          </p>
          <div className="hero__cards">
            <div className="hero__card">
              <div className="hero__card-accent" />
              <div className="hero__card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
              </div>
              <h3>Наш манифест</h3>
              <p>Мы профессиональное сообщество, формирующее ответственную и научно-обоснованную культуру превентивного здоровья в России</p>
            </div>
            <div className="hero__card">
              <div className="hero__card-accent" />
              <div className="hero__card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
              </div>
              <h3>Нормативная основа</h3>
              <p>Указ Президента РФ от 8 декабря 2025 г. №896 о Стратегии развития здравоохранения до 2030 года</p>
            </div>
            <div className="hero__card">
              <div className="hero__card-accent" />
              <div className="hero__card-icon">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </div>
              <h3>Миссия</h3>
              <p>Формирование единой профессиональной экосистемы специалистов в сфере превентивного здоровья, питания и ЗОЖ</p>
            </div>
          </div>
          <Link to="/register" className="btn btn--hero">Стать членом экосистемы</Link>
        </div>
      </section>

      {/* О Федерации */}
      <section className="section section--white">
        <div className="container">
          <div className="split-section">
            <div className="split-section__content">
              <span className="badge">О Федерации</span>
              <h2 className="h2">Профессиональное объединение специалистов и организаций</h2>
              <p className="text-lg">Федерация — это профессиональное объединение специалистов и организаций в сфере превентивного здоровья и здорового образа жизни. Мы формируем экспертное сообщество, развиваем стандарты качества и объединяем науку, практику и бизнес.</p>
              <Link to="/federation" className="btn btn--outline">Подробнее о нас</Link>
            </div>
            <div className="split-section__quote">
              <blockquote>
                <p>&laquo;Наша цель — устойчивое развитие отрасли и повышение доверия к специалистам с превентивным подходом к здоровью&raquo;</p>
                <footer><strong>Ирина Писарева</strong><span>Руководитель Федерации</span></footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Направления */}
      <section className="section section--light">
        <div className="container">
          <div className="section-header"><span className="badge">Деятельность</span><h2 className="h2">Ключевые направления</h2></div>
          <div className="features-grid">
            {[
              { icon: '\u{1F52C}', title: 'Превентивное здоровье', desc: 'Развитие превентивного здоровья, нутрициологии и здорового образа жизни' },
              { icon: '\u{1F4CB}', title: 'Стандарты и этика', desc: 'Содействие формированию профессиональных стандартов и этики специалистов' },
              { icon: '\u{1F4DA}', title: 'Грамотность населения', desc: 'Повышение уровня грамотности населения в области питания и ЗОЖ' },
              { icon: '\u{1F3E5}', title: 'Рынок wellness-услуг', desc: 'Развитие цивилизованного рынка wellness-услуг, БАД и функционального питания' },
              { icon: '\u2705', title: 'Проверенные специалисты', desc: 'Доступ к проверенным специалистам с подтверждённой квалификацией' },
              { icon: '\u{1F393}', title: 'Образовательные стандарты', desc: 'Формирование стандартов образовательных программ для специалистов' },
            ].map((item, i) => (
              <div className="feature-card" key={i}>
                <div className="feature-card__icon">{item.icon}</div>
                <h3 className="feature-card__title">{item.title}</h3>
                <p className="feature-card__text">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Новости */}
      <section className="section section--white">
        <div className="container">
          <div className="section-header"><span className="badge">Новости</span><h2 className="h2">Лента новостей</h2></div>
          <div className="news-grid">
            <article className="news-card">
              <div className="news-card__image"><img src="/news/tass-federation.jpg" alt="ТАСС" /></div>
              <div className="news-card__date">12.02.2026</div>
              <h3 className="news-card__title">В РФ появилась федерация, которая позволит узаконить отрасль нутрициологии</h3>
              <p className="news-card__text">Приоритетом в работе организации назвали защиту потребителя и продвижение доказательного подхода в вопросах питания и профилактики заболеваний.</p>
              <div className="news-card__footer"><a href="https://tass.ru/obschestvo/23315285" target="_blank" rel="noopener noreferrer" className="news-card__source news-card__source--link">ТАСС</a></div>
            </article>
            <article className="news-card">
              <div className="news-card__image"><img src="/news/medvestnik-federation.jpg" alt="МедВестник" /></div>
              <div className="news-card__date">12.02.2026</div>
              <h3 className="news-card__title">В России зарегистрирована Федерация специалистов превентивного здоровья и питания</h3>
              <p className="news-card__text">Организация планирует участвовать в разработке профстандарта нутрициолога, аккредитации обучения профильных врачей и защите потребителей.</p>
              <div className="news-card__footer"><a href="https://medvestnik.ru/content/news/V-Rossii-zaregistrirovana-Federaciya-specialistov-preventivnogo-zdorovya-i-pitaniya.html" target="_blank" rel="noopener noreferrer" className="news-card__source news-card__source--link">МедВестник</a></div>
            </article>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section section--gradient">
        <div className="container">
          <div className="cta-block">
            <h2 className="h2 h2--white">Присоединяйтесь к нам</h2>
            <p className="text-lg text--white-muted">Станьте частью профессиональной экосистемы превентивного здоровья<br />и здорового образа жизни</p>
            <div className="cta-block__buttons">
              <Link to="/register" className="btn btn--white">Вступить в Федерацию</Link>
              <Link to="/partnerstvo" className="btn btn--white-outline">Узнать о партнерстве</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Контакты */}
      <section className="section section--white">
        <div className="container">
          <div className="section-header"><span className="badge">Контакты</span><h2 className="h2">Свяжитесь с нами</h2></div>
          <div className="contacts-grid">
            <a href="tel:+79854698000" className="contact-card">
              <div className="contact-card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z"/></svg></div>
              <h3>Телефон</h3>
              <span className="contact-card__value">+7 985 469 80 00</span>
            </a>
            <a href="mailto:federation-pmn@mail.ru" className="contact-card">
              <div className="contact-card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
              <h3>Email</h3>
              <span className="contact-card__value">federation-pmn@mail.ru</span>
            </a>
            <div className="contact-card">
              <div className="contact-card__icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg></div>
              <h3>Адрес</h3>
              <span className="contact-card__value">г. Москва, ул. Новый Арбат, д.21</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
