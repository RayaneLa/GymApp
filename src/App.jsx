import "./App.css";
import { useTranslation } from "react-i18next";
import "./i18n";
import Header from "./Header";

function App() {
  const { t } = useTranslation();

  return (
    <div>
     
      <h1>{t("welcome")}</h1>
    </div>
  );
}
//test
export default App;
