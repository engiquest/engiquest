import type { Metadata } from 'next';
import './globals.css';
import './worlds.css';
export const metadata: Metadata = { title:'EngiQuest | Your next discovery', description:'Explore engineering through interactive labs, hands-on builds, and a 3D design studio for grades 6–12.', icons:{icon:'/icon.svg'} };
export default function Layout({children}:{children:React.ReactNode}){return <html lang="en" suppressHydrationWarning><body>{children}</body></html>}
