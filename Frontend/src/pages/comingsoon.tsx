import React from "react";

const ComingSoon = () => {
  return (
    <>
      <div className="page">
        {/* Background */}
        <div className="background" />

        {/* Overlay */}
        <div className="overlay">
          {/* Modal */}
          <div className="modal">
            <span className="badge">Early Access</span>

            <h1>Important Update</h1>

            <p className="intro">
              Thank you for onboarding with <strong>LeadEquator</strong>.
            </p>

            <p>
              Due to an exceptionally high volume of early access requests, our
              servers are currently operating at limited capacity. We’re actively
              scaling our infrastructure to ensure a stable, high-performance
              experience for everyone.
            </p>

            <p>
              We appreciate your patience during this brief phase. You’ll be
              notified as soon as full access is enabled.
            </p>

            <p className="support">
              Thank you for being an early supporter of LeadEquator.
            </p>

            <button
              className="home-btn"
              onClick={() => (window.location.href = "/")}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>

      {/* Internal CSS */}
      <style jsx>{`
        .page {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont,
            "Segoe UI", sans-serif;
        }

        .background {
          position: absolute;
          inset: 0;
          background-image: url("/CommingSoon.png");
          background-size: cover;
          background-position: center;
          filter: blur(10px);
          transform: scale(1.12);
        }

        .overlay {
          position: relative;
          z-index: 2;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(
            rgba(0, 0, 0, 0.55),
            rgba(0, 0, 0, 0.7)
          );
        }

        .modal {
          width: 92%;
          max-width: 600px;
          padding: 44px;
          border-radius: 18px;
          background: rgba(15, 15, 15, 0.85);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 30px 80px rgba(0, 0, 0, 0.75);
          color: #ffffff;
          animation: popIn 0.5s ease;
        }

        .badge {
          display: inline-block;
          margin-bottom: 16px;
          padding: 6px 14px;
          font-size: 12px;
          font-weight: 600;
          border-radius: 999px;
          background: rgba(250, 204, 21, 0.15);
          color: #facc15;
          letter-spacing: 0.3px;
        }

        .modal h1 {
          font-size: 30px;
          margin-bottom: 16px;
          color: #facc15;
          font-weight: 700;
        }

        .intro {
          font-size: 16px;
          color: #e5e7eb;
          margin-bottom: 16px;
        }

        .modal p {
          font-size: 15px;
          line-height: 1.7;
          color: #cbd5f5;
          margin-bottom: 14px;
        }

        .support {
          margin-top: 20px;
          font-weight: 500;
          color: #e5e7eb;
        }

        .home-btn {
          margin-top: 30px;
          width: 100%;
          padding: 15px;
          font-size: 15px;
          font-weight: 600;
          border-radius: 14px;
          background: linear-gradient(135deg, #facc15, #fde047);
          color: #000;
          border: none;
          cursor: pointer;
          transition: all 0.25s ease;
        }

        .home-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(250, 204, 21, 0.35);
        }

        @keyframes popIn {
          from {
            opacity: 0;
            transform: translateY(14px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (max-width: 640px) {
          .modal {
            padding: 30px 22px;
          }

          .modal h1 {
            font-size: 24px;
          }
        }
      `}</style>
    </>
  );
};

export default ComingSoon;
