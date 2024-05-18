import "bootstrap/dist/CSS/bootstrap.min.css";
import "react-csv-importer/dist/index.css";
import "./styles.css";

export const metadata = {
  title: "Multisend",
  description: "Send many payments in one transaction",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true"/>
        <link href="https://fonts.googleapis.com/css2?family=Jersey+10&display=swap" rel="stylesheet"/>
        <body>{children}</body>
      </head>
    </html>
  );
}
