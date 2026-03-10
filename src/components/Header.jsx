import React from 'react';

const Header = () => {
  return (
    <header className="header">
      <div className="header-content">
        <div className="header-title">
          <div className="icon-container">
            <span className="icon">🏛️</span>
          </div>
          <div className="title-text">
            <h1>Sri Jayewardenepura Kotte Municipal Council</h1>
            <div className="subtitle">
              <div className="line"></div>
              <p>Automated Valuation System for Sri Lanka</p>
              <div className="line"></div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;