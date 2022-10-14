export function signMessage(lib: any, message: string) {
  return lib.getSigner().signMessage(message)
}
