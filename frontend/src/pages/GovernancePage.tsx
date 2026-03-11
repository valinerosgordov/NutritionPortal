import { Link } from 'react-router-dom';

const governanceMembers = [
  {
    role: 'Президент Федерации',
    lastName: 'Писарева',
    firstName: 'Ирина',
    middleName: 'Александровна',
    photo: '/images/pisareva.jpg',
    desc: 'Стратегическое развитие, взаимодействие с государственными органами и профессиональным сообществом',
  },
];

export default function GovernancePage() {
  return (
    <div className="page-governance">
      {/* Page Header */}
      <section className="page-header">
        <div className="container">
          <span className="badge badge--light">О нас</span>
          <h1 className="page-header__title">Органы управления</h1>
          <p className="page-header__subtitle">
            Руководство Федерации специалистов превентивного здоровья и питания
          </p>
        </div>
      </section>

      {/* Governance */}
      <section className="section section--white">
        <div className="container">
          <div className="section-header">
            <span className="badge">Руководство</span>
            <h2 className="h2">Состав органов управления</h2>
          </div>
          <div className="governance-grid">
            {governanceMembers.map((member, i) => (
              <div className="governance-card" key={i}>
                <div className="governance-card__photo">
                  <img
                    src={member.photo}
                    alt={`${member.lastName} ${member.firstName} ${member.middleName}`}
                    className="governance-card__photo-img"
                  />
                </div>
                <span className="governance-card__role">{member.role}</span>
                <h3 className="governance-card__name">
                  {member.lastName}<br />
                  {member.firstName}<br />
                  {member.middleName}
                </h3>
                <p className="governance-card__desc">{member.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section section--gradient">
        <div className="container">
          <div className="cta-block">
            <h2 className="h2 h2--white">Хотите стать частью нашей экосистемы?</h2>
            <p className="text-lg text--white-muted">
              Присоединяйтесь к Федерации и внесите свой вклад в развитие отрасли превентивного здоровья
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
