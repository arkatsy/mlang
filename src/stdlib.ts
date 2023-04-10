const StdLib = {
  print: (...val: string[]) => `console.log(${val});`,
  input: (prompt: string, variable?: string) =>
    variable ? `let ${variable} = input(${prompt});` : `input(${prompt});`,
};

export default StdLib;
