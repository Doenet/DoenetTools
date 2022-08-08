import React from "react";
// import "./ProgressBar.css"

//In progress
export default function ScaleDonut() {
    return (
      <div>
        <svg viewBox="0 0 500 500" className="align">
          <g className="donut-scale">
            <circle 
              id="donut" 
              fill="var(--donutBody)" 
              cx="50" 
              cy="50" 
              r="50" />
            <circle
              id="donut-topping"
              cx="50"
              cy="50"
              r="40"
              fill="var(--donutTopping)"
            />
            <circle 
              id="donut-hole" 
              cx="50" 
              cy="50" 
              r="18" 
              fill="var(--canvas)" 
            />
          </g>
        </svg>
      </div>
    );
  }
  