import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  Tooltip,
} from "recharts";

const DashBoard = () => {
  const navigate = useNavigate();

  // Mock data
  const sentimentsData = [
    { date: "2024-03-01", sentiment: "positive" },
    { date: "2024-03-01", sentiment: "positive" },
    { date: "2024-03-01", sentiment: "negative" },
    { date: "2024-03-02", sentiment: "positive" },
    { date: "2024-03-02", sentiment: "negative" },
    { date: "2024-03-02", sentiment: "negative" },
  ];

  const formatDataForChart = () => {
    const groupedData = sentimentsData.reduce((acc, curr) => {
      const date = curr.date;
      if (acc[date]) {
        acc[date][curr.sentiment]++;
      } else {
        acc[date] = { positive: 0, negative: 0 };
        acc[date][curr.sentiment]++;
      }
      return acc;
    }, {});

    const dates = Object.keys(groupedData);
    const chartData = dates.map((date) => {
      return {
        date: date,
        positive: groupedData[date].positive,
        negative: groupedData[date].negative,
      };
    });

    return chartData;
  };

  const chartData = formatDataForChart();

  const handleGoBack = () => {
    navigate(-1); // Navigate back
  };

  return (
    <div>
      <button className="bg-white rounded-xl">
        <Link to="/audio-analysis" className="p-2 text-black font-bold ">
          Audio Analysis
        </Link>
      </button>
      <div className="">
        <h2
          style={{ color: "white" }}
          className="top-[10vh]mt-[10vh] text-center uppercase text-2xl font-bold underline-offset-0 mb-10 "
        >
          Sentiments per day
        </h2>
        <div style={{ width: 600, height: 400 }}>
          <BarChart width={600} height={400} data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="positive" stackId="a" fill="#00FF00" />
            <Bar dataKey="negative" stackId="a" fill="#FF0000" />
          </BarChart>
        </div>
      </div>
      <button
        className="bg-gray-300 w-25  p-2 rounded-xl"
        onClick={handleGoBack}
      >
        Go Back
      </button>
    </div>
  );
};

export default DashBoard;
