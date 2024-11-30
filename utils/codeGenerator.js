export function generateUniqueCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    let prevChar = '';
  
    for (let i = 0; i < 10; i++) {
      let char;
  
      do {
        char = chars.charAt(Math.floor(Math.random() * chars.length));
      } while (char === prevChar || (/\d/.test(char) && prevChar && /\d/.test(prevChar)));
  
      code += char;
      prevChar = char;
    }
  
    return code;
  }