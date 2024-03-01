export interface REPLFunction {
  (args: Array<string>): string | JSX.Element | string[][];
}
