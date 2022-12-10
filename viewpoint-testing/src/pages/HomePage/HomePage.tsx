import CustomerChart from "@components/CustomChart/CustomChart";
import type { Domain, User } from "@models/model";
import { orderAPI } from "@services/orderAPI";
import { productPhucAPI } from "@services/productPhucAPI";
import { userApi } from "@services/userAPI";
import { showErrorNotification } from "@utils/notificationUtils";
import { Typography } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Wrapper } from "./HomePage.Styled";
const { Paragraph } = Typography;

export type HistoryAccessItem = {
  name: string;
  type: string;
  lastOpenedTime: string;
  user: User;
  domain: Domain;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  isDeleted: boolean;
  key: string;
  icon: any;
  domainName: string;
  userName: string;
  commonId: string;
};

const HomePage = () => {
  const { t } = useTranslation(["common", "validate"]);
  const [dataChartProduct, setDataChartProduct] = useState(null);
  const [dataChartOrder, setDataChartOrder] = useState(null);
  const [dataChartUser, setDataChartUser] = useState(null);

  const handleCallAPI = async () => {
    try {
      const responseChart = await productPhucAPI.getChartInfo();
      const responseChartUser = await userApi.getChartInfo();
      const responseChartOrder = await orderAPI.getChartInfo();
      responseChart.data.sort((a, b) => a._id - b._id);
      const newDataChart = {
        labels: responseChart.data.map((item) => item._id),
        datasets: [
          {
            label: "Product count",
            data: responseChart.data.map((item) => item.total),
            borderColor: "#1890ff",
            backgroundColor: "#0050b3",
          },
        ],
      };
      setDataChartProduct(newDataChart);
      responseChartUser.data.sort((a, b) => a._id - b._id);
      const newDataChartUser = {
        labels: responseChartUser.data.map((item) => item._id),
        datasets: [
          {
            label: "User count",
            data: responseChartUser.data.map((item) => item.total),
            borderColor: "#fadb14",
            backgroundColor: "#ad8b00",
          },
        ],
      };
      setDataChartUser(newDataChartUser);
      responseChartOrder.data.sort((a, b) => a._id - b._id);
      const newDataChartOrder = {
        labels: responseChartOrder.data.map((item) => item._id),
        datasets: [
          {
            label: "Order count",
            data: responseChartOrder.data.map((item) => item.total),
            borderColor: "rgb(255, 99, 132)",
            backgroundColor: "rgba(255, 99, 132, 0.5)",
          },
        ],
      };
      setDataChartOrder(newDataChartOrder);
    } catch (error) {
      showErrorNotification(error?.msg);
    }
  };

  useEffect(() => {
    handleCallAPI();
  }, []);

  return (
    <div>
      <Wrapper>
        <div
          style={{
            fontSize: "1.5rem",
            fontWeight: "600",
            color: "var(--clr-text)",
          }}
        >
          {t("common:common.dashboard")}
        </div>
      </Wrapper>

      {dataChartOrder && (
        <CustomerChart
          title={t("common:common.order_management")}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "top" as const,
              },
              title: {
                display: true,
                text: "Order Bar Chart",
              },
            },
          }}
          data={dataChartOrder}
        />
      )}
      {dataChartProduct && (
        <CustomerChart
          title={t("common:common.product_management")}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "top" as const,
              },
              title: {
                display: true,
                text: "Product Bar Chart",
              },
            },
          }}
          data={dataChartProduct}
        />
      )}
      {dataChartUser && (
        <CustomerChart
          title={t("common:common.user_management")}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: "top" as const,
              },
              title: {
                display: true,
                text: "User Bar Chart",
              },
            },
          }}
          data={dataChartUser}
        />
      )}
    </div>
  );
};

export default HomePage;
