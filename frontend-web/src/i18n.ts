export type Lang = 'en' | 'hi' | 'kn' | 'pa' | 'te' | 'mr';

export const LANGUAGES: { code: Lang; label: string; native: string }[] = [
  { code: 'en', label: 'English', native: 'English' },
  { code: 'hi', label: 'Hindi', native: 'हिंदी' },
  { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'pa', label: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'te', label: 'Telugu', native: 'తెలుగు' },
  { code: 'mr', label: 'Marathi', native: 'मराठी' },
];

export const T: Record<Lang, Record<string, string>> = {
  en: {
    dashboard: 'Dashboard', myProfile: 'My Profile', soilProfile: 'Soil Profile',
    cropAdvisory: 'Crop Advisory', fertilizer: 'Fertilizer', weather: 'Weather',
    imageAnalysis: 'Image Analysis', marketPrices: 'Market Prices', logout: 'Logout',
    welcomeBack: 'Welcome back, Farmer 👋', getCropAdvice: 'Get Crop Advice',
    fertilizerGuide: 'Fertilizer Guide', weatherAlerts: 'Weather Alerts',
    detectPests: 'Detect Pests', soilProfiles: 'Soil Profiles',
    advisorySessions: 'Advisory Sessions', avgRating: 'Avg Rating',
    language: 'Language',
  },
  hi: {
    dashboard: 'डैशबोर्ड', myProfile: 'मेरी प्रोफ़ाइल', soilProfile: 'मिट्टी प्रोफ़ाइल',
    cropAdvisory: 'फसल सलाह', fertilizer: 'उर्वरक', weather: 'मौसम',
    imageAnalysis: 'छवि विश्लेषण', marketPrices: 'बाज़ार भाव', logout: 'लॉग आउट',
    welcomeBack: 'वापस स्वागत है, किसान 👋', getCropAdvice: 'फसल सलाह लें',
    fertilizerGuide: 'उर्वरक मार्गदर्शिका', weatherAlerts: 'मौसम अलर्ट',
    detectPests: 'कीट पहचानें', soilProfiles: 'मिट्टी प्रोफ़ाइल',
    advisorySessions: 'सलाह सत्र', avgRating: 'औसत रेटिंग',
    language: 'भाषा',
  },
  kn: {
    dashboard: 'ಡ್ಯಾಶ್‌ಬೋರ್ಡ್', myProfile: 'ನನ್ನ ಪ್ರೊಫೈಲ್', soilProfile: 'ಮಣ್ಣಿನ ಪ್ರೊಫೈಲ್',
    cropAdvisory: 'ಬೆಳೆ ಸಲಹೆ', fertilizer: 'ಗೊಬ್ಬರ', weather: 'ಹವಾಮಾನ',
    imageAnalysis: 'ಚಿತ್ರ ವಿಶ್ಲೇಷಣೆ', marketPrices: 'ಮಾರುಕಟ್ಟೆ ಬೆಲೆ', logout: 'ಲಾಗ್ ಔಟ್',
    welcomeBack: 'ಮರಳಿ ಸ್ವಾಗತ, ರೈತ 👋', getCropAdvice: 'ಬೆಳೆ ಸಲಹೆ ಪಡೆಯಿರಿ',
    fertilizerGuide: 'ಗೊಬ್ಬರ ಮಾರ್ಗದರ್ಶಿ', weatherAlerts: 'ಹವಾಮಾನ ಎಚ್ಚರಿಕೆ',
    detectPests: 'ಕೀಟ ಪತ್ತೆ', soilProfiles: 'ಮಣ್ಣಿನ ಪ್ರೊಫೈಲ್',
    advisorySessions: 'ಸಲಹಾ ಅಧಿವೇಶನ', avgRating: 'ಸರಾಸರಿ ರೇಟಿಂಗ್',
    language: 'ಭಾಷೆ',
  },
  pa: {
    dashboard: 'ਡੈਸ਼ਬੋਰਡ', myProfile: 'ਮੇਰੀ ਪ੍ਰੋਫਾਈਲ', soilProfile: 'ਮਿੱਟੀ ਪ੍ਰੋਫਾਈਲ',
    cropAdvisory: 'ਫਸਲ ਸਲਾਹ', fertilizer: 'ਖਾਦ', weather: 'ਮੌਸਮ',
    imageAnalysis: 'ਚਿੱਤਰ ਵਿਸ਼ਲੇਸ਼ਣ', marketPrices: 'ਮੰਡੀ ਭਾਅ', logout: 'ਲੌਗ ਆਊਟ',
    welcomeBack: 'ਵਾਪਸ ਸੁਆਗਤ ਹੈ, ਕਿਸਾਨ 👋', getCropAdvice: 'ਫਸਲ ਸਲਾਹ ਲਓ',
    fertilizerGuide: 'ਖਾਦ ਗਾਈਡ', weatherAlerts: 'ਮੌਸਮ ਚੇਤਾਵਨੀ',
    detectPests: 'ਕੀੜੇ ਪਛਾਣੋ', soilProfiles: 'ਮਿੱਟੀ ਪ੍ਰੋਫਾਈਲ',
    advisorySessions: 'ਸਲਾਹ ਸੈਸ਼ਨ', avgRating: 'ਔਸਤ ਰੇਟਿੰਗ',
    language: 'ਭਾਸ਼ਾ',
  },
  te: {
    dashboard: 'డాష్‌బోర్డ్', myProfile: 'నా ప్రొఫైల్', soilProfile: 'నేల ప్రొఫైల్',
    cropAdvisory: 'పంట సలహా', fertilizer: 'ఎరువు', weather: 'వాతావరణం',
    imageAnalysis: 'చిత్ర విశ్లేషణ', marketPrices: 'మార్కెట్ ధరలు', logout: 'లాగ్ అవుట్',
    welcomeBack: 'తిరిగి స్వాగతం, రైతు 👋', getCropAdvice: 'పంట సలహా పొందండి',
    fertilizerGuide: 'ఎరువు గైడ్', weatherAlerts: 'వాతావరణ హెచ్చరికలు',
    detectPests: 'తెగుళ్ళు గుర్తించండి', soilProfiles: 'నేల ప్రొఫైల్',
    advisorySessions: 'సలహా సెషన్లు', avgRating: 'సగటు రేటింగ్',
    language: 'భాష',
  },
  mr: {
    dashboard: 'डॅशबोर्ड', myProfile: 'माझी प्रोफाइल', soilProfile: 'माती प्रोफाइल',
    cropAdvisory: 'पीक सल्ला', fertilizer: 'खत', weather: 'हवामान',
    imageAnalysis: 'प्रतिमा विश्लेषण', marketPrices: 'बाजार भाव', logout: 'लॉग आउट',
    welcomeBack: 'परत स्वागत आहे, शेतकरी 👋', getCropAdvice: 'पीक सल्ला घ्या',
    fertilizerGuide: 'खत मार्गदर्शिका', weatherAlerts: 'हवामान इशारे',
    detectPests: 'कीड ओळखा', soilProfiles: 'माती प्रोफाइल',
    advisorySessions: 'सल्ला सत्रे', avgRating: 'सरासरी रेटिंग',
    language: 'भाषा',
  },
};

export function t(lang: Lang, key: string): string {
  return T[lang]?.[key] ?? T['en'][key] ?? key;
}
