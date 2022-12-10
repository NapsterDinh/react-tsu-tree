import {
  ArrowLeftOutlined,
  CopyOutlined,
  DownOutlined,
  ExportOutlined,
  FileDoneOutlined,
  ImportOutlined,
  InfoCircleOutlined,
  PlusCircleOutlined,
  SaveOutlined,
  StarOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import ModalAddMembers from "@components/Modal/ModalAddMembers/ModalAddMembers";
import ModalHistoryChanges from "@components/Modal/ModalHistoryChanges/ModalHistoryChanges";
import productAPI from "@services/productAPI";
import {
  LANGUAGE,
  PROCESSING_STATUS,
  PUBLISH_STATUS,
  STATUS_VIEWPOINT_COLLECTION,
} from "@utils/constants";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@utils/notificationUtils";
import {
  Button,
  Dropdown,
  Input,
  Menu,
  MenuProps,
  Select,
  Space,
  Switch,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { SearchContainer } from "AppStyled";
import * as React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineEdit, AiOutlineStar } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { routes } from "routes";
import { Wrapper } from "./CommonAction.Styled";
import ModalClone from "./ModalClone/ModalClone";
import ModalCreateRequest from "./ModalCreateRequest/ModalCreateRequest";
import ModalEditProduct from "./ModalEditProduct/ModalEditProduct";
import ModalImportAppendProduct from "./ModalImportAppendProduct/ModalImportAppendProduct";
import ModalImportDataProduct from "./ModalImportDataProduct/ModalImportDataProduct";
import ModalInfoProduct from "./ModalInfoProduct/ModalInfoProduct";
import ModalRatingProduct from "./ModalRatingProduct/ModalRatingProduct";

const { Search } = Input;
const { Option } = Select;

export type CommonActionProps = {
  currentProduct: any;
  getData: () => void;
  setCurrentProduct: (_product) => void;
  setLevelShow: (_level: number) => void;
  domainList: any[];
  levelShow: number;
  treeRef: any;
  handleChangeStatusProcess: (_status: boolean) => void;
  handleChangeStatusPublish: (_status: boolean) => void;
  setSelectedNode: (_node: any) => void;
  checkOwner: boolean;
  setDataLanguage: (_language: string) => void;
  getDataLanguage: () => string;
  setSearchText: (_value: string) => void;
};

const CommonAction: React.FC<CommonActionProps> = ({
  currentProduct,
  getData,
  setCurrentProduct,
  setLevelShow,
  domainList,
  levelShow,
  handleChangeStatusProcess,
  handleChangeStatusPublish,
  setSelectedNode,
  checkOwner,
  setDataLanguage,
  getDataLanguage,
  setSearchText,
}) => {
  const { t } = useTranslation(["common", "validate", "responseMessage"]); // languages
  const [isShowInfoModal, setShowInfoModal] = useState(false);
  const [isShowInviteMemberModal, setShowInviteMemberModal] = useState(false);
  const [isShowHistoryChangesModal, setShowHistoryChangesModal] =
    useState(false);

  const [isShowEditModal, setIsShowEditModal] = useState(false);
  const [isShowCloneModal, setShowCloneModal] = useState(false);
  const [isShowRatingModal, setShowRatingModal] = useState(false);
  const [isShowCreateRequestModal, setShowCreateRequestModal] = useState(false);
  const [isModalOpenImport, setIsModalOpenImport] = useState<boolean>(false);
  const [isModalOpenImportData, setIsModalOpenImportData] =
    useState<boolean>(false);

  const navigate = useNavigate();

  const handleChangeLanguage = async (value) => {
    (document.getElementById("input-search") as HTMLInputElement).value = "";
    setLevelShow(1);
    setSearchText("");
    setSelectedNode(null);
    setDataLanguage(value);
    await getData();
  };
  const handleExportProduct = async () => {
    try {
      productAPI.exportProduct({
        id: currentProduct.id,
        name: currentProduct?.detail?.name,
        language: currentProduct?.detail?.language,
      });
    } catch (error) {
      showErrorNotification(error?.code);
    }
  };

  const handleExportProductWithLevel = async () => {
    try {
      productAPI.exportProductWithLevel({
        id: currentProduct.id,
        name: currentProduct?.detail?.name,
        language: currentProduct?.detail?.language,
      });
    } catch (error) {
      showErrorNotification(error?.code);
    }
  };

  const items: MenuProps["items"] = [
    {
      label: t("common:common.append_child"),
      key: "append_child",
      onClick: () => {
        setIsModalOpenImport(true);
      },
    },
    {
      label: t("common:common.override_translated_data"),
      key: "import_translated_data",
      onClick: () => {
        setIsModalOpenImportData(true);
      },
    },
  ];

  const itemsExport: MenuProps["items"] = [
    {
      label: t("common:common.export_for_viewing"),
      key: "export_for_viewing",
      onClick: () => {
        handleExportProductWithLevel();
      },
    },
    {
      label: t("common:common.export_for_import_translated_data"),
      key: "export_for_import_translated_data",
      onClick: () => {
        handleExportProduct();
      },
    },
  ];

  return (
    <Wrapper>
      <Space
        align="end"
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <Typography.Title
              level={4}
              style={{
                marginTop: "5px",
                fontWeight: "600",
                color: "var(--clr-text)",
                display: "block",
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: "600px",
                whiteSpace: "nowrap",
              }}
            >
              {currentProduct?.detail?.name ??
                t("common:detail_product.no_product_name")}
            </Typography.Title>
            {checkOwner && (
              <Tooltip title={t("common:common.edit")}>
                <AiOutlineEdit
                  onClick={() => setIsShowEditModal(true)}
                  style={{
                    fontSize: "1.25rem",
                    transform: "translate(5px,-2px)",
                    cursor: "pointer",
                  }}
                />
              </Tooltip>
            )}

            {!currentProduct?.cloneProductId && (
              <Tooltip title={t("common:common.base")}>
                <Tag
                  style={{
                    height: "fit-content",
                    marginLeft: "20px",
                    transform: "translateY(-4px)",
                    color: "white",
                  }}
                  color="#87d068"
                >
                  {t("common:common.base")}
                </Tag>
              </Tooltip>
            )}
          </div>
          <Space size={20} align="start">
            <Space direction="vertical" style={{ marginRight: 130 }}>
              <span className="label">{t("common:common.search")}</span>
              <SearchContainer>
                <Search
                  id="input-search"
                  maxLength={40}
                  placeholder={t("common:common.search_placeholder")}
                  onSearch={(value) => {
                    setSearchText(value);
                  }}
                  style={{ width: 450 }}
                  enterButton={t("common:common.search")}
                />
              </SearchContainer>
            </Space>
            <Space direction="vertical">
              <span className="label">{t("common:common.level")}</span>
              <Select
                onChange={(value) => setLevelShow(parseInt(value))}
                value={levelShow.toString()}
                style={{ width: 150 }}
              >
                {/* <Option value="-1">{t("common:common.all_level")}</Option> */}
                <Option value="1">{`${t("common:common.level")} 1`}</Option>
                <Option value="2">{`${t("common:common.level")} 2`}</Option>
                <Option value="3">{`${t("common:common.level")} 3`}</Option>
                {/* <Option value="4">{`${t("common:common.level")} 4`}</Option>
                <Option value="5">{`${t("common:common.level")} 5`}</Option>
                <Option value="6">{`${t("common:common.level")} 6`}</Option>
                <Option value="7">{`${t("common:common.level")} 7`}</Option> */}
              </Select>
            </Space>
          </Space>
        </div>

        <div className="right-action-container">
          <div style={{ display: "flex", justifyContent: "right" }}>
            <Tag className="tag-rating" color="#f50">
              {currentProduct?.avgRating ? (
                <div>
                  <span>{t("common:common.rating")}: </span>
                  <span>{currentProduct?.avgRating}</span>
                  <AiOutlineStar
                    style={{
                      transform: "translate(4px, 4px)",
                      fontSize: "16px",
                    }}
                  />
                  <span> </span>
                  <span
                    style={{
                      transform: "translateX(10px)",
                    }}
                  >
                    ({currentProduct?.countUserRating})
                  </span>
                </div>
              ) : (
                t("common:status.no_rating")
              )}
            </Tag>
            {currentProduct?.status ===
              STATUS_VIEWPOINT_COLLECTION.ON_GOING && (
              <Tag className="tag-status" color="#87d068">
                <span>{t("common:common.status")}: </span>
                {t("common:status.on_going")}
              </Tag>
            )}
          </div>

          <div className="bottom-action">
            <Button
              onClick={() => {
                checkOwner &&
                  showSuccessNotification(
                    t("common:product.save_successfully")
                  );
                navigate(routes.ProductManagement.path[0]);
              }}
              type="primary"
              icon={checkOwner ? <SaveOutlined /> : <ArrowLeftOutlined />}
            >
              {checkOwner ? t("common:common.save") : t("common:common.cancel")}
            </Button>
            <Button
              onClick={() => {
                setShowHistoryChangesModal(true);
              }}
              type="primary"
              icon={<FileDoneOutlined />}
            >
              {t("common:common.history_changes")}
            </Button>
            <Button
              icon={<InfoCircleOutlined />}
              type="primary"
              onClick={() => {
                setShowInfoModal(true);
              }}
            >
              {t("common:common.information")}
            </Button>
            {!checkOwner && (
              <Button
                onClick={() => {
                  setShowRatingModal(true);
                }}
                type="primary"
                icon={<StarOutlined />}
              >
                {t("common:common.rating")}
              </Button>
            )}
          </div>
          {checkOwner && (
            <div className="bottom-action">
              {checkOwner &&
                currentProduct?.children?.length > 0 &&
                typeof currentProduct?.children[0]?.key === "string" && (
                  <Button
                    onClick={() => {
                      setShowCreateRequestModal(true);
                    }}
                    type="primary"
                    icon={<PlusCircleOutlined />}
                  >
                    {t("common:common.create_merge_request")}
                  </Button>
                )}
              <Button
                onClick={() => {
                  setShowCloneModal(true);
                }}
                type="primary"
                icon={<CopyOutlined />}
              >
                {t("common:detail_product.modal_copy")}
              </Button>
              <Dropdown overlay={<Menu items={items} />} trigger={["click"]}>
                <Button icon={<ImportOutlined />} type="primary">
                  {t("common:common.import")}
                  <DownOutlined />
                </Button>
              </Dropdown>
              <Dropdown
                overlay={<Menu items={itemsExport} />}
                trigger={["click"]}
              >
                <Button icon={<ExportOutlined />} type="primary">
                  {t("common:common.export")}
                  <DownOutlined />
                </Button>
              </Dropdown>
            </div>
          )}
        </div>
      </Space>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "end",
        }}
      >
        <div
          style={{
            gap: 10,
            display: "flex",
            alignItems: "center",
            marginTop: 10,
          }}
        >
          <Select
            defaultValue={() => getDataLanguage()}
            style={{ width: 120 }}
            onChange={handleChangeLanguage}
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
        </div>
        <div
          style={{
            justifyContent: "end",
            display: "flex",
            marginTop: "10px",
            gap: 10,
            alignItems: "center",
          }}
        >
          <Switch
            key={"switchStatusProcessing"}
            checked={
              currentProduct?.processingStatus === +PROCESSING_STATUS.UPDATING
            }
            disabled={!checkOwner}
            checkedChildren={t("common:status.updating")}
            unCheckedChildren={t("common:status.on_going")}
            onChange={(checked) => handleChangeStatusProcess(checked)}
          />
          <Switch
            key={"switchStatusPublish"}
            checked={
              currentProduct?.publishStatus === +PUBLISH_STATUS.PUBLISHED
            }
            disabled={!checkOwner}
            checkedChildren={t("common:status.publishing")}
            unCheckedChildren={t("common:status.published")}
            onChange={(checked) => handleChangeStatusPublish(checked)}
          />
          <Button
            onClick={() => {
              setShowInviteMemberModal(true);
            }}
            type="primary"
            icon={<UsergroupAddOutlined />}
          >
            {t("common:common.member_list")}
          </Button>
        </div>
      </div>
      <ModalImportDataProduct
        currentVPCollection={currentProduct}
        open={isModalOpenImportData}
        // treeDataSelector={treeDataDomainSelector}
        setOpen={setIsModalOpenImportData}
        getData={getData}
      />
      <ModalImportAppendProduct
        currentProduct={currentProduct}
        open={isModalOpenImport}
        // treeDataSelector={treeDataDomainSelector}
        setOpen={setIsModalOpenImport}
        getData={getData}
      />

      <ModalInfoProduct
        visible={isShowInfoModal}
        onCancel={() => setShowInfoModal(false)}
        currentProduct={currentProduct}
      />
      <ModalHistoryChanges
        entity={currentProduct}
        visible={isShowHistoryChangesModal}
        onCancel={() => setShowHistoryChangesModal(false)}
      />
      <ModalAddMembers
        entity={currentProduct}
        visible={isShowInviteMemberModal}
        onCancel={() => setShowInviteMemberModal(false)}
        checkOwner={checkOwner}
        isViewpointCollection={false}
      />

      <ModalEditProduct
        domainList={domainList}
        open={isShowEditModal}
        setOpen={setIsShowEditModal}
        currentProduct={currentProduct}
        setCurrentProduct={setCurrentProduct}
      />

      <ModalClone
        isModalOpen={isShowCloneModal}
        currentProduct={currentProduct}
        setIsModalOpen={setShowCloneModal}
        getData={getData}
      />

      <ModalRatingProduct
        visible={isShowRatingModal}
        onCancel={() => setShowRatingModal(false)}
        currentProduct={currentProduct}
        setCurrentProduct={setCurrentProduct}
      />

      <ModalCreateRequest
        open={isShowCreateRequestModal}
        handleCancel={() => setShowCreateRequestModal(false)}
        currentProduct={currentProduct}
      />
    </Wrapper>
  );
};

export default CommonAction;
