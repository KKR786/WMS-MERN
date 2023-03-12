import React from "react";
import {Chart} from "react-chartjs-2";

function PieChart() {
  const data = {
    labels: ["Red", "Blue", "Yellow"],
    datasets: [
      {
        label: "My First Dataset",
        data: [300, 50, 100],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
        hoverOffset: 4,
      },
    ],
  };
  return (
    <div>
      <Chart type='line' data={data} />
    </div>
  );
}

export default PieChart;
