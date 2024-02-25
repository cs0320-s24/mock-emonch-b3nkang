import "../styles/main.css";
import { Dispatch, SetStateAction, useState } from "react";
import { ControlledInput } from "./ControlledInput";

interface REPLInputProps {
  history: string[];
  setHistory: Dispatch<SetStateAction<string[]>>;
  mode: string;
  switchMode: () => void;
}

export function REPLInput({ history, setHistory, mode, switchMode }: REPLInputProps) {
  const [commandString, setCommandString] = useState<string>("");
  const [count, setCount] = useState<number>(0);

  function handleSubmit(commandString: string) {
    const trimmedCommand = commandString.trim().toLowerCase();
    setCount(count + 1); 

    if (trimmedCommand === "mode") {
      switchMode();
      const modeSwitchMessage = `Switched to ${mode === 'brief' ? 'verbose' : 'brief'} mode`;
      setHistory([...history, `${modeSwitchMessage}`]);
    } else {
      const output = mode === 'verbose' 
            ? `Command: ${trimmedCommand}\nOutput: ${trimmedCommand}` 
            : trimmedCommand;
      setHistory([...history, output]);
    }
    setCommandString(""); // Clear the input field after submission
  }

  return (
    <div className="repl-input">
      <fieldset>
        <legend>Enter a command:</legend>
        <ControlledInput
          value={commandString}
          setValue={setCommandString}
          ariaLabel={"Command input"}
        />
      </fieldset>
      <button onClick={() => handleSubmit(commandString)}>
        Submit Command
      </button>
      <div>
        Commands submitted: {count}
      </div>
    </div>
  );
}
