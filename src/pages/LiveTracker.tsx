import React, { useEffect, useRef, useState } from "react";
import { FaEarthAmericas } from "react-icons/fa6";
import Navigation from "@/components/Navigation";

interface Satellite {
  name: string;
  color: string;
  radius: number;
  speed: number;
  distanceKm: number;
  imageSrc: string;
}

const satellites: Satellite[] = [
  { name: "Chandrayaan-3", color: "lime", radius: 100, speed: 1.3, distanceKm: 384400, imageSrc: "/src/assets/chandrayaan-3.svg" },
  { name: "ISS", color: "white", radius: 150, speed: 1, distanceKm: 408, imageSrc: "/src/assets/iss.svg" },
  { name: "Hubble", color: "yellow", radius: 200, speed: 0.7, distanceKm: 547, imageSrc: "/src/assets/hubble.svg" },
  { name: "GPS", color: "red", radius: 250, speed: 1, distanceKm: 20200, imageSrc: "/src/assets/gps.svg" },
];

const SpaceTracker: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [satelliteImages, setSatelliteImages] = useState<Map<string, HTMLImageElement>>(new Map());

  // Preload satellite images
  useEffect(() => {
    const loadImages = async () => {
      const imageMap = new Map<string, HTMLImageElement>();
      
      for (const satellite of satellites) {
        const img = new Image();
        img.src = satellite.imageSrc;
        
        await new Promise((resolve, reject) => {
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error(`Failed to load image: ${satellite.imageSrc}`));
        });
        
        imageMap.set(satellite.name, img);
      }
      
      setSatelliteImages(imageMap);
      setImagesLoaded(true);
    };

    loadImages().catch(console.error);
  }, []);

  useEffect(() => {
    if (!imagesLoaded) return;
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

      // Draw satellite image
      const img = satelliteImages.get(sat.name);
      if (img) {
        const imageSize = 24; // Size of the satellite image
        ctx.drawImage(img, x - imageSize/2, y - imageSize/2, imageSize, imageSize);
      } else {
        // Fallback to circle if image not loaded
        ctx.beginPath();
        ctx.arc(x, y, 7, 0, Math.PI * 2);
        ctx.fillStyle = sat.color;
        ctx.fill();
      }

      // Add a subtle glow effect around the satellite
      ctx.shadowColor = sat.color;
      ctx.shadowBlur = 10;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      ctx.fillStyle = "white";
      ctx.font = "12px Arial";
      ctx.textAlign = "left";
      ctx.shadowBlur = 0; // Reset shadow for text

      ctx.fillText(`${sat.name}`, x + 15, y - 8);
      ctx.fillText(`Alt: ${sat.distanceKm} km`, x + 15, y + 4);
      ctx.fillText(`Speed: ${sat.speed.toFixed(2)}x`, x + 15, y + 16);
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
  }, [imagesLoaded, satelliteImages]);

  return (
    <div className="min-h-screen bg-[#0b0c10] text-white text-center">
      <Navigation />
      <header className="bg-[#1f2833] p-6 shadow-lg mt-20">
        <h1 className="text-3xl font-bold text-[#66fcf1]">
          🚀  Live Space Tracker
        </h1>
      </header>

      <section className="py-12 border-b border-[#45a29e]">
        {!imagesLoaded ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#66fcf1] mb-4"></div>
            <p className="text-gray-300">Loading satellite models...</p>
          </div>
        ) : (
          <>
            <canvas
              ref={canvasRef}
              width={500}
              height={500}
              className="mx-auto mt-6 rounded-full border-2 border-[#45a29e] shadow-lg"
            />
            <p className="mt-4 text-gray-300">
              Simulated orbit of satellites around Earth 🌍
            </p>
          </>
        )}
      </section>
    </div>
  );
};

export default SpaceTracker;
