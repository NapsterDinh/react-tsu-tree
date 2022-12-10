import { SearchOutlined } from "@ant-design/icons";
import { detailViewpointActions } from "@redux/slices";
import { RootState } from "@redux/store";
import requestAPI from "@services/requestAPI";
import { TYPE_REQUEST } from "@utils/constants";
import {
  MAX_LENGTH_INPUT_NAME_FIELD,
  MAX_LENGTH_TEXT_AREA,
  ROWS_DEFAULT_TEXT_AREA,
} from "@utils/constantsUI";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@utils/notificationUtils";
import { validateInput, VALIDATE_TRIGGER } from "@utils/validateFormUtils";
import {
  AutoComplete,
  Button,
  Form,
  Input,
  Modal,
  Select,
  SelectProps,
  Tag,
} from "antd";
import * as React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { routes } from "routes";
import { Wrapper } from "./ModalCreateRequest.Styled";

const { TextArea } = Input;
const { Option } = Select;

export type ModalCategoryProps = {
  open: boolean;
  handleCancel: () => void;
  currentVPCollection: any;
  isCreateRequestIndirect: boolean;
  isViewpointCollection: boolean;
};
const ModalCreateRequest: React.FC<ModalCategoryProps> = ({
  open,
  handleCancel,
  currentVPCollection,
}) => {
  const { t } = useTranslation(["common", "validate", "responseMessage"]);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [options, setOptions] = useState<SelectProps<object>["options"]>([]);
  const { resultSearch, loadingSearch } = useSelector(
    (state: RootState) => state.detailViewpoint
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [form] = Form.useForm();

  const searchResult = (arr) => {
    return arr.map((item) => {
      return {
        value: item?.detail?.name,
        id: item?.id,
        label: (
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <span>
              {item?.detail?.name}
              {!item?.cloneCollectionId && (
                <Tag style={{ transform: "translateX(10px)" }} color="#87d068">
                  {t("common:common.base")}
                </Tag>
              )}
            </span>
            <span>{item?.userCreate?.account}</span>
          </div>
        ),
      };
    });
  };

  const handleSearchFrom = async (value) => {
    if (value.trim() === "") {
      setOptions([]);
      return;
    }
    try {
      dispatch(
        detailViewpointActions.searchViewpoint({
          payload: {
            search: value?.trim(),
          },
        })
      );
    } catch (error) {
      if (error?.code) {
        showErrorNotification(t(`responseMessage:${error?.code}`));
      }
    }
  };

  React.useEffect(() => {
    if (currentVPCollection) {
      setOptions(
        searchResult(
          resultSearch
            .filter((item) => item.id !== currentVPCollection.id)
            .map((item) => ({
              ...item,
              value: item.id,
              label: item.id,
            }))
        )
      );
    }
  }, [resultSearch]);

  const onSelectAutoCompleted = async (value: string, option: any) => {
    const newField = [
      {
        name: "mergeInto",
        value: {
          value: value,
          id: option.id,
        },
      },
    ];
    const newMergeInto = resultSearch?.find((item) => item.id === option.id);
    newField.push({
      name: "approver",
      value: {
        value: newMergeInto.userCreate.account,
        id: newMergeInto.userCreate.id,
      },
    });
    form.setFields(newField);
  };

  const onSubmit = async (values) => {
    try {
      if (!values.mergeInto?.id) {
        form.setFields([
          {
            name: "mergeInto",
            value: values.mergeInto,
            errors: [t("validate:viewpoint_collection.name_is_invalid")],
          },
        ]);
        return;
      }
      setConfirmLoading(true);
      await requestAPI.createRequest({
        payload: {
          requestType: values.type,
          title: values.title,
          description: values.description,
          viewPointCollectionIdFrom: values.from.id,
          viewPointCollectionIdTo: values.mergeInto.id,
          userApproveId: values.approver.id,
        },
      });
      navigate(routes.RequestManagement.path[0]);
      showSuccessNotification(t("common:common.create_request_successfully"));
      handleCancel();
      form.resetFields();
    } catch (error) {
      if (error?.code === "RequestTitleIsExisted") {
        form.setFields([
          {
            name: "title",
            value: values.title,
            errors: [t(`responseMessage:${error?.code}`)],
          },
        ]);
      } else if (error?.code === "ViewPointCollectionToInvalid") {
        form.setFields([
          {
            name: "mergeInto",
            errors: [t(`responseMessage:${error?.code}`)],
          },
        ]);
      } else {
        if (error?.code) {
          showErrorNotification(t(`responseMessage:${error?.code}`));
        }
      }
    } finally {
      setConfirmLoading(false);
    }
  };

  React.useEffect(() => {
    if (currentVPCollection || open) {
      form.setFields([
        {
          name: "type",
          value: TYPE_REQUEST.VIEWPOINT_COLLECTION,
          errors: [],
        },
        {
          name: "title",
          value: "",
          errors: [],
        },
        {
          name: "description",
          value: "",
          errors: [],
        },
        {
          name: "from",
          value: {
            value: currentVPCollection?.detail?.name,
            id: currentVPCollection?.id,
          },
          errors: [],
        },
        {
          name: "mergeInto",
          value:
            currentVPCollection?.cloneCollectionId &&
            !currentVPCollection?.cloneCollection?.isDeleted
              ? {
                  value: currentVPCollection?.cloneCollection?.detail?.name,
                  id: currentVPCollection?.cloneCollection?.id,
                }
              : "",
          errors: [],
        },
        {
          name: "approver",
          value:
            currentVPCollection?.cloneCollectionId &&
            !currentVPCollection?.cloneCollection?.isDeleted
              ? {
                  value:
                    currentVPCollection?.cloneCollection?.userCreate?.account,
                  id: currentVPCollection?.cloneCollection?.userCreate?.id,
                }
              : "",
          errors: [],
        },
      ]);
    }
  }, [currentVPCollection, open]);

  return (
    <Modal
      title={t("common:common.create_merge_request")}
      visible={open}
      width={1000}
      onCancel={() => {
        handleCancel();
        form.resetFields();
      }}
      footer={[
        <Button
          key="cancel"
          onClick={() => {
            handleCancel();
            form.resetFields();
          }}
        >
          {t("common:common.cancel")}
        </Button>,
        <Button
          key="create"
          form="createMergeRequest"
          type="primary"
          htmlType="submit"
          loading={confirmLoading}
        >
          {t("common:common.create")}
        </Button>,
      ]}
    >
      <Wrapper>
        <Form
          id={"createMergeRequest"}
          form={form}
          name="basic"
          labelAlign="left"
          labelCol={{
            span: 6,
          }}
          wrapperCol={{
            span: 17,
          }}
          onFinish={onSubmit}
          autoComplete="off"
        >
          <Form.Item
            required
            label={t("common:common.type")}
            name="type"
            validateTrigger={VALIDATE_TRIGGER}
          >
            <Select
              disabled
              style={{
                width: 200,
              }}
            >
              <Option value={TYPE_REQUEST.VIEWPOINT_COLLECTION}>
                {t("common:viewpoint_collection.name")}
              </Option>
              <Option value={TYPE_REQUEST.PRODUCT}>
                {t("common:product.name")}
              </Option>
            </Select>
          </Form.Item>
          <Form.Item
            rules={[
              validateInput({
                messageRequired: t(
                  "validate:request_management.title_is_required"
                ),
                messageTrimSpace: t(
                  "validate:request_management.title_trim_space"
                ),
                messageNotContainSpecialCharacter: t(
                  "validate:request_management.title_not_contains_special_characters"
                ),
                maxLength: MAX_LENGTH_INPUT_NAME_FIELD,
                messageMaxLength: t(
                  "validate:request_management.title_max_length",
                  {
                    MAX_LENGTH_INPUT_NAME_FIELD: MAX_LENGTH_INPUT_NAME_FIELD,
                  }
                ),
              }),
            ]}
            validateTrigger={VALIDATE_TRIGGER}
            required
            name="title"
            label={t("common:common.title")}
          >
            <Input placeholder={t("common:common.title_placeholder")} />
          </Form.Item>

          <Form.Item
            validateTrigger={VALIDATE_TRIGGER}
            rules={[
              validateInput({
                messageTrimSpace: t(
                  "validate:request_management.description_trim_space"
                ),
                maxLength: MAX_LENGTH_TEXT_AREA,
                messageMaxLength: t(
                  "validate:request_management.description_max_length",
                  {
                    MAX_LENGTH_TEXT_AREA: MAX_LENGTH_TEXT_AREA,
                  }
                ),
              }),
            ]}
            label={t("common:common.description")}
            name="description"
          >
            <TextArea
              showCount
              maxLength={MAX_LENGTH_TEXT_AREA}
              rows={ROWS_DEFAULT_TEXT_AREA}
              placeholder={t(
                "common:request_management.description_placeholder"
              )}
            />
          </Form.Item>

          <Form.Item
            required
            label={t("common:common.from")}
            name="from"
            extra={`*${t("common:common.default_from_is_current_file")}`}
          >
            <AutoComplete className="auto-complete" maxLength={40} disabled>
              <Input.Search
                className="search-box"
                placeholder={t("common:common.search_placeholder")}
                enterButton={<SearchOutlined />}
              />
            </AutoComplete>
          </Form.Item>
          <Form.Item
            validateTrigger={VALIDATE_TRIGGER}
            rules={[
              validateInput({
                messageRequired: t(
                  "validate:request_management.merge_into_file_required"
                ),
                messageTrimSpace: t(
                  "validate:request_management.merge_into_trim_space"
                ),
                messageNotContainSpecialCharacter: t(
                  "validate:request_management.merge_into_can_not_contain_special_character"
                ),
                maxLength: MAX_LENGTH_INPUT_NAME_FIELD,
                messageMaxLength: t(
                  "validate:request_management.merge_into_max_length",
                  {
                    MAX_LENGTH_INPUT_NAME_FIELD: MAX_LENGTH_INPUT_NAME_FIELD,
                  }
                ),
              }),
            ]}
            required
            label={t("common:common.merge_into")}
            name="mergeInto"
            extra={`*${t(
              "common:detail_viewpoint_collection.only_merge_not_itself_viewpoint_collection"
            )}`}
          >
            <AutoComplete
              className="auto-complete"
              options={options}
              onSelect={onSelectAutoCompleted}
              onSearch={(value) => {
                handleSearchFrom(value);
              }}
              maxLength={MAX_LENGTH_INPUT_NAME_FIELD}
              showSearch
              backfill
              notFoundContent={t("common:common.not_found")}
              filterOption={(input, option) => {
                return (
                  option?.props?.value
                    ?.toLowerCase()
                    ?.indexOf(input?.trim()?.toLowerCase()) >= 0
                );
              }}
            >
              <Input.Search
                loading={loadingSearch}
                className="search-box"
                placeholder={t("common:common.search_placeholder")}
                enterButton={<SearchOutlined />}
              />
            </AutoComplete>
          </Form.Item>
          <Form.Item
            style={{ display: "none" }}
            required
            label={t("common:common.approver")}
            name="approver"
            extra={`*${t("common:common.only_owner_can_approve")}`}
          >
            <AutoComplete
              className="auto-complete"
              dropdownMatchSelectWidth={252}
              maxLength={MAX_LENGTH_INPUT_NAME_FIELD}
              disabled
            >
              <Input.Search
                className="search-box"
                placeholder={t("common:common.search_placeholder")}
                enterButton={<SearchOutlined />}
              />
            </AutoComplete>
          </Form.Item>
        </Form>
      </Wrapper>
    </Modal>
  );
};

export default ModalCreateRequest;
