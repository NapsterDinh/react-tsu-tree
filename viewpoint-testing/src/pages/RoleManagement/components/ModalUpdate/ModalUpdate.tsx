import { IPermission } from "@models/model";
import { roleApi } from "@services/roleAPI";
import { FUNCTION } from "@utils/constants";
import {
  MAX_LENGTH_INPUT_NAME_FIELD,
  MAX_LENGTH_TEXT_AREA,
  MIN_LENGTH_INPUT,
} from "@utils/constantsUI";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@utils/notificationUtils";
import { validateInput } from "@utils/validateFormUtils";
import { Button, Checkbox, Form, Input, Modal, Switch, Table } from "antd";
import type { ColumnsType } from "antd/es/table";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ModalUpdateWrapper } from "./ModelUpdateWrapper";
interface DataType {
  key: React.Key;
  function: string;
  view: any;
  create: any;
  edit: any;
  delete: any;
  clone: any;
  approve: any;
  reject: any;
}

const ModalUpdate = ({
  isModalOpenUpdate,
  setIsModalOpenUpdate,
  form,
  detailRole,
  permissions,
  setLoading,
  setDetailRole,
  handleGetAllRole,
  checkPermission,
}) => {
  const { t } = useTranslation(["common", "validate"]); // languages
  const [data, setData] = useState<any>([]);
  const [permissionIds, setPermissionIds] = useState<string[]>([]);

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

  const handleUpdateRole = async (values: any) => {
    try {
      setLoading(true);
      await roleApi.updatePermissions({ permissionIds }, detailRole?.id);
      await roleApi.updateRole(values, detailRole?.id);
      showSuccessNotification(t("common:role_management.update_successfully"));
      handleCancelUpdate();
      handleGetAllRole();
    } catch (error) {
      if (error?.code === "RoleExisted" || error?.code === "RoleIdInvalid") {
        form.setFields([
          {
            name: "roleName",
            errors: [t(`responseMessage:${error?.code}`)],
          },
        ]);
      } else {
        if (error?.code) {
          showErrorNotification(t(`responseMessage:${error?.code}`));
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancelUpdate = () => {
    setIsModalOpenUpdate(false);
    setPermissionIds([]);
    setData([]);
    setDetailRole(null);
    form.resetFields();
  };

  // handle click check box
  const onChange = (e, i: IPermission[]) => {
    if (e.target.checked) {
      setPermissionIds((prev) => [...prev, i[0].id]);
    } else {
      permissionIds.slice(
        permissionIds.indexOf(i?.[0]?.id),
        permissionIds.indexOf(i?.[0]?.id) + 1
      );

      setPermissionIds(permissionIds);
    }
  };

  const changeState = () => {
    const permissionNameList = detailRole?.permissions.map(
      (permission: IPermission) => permission?.functionName
    );
    const currentPermissions = FUNCTION.map((e) => {
      if (permissionNameList?.includes(e?.key)) {
        return {
          id: detailRole?.permissions?.[permissionNameList.indexOf(e?.key)]?.id,
          functionName:
            detailRole?.permissions?.[permissionNameList.indexOf(e?.key)]
              ?.functionName,
          permissions:
            detailRole?.permissions?.[permissionNameList.indexOf(e?.key)]
              ?.permissions,
          permissionType:
            detailRole?.permissions?.[permissionNameList.indexOf(e?.key)]
              ?.permissionType,
        };
      } else {
        return {
          id: null,
          functionName: null,
          permissions: [],
          permissionType: null,
        };
      }
    });

    const newList = [];

    for (let i = 0; i < FUNCTION.length; i++) {
      newList.push({
        key: i,
        view:
          permissions?.[i]?.permissions.filter((a) => a?.name?.includes("VIEW"))
            ?.length == 0 ? (
            <Checkbox disabled></Checkbox>
          ) : currentPermissions?.[i]?.permissions.filter((x) => {
              return x?.name?.includes("VIEW");
            })?.length > 0 ? (
            <Checkbox
              defaultChecked
              onChange={(e) =>
                onChange(
                  e,
                  currentPermissions?.[i]?.permissions?.filter((x) => {
                    return x?.name?.includes("VIEW");
                  })
                )
              }
            ></Checkbox>
          ) : (
            <Checkbox
              onChange={(e) =>
                onChange(
                  e,
                  permissions?.[i]?.permissions.filter((x) => {
                    return x?.name?.includes("VIEW");
                  })
                )
              }
            ></Checkbox>
          ),
        create:
          permissions?.[i]?.permissions.filter((a) =>
            a?.name?.includes("CREATE")
          ).length == 0 ? (
            <Checkbox disabled></Checkbox>
          ) : currentPermissions[i]?.permissions.filter((x) => {
              return x?.name?.includes("CREATE");
            })?.length > 0 ? (
            <Checkbox
              defaultChecked
              onChange={(e) =>
                onChange(
                  e,
                  currentPermissions?.[i]?.permissions.filter((x) => {
                    return x?.name?.includes("CREATE");
                  })
                )
              }
            ></Checkbox>
          ) : (
            <Checkbox
              onChange={(e) =>
                onChange(
                  e,
                  permissions?.[i]?.permissions.filter((x) => {
                    return x?.name?.includes("CREATE");
                  })
                )
              }
            ></Checkbox>
          ),
        update:
          permissions?.[i]?.permissions.filter((a) =>
            a?.name?.includes("UPDATE")
          )?.length == 0 ? (
            <Checkbox disabled></Checkbox>
          ) : currentPermissions[i]?.permissions.filter((x) => {
              return x?.name?.includes("UPDATE");
            })?.length > 0 ? (
            <Checkbox
              defaultChecked
              onChange={(e) =>
                onChange(
                  e,
                  currentPermissions?.[i]?.permissions.filter((x) => {
                    return x?.name?.includes("UPDATE");
                  })
                )
              }
            ></Checkbox>
          ) : (
            <Checkbox
              onChange={(e) =>
                onChange(
                  e,
                  permissions?.[i]?.permissions.filter((x) => {
                    return x?.name?.includes("UPDATE");
                  })
                )
              }
            ></Checkbox>
          ),
        delete:
          permissions?.[i]?.permissions.filter((a) =>
            a?.name?.includes("DELETE")
          ).length == 0 ? (
            <Checkbox disabled></Checkbox>
          ) : currentPermissions?.[i]?.permissions.filter((x) => {
              return x?.name?.includes("DELETE");
            })?.length > 0 ? (
            <Checkbox
              defaultChecked
              onChange={(e) =>
                onChange(
                  e,
                  currentPermissions?.[i]?.permissions.filter((x) => {
                    return x?.name?.includes("DELETE");
                  })
                )
              }
            ></Checkbox>
          ) : (
            <Checkbox
              onChange={(e) =>
                onChange(
                  e,
                  permissions?.[i]?.permissions.filter((x) => {
                    return x?.name?.includes("DELETE");
                  })
                )
              }
            ></Checkbox>
          ),
        clone:
          permissions?.[i]?.permissions.filter((a) => a?.name.includes("CLONE"))
            ?.length == 0 ? (
            <Checkbox disabled></Checkbox>
          ) : currentPermissions?.[i]?.permissions.filter((x) => {
              return x?.name?.includes("CLONE");
            })?.length > 0 ? (
            <Checkbox
              defaultChecked
              onChange={(e) =>
                onChange(
                  e,
                  currentPermissions?.[i]?.permissions.filter((x) => {
                    return x?.name?.includes("CLONE");
                  })
                )
              }
            ></Checkbox>
          ) : (
            <Checkbox
              onChange={(e) =>
                onChange(
                  e,
                  permissions?.[i]?.permissions.filter((x) => {
                    return x?.name?.includes("CLONE");
                  })
                )
              }
            ></Checkbox>
          ),
        approve:
          permissions?.[i]?.permissions.filter((a) =>
            a?.name?.includes("APPROVE")
          ).length == 0 ? (
            <Checkbox disabled></Checkbox>
          ) : currentPermissions[i]?.permissions.filter((x) => {
              return x?.name?.includes("APPROVE");
            })?.length > 0 ? (
            <Checkbox
              defaultChecked
              onChange={(e) =>
                onChange(
                  e,
                  currentPermissions?.[i]?.permissions.filter((x) => {
                    return x?.name?.includes("APPROVE");
                  })
                )
              }
            ></Checkbox>
          ) : (
            <Checkbox
              onChange={(e) =>
                onChange(
                  e,
                  permissions?.[i]?.permissions.filter((x) => {
                    return x?.name?.includes("APPROVE");
                  })
                )
              }
            ></Checkbox>
          ),
        reject:
          permissions?.[i]?.permissions.filter((a) =>
            a?.name?.includes("REJECT")
          ).length == 0 ? (
            <Checkbox disabled></Checkbox>
          ) : currentPermissions?.[i]?.permissions.filter((x) => {
              return x?.name?.includes("REJECT");
            })?.length > 0 ? (
            <Checkbox
              defaultChecked
              onChange={(e) =>
                onChange(
                  e,
                  currentPermissions?.[i]?.permissions.filter((x) => {
                    return x?.name?.includes("REJECT");
                  })
                )
              }
            ></Checkbox>
          ) : (
            <Checkbox
              onChange={(e) =>
                onChange(
                  e,
                  permissions?.[i]?.permissions.filter((x) => {
                    return x?.name?.includes("REJECT");
                  })
                )
              }
            ></Checkbox>
          ),
        function: FUNCTION?.[i].func as string,
      });
    }
    setData(newList);
  };

  useEffect(() => {
    if (detailRole) {
      changeState();
      form.setFieldsValue({
        roleName: detailRole?.name,
        description: detailRole?.description,
        isActive: detailRole?.isActive,
      });

      const permissionIdList = [];
      detailRole?.permissions?.forEach((e) => {
        e?.permissions.forEach((i) => {
          permissionIdList.push(i.id);
        });
      });
      setPermissionIds(permissionIdList);
    }
  }, [detailRole, isModalOpenUpdate]);

  return (
    <ModalUpdateWrapper>
      <Modal
        forceRender
        title={t("common:role_management.modal_update")}
        visible={isModalOpenUpdate}
        onCancel={handleCancelUpdate}
        width={1200}
        style={{ top: 20 }}
        footer={[
          <Button key="cancel" htmlType="button" onClick={handleCancelUpdate}>
            {t("common:common.cancel")}
          </Button>,
          <Button
            key="update"
            form="updateRoleForm"
            disabled={!checkPermission(["ROLE.UPDATE"])}
            type="primary"
            htmlType="submit"
          >
            {t("common:common.update")}
          </Button>,
        ]}
      >
        <Form
          id="updateRoleForm"
          labelAlign="left"
          form={form}
          labelCol={{
            span: 6,
          }}
          onFinish={handleUpdateRole}
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
                messageMaxLength: t(
                  "validate:role_management.name_max_length",
                  {
                    MAX_LENGTH_INPUT_NAME_FIELD: MAX_LENGTH_INPUT_NAME_FIELD,
                  }
                ),
                minLength: MIN_LENGTH_INPUT,
                messageMinLength: t(
                  "validate:role_management.name_min_length",
                  {
                    MIN_LENGTH_INPUT: MIN_LENGTH_INPUT,
                  }
                ),
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
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="permissions"
            validateTrigger={["onBlur", "onChange"]}
            rules={[
              {
                required: permissionIds.length == 0 ? true : false,
                message: t("validate:role_management.permission_required"),
              },
            ]}
          >
            <Table columns={columns} dataSource={data} pagination={false} />
          </Form.Item>
        </Form>
      </Modal>
    </ModalUpdateWrapper>
  );
};

export default ModalUpdate;
