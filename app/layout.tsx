import './globals.css'
import Header from '../components/Header'
export const metadata={title:'EasyCar',description:'P2P car marketplace'}
export default function RootLayout({children}:{children:React.ReactNode}){
  return(<html lang='en'><body><Header/>{children}</body></html>)
}
