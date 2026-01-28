
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface RiskGaugeProps {
  score: number;
}

const RiskGauge: React.FC<RiskGaugeProps> = ({ score }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = 240;
    const height = 140;
    const radius = Math.min(width, height);
    const innerRadius = radius * 0.7;

    const g = svg.append("g")
      .attr("transform", `translate(${width / 2}, ${height - 10})`);

    const arc = d3.arc<any>()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2)
      .endAngle(Math.PI / 2);

    // Background arc
    g.append("path")
      .datum({ endAngle: Math.PI / 2 })
      .style("fill", "#1e293b")
      .attr("d", arc);

    // Color gradient based on score
    const getColor = (s: number) => {
      if (s < 30) return "#10b981"; // Emerald
      if (s < 70) return "#f59e0b"; // Amber
      return "#ef4444"; // Red
    };

    const targetAngle = (score / 100) * Math.PI - (Math.PI / 2);

    const foregroundArc = d3.arc<any>()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .startAngle(-Math.PI / 2)
      .cornerRadius(10);

    g.append("path")
      .datum({ endAngle: -Math.PI / 2 })
      .style("fill", getColor(score))
      .attr("d", foregroundArc)
      .transition()
      .duration(1500)
      .ease(d3.easeCubicOut)
      .attrTween("d", function(d: any) {
        const interpolate = d3.interpolate(d.endAngle, targetAngle);
        return function(t) {
          d.endAngle = interpolate(t);
          return foregroundArc(d) || "";
        };
      });

    // Score Text
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "-0.2em")
      .attr("class", "text-4xl font-bold")
      .style("fill", "#f8fafc")
      .text("0")
      .transition()
      .duration(1500)
      .tween("text", function() {
        const i = d3.interpolateNumber(0, score);
        return function(t) {
          this.textContent = Math.round(i(t)).toString();
        };
      });

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "1.2em")
      .attr("class", "text-sm font-medium uppercase tracking-widest text-slate-400")
      .text("Risk Score");

  }, [score]);

  return (
    <div className="flex justify-center items-center">
      <svg ref={svgRef} width="240" height="150" />
    </div>
  );
};

export default RiskGauge;
