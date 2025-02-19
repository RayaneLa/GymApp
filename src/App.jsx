import './App.css';
import { useTranslation } from "react-i18next";
import { Link } from 'react-router-dom';
import "./i18n";
import Header from './Header';

function App() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div>
      {/* Include the Header with menu items and language switcher */}
      <Header changeLanguage={changeLanguage} />

      <h1>{t("welcome")}</h1>

    </div>
  );
}

export default App;
