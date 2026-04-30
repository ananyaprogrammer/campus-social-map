import React from "react";
import "./About.css";

export default function About() {
  // Yahan baad me apna actual photo URL daal dena
  const photoUrl = "/utkarsh.jpg";

  return (
    <div className="about-page">
      <div className="about-card">
        {/* Left: Photo */}
        <div className="about-left">
          <div className="about-avatar-wrapper">
            <img
              src={photoUrl}
              alt="Utkarsh"
              className="about-avatar"
            />
            <div className="about-avatar-glow" />
          </div>

          <div className="about-basic-info">
            <h1 className="about-name">Utkarsh Saxena</h1>
            <p className="about-tagline">
              Builder of Campus Social Map • Student • Developer
            </p>

            <div className="about-pill-row">
              <span className="about-pill">Full Stack (MERN)</span>
              <span className="about-pill">React & UI</span>
              <span className="about-pill">Problem Solver</span>
            </div>
          </div>
        </div>

        {/* Right: Text content */}
        <div className="about-right">
          <section className="about-section">
            <h2>About me</h2>
            <p>
              Hey, I&apos;m <strong>Utkarsh</strong> – a student and a developer
              who loves turning simple ideas into real products.{" "}
              <strong>Campus Social Map</strong> is my way of solving a very
              real problem: colleges ke andar kya ho raha hai, kis event me
              jana hai, kaun sa study group chal raha hai – sab ek hi jagah
              pe clean UI ke saath.
            </p>
            <p>
              Mujhe code likhna sirf degree ke liye nahi, balki{" "}
              <strong>logon ki life thodi easy banane</strong> ke liye pasand
              hai. Is project ke through maine backend, frontend, realtime
              updates, authentication aur UI polish sab ek saath sikha aur
              implement kiya.
            </p>
          </section>

          <section className="about-section">
            <h2>What I work with</h2>
            <div className="about-grid">
              <div className="about-grid-item">
                <h3>Frontend</h3>
                <p>React, modern CSS, responsive UI, clean UX.</p>
              </div>
              <div className="about-grid-item">
                <h3>Backend</h3>
                <p>Node.js, Express, REST APIs, JWT auth.</p>
              </div>
              <div className="about-grid-item">
                <h3>Database & Realtime</h3>
                <p>MongoDB, Mongoose, Socket.io, Cloudinary for media.</p>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>Why I built Campus Social Map</h2>
            <p>
              Campus me aksar bahut saari cheeze chal rahi hoti hain – events,
              competitions, workshops, study groups, lost & found. Lekin
              information idhar–udhar bikhar jaati hai: WhatsApp groups, random
              stories, posters… <strong>Campus Social Map</strong> isi scatter
              ko solve karta hai – ek single feed jahan se student{" "}
              <strong>connect, discover aur meet</strong> kar sakte hain.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
