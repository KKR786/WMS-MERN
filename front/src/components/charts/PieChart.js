import React from 'react';
import { VictoryPie } from 'victory';


function PieChart(props) {
  const indicators = () => {
    return props.data.map((entry, index) => (
      <div key={index} className="color-indicator">
        <span
          className="color-indicator__circle"
          style={{ backgroundColor: entry.color }}
        ></span>
        <span className="color-indicator__label">{entry.x}</span>
      </div>
    ));
  };


  console.log(props.data)
  return (
    <>
    <h2>Total Hours</h2>
    <div className="d-flex justify-content-between align-items-center">
      <h4 style={{color: "#3c536a"}}>{props.month}</h4>
      <div className="color-indicators">{indicators()}</div>
      </div>

      <VictoryPie data={props.data}
        colorScale={props.data.map((entry) => entry.color)}
        innerRadius={0}
        labels={({ datum }) => `${datum.y}`}
        labelRadius={({ innerRadius }) => innerRadius + 60}
        style={{
          labels: { fill: 'white', fontSize: 16, fontWeight: 'bold' },
        }}
      />
    </>
  );
}

export default PieChart;
