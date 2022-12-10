import { BreadCrumb } from "@components";
import { usePermissions } from "@hooks/usePermissions";
import { INPUT_SEARCH } from "@utils/constantsUI";
import {
  checkContainsSpecialCharacter,
  removeEmoji,
} from "@utils/helpersUtils";
import { Button, Form, Input, Space, Tooltip } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { URLSearchParamsInit } from "react-router-dom";

interface IProps {
  searchParams: URLSearchParams;
  onResetFilter: () => void;
  onShowCreateModal: () => void;
  onShowImportProduct: () => void;
  setSearchParams: (
    _nextInit: URLSearchParamsInit,
    _navigateOptions?: {
      replace?: boolean;
      state?: any;
    }
  ) => void;
  onDownloadProductTemplate: () => Promise<void>;
  pagination;
  setPagination;
}

const CommonAction = ({
  pagination,
  setPagination,
  searchParams,
  onResetFilter,
  setSearchParams,
  onShowCreateModal,
  onShowImportProduct,
  onDownloadProductTemplate,
}: IProps) => {
  const { t } = useTranslation(["common", "validate", "responseMessage"]); // languages
  const [form] = Form.useForm();
  const [searchValue, setSearchValue] = useState(searchParams.get("Text"));
  const { checkPermission } = usePermissions();

  const handleChangeInputSearch = (e: any) => {
    setSearchValue(e.target.value);
  };

  const handleEnterSearch = (value: string) => {
    setSearchValue(value.trim());
    form.setFields([
      {
        name: "searchValue",
        value: value.trim(),
      },
    ]);
    if (value.trim() && !checkContainsSpecialCharacter(value.trim())) {
      searchParams.set("Text", value.trim());
      setSearchParams(searchParams);
    } else {
      searchParams.delete("Text");
      setSearchParams(searchParams);
    }
    setPagination({
      ...pagination,
      currentPage: 1,
    });
  };
  return (
    <>
      <BreadCrumb
        title={t("common:product.name")}
        link="/"
        previousTitle={t("common:common.home_page")}
        breadCrumb={true as boolean}
      />

      <Space
        align="start"
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Space align="start">
          <Space direction="vertical">
            <Form form={form} autoComplete="off">
              <Form.Item
                validateTrigger={["onChange", "onBlur"]}
                name="searchValue"
                rules={[
                  {
                    validator(_, value) {
                      if (
                        value &&
                        (checkContainsSpecialCharacter(value) ||
                          removeEmoji(value))
                      ) {
                        return Promise.reject(
                          t(
                            "validate:common.search_can_not_contains_special_characters"
                          )
                        );
                      }
                      return Promise.resolve();
                    },
                  },
                ]}
              >
                <Input.Search
                  value={searchValue}
                  placeholder={t("common:common.search_placeholder")}
                  onSearch={handleEnterSearch}
                  enterButton={t("common:common.search")}
                  onChange={handleChangeInputSearch}
                  maxLength={INPUT_SEARCH.MAX_LENGTH}
                  style={{ width: INPUT_SEARCH.WIDTH }}
                />
              </Form.Item>
            </Form>
          </Space>
          <Space direction="vertical">
            <Tooltip title={t("common:common.reset_sort_and_filter")}>
              <Button onClick={onResetFilter}>
                {t("common:common.reset")}
              </Button>
            </Tooltip>
          </Space>
        </Space>

        <Space>
          {checkPermission(["PRODUCT.CREATE"]) && (
            <Button type="primary" onClick={onDownloadProductTemplate}>
              {t("common:common.download_template")}
            </Button>
          )}
          {checkPermission(["PRODUCT.CREATE"]) && (
            <Button type="primary" onClick={onShowImportProduct}>
              {t("common:common.import")}
            </Button>
          )}
          {checkPermission(["PRODUCT.CREATE"]) && (
            <Button type="primary" onClick={onShowCreateModal}>
              {t("common:common.create")}
            </Button>
          )}
        </Space>
      </Space>
    </>
  );
};

export default CommonAction;
