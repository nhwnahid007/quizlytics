import "./globals.css";

export const metadata = {
  title: "Quizlytics",
  description: "A quiz-based analytics platform to test your knowledge and track your performance.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
