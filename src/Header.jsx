import "./Header.css";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const Header = () => {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      {/* Hamburger menu button */}
      <button className="hamburger" onClick={() => setIsOpen(!isOpen)}>
        ☰
      </button>

      <nav>
        <ul>
          <li>
            <NavLink to="/">
              <span>{t("home")}</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/profile">
              <span>{t("profile")}</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/reservations">
              <span>{t("reservations")}</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/booking">
              <span>{t("booking")}</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/subscription_info">
              <span>{t("subscription_info")}</span>
            </NavLink>
          </li>
          <li>
            <NavLink to="/diary_schedule">
              <span>{t("diary_schedule")}</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      {/* Language Switcher */}
      <div className="language-switcher">
        <select onChange={(e) => changeLanguage(e.target.value)}>
          <option value="en">English</option>
          <option value="nl">Nederlands</option>
          <option value="fr">Français</option>
        </select>
      </div>
    </aside>
  );
};

export default Header;
