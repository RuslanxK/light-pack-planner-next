
import { Poppins } from "next/font/google";
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import { Paper, ThemeProvider} from "@mui/material";
import { lightTheme, darkTheme } from "../components/custom/theme.jsx";
import Providers from '../components/Providers'
import '../style.css'
import Nav from "../components/Nav.jsx";
import { getServerSession } from 'next-auth';
import {options} from './api/auth/[...nextauth]/options'

const poppins = Poppins({
  weight: ['200', '400', '500', '600', '700', '800'],
  subsets: ['latin'],
  display: "swap"
})

export const metadata = {
  title: "Light Pack - Planner",
  description: "Organize your backpack with ease",
};



export default async function RootLayout({ children }) {


  const session = await getServerSession(options)



  const getUser = async (session) => {
    try {
      const res = await fetch(`${process.env.API_URL}/api/user/${session?.user?.id}`, { cache: 'no-store' });
      if (!res.ok) {
        throw new Error("Failed to fetch user");
      }
      return res.json();
    } catch (error) {
      console.error("Error fetching user:", error);
      return [];
    }
  };




  const getBags = async (session) => {
    try {
      const res = await fetch(`${process.env.API_URL}/bags/${session?.user?.id}/creator`, { cache: 'no-store' });
      if (!res.ok) {
        throw new Error("Failed to fetch bags");
      }
      return res.json();
    } catch (error) {
      console.error("Error fetching bags:", error);
      return [];
    }
  };


   const bags = session ? await getBags(session) : [];
   const user = session ? await getUser(session) : { mode: "light" };

   
   


  return (
    <html lang="en">
      <head>
      <link rel="icon" type="image/x-icon" href="/icon.ico"></link>
      <link rel="preconnect" href="https://fonts.googleapis.com"></link>
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"></link>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900&display=swap" rel="stylesheet"></link>
      </head>
      <Providers>
      <ThemeProvider theme={user.mode === "light" ? lightTheme : darkTheme}>
         <body className={poppins.className} suppressHydrationWarning={true}>
          <AppRouterCacheProvider>
            <Paper sx={{borderRadius: "0px"}}>
            <div className="main-container">
            <Nav session={session} bags={bags} user={user} />
           {children}
           </div>
           </Paper>
          </AppRouterCacheProvider>
          </body>
          </ThemeProvider>
          </Providers>

         
    </html>
  );
}
