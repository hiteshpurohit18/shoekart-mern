import { useEffect, useState } from "react";

export default function ScrollToTopButton() {
  const [visible, setVisible] = useState(false);

  //Show button when scrolled
  useEffect(function () {
    function toggleVisibility() {
      if (window.scrollY > 300) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    }
    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button onClick={scrollToTop}
      className={`fixed right-6 bottom-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-black text-white shadow-lg transition-all duration-300 ${visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"} `}
      aria-label="Scroll to Top"
    >
      ↑
    </button>
  );
}
