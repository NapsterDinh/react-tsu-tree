import { Button, Input, Select, Space } from "antd";
import { useTranslation } from "react-i18next";
import { Wrapper } from "./CommonActionStyle";
import { usePermissions } from "@hooks/usePermissions";
const { Option } = Select;
const { Search } = Input;

type CommonActionProps = {
  onSearch: (searchContent: string) => void;
  handleChangeFilter: (filter: string, any) => void;
  loading: boolean;
  showModal: () => void;
  errorSearch: string;
};

const CommonAction: React.FC<CommonActionProps> = ({
  onSearch,
  handleChangeFilter,
  loading,
  showModal,
  errorSearch,
}) => {
  const { t } = useTranslation(["common"]);
  const { checkPermission } = usePermissions();
  return (
    <Wrapper>
      <Space
        align="end"
        className="common-action"
        style={{ justifyContent: "space-between" }}
      >
        <Space align="end">
          <Space direction="vertical">
            <span className="label">{t("common:status")}</span>
            <Select
              defaultValue="2"
              style={{
                width: 150,
              }}
              onChange={(value) => handleChangeFilter("isActive", value)}
            >
              <Option value="2">{t("common:all_of_status")}</Option>
              <Option value="1">{t("common:status_active")}</Option>
              <Option value="0">{t("common:status_inactive")}</Option>
            </Select>
          </Space>
          <Space direction="vertical">
            <span className="label">{t("common:sort")}</span>
            <Select
              defaultValue="2"
              style={{
                width: 200,
              }}
              onChange={(value) => handleChangeFilter("sort", value)}
            >
              <Option value="2">{t("common:no_sort")}</Option>
              <Option value="0">{t("common:sort_by_name_a_z")}</Option>
              <Option value="1">{t("common:sort_by_name_z_a")}</Option>
            </Select>
          </Space>
          <Space direction="vertical" className="search-container">
            <p className="label">{t("common:search")}</p>
            <Search
              className="search-box"
              placeholder={t("common:enter_search_text")}
              enterButton={t("common:search")}
              onSearch={onSearch}
              maxLength={20}
              loading={loading}
              status={errorSearch !== "" ? "error" : ""}
            />
            {errorSearch !== "" && (
              <span className="error-search">{errorSearch}</span>
            )}
          </Space>
        </Space>
        {checkPermission(["FUNCTION_GROUP.CREATE"]) && (
          <Button type="primary" onClick={() => showModal()}>
            {t("common:create")}
          </Button>
        )}
      </Space>
    </Wrapper>
  );
};

export default CommonAction;
