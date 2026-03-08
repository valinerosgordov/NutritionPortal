import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="footer">
      {/* Белый блок — логотип, название, ИНН */}
      <div className="footer__info">
        <div className="footer__container">
          <div className="footer__brand">
            <div className="footer__logo">
              <img src="/logo.png" alt="Федерация специалистов превентивной медицины и питания" className="footer__logo-img" />
            </div>
            <div className="footer__brand-text">
              <p className="footer__org-name">
                Автономная некоммерческая организация<br />
                &laquo;Федерация специалистов превентивного здоровья и питания&raquo;
              </p>
              <p className="footer__inn">ИНН: 9728169432</p>
            </div>
          </div>
        </div>
      </div>

      {/* Тёмный блок — навигация */}
      <div className="footer__nav">
        <div className="footer__container">
          <div className="footer__nav-columns">
            <nav className="footer__nav-col">
              <h4 className="footer__nav-title">Навигация</h4>
              <Link to="/" className="footer__link">Главная</Link>
              <Link to="/federation" className="footer__link">О Федерации</Link>
              <Link to="/deyatelnost" className="footer__link">Деятельность</Link>
              <Link to="/news" className="footer__link">Новости</Link>
            </nav>
            <nav className="footer__nav-col">
              <h4 className="footer__nav-title">Партнерам</h4>
              <Link to="/partnerstvo" className="footer__link">Партнерство</Link>
              <Link to="/sotrudnichestvo" className="footer__link">Сотрудничество</Link>
              <Link to="/reestr" className="footer__link">Реестр нутрициологов</Link>
              <Link to="/register" className="footer__link">Регистрация</Link>
            </nav>
            <nav className="footer__nav-col">
              <h4 className="footer__nav-title">Контакты</h4>
              <a href="tel:+79854698000" className="footer__link">+7 985 469 80 00</a>
              <a href="mailto:federation-pmn@mail.ru" className="footer__link">federation-pmn@mail.ru</a>
              <a href="https://t.me/federation2026" target="_blank" rel="noopener noreferrer" className="footer__link">Telegram</a>
              <Link to="/contacts" className="footer__link">Все контакты</Link>
            </nav>
          </div>

          <div className="footer__bottom">
            <p>&copy; 2025-2026 Федерация ПМП. Все права защищены.</p>
            <Link to="/privacy" className="footer__bottom-link">Политика конфиденциальности</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
