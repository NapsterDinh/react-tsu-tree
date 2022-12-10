import { userActions } from "@redux/slices";
import { RootState } from "@redux/store";
import viewpointCollectionAPI from "@services/viewpointCollectionAPI";
import productAPI from "@services/productAPI";
import { MAX_LENGTH_INPUT_NAME_FIELD } from "@utils/constantsUI";
import {
  checkContainsSpecialCharacter,
  removeEmoji,
} from "@utils/helpersUtils";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@utils/notificationUtils";
import { Button, Form, List, Modal, Popconfirm, Select, Skeleton } from "antd";
import * as React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Wrapper } from "./ModalAddMembers.Styled";

const ModalAddMembers = ({
  visible,
  onCancel,
  entity,
  checkOwner,
  isViewpointCollection = true,
}) => {
  const [options, setOptions] = useState<any>([]);
  const [lists, setLists] = useState<any>([]);
  const { t } = useTranslation(["common", "validate", "responseMessage"]);
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const { resultSearch, loadingSearch } = useSelector(
    (state: RootState) => state.user
  );

  const onFinish = async (values: any) => {
    try {
      let res = null;
      if (isViewpointCollection) {
        res = await viewpointCollectionAPI.addMember({
          id: entity?.id,
          data: values,
        });
      } else {
        res = await productAPI.addMember({
          id: entity?.id,
          data: values,
        });
      }

      setLists([...res?.data?.listOwner]);
      showSuccessNotification(t("common:common.add_members_successfully"));
    } catch (error) {
      if (error?.code) {
        showErrorNotification(t(`responseMessage:${error?.code}`));
      }
    } finally {
      form.resetFields();
    }
  };

  const handleSearchFrom = async (value) => {
    validateUserAccount(value);
    try {
      dispatch(
        userActions.searchUser({
          payload: { search: value?.trim() },
        })
      );
    } catch (error) {
      if (error?.code) {
        showErrorNotification(t(`responseMessage:${error?.code}`));
      }
    }
  };

  const validateUserAccount = (value) => {
    const newValue = !value
      ? ""
      : typeof value === "object"
      ? value.value
      : value;

    if (!newValue && form.getFieldValue("userId")?.length === 0) {
      form.setFields([
        {
          name: "userId",
          errors: [t("validate:add_members.user_account_is_required")],
        },
      ]);
      return;
    } else if (newValue.startsWith(" ") || newValue.endsWith(" ")) {
      form.setFields([
        {
          name: "userId",
          errors: [t("validate:add_members.user_account_trim_space")],
        },
      ]);
      return;
    } else if (checkContainsSpecialCharacter(newValue)) {
      form.setFields([
        {
          name: "userId",
          errors: [
            t(
              "validate:add_members.user_account_can_not_contain_special_characters"
            ),
          ],
        },
      ]);
      return;
    } else if (removeEmoji(newValue)) {
      form.setFields([
        {
          name: "userId",
          errors: [
            t(
              "validate:add_members.user_account_can_not_contain_special_characters"
            ),
          ],
        },
      ]);
      return;
    } else if (newValue.length > MAX_LENGTH_INPUT_NAME_FIELD) {
      form.setFields([
        {
          name: "userId",
          errors: [
            t("validate:add_members.user_account_max_length", {
              MAX_LENGTH_INPUT_NAME_FIELD: MAX_LENGTH_INPUT_NAME_FIELD,
            }),
          ],
        },
      ]);
      return;
    }
    form.setFields([
      {
        name: "userId",
        errors: [],
      },
    ]);
  };

  React.useEffect(() => {
    if (entity) {
      if (lists.length === 0) {
        const newList = [];
        entity?.listOwner.map((e) => newList.push(e?.id));
        setOptions(
          resultSearch
            .filter((item) => {
              return !newList.includes(item?.id);
            })
            .map((item) => ({
              value: item.id,
              label: item.account,
            }))
        );
      } else {
        const newList = [];
        lists.map((e) => newList.push(e?.id));
        setOptions(
          resultSearch
            .filter((item) => {
              return !newList.includes(item?.id);
            })
            .map((item) => ({
              value: item.id,
              label: item.account,
            }))
        );
      }
    }
  }, [resultSearch]);

  React.useEffect(() => {
    if (entity) {
      setLists([...entity.listOwner]);
    }
  }, [entity]);
  const confirm = async (e: any) => {
    try {
      if (isViewpointCollection) {
        await viewpointCollectionAPI.removeOwner({
          id: entity.id,
          data: { userId: [e.id] },
        });
      } else {
        await productAPI.removeOwner({
          id: entity.id,
          data: { userId: [e.id] },
        });
      }

      setLists((olds) => {
        const newLists = olds.filter((old) => {
          return old.id !== e.id;
        });
        return newLists;
      });
      showSuccessNotification(t("common:viewpoint_collection.remove_owner"));
    } catch (error) {
      if (error?.code) {
        showErrorNotification(t(`responseMessage:${error?.code}`));
      }
    }
  };

  const renderItem = (item) => {
    if (checkOwner) {
      if (entity.userCreate.id !== item.id) {
        return (
          <Popconfirm
            placement="bottomRight"
            title={t("common:common.remove_member")}
            onConfirm={() => confirm(item)}
            okText={t("common:common.remove")}
            cancelText={t("common:common.cancel")}
          >
            <Button>{t("common:common.remove")}</Button>
          </Popconfirm>
        );
      }
    }
    if (entity.userCreate.id === item.id) {
      return (
        <span style={{ padding: "4px 15px", width: 85.7 }}>
          {t("common:common.owner")}
        </span>
      );
    } else {
      return (
        <span style={{ padding: "4px 15px" }}>{t("common:common.member")}</span>
      );
    }
  };

  return (
    <Modal
      forceRender
      title={t("common:common.member_list")}
      visible={visible}
      onOk={() => {
        form.validateFields().then((values) => {
          onFinish(values);
        });
      }}
      onCancel={() => {
        form.resetFields();
        setOptions([]);
        onCancel();
      }}
      width={900}
      footer={null}
      style={{ top: 20 }}
    >
      <Wrapper>
        {checkOwner && (
          <Form
            form={form}
            layout="inline"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              required
              label={t("common:common.search")}
              name="userId"
              style={{ flex: "1" }}
            >
              <Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder={t("common:common.search_account_name")}
                optionLabelProp="label"
                options={options}
                onSearch={handleSearchFrom}
                onKeyDown={(event: any) => {
                  if (
                    event.code === "Delete" ||
                    event.code === "Backspace" ||
                    event.code === "Enter"
                  ) {
                    const temp = event.target.value.split("");
                    temp.pop();
                    validateUserAccount(temp.toString().replaceAll(",", ""));
                  }
                }}
                filterOption={(input, option) => {
                  return (
                    option?.props?.label
                      ?.toLowerCase()
                      ?.indexOf(input?.trim()?.toLowerCase()) >= 0 ||
                    option.props.value
                      ?.toLowerCase()
                      ?.indexOf(input?.trim()?.toLowerCase()) >= 0
                  );
                }}
                onBlur={() => {
                  form.setFields([
                    {
                      name: "userId",
                      errors: [],
                    },
                  ]);
                  setOptions([]);
                }}
                loading={loadingSearch}
                showSearch
                allowClear
              ></Select>
            </Form.Item>
            <Form.Item style={{ marginRight: "0" }}>
              <Button
                style={{ width: 85.7 }}
                type="primary"
                htmlType="submit"
                disabled={
                  !form.getFieldValue("userId") ||
                  form.getFieldValue("userId")?.length === 0
                }
              >
                {t("common:common.add")}
              </Button>
            </Form.Item>
          </Form>
        )}
        <List
          className="demo-loadmore-list"
          itemLayout="horizontal"
          dataSource={lists}
          renderItem={(item: any) => {
            return (
              <List.Item>
                <Skeleton avatar loading={false} title={false} active>
                  <List.Item.Meta
                    title={<span>{item?.userName}</span>}
                    description={item?.email}
                  />
                  {renderItem(item)}
                </Skeleton>
              </List.Item>
            );
          }}
        />
      </Wrapper>
    </Modal>
  );
};

export default ModalAddMembers;
