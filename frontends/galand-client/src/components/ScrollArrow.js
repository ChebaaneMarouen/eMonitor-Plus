import React, { useState } from "react";

export default function ScrollArrow({lang}) {
  const [showScroll, setShowScroll] = useState(false);

  const checkScrollTop = () => {
    if (!showScroll && window.pageYOffset > 400) {
      setShowScroll(true);
    } else if (showScroll && window.pageYOffset <= 400) {
      setShowScroll(false);
    }
  };

  const scrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  window.addEventListener("scroll", checkScrollTop);

  return (
    <div
      className={lang === "ar" ? "scrollTop-ar" : "scrollTop"}
      onClick={scrollTop}
      style={{
        display: showScroll ? "inline-table" : "none",
        backgroundColor: "#c71904",
        color: "white",
        textAlign: "center",
        fontSize: "35px",
      }}
    >
      ⬆
    </div>
  );
}
