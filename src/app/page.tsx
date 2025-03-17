"use client";

import { useState, useEffect } from "react";
import NodeGraph from "../components/NodeGraph";

export default function Home() {
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    // Set initial dimensions
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    // Handle resize
    function handleResize() {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nodes = [
    {
      id: "Adam",
      text: "Building an autonomous robot to deliver snacks. I also produce music!",
    },
    {
      id: "Anupam",
      text: "",
    },
    {
      id: "Izumi",
      text: "Building a multi-language news aggregator",
    },
    {
      id: "Sam",
      text: "Building an indie RPG video game with 9 others around the world. Sometimes I work on CAD…sometimes",
    },
    {
      id: "Yujin",
      text: "Building a witch themed potion brewing game",
    },
  ];

  const links = [
    { source: "Adam", target: "Sam" },
    { source: "Sam", target: "Yujin" },
    { source: "Izumi", target: "Anupam" },
    { source: "Adam", target: "Izumi" },
    { source: "Yujin", target: "Anupam" },
  ];

  return (
    <div className="w-screen h-screen bg-gray-900">
      <NodeGraph
        nodes={nodes}
        links={links}
        width={dimensions.width}
        height={dimensions.height}
      />
    </div>
  );
}
