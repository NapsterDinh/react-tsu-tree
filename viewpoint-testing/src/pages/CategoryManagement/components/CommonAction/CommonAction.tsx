import { Button, Input, Select, Space } from "antd";
import { useTranslation } from "react-i18next";
import { Wrapper } from "./CommonAction.Styled";
import { usePermissions } from "@hooks/usePermissions";
import { SORT, STATUS } from "@utils/constants";
const { Option } = Select;
const { Search } = Input;

type CommonActionProps = {
  onSearch: (any) => void;
  handleChangeFilter: (string, any) => void;
  loading: boolean;
  showModal: () => void;
  errorSearch: string;
  contentSearch: string;
  setContentSearch: (string) => void;
  filter: any;
};

const CommonAction: React.FC<CommonActionProps> = ({
  onSearch,
  handleChangeFilter,
  loading,
  showModal,
  errorSearch,
  contentSearch,
  setContentSearch,
  filter,
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
              defaultValue={parseInt(filter.isActive)}
              style={{
                width: 150,
              }}
              onChange={(value) => handleChangeFilter("isActive", value)}
            >
              <Option value={STATUS.DEFAULT}>
                {t("common:all_of_status")}
              </Option>
              <Option value={STATUS.ACTIVE}>{t("common:status_active")}</Option>
              <Option value={STATUS.INACTIVE}>
                {t("common:status_inactive")}
              </Option>
            </Select>
          </Space>
          <Space direction="vertical">
            <span className="label">{t("common:sort")}</span>
            <Select
              defaultValue={filter.sort}
              style={{
                width: 200,
              }}
              onChange={(value) => handleChangeFilter("sort", value)}
            >
              <Option value={SORT.DEFAULT}>{t("common:no_sort")}</Option>
              <Option value={SORT.ACS}>{t("common:sort_by_name_a_z")}</Option>
              <Option value={SORT.DESC}>{t("common:sort_by_name_z_a")}</Option>
            </Select>
          </Space>
          <Space direction="vertical" className="search-container">
            <p className="label">{t("common:search")}</p>
            <Search
              className="search-box"
              placeholder={t("common:enter_search_text")}
              enterButton={t("common:search")}
              onSearch={onSearch}
              value={contentSearch}
              onChange={(e) => setContentSearch(e.target.value)}
              maxLength={20}
              loading={loading}
              status={errorSearch !== "" ? "error" : ""}
            />
            {errorSearch !== "" && (
              <span className="error-search">{errorSearch}</span>
            )}
          </Space>
        </Space>

        <Button
          disabled={!checkPermission(["CATEGORY.CREATE"])}
          type="primary"
          onClick={() => showModal()}
        >
          {t("common:create")}
        </Button>
      </Space>
    </Wrapper>
  );
};

export default CommonAction;
