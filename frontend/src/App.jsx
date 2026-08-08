import { useEffect, useState } from "react";
import "./App.css";

const questions = [
  {
    type: "Introduction",
    question: "Tell me about yourself and your background.",
  },
  {
    type: "Technical",
    question: "What is the difference between let, const and var in JavaScript?",
  },
  {
    type: "Technical",
    question: "What is React and why do developers use it?",
  },
  {
    type: "Project",
    question: "Tell me about a project you have worked on recently.",
  },
  {
    type: "Behavioral",
    question: "What is one challenge you faced and how did you solve it?",
  },
];

function App() {
  const [screen, setScreen] = useState("home");

  const [name, setName] = useState("");
  const [role, setRole] = useState("Frontend Developer");
  const [difficulty, setDifficulty] = useState("Medium");

  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState("");

  const [time, setTime] = useState(120);
  const [isListening, setIsListening] = useState(false);

  const currentQuestion = questions[questionIndex];

  useEffect(() => {
    if (screen !== "interview") return;

    if (time <= 0) {
      nextQuestion();
      return;
    }

    const timer = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [screen, time]);

  const formatTime = () => {
    const min = Math.floor(time / 60);
    const sec = time % 60;

    return `${String(min).padStart(2, "0")}:${String(sec).padStart(
      2,
      "0"
    )}`;
  };

  const startInterview = () => {
    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }

    setQuestionIndex(0);
    setTime(120);
    setAnswer("");
    setScreen("interview");
  };

  const nextQuestion = () => {
    if (questionIndex === questions.length - 1) {
      setScreen("result");
      return;
    }

    setQuestionIndex((prev) => prev + 1);
    setAnswer("");
    setTime(120);
    setIsListening(false);
  };

  const restart = () => {
    setQuestionIndex(0);
    setAnswer("");
    setTime(120);
    setScreen("home");
  };

  /* HOME */

  if (screen === "home") {
    return (
      <div className="app">
        <Background />

        <nav className="navbar">
          <div className="brand">
            <div className="brand-icon">✦</div>

            <div>
              <strong>InterviewAI</strong>
              <span>Smart Interview Coach</span>
            </div>
          </div>

          <div className="online">
            <span></span>
            AI Online
          </div>
        </nav>

        <main className="home">
          <section className="hero-left">
            <div className="small-badge">
              <span>✦</span>
              AI POWERED INTERVIEW
            </div>

            <h1>
              Your next interview
              <br />
              <span>starts here.</span>
            </h1>

            <p className="hero-text">
              Practice realistic interviews with an AI interviewer.
              Get instant feedback, improve your confidence and
              prepare to land your dream job.
            </p>

            <div className="stats">
              <div>
                <strong>10K+</strong>
                <span>Interviews</span>
              </div>

              <div>
                <strong>94%</strong>
                <span>Improvement</span>
              </div>

              <div>
                <strong>24/7</strong>
                <span>Available</span>
              </div>
            </div>

            <div className="setup">
              <div className="setup-title">
                <div className="setup-number">01</div>

                <div>
                  <h3>Configure your interview</h3>
                  <p>Tell us a little about yourself.</p>
                </div>
              </div>

              <div className="input-group">
                <label>Your name</label>

                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="two-inputs">
                <div className="input-group">
                  <label>Job role</label>

                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option>Frontend Developer</option>
                    <option>Backend Developer</option>
                    <option>Full Stack Developer</option>
                    <option>Software Engineer</option>
                    <option>Data Analyst</option>
                  </select>
                </div>

                <div className="input-group">
                  <label>Difficulty</label>

                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value)}
                  >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                </div>
              </div>

              <button className="start-button" onClick={startInterview}>
                <span>Start AI Interview</span>
                <span className="arrow">→</span>
              </button>
            </div>
          </section>

          <section className="hero-right">
            <div className="orb-container">
              <div className="ring ring-one"></div>
              <div className="ring ring-two"></div>
              <div className="ring ring-three"></div>

              <div className="ai-orb">
                <div className="orb-inner">
                  <span>✦</span>
                </div>
              </div>

              <div className="orb-dot dot-one"></div>
              <div className="orb-dot dot-two"></div>
              <div className="orb-dot dot-three"></div>
            </div>

            <div className="floating-card floating-one">
              <div className="mini-icon">✓</div>

              <div>
                <span>Technical Skills</span>
                <strong>92%</strong>
              </div>
            </div>

            <div className="floating-card floating-two">
              <div className="mini-icon">↗</div>

              <div>
                <span>Confidence</span>
                <strong>88%</strong>
              </div>
            </div>

            <div className="ai-label">
              <span className="pulse"></span>
              Your AI interviewer is ready
            </div>
          </section>
        </main>
      </div>
    );
  }

  /* INTERVIEW */

  if (screen === "interview") {
    const progress =
      ((questionIndex + 1) / questions.length) * 100;

    return (
      <div className="app">
        <Background />

        <nav className="navbar">
          <div className="brand">
            <div className="brand-icon">✦</div>

            <div>
              <strong>InterviewAI</strong>
              <span>Live Interview</span>
            </div>
          </div>

          <div className="interview-user">
            <div className="avatar">
              {name.charAt(0).toUpperCase()}
            </div>

            <span>{name}</span>
          </div>
        </nav>

        <main className="interview">
          <div className="interview-top">
            <div>
              <span className="live-badge">
                <i></i> LIVE INTERVIEW
              </span>

              <h1>Technical Interview</h1>

              <p>
                {role} • {difficulty} difficulty
              </p>
            </div>

            <div className="timer">
              <span>◷</span>
              {formatTime()}
            </div>
          </div>

          <div className="progress-area">
            <div className="progress-info">
              <span>
                Question {questionIndex + 1} of {questions.length}
              </span>

              <span>{Math.round(progress)}%</span>
            </div>

            <div className="progress">
              <div style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          <div className="interviewer-card">
            <div className="interviewer-avatar">
              <div>✦</div>
            </div>

            <div className="interviewer-content">
              <div className="ai-speaking">
                <span>AI Interviewer</span>

                <div className="sound-wave">
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                  <i></i>
                </div>
              </div>

              <div className="question-type">
                {currentQuestion.type}
              </div>

              <h2>{currentQuestion.question}</h2>

              <p>
                Take your time. Give a clear answer with examples
                whenever possible.
              </p>
            </div>
          </div>

          <div className="answer-box">
            <div className="answer-top">
              <label>Your Answer</label>

              <span>{answer.length} characters</span>
            </div>

            <textarea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
            ></textarea>

            <div className="answer-bottom">
              <button
                className={`mic-button ${
                  isListening ? "listening" : ""
                }`}
                onClick={() => setIsListening(!isListening)}
              >
                🎙
                {isListening ? " Listening..." : " Voice Answer"}
              </button>

              <button className="next-button" onClick={nextQuestion}>
                {questionIndex === questions.length - 1
                  ? "Finish Interview"
                  : "Next Question →"}
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }


  return (
    <div className="app">
      <Background />

      <nav className="navbar">
        <div className="brand">
          <div className="brand-icon">✦</div>

          <div>
            <strong>InterviewAI</strong>
            <span>Interview Report</span>
          </div>
        </div>
      </nav>

      <main className="result">
        <div className="success-icon">✓</div>

        <div className="small-badge">INTERVIEW COMPLETE</div>

        <h1>
          Great job, <span>{name}</span>!
        </h1>

        <p>
          Your interview has been completed.
          Here is your AI performance summary.
        </p>

        <div className="score-card">
          <div className="score-ring">
            <div>
              <strong>88</strong>
              <span>/100</span>
            </div>
          </div>

          <div className="score-content">
            <span>OVERALL SCORE</span>

            <h2>Excellent performance</h2>

            <p>
              You demonstrated strong technical knowledge,
              communication and confidence throughout the interview.
            </p>
          </div>
        </div>

        <div className="result-grid">
          <ResultStat title="Technical Skills" score="91%" />
          <ResultStat title="Communication" score="87%" />
          <ResultStat title="Confidence" score="86%" />
        </div>

        <button className="start-button result-button" onClick={restart}>
          Practice Again →
        </button>
      </main>
    </div>
  );
}

function ResultStat({ title, score }) {
  return (
    <div className="result-stat">
      <span>{title}</span>
      <strong>{score}</strong>

      <div className="stat-line">
        <div style={{ width: score }}></div>
      </div>
    </div>
  );
}

function Background() {
  return (
    <div className="background">
      <div className="blob blob-one"></div>
      <div className="blob blob-two"></div>

      <div className="grid-bg"></div>

      <div className="particle p1"></div>
      <div className="particle p2"></div>
      <div className="particle p3"></div>
      <div className="particle p4"></div>
    </div>
  );
}

export default App;