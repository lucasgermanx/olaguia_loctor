import localFont from "next/font/local"

// Volkhov Font
export const volkhov = localFont({
  src: [
    {
      path: "../fonts/Volkhov/Volkhov-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/Volkhov/Volkhov-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/Volkhov/Volkhov-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../fonts/Volkhov/Volkhov-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-volkhov",
  display: "swap",
})

// Open Sans Font
export const openSans = localFont({
  src: [
    {
      path: "../fonts/Open_Sans/static/OpenSans-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/Open_Sans/static/OpenSans-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/Open_Sans/static/OpenSans-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../fonts/Open_Sans/static/OpenSans-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../fonts/Open_Sans/static/OpenSans-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/Open_Sans/static/OpenSans-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/Open_Sans/static/OpenSans-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/Open_Sans/static/OpenSans-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
  ],
  variable: "--font-open-sans",
  display: "swap",
})

// Lato Font
export const lato = localFont({
  src: [
    {
      path: "../fonts/Lato/Lato-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/Lato/Lato-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/Lato/Lato-Italic.ttf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../fonts/Lato/Lato-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },
    {
      path: "../fonts/Lato/Lato-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../fonts/Lato/Lato-Thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../fonts/Lato/Lato-Black.ttf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-lato",
  display: "swap",
})

