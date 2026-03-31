import FootballIcon from './FootballIcon';

export default function App() {
  return (
    <div className="app">
      <header className="header">
        <FootballIcon size={48} />
        <div className="header-text">
          <h1 className="title">Footy Scores</h1>
          <span className="subtitle">Paris 2024 &amp; Beyond</span>
        </div>
      </header>

      <main className="main">
        <p className="placeholder">Wyniki meczów pojawią się tutaj...</p>
      </main>
    </div>
  );
}
