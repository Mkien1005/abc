"use client";

import { useEffect } from "react";
import { Providers } from "@/store/provider";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "@/styles/style.scss";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Preloader from "@/components/preloader/Preloader";
import ChatBotComponent from "@/components/widget/ChatbotComponent";
import { ToastContainer } from "react-toastify";

const queryClient = new QueryClient();

const RootLayout = ({ children }) => {
  useEffect(() => {
    window.bootstrap = require("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Albert+Sans:wght@100..900&family=Roboto:wght@100..900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
        <link rel="stylesheet" href="/css/font-awesome.css" />
      </head>
      <body suppressHydrationWarning={true}>
        <Preloader />
        <QueryClientProvider client={queryClient}>
          <Providers>{children}</Providers>
        </QueryClientProvider>
        <ChatBotComponent />
        <ToastContainer />
      </body>
    </html>
  );
};

export default RootLayout;
