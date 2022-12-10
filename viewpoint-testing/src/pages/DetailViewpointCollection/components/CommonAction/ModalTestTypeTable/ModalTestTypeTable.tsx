import { Button, Modal, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { useTranslation } from "react-i18next";

interface IProps {
  visible: boolean;
  setVisible;
}

interface DataType {
  key: React.ReactNode;
  name: string;
  description: string;
  children?: DataType[];
}

const ModalTestTypeTable = ({ visible, setVisible }: IProps) => {
  const { t } = useTranslation(["common"]);
  const columns: ColumnsType<DataType> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: "40%",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "60%",
    },
  ];

  const dataTestType: DataType[] = [
    {
      key: 1,
      name: "Functional Testing",
      description: "",
      children: [
        {
          key: 11,
          name: "Functionality",
          description: "",
          children: [
            {
              key: 111,
              name: "Functional Testing",
              description:
                "A test base on an analysis of the functional specifications of a components or system. Make sure it meets the specifications",
            },
            {
              key: 112,
              name: "Scenario Testing / Usecase Testing",
              description:
                "A test that is performed based on a scenario that assumes business. We confirm that the work to be done by the customer is in line with the requirements, such as whether it can be realized.",
            },
          ],
        },
        {
          key: 12,
          name: "Usability",
          description: "",
          children: [
            {
              key: 121,
              name: "Usability Testing",
              description: "",
            },
          ],
        },
      ],
    },
    {
      key: 2,
      name: "Non-Functional Testing",
      description: "",
      children: [
        {
          key: 21,
          name: "Functionality",
          description: "",
          children: [
            {
              key: 211,
              name: "Security Testing",
              description:
                "A test base on an analysis of the functional specifications of a components or system. Make sure it meets the specifications",
            },
          ],
        },
        {
          key: 22,
          name: "Reliability",
          description: "",
        },
        {
          key: 23,
          name: "Efficiency Testing",
          description: "",
          children: [
            {
              key: 231,
              name: "Performance Test",
              description:
                "Confirm that performance requirements are met (Response, capacity, etc.)",
            },
            {
              key: 232,
              name: "Load Test",
              description:
                "A test that confirms correct operation when a load is applied to the test target (when a large amount of data or a large data is given, when a large number of processes are performed within a certain period time, etc.)",
            },
            {
              key: 233,
              name: "Stress Test",
              description:
                "A test that confirms correct operation when a load is applied to the test target and the limit is exceeded when the availability of resources such as memory and server is reduced",
            },
          ],
        },
        {
          key: 24,
          name: "Serviceability",
          description: "",
        },
        {
          key: 25,
          name: "Portability",
          description: "",
        },
      ],
    },
    {
      key: 3,
      name: "Structural Testing",
      description:
        "A test based on an analysis of the internal structure of a component or system. Evaluate the completeness of test execution by how much structure is covered",
    },
    {
      key: 4,
      name: "Change-related Testing",
      description: "",
      children: [
        {
          key: 41,
          name: "Confirmation Test",
          description:
            "Test for verifying that the original defect was fixed correctly",
        },
        {
          key: 42,
          name: "Regression Testing",
          description:
            "A test performed on an already tested program after a change is made to ensure that the change does not introduce or expose defects in the unchanged portion of the software.",
        },
      ],
    },
  ];

  const handleCancel = () => {
    setVisible(false);
  };
  return (
    <Modal
      title={t("common:test_type_management.name")}
      visible={visible}
      onCancel={handleCancel}
      width={1200}
      footer={[
        <Button key="ok" onClick={handleCancel}>
          {t("common:common.cancel")}
        </Button>,
      ]}
    >
      <Table
        columns={columns}
        dataSource={dataTestType}
        pagination={false}
        bordered
      />
    </Modal>
  );
};

export default ModalTestTypeTable;
