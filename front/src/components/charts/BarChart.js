import React from 'react';
import { VictoryBar, VictoryChart, VictoryAxis } from 'victory';

function BarChart() {
  const data = [
    { x: 1, y: 10 },
    { x: 2, y: 5 },
    { x: 3, y: 15 },
    { x: 4, y: 7 },
    { x: 5, y: 12 },
  ];

  return (
    <VictoryChart
      padding={{ top: 20, bottom: 80, left: 50, right: 20 }}
      domainPadding={{ x: 20 }}
    >
      <VictoryAxis
        tickValues={data.map((d) => d.x)}
        tickFormat={data.map((d) => d.x)}
      />
      <VictoryAxis dependentAxis />
      <VictoryBar
        data={data}
        x="x"
        y="y"
      />
    </VictoryChart>
  );
}

export default BarChart;
