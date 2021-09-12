export function sum(...args: number[]) {
  return args.reduce((total, arg) => total + arg, 0);
}
