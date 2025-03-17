"use client";

import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface Node {
  id: string;
  text: string;
  x?: number;
  y?: number;
}

interface Link {
  source: string;
  target: string;
}

interface NodeGraphProps {
  nodes: Node[];
  links: Link[];
  width?: number;
  height?: number;
}

const NodeGraph: React.FC<NodeGraphProps> = ({
  nodes,
  links,
  width = 800,
  height = 600,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredNode, setHoveredNode] = useState<Node | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const simulation = d3
      .forceSimulation(nodes as any)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance(200)
      )
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(60));

    const g = svg.append("g");

    const zoom = d3
      .zoom()
      .scaleExtent([0.5, 2])
      .on("zoom", (event) => {
        g.attr("transform", event.transform);
      });

    svg.call(zoom as any);

    const link = g
      .selectAll(".link")
      .data(links)
      .join("line")
      .attr("class", "link")
      .style("stroke", "#4A5568")
      .style("stroke-opacity", 0.6)
      .style("stroke-width", 3);

    const node = g
      .selectAll(".node")
      .data(nodes)
      .join("g")
      .attr("class", "node")
      .call(
        d3
          .drag<any, any>()
          .on("start", dragstarted)
          .on("drag", dragged)
          .on("end", dragended)
      );

    const gradient = svg
      .append("defs")
      .selectAll("radialGradient")
      .data(nodes)
      .join("radialGradient")
      .attr("id", (d, i) => `gradient-${i}`)
      .attr("gradientUnits", "userSpaceOnUse");

    gradient.append("stop").attr("offset", "0%").attr("stop-color", "#4C51BF");

    gradient
      .append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#2D3748");

    node
      .append("circle")
      .attr("r", 40)
      .style("fill", (d, i) => `url(#gradient-${i})`)
      .style("stroke", "#E2E8F0")
      .style("stroke-width", 2)
      .on("mouseover", (event: any, d: any) => {
        setHoveredNode(d);
        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr("r", 55)
          .style("stroke", "#90CDF4");
      })
      .on("mouseout", (event: any) => {
        setHoveredNode(null);
        d3.select(event.currentTarget)
          .transition()
          .duration(200)
          .attr("r", 40)
          .style("stroke", "#E2E8F0");
      });

    node
      .append("text")
      .text((d: Node) => d.id)
      .attr("text-anchor", "middle")
      .attr("dy", ".35em")
      .style("font-size", "14px")
      .style("fill", "#E2E8F0")
      .style("pointer-events", "none");

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => {
      simulation.stop();
    };
  }, [nodes, links, width, height]);

  return (
    <div className="relative w-full h-full">
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className="bg-gray-900"
      ></svg>
      {hoveredNode && (
        <div
          className="absolute bg-gray-800 text-gray-100 p-6 rounded-xl shadow-xl border border-gray-700"
          style={{
            left: (hoveredNode as any).x + 60,
            top: (hoveredNode as any).y - 30,
            maxWidth: "300px",
            zIndex: 10,
          }}
        >
          <h3 className="font-bold mb-2">{hoveredNode.id}</h3>
          <p className="text-gray-300">{hoveredNode.text}</p>
        </div>
      )}
    </div>
  );
};

export default NodeGraph;
