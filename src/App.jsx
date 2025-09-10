import { Outlet } from 'react-router-dom'
import Header from './components/haeder/Header'
import Footer from './components/footer/Footer'
import { useEffect } from 'react';
import { initTikTokPixel } from './utility/tiktokPixel';
import getData from './constans/getData';

function App() {
  const { tiktokP } = getData
  useEffect(() => {
    if (tiktokP) {
      initTikTokPixel(tiktokP); // Replace with your real Pixel ID
    }
  }, []);
  return (
    <div dir='rtl'>
      <Header />
      <Outlet />
      <Footer />
    </div>
  )
}

export default App
