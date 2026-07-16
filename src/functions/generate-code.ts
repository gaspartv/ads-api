export function generateCode() {
  const random = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += random.charAt(Math.floor(Math.random() * random.length));
  }
  return code;
}
