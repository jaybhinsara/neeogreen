"use client";

import { useState } from "react";
import { Loader } from "@/components/Loader";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { TrustedBy } from "@/components/TrustedBy";
import { Manifesto } from "@/components/Manifesto";
import { Services } from "@/components/Services";
import { BrandInAction } from "@/components/BrandInAction";
import { Statement } from "@/components/Statement";
import { Process } from "@/components/Process";
import { WhyEco } from "@/components/WhyEco";
import { CtaBand } from "@/components/CtaBand";
import { Footer } from "@/components/Footer";

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      <Loader onDone={() => setLoaded(true)} />
      <Header />
      <main>
        <Hero ready={loaded} />
        <TrustedBy />
        <Manifesto />
        <Services />
        <BrandInAction />
        <Statement />
        <Process />
        <WhyEco />
        <CtaBand />
      </main>
      <Footer />
    </>
  );
}
