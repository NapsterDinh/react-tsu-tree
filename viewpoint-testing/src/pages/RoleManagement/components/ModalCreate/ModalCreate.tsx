import { roleApi } from "@services/roleAPI";
import { FUNCTION } from "@utils/constants";
import {
  MAX_LENGTH_INPUT_NAME_FIELD,
  MAX_LENGTH_TEXT_AREA,
  MIN_LENGTH_INPUT,
} from "@utils/constantsUI";
import { showSuccessNotification } from "@utils/notificationUtils";
import { validateInput } from "@utils/validateFormUtils";
import { Button, Checkbox, Form, Input, Modal, Switch, Table } from "antd";
import type { CheckboxChangeEvent } from "antd/es/checkbox";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

interface DataType {
  key: React.Key;
  function: string;
  view: any;
  create: any;
  update: any;
  delete: any;
  clone: any;
  approve: any;
  reject: any;
}

const ModalCreate = ({
  isModalOpenCreate,
  handleOkCreate,
  handleCancelCreate,
  setIsModalOpenCreate,
  permissions,
  setPermissions,
  setLoading,
  handleGetAllRole,
}) => {
  const { t } = useTranslation(["common", "validate"]); // languages
  const [data, setData] = useState<any>([]);
  const [permissionIds, setPermissionIds] = useState<any>([]);
  const [errorMessage, setErrorMessage] = useState<any>();
  const [form] = Form.useForm();

  const columns: ColumnsType<DataType> = [
    {
      title: t("common:common.function"),
      dataIndex: "function",
    },
    {
      title: t("common:common.view"),
      dataIndex: "view",
      align: "center",
    },
    {
      title: t("common:common.create"),
      dataIndex: "create",
      align: "center",
    },
    {
      title: t("common:common.update"),
      dataIndex: "update",
      align: "center",
    },
    {
      title: t("common:common.delete"),
      dataIndex: "delete",
      align: "center",
    },
    {
      title: t("common:common.clone"),
      dataIndex: "clone",
      align: "center",
    },
    {
      title: t("common:common.approve"),
      dataIndex: "approve",
      align: "center",
    },
    {
      title: t("common:common.reject"),
      dataIndex: "reject",
      align: "center",
    },
  ];

  const onChange = (e: CheckboxChangeEvent, i) => {
    if (e.target.checked) {
      setPermissionIds([...permissionIds, i?.[0]?.id]);
    } else {
      const unCheckValue = permissionIds.slice(
        permissionIds.indexOf(i?.[0].id),
        permissionIds.indexOf(i?.[0].id) + 1
      );
      const newArr = permissionIds.filter((e) => {
        return e !== unCheckValue[0];
      });
      setPermissionIds(newArr);
    }
  };
  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      await roleApi.createRole({ ...values, permissionIds });
      showSuccessNotification(t("common:role_management.create_successfully"));
      handleGetAllRole();
      setIsModalOpenCreate(false);
      form.resetFields();
    } catch (error) {
      setErrorMessage(error);
    } finally {
      setLoading(false);
    }
  };

  const changeState = () => {
    const newList = { Data: [] };
    for (let i = 0; i < permissions?.length; i++) {
      newList.Data.push({
        key: i,
        view:
          permissions[i]?.permissions?.filter((x) => {
            return x?.name?.includes("VIEW");
          })?.length > 0 ? (
            <Checkbox
              onChange={(e) =>
                onChange(
                  e,
                  permissions[i]?.permissions?.filter((x) => {
                    return x?.name?.includes("VIEW");
                  })
                )
              }
            ></Checkbox>
          ) : (
            <Checkbox disabled></Checkbox>
          ),
        create:
          permissions[i]?.permissions?.filter((x) => {
            return x?.name?.includes("CREATE");
          })?.length > 0 ? (
            <Checkbox
              onChange={(e) =>
                onChange(
                  e,
                  permissions[i]?.permissions?.filter((x) => {
                    return x?.name?.includes("CREATE");
                  })
                )
              }
            ></Checkbox>
          ) : (
            <Checkbox disabled></Checkbox>
          ),
        update:
          permissions[i]?.permissions?.filter((x) => {
            return x?.name?.includes("UPDATE");
          })?.length > 0 ? (
            <Checkbox
              onChange={(e) =>
                onChange(
                  e,
                  permissions[i]?.permissions?.filter((x) => {
                    return x?.name?.includes("UPDATE");
                  })
                )
              }
            ></Checkbox>
          ) : (
            <Checkbox disabled></Checkbox>
          ),
        delete:
          permissions[i]?.permissions?.filter((x) => {
            return x?.name?.includes("DELETE");
          })?.length > 0 ? (
            <Checkbox
              onChange={(e) =>
                onChange(
                  e,
                  permissions[i]?.permissions?.filter((x) => {
                    return x?.name?.includes("DELETE");
                  })
                )
              }
            ></Checkbox>
          ) : (
            <Checkbox disabled></Checkbox>
          ),
        clone:
          permissions[i]?.permissions?.filter((x) => {
            return x?.name?.includes("CLONE");
          })?.length > 0 ? (
            <Checkbox
              onChange={(e) =>
                onChange(
                  e,
                  permissions[i]?.permissions?.filter((x) => {
                    return x?.name?.includes("CLONE");
                  })
                )
              }
            ></Checkbox>
          ) : (
            <Checkbox disabled></Checkbox>
          ),
        approve:
          permissions[i]?.permissions?.filter((x) => {
            return x?.name?.includes("APPROVE");
          })?.length > 0 ? (
            <Checkbox
              onChange={(e) =>
                onChange(
                  e,
                  permissions[i]?.permissions?.filter((x) => {
                    return x?.name?.includes("APPROVE");
                  })
                )
              }
            ></Checkbox>
          ) : (
            <Checkbox disabled></Checkbox>
          ),
        reject:
          permissions[i]?.permissions?.filter((x) => {
            return x?.name?.includes("REJECT");
          })?.length > 0 ? (
            <Checkbox
              onChange={(e) =>
                onChange(
                  e,
                  permissions[i]?.permissions?.filter((x) => {
                    return x?.name?.includes("REJECT");
                  })
                )
              }
            ></Checkbox>
          ) : (
            <Checkbox disabled></Checkbox>
          ),
        function: FUNCTION[i]?.func,
      });
    }
    setData(newList);
  };
  
  useEffect(() => {
    if (errorMessage) {
      form.setFields([
        {
          name: "roleName",
          errors: [t(`responseMessage:${errorMessage?.code}`)],
        },
      ]);
    }
    if (permissionIds?.length == 0) {
      form.setFields([
        {
          name: "table",
          errors: ["erorr"],
        },
      ]);
    }
  }, [errorMessage, form]);

  useEffect(() => {
    changeState();
  }, [permissions, permissionIds]);

  return (
    <Modal
      forceRender
      title={t("common:role_management.modal_create")}
      visible={isModalOpenCreate}
      onOk={() => handleOkCreate()}
      onCancel={() => {
        form.resetFields();
        setPermissions(null);
        setPermissionIds([]);
        handleCancelCreate();
      }}
      width={1200}
      footer={[
        <Button
          key="cancel"
          htmlType="button"
          onClick={(): void => {
            form.resetFields();

            setPermissions(null);
            setPermissionIds([]);
            handleCancelCreate();
          }}
        >
          {t("common:common.cancel")}
        </Button>,
        <Button
          form="createRoleForm"
          key="create"
          type="primary"
          htmlType="submit"
        >
          {t("common:common.create")}
        </Button>,
      ]}
      style={{ top: 20 }}
    >
      <Form
        id="createRoleForm"
        form={form}
        labelAlign="left"
        labelCol={{
          span: 6,
        }}
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label={t("common:common.name")}
          name="roleName"
          required
          rules={[
            validateInput({
              messageRequired: t("validate:role_management.name_is_required"),
              messageTrimSpace: t("validate:role_management.name_trim_space"),
              messageNotContainSpecialCharacter: t(
                "validate:role_management.name_can_not_contains_special_characters"
              ),
              maxLength: MAX_LENGTH_INPUT_NAME_FIELD,
              messageMaxLength: t("validate:role_management.name_max_length", {
                MAX_LENGTH_INPUT_NAME_FIELD: MAX_LENGTH_INPUT_NAME_FIELD,
              }),
              minLength: MIN_LENGTH_INPUT,
              messageMinLength: t("validate:role_management.name_min_length", {
                MIN_LENGTH_INPUT: MIN_LENGTH_INPUT,
              }),
            }),
          ]}
          validateTrigger={["onBlur", "onChange"]}
        >
          <Input placeholder={t("common:role_management.name_placeholder")} />
        </Form.Item>
        <Form.Item
          label={t("common:common.description")}
          name="description"
          validateTrigger={["onBlur", "onChange"]}
          rules={[
            validateInput({
              messageTrimSpace: t(
                "validate:role_management.description_trim_space"
              ),
              maxLength: MAX_LENGTH_TEXT_AREA,
              messageMaxLength: t(
                "validate:role_management.description_max_length",
                {
                  MAX_LENGTH_TEXT_AREA: MAX_LENGTH_TEXT_AREA,
                }
              ),
            }),
          ]}
        >
          <Input.TextArea
            showCount
            maxLength={MAX_LENGTH_TEXT_AREA}
            rows={4}
            placeholder={t("common:role_management.description_placeholder")}
          />
        </Form.Item>
        <Form.Item
          label={t("common:common.status")}
          name="isActive"
          valuePropName="checked"
          validateTrigger={["onBlur", "onChange"]}
        >
          <Switch />
        </Form.Item>
        <Form.Item
          name="permissions"
          labelCol={{ span: 24, offset: 0 }}
          validateTrigger={["onBlur", "onChange"]}
          rules={[
            {
              required: permissionIds.length == 0 ? true : false,
              message: t("validate:role_management.permission_required"),
            },
          ]}
        >
          <Table columns={columns} dataSource={data?.Data} pagination={false} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalCreate;
