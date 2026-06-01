import { useNavigate } from "react-router";
import "../style/landing.scss";
import { useEffect, useState } from "react";
import { getMe } from "../../auth/services/auth.api";

const Landing = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = 90;
    const duration = 2000; // 2 seconds

    const incrementTime = duration / end;

    const counter = setInterval(() => {
      start += 1;
      setScore(start);

      if (start >= end) {
        clearInterval(counter);
      }
    }, incrementTime);

    return () => clearInterval(counter);
  }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
       const data = await getMe();
      if(data?.user){
        setIsLoggedIn(true);
      }else{
        setIsLoggedIn(false);
      }
      } catch (err) {
        setIsLoggedIn(false);
      }
    };

    checkAuth();
  }, []);

  return (
    <div className="landing">
      {/* NAVBAR */}
      <header className="landing__nav">
        <h2 className="logo">PrepAI</h2>

        <div className="nav-actions">
          {!isLoggedIn ? (
            <>
              <button
                onClick={() => navigate("/login")}
                className="btn-outline"
              >
                Login
              </button>

              <button
                onClick={() => navigate("/register")}
                className="btn-primary"
              >
                Get Started
              </button>
            </>
          ) : (
            <button onClick={() => navigate("/home")} className="btn-primary">
              Go to Dashboard
            </button>
          )}
        </div>
      </header>

      {/* HERO */}
      <section className="landing__hero">
        <h1>
          Crack Your <span>Placements</span> with PrepAI
        </h1>
        <p>
          Build ATS-friendly resumes, get interview questions and
          Placement-roadmap, and analyze your resume with smart match scoring.
        </p>

        <div className="hero-actions">
          {!isLoggedIn ? (
            <>
              <button
                onClick={() => navigate("/register")}
                className="btn-primary"
              >
                Create Resume
              </button>

              <button
                onClick={() => navigate("/login")}
                className="btn-outline"
              >
                Already have account
              </button>
            </>
          ) : (
            <button onClick={() => navigate("/home")} className="btn-primary">
              Continue to Dashboard
            </button>
          )}
        </div>

        {/* MOCK CARD */}
        <div className="hero-card">
          <div className="score">{score}%</div>
          <p>Accuracy in Score matching and Data Analysis</p>
        </div>
      </section>

      {/* FEATURES */}
      <section className="landing__features">
        <h2>Why use PrepAI?</h2>

        <div className="features-grid">
          <div className="feature-card">
            <h3>AI Resume Generator</h3>
            <p>Create professional resumes instantly with optimized content.</p>
          </div>

          <div className="feature-card">
            <h3>Match Score</h3>
            <p>
              Get a score showing how well your resume fits job descriptions.
            </p>
          </div>

          <div className="feature-card">
            <h3>Interview Preparation</h3>
            <p>Practice real interview questions tailored to your profile.</p>
          </div>

          <div className="feature-card">
            <h3>Smart Suggestions</h3>
            <p>Improve your resume with AI-powered insights.</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="landing__cta">
        <h2>Start preparing today</h2>
        <button
          onClick={() => navigate(isLoggedIn ? "/home" : "/register")}
          className="btn-primary large"
        >
          {isLoggedIn ? "Go to Dashboard" : "Get Started Free"}
        </button>
      </section>

      {/* FOOTER */}
      <footer className="landing__footer">
        <p>© 2026 PrepAI • Built for placement</p>
      </footer>
    </div>
  );
};

export default Landing;
