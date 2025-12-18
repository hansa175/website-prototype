import { useRef } from "react";
import "./hero.css";
import heroImage from "../../../assets/about_3.jpg";

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  const updateMouse = (e: React.MouseEvent) => {
  if (!heroRef.current) return;

  const hero = heroRef.current;
  const img = hero.querySelector(
    ".hero-image-reveal"
  ) as HTMLDivElement;

  if (!img) return;

  const imgRect = img.getBoundingClientRect();

  const x = (e.clientX - imgRect.left) / imgRect.width;
  const y = (e.clientY - imgRect.top) / imgRect.height;

  const inside =
    x >= 0 && x <= 1 && y >= 0 && y <= 1;

  hero.style.setProperty("--mx", x.toString());
  hero.style.setProperty("--my", y.toString());
  hero.style.setProperty("--r", inside ? "90px" : "0px");
};


  const handleMouseLeave = () => {
  if (!heroRef.current) return;
  heroRef.current.style.setProperty("--r", "0px");
};


  return (
    <section
      ref={heroRef}
      className="hero"
      onMouseMove={updateMouse}
      onMouseEnter={updateMouse}
      onMouseLeave={handleMouseLeave}
      style={{ "--hero-img": `url(${heroImage})` } as React.CSSProperties}
    >
      {/* NAVBAR */}
      <div className="nav-wrapper">
        <nav className="nav">
          <button>Login</button>
          <button>Events</button>
          <button>About Us</button>
        </nav>
        <div className="nav-line" />
      </div>

      {/* IMAGE REVEAL */}
      <div className="hero-image-reveal" />

      {/* HERO CONTENT */}
      <div className="hero-center">
        <h1 className="hero-title">
          <span className="dsbs">dsbs</span> students association
        </h1>

        <button className="cta">
          Register for Datakon <span>&gt;</span>
        </button>
      </div>
    </section>
  );
}
