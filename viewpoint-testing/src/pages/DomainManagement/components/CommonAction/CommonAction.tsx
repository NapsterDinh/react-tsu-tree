import { BreadCrumb } from "@components";
import { INPUT_SEARCH } from "@utils/constantsUI";
import {
  checkContainsSpecialCharacter,
  removeEmoji,
} from "@utils/helpersUtils";
import { Form, Input, Select, Space } from "antd";
import { useTranslation } from "react-i18next";

interface IProps {
  form;
  search;
  onChangeSelect;
  openForm;
  onEnterSearch;
}

const CommonAction = ({
  form,
  search,
  onChangeSelect,
  onEnterSearch,
}: IProps) => {
  const { t } = useTranslation(["common", "validate"]); // languages
  const levelItem = [
    { value: "-1", name: t("common:common.all_level") },
    { value: "1", name: `${t("common:common.level")} 1` },
    { value: "2", name: `${t("common:common.level")} 2` },
    { value: "3", name: `${t("common:common.level")} 3` },
    { value: "4", name: `${t("common:common.level")} 4` },
    { value: "5", name: `${t("common:common.level")} 5` },
    { value: "6", name: `${t("common:common.level")} 6` },
    { value: "7", name: `${t("common:common.level")} 7` },
  ];
  return (
    <>
      <BreadCrumb
        title={t("common:domain_management.name")}
        previousTitle={t("common:common.home_page")}
        link="/"
        breadCrumb={true as boolean}
      />

      <Space
        size={20}
        align="center"
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Space size={20} align="start">
          <Space direction="vertical">
            <span className="label">{t("common:common.search")}</span>
            <Form
              form={form}
              initialValues={{ searchValue: search }}
              autoComplete="off"
            >
              <Form.Item
                name="searchValue"
                rules={[
                  {
                    validator: (_, value) => {
                      if (value) {
                        if (
                          checkContainsSpecialCharacter(value) ||
                          removeEmoji(value)
                        ) {
                          return Promise.reject(
                            t(
                              "validate:domain_management.name_can_not_contains_special_characters"
                            )
                          );
                        } else {
                          return Promise.resolve();
                        }
                      }
                    },
                  },
                ]}
                validateTrigger={["onChange", "onBlur"]}
              >
                <Input.Search
                  placeholder={t("common:domain_management.search_placeholder")}
                  maxLength={INPUT_SEARCH.MAX_LENGTH}
                  style={{ width: INPUT_SEARCH.WIDTH }}
                  enterButton={t("common:common.search")}
                  value={search}
                  onSearch={onEnterSearch}
                />
              </Form.Item>
            </Form>
          </Space>
          <Space direction="vertical">
            <span className="label">{t("common:common.level")}</span>
            <Select
              onChange={onChangeSelect}
              defaultValue="1"
              style={{ width: 150 }}
            >
              {levelItem.map((level, index) => (
                <Select.Option value={level.value} key={index}>
                  {level.name}
                </Select.Option>
              ))}
            </Select>
          </Space>
        </Space>
      </Space>
    </>
  );
};

export default CommonAction;
