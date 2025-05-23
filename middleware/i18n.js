const path = require("path");
const fs = require("fs");

const translationsDir = path.join(__dirname, "..", "translations");

const defaultLang = "en";

const loadTranslations = (lang) => {
  try {
    const filePath = path.join(translationsDir, lang + ".json");
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(content);
    }
  } catch (err) {
    console.error("Error loading translations for lang:", lang, err);
  }
  return {};
};

const i18nMiddleware = (req, res, next) => {
  const lang = req.query.lang || defaultLang;
  const translations = loadTranslations(lang);

  // Simple translation function
  res.locals.t = (key) => {
    const keys = key.split(".");
    let value = translations;
    for (const k of keys) {
      if (value && Object.prototype.hasOwnProperty.call(value, k)) {
        value = value[k];
      } else {
        return key; // fallback to key if translation missing
      }
    }
    return value;
  };

  res.locals.lang = lang;

  next();
};

module.exports = i18nMiddleware;
