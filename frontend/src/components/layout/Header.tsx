import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useState, useRef, useEffect } from 'react';

export default function Header() {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [aboutDropdown, setAboutDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setAboutDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" className="header__logo" onClick={closeMenu}>
          <img src="/logo.png" alt="Федерация специалистов превентивного здоровья и питания" className="header__logo-img" />
        </Link>

        <button
          className={`header__burger ${menuOpen ? 'header__burger--open' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`header__nav ${menuOpen ? 'header__nav--open' : ''}`}>
          <div className="header__nav-links">
            {/* О нас dropdown */}
            <div className="header__dropdown" ref={dropdownRef}>
              <button
                className="header__link header__link--dropdown"
                onClick={() => setAboutDropdown(!aboutDropdown)}
                onMouseEnter={() => setAboutDropdown(true)}
              >
                О нас
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="14" height="14">
                  <polyline points="6 9 12 15 18 9"/>
                </svg>
              </button>
              {aboutDropdown && (
                <div
                  className="header__dropdown-menu"
                  onMouseLeave={() => setAboutDropdown(false)}
                >
                  <NavLink to="/federation" className="header__dropdown-link" onClick={() => { closeMenu(); setAboutDropdown(false); }}>
                    О Федерации
                  </NavLink>
                  <NavLink to="/deyatelnost" className="header__dropdown-link" onClick={() => { closeMenu(); setAboutDropdown(false); }}>
                    Деятельность
                  </NavLink>
                  <NavLink to="/organy-upravleniya" className="header__dropdown-link" onClick={() => { closeMenu(); setAboutDropdown(false); }}>
                    Органы управления
                  </NavLink>
                  <NavLink to="/reestr" className="header__dropdown-link" onClick={() => { closeMenu(); setAboutDropdown(false); }}>
                    Реестр нутрициологов
                  </NavLink>
                </div>
              )}
            </div>

            <NavLink to="/news" className="header__link" onClick={closeMenu}>Новости</NavLink>
            <NavLink to="/partnerstvo" className="header__link" onClick={closeMenu}>Партнерство</NavLink>
            <NavLink to="/sotrudnichestvo" className="header__link" onClick={closeMenu}>Сотрудничество</NavLink>
            <NavLink to="/contacts" className="header__link" onClick={closeMenu}>Контакты</NavLink>
          </div>

          <div className="header__actions">
            {isAuthenticated ? (
              <>
                <NavLink to="/cabinet" className="header__link" onClick={closeMenu}>
                  Личный кабинет
                </NavLink>
                {isAdmin && (
                  <NavLink to="/admin" className="header__link header__link--admin" onClick={closeMenu}>
                    Админ-панель
                  </NavLink>
                )}
                <div className="header__user-block">
                  <span className="header__email">{user?.email}</span>
                  <button className="header__logout-btn" onClick={handleLogout}>Выйти</button>
                </div>
              </>
            ) : (
              <div className="header__auth-buttons">
                <Link to="/login" className="header__link header__link--login" onClick={closeMenu}>Войти</Link>
                <Link to="/register" className="btn btn--primary btn--sm" onClick={closeMenu}>
                  Вступить
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
