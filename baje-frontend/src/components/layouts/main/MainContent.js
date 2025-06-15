import React from "react";

const MainContent = ({ children }) => {
  return (
    <main className="main-content pb-5 pb-lg-0 py-lg-3">
      <div className="route-container px-lg-3 position-relative">
        {children}
      </div>
    </main>
  );
};

export default MainContent;
