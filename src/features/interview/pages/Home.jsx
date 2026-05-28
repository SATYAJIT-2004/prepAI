import React, { useState, useRef, useEffect } from "react";
import "../style/home.scss";
import { useInterview } from "../hooks/useInterview.js";
import { useNavigate } from "react-router";
import { useAuth } from "../../auth/hooks/useAuth.js";

const Home = () => {
  const { loading, generateReport, reports } = useInterview();
  const [jobDescription, setJobDescription] = useState("");
  const [selfDescription, setSelfDescription] = useState("");
  const resumeInputRef = useRef();
  const { handleLogout } = useAuth();

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
    }
  }, [user, navigate]);

  const handleGenerateReport = async () => {
    const resumeFile = resumeInputRef.current.files[0];
    const data = await generateReport({
      jobDescription,
      selfDescription,
      resumeFile,
    });
    navigate(`/interview/${data._id}`);
  };

  if (loading) {
    return (
      <main className="loading-screen">
        <div className="loading-container">
          {/* Minimal Loader */}
          <div className="loading-animation">
            <div className="loading-ring"></div>
          </div>

          {/* Content */}
          <div className="loading-content">
            <h1 className="loading-title">
              Generating your interview strategy
              <span className="loading-dots">
                <span>.</span>
                <span>.</span>
                <span>.</span>
              </span>
            </h1>

            <p className="loading-subtitle">
              Analyzing your profile and preparing tailored questions
            </p>

            {/* Progress Bar */}
            <div className="loading-progress">
              <div className="loading-progress__bar"></div>

              {/* Steps */}
              <div className="loading-progress__steps">
                <span className="step active">Resume</span>
                <span className="step">Skills</span>
                <span className="step">Questions</span>
                <span className="step">Roadmap</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="home-page">
      {/* Page Header */}
      <header className="page-header">
        <div className="header-container">
          <button
            className="logout-btn logout-btn--left"
            onClick={() => navigate("/battle")}
            aria-label="Start Battle"
          >
            {/* your svg icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="logout-btn__icon"
            >
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            <span className="logout-btn__text">BattleGround</span>  
          </button>

          <div className="header-content">
            <h1>
              Create Your Custom{" "}
              <span className="highlight">Interview Plan</span>
            </h1>
            <p>
              Let our AI analyze the job requirements and your unique profile to
              build a winning strategy.
            </p>
          </div>

          <button
            className="logout-btn"
            onClick={handleLogout}
            aria-label="Logout"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="logout-btn__icon"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            <span className="logout-btn__text">Logout</span>
          </button>
        </div>
      </header>

      {/* Main Card */}
      <div className="interview-card">
        <div className="interview-card__body">
          {/* Left Panel - Job Description */}
          <div className="panel panel--left">
            <div className="panel__header">
              <div className="panel__header-left">
                <span className="panel__icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                  </svg>
                </span>
                <h2>Target Job Description</h2>
              </div>
              <span className="badge badge--required">Required</span>
            </div>
            <textarea
              onChange={(e) => {
                setJobDescription(e.target.value);
              }}
              className="panel__textarea"
              placeholder={`Paste the full job description here...\ne.g. 'Senior Frontend Engineer at Google requires proficiency in React, TypeScript, and large-scale system design...'`}
              maxLength={5000}
              value={jobDescription}
            />
            <div className="char-counter">
              {jobDescription.length} / 5000 chars
            </div>
          </div>

          {/* Vertical Divider */}
          <div className="panel-divider" />

          {/* Right Panel - Profile */}
          <div className="panel panel--right">
            <div className="panel__header">
              <div className="panel__header-left">
                <span className="panel__icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                </span>
                {/* <h2>Your Profile</h2> */}
              </div>
            </div>

            {/* Upload Resume */}
            <div className="upload-section">
              <div className="section-label-wrapper">
                <label className="section-label">Upload Resume</label>
                <span className="badge badge--best">Best Results</span>
              </div>
              <label className="dropzone" htmlFor="resume">
                <span className="dropzone__icon">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="28"
                    height="28"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <polyline points="16 16 12 12 8 16" />
                    <line x1="12" y1="12" x2="12" y2="21" />
                    <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
                  </svg>
                </span>
                <p className="dropzone__title">
                  Click to upload or drag &amp; drop
                </p>
                <p className="dropzone__subtitle">PDF or DOCX (Max 5MB)</p>
                <input
                  ref={resumeInputRef}
                  hidden
                  type="file"
                  id="resume"
                  name="resume"
                  accept=".pdf,.docx"
                />
              </label>
            </div>

            {/* OR Divider */}
            <div className="or-divider">
              <span>OR</span>
            </div>

            {/* Quick Self-Description */}
            <div className="self-description">
              <label className="section-label" htmlFor="selfDescription">
                Quick Self-Description
              </label>
              <textarea
                onChange={(e) => {
                  setSelfDescription(e.target.value);
                }}
                id="selfDescription"
                name="selfDescription"
                className="panel__textarea panel__textarea--short"
                placeholder="Briefly describe your experience, key skills, and years of experience if you don't have a resume handy..."
                value={selfDescription}
              />
            </div>

            {/* Info Box */}
            <div className="info-box">
              <span className="info-box__icon">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <circle cx="12" cy="12" r="10" />
                  <line
                    x1="12"
                    y1="8"
                    x2="12"
                    y2="12"
                    stroke="#1a1f27"
                    strokeWidth="2"
                  />
                  <line
                    x1="12"
                    y1="16"
                    x2="12.01"
                    y2="16"
                    stroke="#1a1f27"
                    strokeWidth="2"
                  />
                </svg>
              </span>
              <p>
                A <strong>Resume</strong> and a{" "}
                <strong>Self Description</strong> is required to generate a
                personalized plan.
              </p>
            </div>
          </div>
        </div>

        {/* Card Footer */}
        <div className="interview-card__footer">
          <span className="footer-info">
            AI-Powered Strategy Generation • Approx 30s
          </span>
          <button onClick={handleGenerateReport} className="generate-btn">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
            </svg>
            Generate My Interview Strategy
          </button>
        </div>
      </div>

      {/* Recent Reports List */}
      {reports.length > 0 && (
        <section className="recent-reports">
          <div className="recent-reports-header">
            <h2>My Recent Interview Plans</h2>
            <p className="recent-reports-subtitle">
              Continue your preparation where you left off
            </p>
          </div>
          <div className="reports-grid">
            {reports.map((report) => (
              <div
                key={report._id}
                className="report-card"
                onClick={() => navigate(`/interview/${report._id}`)}
              >
                {/* Gradient Border Effect */}
                <div className="report-card__border"></div>

                <div className="report-card__content">
                  <div className="report-card__header">
                    <div className="report-card__icon">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                    </div>
                    <div
                      className={`match-score-indicator ${
                        report.matchScore >= 80
                          ? "score--high"
                          : report.matchScore >= 60
                            ? "score--mid"
                            : "score--low"
                      }`}
                    >
                      <span className="match-score-indicator__value">
                        {report.matchScore}
                      </span>
                      <span className="match-score-indicator__percent">%</span>
                    </div>
                  </div>

                  <h3 className="report-card__title">
                    {report.title || "Untitled Position"}
                  </h3>

                  <p className="report-card__meta">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    {new Date(report.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>

                  <div className="report-card__footer">
                    <span className="report-card__action">
                      Continue Preparation
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      {/* Page Footer */}
      <footer className="page-footer">
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Terms of Service</a>
          <a href="#">Help Center</a>
        </div>
      </footer>
    </div>
  );
};

export default Home;
