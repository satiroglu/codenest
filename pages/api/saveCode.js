import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Kodun benzersiz 10 haneli kodunu üretme
function generateUniqueCode() {
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

// API Handler
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { code, expiry } = req.body;

    // Validation
    if (!code || !expiry) {
      return res.status(400).json({ message: 'Code and expiry are required.' });
    }

    // Generate Unique Code
    const uniqueCode = generateUniqueCode();

    try {
      // Save Code to Database
      const savedCode = await prisma.codeSnippet.create({
        data: {
          code: code,
          uniqueCode: uniqueCode, // Save the generated unique code
          expiry: expiry,
        },
      });

      // Expiry time logic
      setTimeout(async () => {
        await prisma.codeSnippet.delete({ where: { id: savedCode.id } });
        console.log(`Kod ID ${savedCode.id} başarıyla silindi.`);
      }, getExpiryTimeInMilliseconds(expiry));

      // URL oluşturma ve kaydetme
      const codeUrl = `${process.env.FRONTEND_URL}/code/${savedCode.uniqueCode}`;
      console.log('Oluşturulan URL:', codeUrl);  // URL'nin doğru olduğuna emin olmak için log ekleyin

      return res.status(201).json({ url: codeUrl });
    } catch (error) {
      console.error('Error saving code: ', error);
      return res.status(500).json({ message: 'Error saving code', error: error.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}

// Get Expiry Time in milliseconds
function getExpiryTimeInMilliseconds(expiry) {
  const timeMap = {
    '1hour': 1 * 60 * 60 * 1000,
    '3hour': 3 * 60 * 60 * 1000,
    '6hour': 6 * 60 * 60 * 1000,
    '12hour': 12 * 60 * 60 * 1000,
    '24hour': 24 * 60 * 60 * 1000,
    '1day': 24 * 60 * 60 * 1000,
    '3day': 3 * 24 * 60 * 60 * 1000,
    '7day': 7 * 24 * 60 * 60 * 1000,
  };

  return timeMap[expiry] || 24 * 60 * 60 * 1000; // Default to 1 day if no valid expiry
}