import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import { Card, Statistic } from "antd";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
      text: "Chart.js Line Chart",
    },
  },
};

const labels = ["January", "February", "March", "April", "May", "June", "July"];

function CustomerChart({ data, options, title }) {
  const checkIdleIncrease = () => {
    if (data.datasets[0].data.length >= 2) {
      return {
        data:
          (data.datasets[0].data[data.datasets[0].data.length - 1] /
            data.datasets[0].data[data.datasets[0].data.length - 2]) *
          100,
        isIncrease:
          (data.datasets[0].data[data.datasets[0].data.length - 1] /
            data.datasets[0].data[data.datasets[0].data.length - 2]) *
            100 >
          100,
      };
    } else {
      return {
        data: 0,
        isIncrease: true,
      };
    }
  };
  return (
    <div>
      <h1>{title}</h1>
      <div>
        <div style={{ display: "flex", gap: 20 }}>
          <Card style={{ flex: "0 0 200px" }}>
            <Statistic
              title="Total"
              value={data.datasets[0].data.reduce((curr, next, index, arr) => {
                return curr + next;
              }, 0)}
              valueStyle={{ color: "#3f8600" }}
            />
          </Card>
          <Card style={{ flex: "0 0 200px" }}>
            <Statistic
              title="Idle"
              value={checkIdleIncrease().data}
              precision={2}
              valueStyle={{
                color: checkIdleIncrease().isIncrease ? "#3f8600" : "#cf1322",
              }}
              prefix={
                checkIdleIncrease().isIncrease ? (
                  <ArrowUpOutlined />
                ) : (
                  <ArrowDownOutlined />
                )
              }
              suffix="%"
            />
          </Card>
        </div>
        <Bar
          id={`chartBox${title}`}
          key={`chartBox${title}`}
          className="chartBox"
          options={{
            ...options,
            maintainAspectRatio: false,
            scales: { y: { beginAtZero: true } },
          }}
          data={data}
        />
      </div>
    </div>
  );
}

export default CustomerChart;
