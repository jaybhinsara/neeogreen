"use client";

import { useState } from "react";
import { Loader } from "@/components/Loader";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { BrandStatement } from "@/components/BrandStatement";
import { EngineeringStatement } from "@/components/EngineeringStatement";
import { FocusAreas } from "@/components/FocusAreas";
import { GlobeSection } from "@/components/GlobeSection";
import { Process } from "@/components/Process";
import { BookCallBand } from "@/components/BookCallBand";
import { Footer } from "@/components/Footer";

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <Loader onDone={() => setLoaded(true)} />
      <Header />
      <main>
        <Hero ready={loaded} />
        <BrandStatement />
        <EngineeringStatement />
        <FocusAreas />
        <GlobeSection />
        <Process />
        <BookCallBand />
      </main>
      <Footer />
    </>
  );
}
