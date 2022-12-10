import {
  CloseOutlined,
  ExclamationCircleOutlined,
  QuestionCircleOutlined,
} from "@ant-design/icons";
import CustomRCTree from "@components/CustomRCTree/CustomRCTree";
import { WrapperRCTree } from "@components/CustomRCTree/RCTree.Styled";
import { LANGUAGE } from "@utils/constants";
import { Modal, Select, Typography } from "antd";
import * as React from "react";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ElementWrapper } from "../../StagedChangeWrapper";
import { Wrapper } from "./TreeTo.Styled";
import TreeToNode from "./TreeToNode/TreeToNode";

export type TreeData = {
  children: any[]; //get ID, order item
  key: React.Key;
  parentKey: React.Key;
  title: string | any;
  detail: any;
};
const TreeTo = ({
  dataObjectTree,
  setSelectedNodeTo,
  selectedNodeTo,
  transferNode,
  overrideNode,
  setIsShowHintTestType,
  findReferenceNode,
  setOpenModalDetail,
  setIsOpenDetailBoth,
  handleChangeLanguage,
  getDataLanguage,
  isBlocking,
  handleOnSaveDraft,
}) => {
  const [selectedKeys, setSelectedKeys] = React.useState([]);
  const { t } = useTranslation(["common", "validate", "responseMessage"]); // languages
  const [value, setValue] = React.useState(() => getDataLanguage());
  useEffect(() => {
    !selectedNodeTo && setSelectedKeys([]);
  }, [selectedNodeTo]);

  return (
    <ElementWrapper>
      <Wrapper>
        <Typography.Title level={5} className="color-text">
          {t("common:common.to")}
          {": "}
          {dataObjectTree?.detail?.name ??
            t(
              "common:detail_viewpoint_collection.no_viewpoint_collection_name"
            )}
        </Typography.Title>
        <div
          style={{
            gap: 10,
            display: "flex",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <Select
            value={value}
            style={{ width: 120 }}
            onChange={(newValue) => {
              if (isBlocking) {
                Modal.confirm({
                  title: (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      {t("common:detail_request.change_language")}
                      <CloseOutlined
                        onClick={() => {
                          Modal.destroyAll();
                          setValue(value);
                        }}
                      />
                    </div>
                  ),
                  icon: <ExclamationCircleOutlined />,
                  content: (
                    <>
                      <p style={{ marginBottom: 0 }}>
                        {t("common:detail_request.confirm_switch_language_1")}
                      </p>
                      <p>
                        {t("common:detail_request.confirm_switch_language_2")}
                      </p>
                    </>
                  ),
                  okText: t(
                    "common:detail_request.save_draft_and_change_language"
                  ),
                  width: 600,
                  cancelText: t("common:common.cancel"),
                  onOk: async () => {
                    await handleOnSaveDraft();
                    handleChangeLanguage(newValue);
                    setValue(newValue);
                  },
                  onCancel: () => {
                    Modal.destroyAll();
                    setValue(value);
                  },
                });
              } else {
                handleChangeLanguage(newValue);
                setValue(newValue);
              }
            }}
            options={[
              {
                value: LANGUAGE.VI,
                label: t("common:common.vietnam"),
              },
              {
                value: LANGUAGE.EN,
                label: t("common:common.english"),
              },
              {
                value: LANGUAGE.JPN,
                label: t("common:common.japan"),
              },
            ]}
          />
          <div>
            <QuestionCircleOutlined
              style={{
                cursor: "pointer",
                fontSize: "20px",
              }}
              onClick={() => setIsShowHintTestType(true)}
            />
          </div>
        </div>
        <WrapperRCTree>
          <CustomRCTree
            rootClassName={"treeTo"}
            rootStyle={{
              backgroundColor: "var(--background-color-element)",
              color: "var(--clr-text)",
              marginTop: 10,
            }}
            blockNode
            selectedKeys={selectedKeys}
            onSelect={(selectedKeys) => {
              setSelectedKeys(selectedKeys);
              findReferenceNode(
                selectedKeys.length > 0 ? selectedKeys[0] : null
              );
            }}
            selectable
            defaultExpandAll
            treeData={dataObjectTree?.children}
            height={740}
            itemHeight={500}
            showIcon={false}
            icon={null}
            titleRender={(node: any) => (
              <TreeToNode
                setIsOpenDetailBoth={setIsOpenDetailBoth}
                setOpenModalDetail={setOpenModalDetail}
                node={node}
                overrideNode={overrideNode}
                transferNode={transferNode}
                objectDataTree={dataObjectTree}
                setSelectedNode={setSelectedNodeTo}
              />
            )}
          />
        </WrapperRCTree>
      </Wrapper>
    </ElementWrapper>
  );
};

export default TreeTo;
