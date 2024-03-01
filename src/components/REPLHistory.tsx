import "../styles/main.css";

interface REPLHistoryProps {
  history: (string | JSX.Element)[];
}

export function REPLHistory({ history }: REPLHistoryProps) {
  return (
    <div className="repl-history">
      {history.map((entry, index) => {
        if (typeof entry === 'string') {
          const parts = entry.split('\n').map((part, partIndex) => (
            <div key={partIndex}>{part}</div>
          ));
          return <div key={index}>{parts}</div>;
        } else {
          return <div key={index}>{entry}</div>;
        }
      })}
    </div>
  );
}