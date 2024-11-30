import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function getServerSideProps({ params }) {
  const { id } = params;

  try {
    // Veritabanından kodu çekiyoruz
    const codeSnippet = await prisma.codeSnippet.findUnique({
      where: {
        id: id, // Kodun ID'sine göre arama yapıyoruz
      },
    });

    if (!codeSnippet) {
      return {
        notFound: true, // Eğer kod bulunamazsa 404 döner
      };
    }

    return {
      props: {
        code: codeSnippet.code, // Kod verisini props olarak gönderiyoruz
      },
    };
  } catch (error) {
    return {
      notFound: true, // Hata durumunda da 404 dönecek
    };
  }
}

export default function CodePage({ code }) {
  if (!code) {
    return <div>Code not found!</div>; // Eğer kod yoksa hata mesajı gösterir
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4">
      <h1 className="text-4xl text-slate-900 font-semibold mb-4">Your Shared Code</h1>
      <pre className="bg-slate-900 text-white p-4 rounded-md w-full max-w-4xl overflow-auto">
        {code} {/* Burada yapıştırılan kodu gösteriyoruz */}
      </pre>
    </div>
  );
}