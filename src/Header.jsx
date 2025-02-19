import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";

const Header = () => {
  const { i18n } = useTranslation();

  // Handle language change
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header className="sidebar">
      <nav>
        <ul>
          <li><Link to="/">{i18n.t("welcome")}</Link></li>
          <li><Link to="/profile">{i18n.t("profile")}</Link></li>
          <li><Link to="/reservations">{i18n.t("reservations")}</Link></li>
          <li><Link to="/booking">{i18n.t("booking")}</Link></li>
          <li><Link to="/subscription_info">{i18n.t("subscription_info")}</Link></li>
          <li><Link to="/diary_schedule">{i18n.t("diary_schedule")}</Link></li>
        </ul>
      </nav>

      {/* Language Switcher */}
      <div className="language-switcher">
        <label>{i18n.t("language")}:</label>
        <select onChange={(e) => changeLanguage(e.target.value)} value={i18n.language}>
          <option value="en">English</option>
          <option value="nl">Nederlands</option>
          <option value="fr">Français</option>
        </select>
      </div>
    </header>
  );
};

export default Header;
