
import { Outlet } from "react-router-dom";

import Header from "../common/Header/Header";
import { Footer } from "./Footer";
import { ScrollToTop } from "../common/ScrollToTop";
import ChatBot from "../chat/ChatBot";

export const Layout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
       <ScrollToTop />
       <div className="z-[9999]">
               <ChatBot />
             </div>
      {/* Header */}
      <div className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200/50 shadow-sm">
        <Header />
      </div>
      
      {/* Main content*/}
      <main className="relative min-h-[calc(100vh-200px)]">
        {/* Background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-emerald-400/10 to-cyan-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>
        
        {/* Content wrapper với margin 2 bên */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
          <Outlet />
        </div>
        
      </main>
      
      {/* Footer */}
      <Footer />
      
    </div>
  );
};