import React, { useState } from "react";
import themes from "@/app/_data/Themes"; // Importing themes from Themes.jsx

const ThemeSwitcher = () => {
  const [currentTheme, setCurrentTheme] = useState(themes[0]); // Default theme

  const generateRandomTheme = () => {
    const randomIndex = Math.floor(Math.random() * themes.length);
    setCurrentTheme(themes[randomIndex]); // Set a random theme
  };

  return (
    <div style={{ backgroundColor: currentTheme["base-100"], color: currentTheme["base-content"], padding: "20px", textAlign: "center" }}>
      <h2>Random Theme Generator</h2>
      <p>Current Theme: {currentTheme.theme}</p>

      <button
        onClick={generateRandomTheme}
        style={{
          backgroundColor: currentTheme.primary,
          color: currentTheme["primary-content"],
          padding: "10px 20px",
          border: "none",
          cursor: "pointer",
          borderRadius: "5px"
        }}
      >
        Generate a Random Theme
      </button>
    </div>
  );
};

export default ThemeSwitcher;
