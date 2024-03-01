import "../styles/main.css";

interface REPLHistoryProps {
  history: (string | JSX.Element)[];
}

/**
 * a component for displaying the history of all commands submitted into the REPL
 *
 * @param param0 a list of the history of commands, either strings or JSX elements
 * @returns the REPL history component itself
 */
export function REPLHistory({ history }: REPLHistoryProps) {
  return (
    <div className="repl-history">
      {history.map((entry, index) => {
        if (typeof entry === "string") {
          const parts = entry
            .split("\n")
            .map((part, partIndex) => <div key={partIndex}>{part}</div>);
          return <div key={index}>{parts}</div>;
        } else {
          return <div key={index}>{entry}</div>;
        }
      })}
    </div>
  );
}
