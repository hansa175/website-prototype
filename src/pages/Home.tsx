import PageLayout from "../components/layout/PageLayout";
import Hero from "../components/sections/Hero/Hero";
import About from "../components/sections/About/About";

export default function Home() {
  return (
    <PageLayout>
      <Hero />
      <About />
    </PageLayout>
  );
}
