import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const ProbabilityTreeCanvas = ({ data, onReset }) => {
  const d3Container = useRef(null);
  const STATES = ["Student", "Junior Developer", "ML Engineer", "Procrastinator", "Stuck"];

  useEffect(() => {
    if (data && data.final_distribution && d3Container.current) {
      const svg = d3.select(d3Container.current);
      svg.selectAll("*").remove(); // Wipe out placeholders

      const width = d3Container.current.clientWidth || 800;
      const height = 400;

      const chartData = Object.entries(data.final_distribution).map(([state, prob]) => ({
        state,
        prob: prob * 100
      }));

      // Scales
      const xScale = d3.scaleBand()
        .domain(STATES)
        .range([50, width - 50])
        .padding(0.4);

      const yScale = d3.scaleLinear()
        .domain([0, 100])
        .range([height - 50, 50]);

      // Render Dynamic Distribution Bars
      svg.selectAll(".bar")
        .data(chartData)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => xScale(d.state))
        .attr("y", d => yScale(d.prob))
        .attr("width", xScale.bandwidth())
        .attr("height", d => (height - 50) - yScale(d.prob))
        .attr("fill", "#6366f1")
        .attr("rx", 6);

      // Value Labels
      svg.selectAll(".label")
        .data(chartData)
        .enter()
        .append("text")
        .attr("x", d => xScale(d.state) + xScale.bandwidth() / 2)
        .attr("y", d => yScale(d.prob) - 10)
        .attr("text-anchor", "middle")
        .attr("fill", "white")
        .attr("font-size", "14px")
        .text(d => `${d.prob.toFixed(1)}%`);

      // X Axis Labels
      svg.selectAll(".axis-text")
        .data(STATES)
        .enter()
        .append("text")
        .attr("x", d => xScale(d) + xScale.bandwidth() / 2)
        .attr("y", height - 20)
        .attr("text-anchor", "middle")
        .attr("fill", "#9ca3af")
        .attr("font-size", "12px")
        .text(d => d);
    }
  }, [data]);

  return (
    <div className="flex flex-col items-center justify-center p-8 w-full max-w-6xl mx-auto">
      <div className="bg-slate-900/50 border border-white/10 rounded-2xl w-full p-8 flex flex-col items-center backdrop-blur-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-white">
          Simulation Results
        </h2>
        <div className="w-full h-[450px] border border-white/10 rounded-xl bg-slate-950 flex items-center justify-center overflow-hidden">
          <svg className="w-full h-full" ref={d3Container} />
        </div>

        {data && (
          <div className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-4 w-full">
            <div className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
              <p className="text-sm text-gray-400">Total Runs</p>
              <p className="text-2xl font-bold text-white">{data.total_simulations || 0}</p>
            </div>
            {data.final_distribution && Object.entries(data.final_distribution).map(([state, prob]) => (
              <div key={state} className="bg-white/5 border border-white/10 rounded-xl p-4 text-center">
                <p className="text-sm text-gray-400">{state}</p>
                <p className="text-2xl font-bold text-indigo-400">{(prob * 100).toFixed(1)}%</p>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={onReset}
          className="mt-8 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-colors font-medium"
        >
          Start New Simulation
        </button>
      </div>
    </div>
  );
};

export default ProbabilityTreeCanvas;