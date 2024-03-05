// export interface REPLFunction {
//   (args: Array<string>): string | JSX.Element | string[][];
// }

export interface REPLFunction {
  (args: Array<string>, context: any): string | JSX.Element | string[][];
}
