import Hero from "@/components/Hero";
import Intro from "@/components/Intro";
import Marquee from "@/components/Marquee";
import Work from "@/components/Work";
import About from "@/components/About";
import Skills from "@/components/Skills";
import E5Synthesis from "@/components/E5Synthesis";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Hero />
      <Intro />
      <Marquee items={["Développement web", "Bases de données", "BTS SIO SLAM", "Épreuve E5"]} />
      <Work />
      <About />
      <Skills />
      <E5Synthesis />
      <Contact />
      <Footer />
    </>
  );
}
