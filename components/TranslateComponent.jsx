import { useEffect, useState } from "react";

const TranslateComponent = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Define the initialization function
    window.googleTranslateElementInit = () => {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: "en",
          autoDisplay: false,
          includedLanguages: "en,es,fr,de,zh,ja,no,ru,ar,bn,pt", // Add languages you want to support
          layout: google.translate.TranslateElement.InlineLayout.SIMPLE,
        },
        "google_translate_element"
      );

      // Restore the language from localStorage or default to English if not set
      const lang = localStorage.getItem("googleTrans") || "/en/en";
      const select = document.querySelector(".goog-te-combo");
      if (select) {
        select.value = lang.split("/")[2];
        select.dispatchEvent(new Event("change"));
      }

      setIsInitialized(true);
    };

    const loadGoogleTranslateScript = () => {
      if (!document.getElementById("google-translate-script")) {
        const addScript = document.createElement("script");
        addScript.id = "google-translate-script";
        addScript.src = "//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit";
        document.body.appendChild(addScript);
      } else {
        // If the script is already present, just initialize the translate element
        if (window.google && window.google.translate) {
          window.googleTranslateElementInit();
        }
      }
    };

    // Preload the language setting before loading the Google Translate script
    const preloadLanguage = () => {
      const lang = localStorage.getItem("googleTrans") || "/en/en";
      const langCode = lang.split("/")[2];

      // Create a fake select element to initialize the language
      const select = document.createElement("select");
      select.classList.add("goog-te-combo");
      select.value = langCode;
      document.body.appendChild(select);
      select.dispatchEvent(new Event("change"));
      document.body.removeChild(select);

      // Now load the Google Translate script
      loadGoogleTranslateScript();
    };

    preloadLanguage();
  }, []);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const select = document.querySelector(".goog-te-combo");
      if (select) {
        select.addEventListener("change", (e) => {
          handleLanguageChange(e.target.value);
        });

        // Set initial language from localStorage if present, otherwise default to English
        const lang = localStorage.getItem("googleTrans") || "/en/en";
        select.value = lang.split("/")[2];
        select.dispatchEvent(new Event("change"));
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
    };
  }, []);

  // Function to handle language change
  const handleLanguageChange = (lang) => {
    localStorage.setItem("googleTrans", `/en/${lang}`);
    const select = document.querySelector(".goog-te-combo");
    if (select) {
      select.value = lang;
      select.dispatchEvent(new Event("change"));
    }
  };

  return (
    <div id="google_translate_element" style={{ display: isInitialized ? 'block' : 'none' }}></div>
  );
};

export default TranslateComponent;
