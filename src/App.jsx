import "./App.css";
import { useTranslation } from "react-i18next";
import "./i18n";
import Header from "./Header";

function App() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div>
      <Header changeLanguage={changeLanguage} /> {/* Make sure this is correct */}
      <div className="main-content">
        <h1>{t("welcome")}</h1>
      </div>
    </div>
  );
}

export default App;
