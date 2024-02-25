import "../styles/main.css";

interface REPLHistoryProps {
  history: string[];
}
export function REPLHistory({ history }: REPLHistoryProps) {
  return (
    <div className="repl-history">
      {history.map((entry, index) => {
      
        const parts = entry.split('\n').map((part, partIndex) => (
          <div key={partIndex}>{part}</div>
        ));
        return <div key={index}>{parts}</div>;
      })}
    </div>
  );
}