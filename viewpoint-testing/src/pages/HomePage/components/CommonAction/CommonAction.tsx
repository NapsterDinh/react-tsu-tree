import { FILTER_TIME, OWNED, TYPE_FILTER_LOG } from "@utils/constants";
import { INPUT_SEARCH } from "@utils/constantsUI";
import { Input, Select, Space } from "antd";
import { useTranslation } from "react-i18next";
import { Wrapper } from "./CommonAction.Styled";
const { Option } = Select;
const { Search } = Input;

type CommonActionProps = {
  onSearch: (any) => void;
  handleChangeFilter: (string, any) => void;
  loading: boolean;
  errorSearch: string;
  filter: any;
};

const CommonAction: React.FC<CommonActionProps> = ({
  onSearch,
  handleChangeFilter,
  loading,
  errorSearch,
  filter,
}) => {
  const { t } = useTranslation(["common"]);
  return (
    <Wrapper>
      <Space
        className="common-action"
        style={{ justifyContent: "space-between", position: "relative" }}
        align="end"
      >
        <Space direction="vertical" className="search-container">
          <p className="label">{t("common:common.search")}</p>
          <Search
            className="search-box"
            placeholder={t("common:common.search_placeholder")}
            enterButton={t("common:common.search")}
            onSearch={onSearch}
            maxLength={INPUT_SEARCH.MAX_LENGTH}
            style={{ width: INPUT_SEARCH.WIDTH }}
            loading={loading}
            status={errorSearch !== "" ? "error" : ""}
          />
          {errorSearch !== "" && (
            <span className="error-search">{errorSearch}</span>
          )}
        </Space>
        <Space>
          <Space direction="vertical">
            <span className="label">
              {t("common:dashboard.last_opened_time")}
            </span>
            <Select
              defaultValue={parseInt(filter.lastOpenedTimeRange)}
              style={{
                width: 180,
              }}
              onChange={(value) => handleChangeFilter("LastOpenedTime", value)}
            >
              <Option value={FILTER_TIME.TODAY}>
                {t("common:dashboard.today")}
              </Option>
              <Option value={FILTER_TIME.LAST_7_DAYS}>
                {t("common:dashboard.last_7_days")}
              </Option>
              <Option value={FILTER_TIME.LAST_30_DAYS}>
                {t("common:dashboard.last_30_days")}
              </Option>
            </Select>
          </Space>
          <Space direction="vertical">
            <span className="label">{t("common:common.owner")}</span>
            <Select
              defaultValue={parseInt(filter.owner)}
              style={{
                width: 180,
              }}
              onChange={(value) => handleChangeFilter("Owner", value)}
            >
              <Option value={OWNED.ALL_USER}>
                {t("common:dashboard.owned_by_everyone")}
              </Option>
              <Option value={OWNED.OWNED}>
                {t("common:dashboard.owned_by_me")}
              </Option>
              <Option value={OWNED.NO_OWNED}>
                {t("common:dashboard.not_owned_by_me")}
              </Option>
            </Select>
          </Space>

          <Space direction="vertical">
            <span className="label">{t("common:dashboard.type_file")}</span>
            <Select
              defaultValue={parseInt(filter.type)}
              style={{
                width: 180,
              }}
              onChange={(value) => handleChangeFilter("TypeFile", value)}
            >
              <Option value={TYPE_FILTER_LOG.DEFAULT}>
                {t("common:dashboard.all_of_type_file")}
              </Option>
              <Option value={TYPE_FILTER_LOG.PRODUCT}>
                {t("common:product.name")}
              </Option>
              <Option value={TYPE_FILTER_LOG.VIEWPOINT_COLLECTION}>
                {t("common:viewpoint_collection.name")}
              </Option>
            </Select>
          </Space>
        </Space>
      </Space>
    </Wrapper>
  );
};

export default CommonAction;
