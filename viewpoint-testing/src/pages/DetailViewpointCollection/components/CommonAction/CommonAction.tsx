import {
  ArrowLeftOutlined,
  CopyOutlined,
  DownOutlined,
  ExportOutlined,
  FileDoneOutlined,
  ImportOutlined,
  InfoCircleOutlined,
  PlusCircleOutlined,
  QuestionCircleOutlined,
  SaveOutlined,
  StarOutlined,
  UsergroupAddOutlined,
} from "@ant-design/icons";
import ModalAddMembers from "@components/Modal/ModalAddMembers/ModalAddMembers";
import ModalHistoryChanges from "@components/Modal/ModalHistoryChanges/ModalHistoryChanges";
import ViewpointAPI from "@services/viewpointsAPI";
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
import ModalEditVPCollection from "./ModalEditVPCollection/ModalEditVPCollection";
// import ModalHistoryChanges from "./ModalHistoryChanges/ModalHistoryChanges";
import ModalImportAppendViewpoint from "./ModalImportAppendViewpoint/ModalImportAppendViewpoint";
import ModalImportDataViewpoint from "./ModalImportDataViewpoint/ModalImportDataViewpoint";
import ModalInfoVPCollection from "./ModalInfoVPCollection/ModalInfoVPCollection";
import ModalRatingVPCollection from "./ModalRatingVPCollection/ModalRatingVPCollection";
import ModalTestTypeTable from "./ModalTestTypeTable/ModalTestTypeTable";

const { Search } = Input;
const { Option } = Select;

export type CommonActionProps = {
  currentVPCollection: any;
  getData: () => void;
  setCurrentVPCollection: React.Dispatch<any>;
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
  currentVPCollection,
  getData,
  setCurrentVPCollection,
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
  const [isShowHintTestType, setIsShowHintTestType] = useState(false);
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

  const handleExportViewpoint = async () => {
    try {
      ViewpointAPI.exportViewpoint({
        id: currentVPCollection.id,
        name: currentVPCollection?.detail?.name,
        language: currentVPCollection?.detail?.language,
      });
    } catch (error) {
      showErrorNotification(error?.code);
    }
  };

  const handleExportViewpointWithLevel = async () => {
    try {
      ViewpointAPI.exportViewpointWithLevel({
        id: currentVPCollection.id,
        name: currentVPCollection?.detail?.name,
        language: currentVPCollection?.detail?.language,
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
        handleExportViewpointWithLevel();
      },
    },
    {
      label: t("common:common.export_for_import_translated_data"),
      key: "export_for_import_translated_data",
      onClick: () => {
        handleExportViewpoint();
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
              {currentVPCollection?.detail?.name ??
                t(
                  "common:detail_viewpoint_collection.no_viewpoint_collection_name"
                )}
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

            {!currentVPCollection?.cloneCollectionId && (
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
              {currentVPCollection?.avgRating ? (
                <div>
                  <span>{t("common:common.rating")}: </span>
                  <span>{currentVPCollection?.avgRating}</span>
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
                    ({currentVPCollection?.countUserRating})
                  </span>
                </div>
              ) : (
                t("common:status.no_rating")
              )}
            </Tag>
            {currentVPCollection?.status ===
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
                    t("common:viewpoint_collection.save_successfully")
                  );
                navigate(routes.ViewpointCollection.path[0]);
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
                currentVPCollection?.children?.length > 0 &&
                typeof currentVPCollection?.children[0]?.key === "string" && (
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
                {t("common:detail_viewpoint_collection.modal_copy")}
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
              currentVPCollection?.processingStatus ===
              +PROCESSING_STATUS.UPDATING
            }
            disabled={!checkOwner}
            checkedChildren={t("common:status.updating")}
            unCheckedChildren={t("common:status.on_going")}
            onChange={(checked) => handleChangeStatusProcess(checked)}
          />
          <Switch
            key={"switchStatusPublish"}
            checked={
              currentVPCollection?.publishStatus === +PUBLISH_STATUS.PUBLISHED
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
      <ModalImportDataViewpoint
        currentVPCollection={currentVPCollection}
        open={isModalOpenImportData}
        // treeDataSelector={treeDataDomainSelector}
        setOpen={setIsModalOpenImportData}
        getData={getData}
      />
      <ModalImportAppendViewpoint
        currentVPCollection={currentVPCollection}
        open={isModalOpenImport}
        // treeDataSelector={treeDataDomainSelector}
        setOpen={setIsModalOpenImport}
        getData={getData}
      />
      <ModalTestTypeTable
        visible={isShowHintTestType}
        setVisible={setIsShowHintTestType}
      />

      <ModalInfoVPCollection
        visible={isShowInfoModal}
        onCancel={() => setShowInfoModal(false)}
        currentVPCollection={currentVPCollection}
      />
      <ModalHistoryChanges
        entity={currentVPCollection}
        visible={isShowHistoryChangesModal}
        onCancel={() => setShowHistoryChangesModal(false)}
      />
      <ModalAddMembers
        entity={currentVPCollection}
        visible={isShowInviteMemberModal}
        onCancel={() => setShowInviteMemberModal(false)}
        checkOwner={checkOwner}
      />

      <ModalEditVPCollection
        domainList={domainList}
        open={isShowEditModal}
        setOpen={setIsShowEditModal}
        currentVPCollection={currentVPCollection}
        setCurrentVPCollection={setCurrentVPCollection}
      />

      <ModalClone
        isModalOpen={isShowCloneModal}
        currentVPCollection={currentVPCollection}
        setIsModalOpen={setShowCloneModal}
        getData={getData}
      />

      <ModalRatingVPCollection
        visible={isShowRatingModal}
        onCancel={() => setShowRatingModal(false)}
        currentVPCollection={currentVPCollection}
        setCurrentVPCollection={setCurrentVPCollection}
      />

      <ModalCreateRequest
        isViewpointCollection
        open={isShowCreateRequestModal}
        handleCancel={() => setShowCreateRequestModal(false)}
        currentVPCollection={currentVPCollection}
        isCreateRequestIndirect={
          currentVPCollection?.cloneCollectionId ? true : false
        }
      />
    </Wrapper>
  );
};

export default CommonAction;
