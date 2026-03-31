import { useOlympicsData } from '../hooks/useOlympicsData';
import FootballIcon from './FootballIcon';
import MatchList from './MatchList';

export default function App() {
  const { matches, events, loading, error } = useOlympicsData();

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
        {loading && <p className="state-msg">Ładowanie meczów...</p>}
        {error   && <p className="state-msg state-msg--error">{error}</p>}
        {!loading && !error && (
          <MatchList matches={matches} events={events} />
        )}
      </main>
    </div>
  );
}
