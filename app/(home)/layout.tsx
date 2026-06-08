import Footer from "@/components/pages/shared/home/Footer";
import Navbar from "@/components/pages/shared/home/Navbar";

const layout = async ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      <main className="min-h-screen ">{children}</main>
      <Footer />
    </div>
  );
};

export default layout;
