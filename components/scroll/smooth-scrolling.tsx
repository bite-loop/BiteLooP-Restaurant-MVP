"use client";

import { useEffect } from "react";
import gsap from "gsap";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function SmoothScrolling() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({
      smoothWheel: true,
      touchMultiplier: 1.5,
      lerp: 0.08,
    });

    // Sync ScrollTrigger with Lenis
    lenis.on("scroll", ScrollTrigger.update);

    const update = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);

    // Refresh ScrollTrigger
    ScrollTrigger.refresh();

    // Dynamic Tab Title
    const originalTitle = document.title;

    const handleVisibility = () => {
      document.title = document.hidden
        ? "👋Onboard You Restaurant"
        : originalTitle;
    };

    document.addEventListener(
      "visibilitychange",
      handleVisibility
    );

    return () => {
      lenis.destroy();

      gsap.ticker.remove(update);

      document.removeEventListener(
        "visibilitychange",
        handleVisibility
      );
    };
  }, []);

  return null;
}