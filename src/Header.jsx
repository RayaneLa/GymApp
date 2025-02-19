import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Header.css";

function Header() {
  const { t, i18n } = useTranslation(); // ✅ Get t and i18n from the hook

  // Language change function
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="sidebar">
      <nav>
        <ul>
          <li><Link to="/">{t("home")}</Link></li>
          <li><Link to="/profile">{t("profile")}</Link></li>
          <li><Link to="/reservations">{t("reservations")}</Link></li>
          <li><Link to="/booking">{t("booking")}</Link></li>
          <li><Link to="/subscription_info">{t("subscription")}</Link></li>
          <li><Link to="/diary_schedule">{t("diary_schedule")}</Link></li>
        </ul>
      </nav>

      <div className="language-switcher">
        <select onChange={(e) => changeLanguage(e.target.value)}>
          <option value="en">{t("english")}</option>
          <option value="fr">{t("french")}</option>
          <option value="nl">{t("dutch")}</option>
        </select>
      </div>
    </div>
  );
}

export default Header;
