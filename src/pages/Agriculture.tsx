import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface SensorData {
  temperature: number;
  humidity: number;
  light: number;
  soilMoisture: number;
  growthRate: number;
}

const SpaceAgriculture: React.FC = () => {
  const [data, setData] = useState<SensorData>({
    temperature: 22,
    humidity: 55,
    light: 400,
    soilMoisture: 45,
    growthRate: 1.0,
  });
  const [mlPrediction, setMlPrediction] = useState<number>(0);

  // Interactive user controls
  const [tempControl, setTempControl] = useState(22);
  const [humControl, setHumControl] = useState(55);
  const [lightControl, setLightControl] = useState(400);
  const [soilControl, setSoilControl] = useState(45);

  useEffect(() => {
    const interval = setInterval(() => {
      // simulate small fluctuations around user controls
      const newData: SensorData = {
        temperature: +(tempControl + (Math.random() - 0.5) * 2).toFixed(1),
        humidity: +(humControl + (Math.random() - 0.5) * 3).toFixed(1),
        light: +(lightControl + (Math.random() - 0.5) * 50).toFixed(0),
        soilMoisture: +(soilControl + (Math.random() - 0.5) * 4).toFixed(1),
        growthRate: +(0.5 + Math.random() * 1.5).toFixed(2),
      };
      setData(newData);

      // ML prediction formula
      const predictedGrowth =
        newData.temperature * 0.02 +
        newData.humidity * 0.01 +
        newData.light * 0.0005 -
        newData.soilMoisture * 0.005 +
        Math.random() * 0.1;
      setMlPrediction(+predictedGrowth.toFixed(2));
    }, 2000);

    return () => clearInterval(interval);
  }, [tempControl, humControl, lightControl, soilControl]);

  return (
    <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 min-h-screen p-6 text-white flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">🚀 AI Space Agriculture</h1>
      <p className="mb-6 text-gray-300 text-center max-w-xl">
        Smart system monitoring plant growth in microgravity using sensors and
        AI predictions. Adjust environment to see effects on plant growth.
      </p>

      {/* Sensor Dashboard */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full max-w-5xl mb-8">
        {Object.entries(data).map(([key, value]) => (
          <motion.div
            key={key}
            className="bg-gray-800 p-4 rounded-lg flex flex-col items-center shadow-md"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h4 className="font-semibold capitalize">{key}</h4>
            <p className="text-lg font-mono">{value}</p>
            <div className="w-full h-2 bg-gray-700 rounded mt-2">
              <div
                className="h-2 bg-green-400 rounded"
                style={{
                  width:
                    key === "light"
                      ? `${Math.min(Number(value) / 5, 100)}%`
                      : `${Math.min(Number(value) * 2, 100)}%`,
                }}
              ></div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ML Prediction */}
      <div className="w-full max-w-3xl mb-8">
        <h2 className="text-xl font-semibold mb-2">📈 Predicted Growth Rate</h2>
        <div className="w-full bg-gray-700 rounded h-6 relative">
          <motion.div
            className="h-6 bg-gradient-to-r from-yellow-400 to-red-500 rounded text-white text-xs flex items-center justify-end pr-2 font-mono"
            initial={{ width: 0 }}
            animate={{ width: `${mlPrediction * 50}%` }}
            transition={{ duration: 0.5 }}
          >
            {mlPrediction} cm/day
          </motion.div>
        </div>
      </div>

      {/* Interactive Controls */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 w-full max-w-5xl">
        <div>
          <label className="block mb-1">Temperature (°C)</label>
          <input
            type="range"
            min="18"
            max="30"
            value={tempControl}
            onChange={(e) => setTempControl(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block mb-1">Humidity (%)</label>
          <input
            type="range"
            min="40"
            max="80"
            value={humControl}
            onChange={(e) => setHumControl(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block mb-1">Light (Lux)</label>
          <input
            type="range"
            min="200"
            max="800"
            value={lightControl}
            onChange={(e) => setLightControl(Number(e.target.value))}
            className="w-full"
          />
        </div>
        <div>
          <label className="block mb-1">Soil Moisture (%)</label>
          <input
            type="range"
            min="30"
            max="70"
            value={soilControl}
            onChange={(e) => setSoilControl(Number(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Plant Visual */}
      <motion.div
        className="text-7xl animate-bounce"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
      >
        🌱
      </motion.div>
    </div>
  );
};

export default SpaceAgriculture;
