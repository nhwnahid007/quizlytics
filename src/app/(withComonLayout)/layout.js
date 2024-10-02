import Navbar from "@/components/Shared/Navbar";
import "../globals.css";
import Footer from "@/components/Shared/Footer";
import AuthProviders from "@/providers/AuthProviders";

export default function RootLayout({ children }) {
    return (
        <div>
            <AuthProviders>
                <Navbar />
                <div>
                    {children}
                </div>
                <Footer />
            </AuthProviders>
        </div>
    )
}