import React, { useEffect, useRef } from "react";
import { FaEarthAmericas } from "react-icons/fa6";
import Navigation from "@/components/Navigation";

interface Satellite {
  name: string;
  color: string;
  radius: number;
  speed: number;
  distanceKm: number;
}

const satellites: Satellite[] = [
  { name: "Chandrayaan-3", color: "lime", radius: 100, speed: 1.3, distanceKm: 384400 },
  { name: "ISS", color: "white", radius: 150, speed: 1, distanceKm: 408 },
  { name: "Hubble", color: "yellow", radius: 200, speed: 0.7, distanceKm: 547 },
  { name: "GPS", color: "red", radius: 250, speed: 1.7, distanceKm: 20200 },
];

const SpaceTracker: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let angle = 0;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const stars = Array.from({ length: 200 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5,
    }));

    const drawStars = () => {
      ctx.fillStyle = "white";
      stars.forEach((star) => {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.r, 0, Math.PI * 2);
        ctx.fill();
      });
    };

    const drawEarthIcon = () => {
      // We'll just place text "🌍" (or Earth Icon fallback)
      ctx.font = "40px Arial";
      ctx.textAlign = "center";
      ctx.fillText("🌍", centerX, centerY + 15);

      ctx.fillStyle = "white";
      ctx.font = "bold 14px Arial";
      ctx.fillText("Earth", centerX, centerY + 50);
    };

    const drawOrbitCircle = (radius: number) => {
      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.strokeStyle = "white";
      ctx.stroke();
      ctx.setLineDash([]);
    };

    const drawSatellite = (sat: Satellite, angle: number) => {
      const x = centerX + sat.radius * Math.cos(angle * sat.speed);
      const y = centerY + sat.radius * Math.sin(angle * sat.speed);

      ctx.beginPath();
      ctx.arc(x, y, 7, 0, Math.PI * 2);
      ctx.fillStyle = sat.color;
      ctx.fill();

      ctx.fillStyle = "white";
      ctx.font = "12px Arial";
      ctx.textAlign = "left";

      ctx.fillText(`${sat.name}`, x + 12, y - 5);
      ctx.fillText(`Alt: ${sat.distanceKm} km`, x + 12, y + 7);
      ctx.fillText(`Speed: ${sat.speed.toFixed(2)}x`, x + 12, y + 19);
    };

    const drawOrbit = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawStars();

      drawEarthIcon();

      satellites.forEach((sat) => drawOrbitCircle(sat.radius));
      satellites.forEach((sat) => drawSatellite(sat, angle));

      angle += 0.02;
      requestAnimationFrame(drawOrbit);
    };

    drawOrbit();
  }, []);

  return (
    <div className="min-h-screen bg-[#0b0c10] text-white text-center">
      <Navigation />
      <header className="bg-[#1f2833] p-6 shadow-lg mt-20">
        <h1 className="text-3xl font-bold text-[#66fcf1]">
          🚀  Live Space Tracker
        </h1>
      </header>

      <section className="py-12 border-b border-[#45a29e]">
        
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className="mx-auto mt-6 rounded-full border-2 border-[#45a29e] shadow-lg"
        />
        <p className="mt-4 text-gray-300">
          Simulated orbit of satellites around Earth 🌍
        </p>
      </section>
    </div>
  );
};

export default SpaceTracker;
