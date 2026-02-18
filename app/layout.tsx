import './globals.css';
import Navbar from '../components/Navbar'; // RELATIVE PATH FIX

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black">
        <Navbar />
        {children}
      </body>
    </html>
  );
}