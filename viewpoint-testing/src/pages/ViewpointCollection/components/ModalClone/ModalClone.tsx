import { Domain, IResponseData } from "@models/model";
import viewpointCollectionAPI from "@services/viewpointCollectionAPI";
import { PROCESSING_STATUS, PUBLISH_STATUS } from "@utils/constants";
import {
  MAX_LENGTH_INPUT_NAME_FIELD,
  MAX_LENGTH_TEXT_AREA,
} from "@utils/constantsUI";
import { deepCopy } from "@utils/helpersUtils";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@utils/notificationUtils";
import {
  generateFlattenedTreeList,
  getAllIdTreeData,
  loopAllLockNode,
} from "@utils/treeUtils";
import { validateInput, VALIDATE_TRIGGER } from "@utils/validateFormUtils";
import {
  Button,
  Empty,
  Form,
  Input,
  Modal,
  Select,
  Spin,
  Tree,
  TreeSelect
} from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { routes } from "routes";
const ModalClone = ({
  setLoading,
  isModalOpen,
  valueSelect,
  treeDataDomainSelector,
  setValueSelect,
  setIsModalOpen,
  loading,
}) => {
  const { t } = useTranslation(["common", "validate", "responseMessage"]); // languages
  const navigate = useNavigate();
  const [cloneForm] = Form.useForm(); // clone form
  const [flattenedTreeData, setFlattenedTreeData] = useState([]); // flattened tree data has converted from response tree data from BE
  const [selectedViewpoints, setSelectedViewpoints] = useState([]); // list of selected viewpoints to handle call api
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]); // list of selected keys to show checked viewpoint in UI
  const [currentVPCollection, setCurrentVPCollection] = useState(null); // response data viewpoint collection from BE
  const [loadingClone, setLoadingClone] = useState(false); // loading for list viewpoints of selected viewpoint collection on form clone

  // handle cancel clone form
  // reset all state
  const handleCancelCloneViewpointCollection = () => {
    setCheckedKeys([]);
    setFlattenedTreeData([]);
    setSelectedViewpoints([]);
    setValueSelect(null);
    setCurrentVPCollection(null);
    setIsModalOpen(false);
    cloneForm.resetFields();
  };

  // handle submit clone collection
  const handleCloneViewpointCollection = async (values: any) => {
    try {
      setLoading(true); // set loading on modal clone viewpoint collection
      const contentLanguage = localStorage.getItem("dataLanguage"); // get content language in local storage
      const clonedViewpointList = []; // temp variable to store list of viewpoints

      // map in flattened tree data viewpoint collection to find list of selected viewpoints
      flattenedTreeData?.map((viewpoint) => {
        if (selectedViewpoints.includes(viewpoint.key)) {
          const orderList = viewpoint?.orderStrings?.filter((id: string) =>
            selectedViewpoints.includes(id)
          );
          clonedViewpointList.push({
            id: viewpoint.key,
            viewDetail: JSON.stringify([viewpoint.viewDetail]),
            viewPointCollectionId: viewpoint.viewPointCollectionId,
            parentId: viewpoint.parentId,
            orderStrings: JSON.stringify(orderList),
            isLocked: viewpoint.isLocked,
          });
        }
      });

      // filter list of orderStrings using selected viewpoints
      const orderParentList = currentVPCollection.orderStrings.filter(
        (id: string) => selectedViewpoints.includes(id)
      );

      // data body to send to the server
      const dataBody = {
        detail: JSON.stringify([
          {
            name: values?.name?.trim(),
            language: contentLanguage,
            description: values?.description?.trim(),
          },
        ]),
        processingStatus: +PROCESSING_STATUS.ON_GOING,
        publishStatus: +PUBLISH_STATUS.PUBLISHING,
        cloneCollectionId: currentVPCollection?.id,
        domainIds: values?.domainIds?.map((item) => item?.value),
        viewPoints: clonedViewpointList,
        orderStrings: orderParentList,
      };

      const response: IResponseData =
        await viewpointCollectionAPI.cloneCollection({
          payload: dataBody,
        });

      if (response?.isSucceeded) {
        const id = response.data.id;
        navigate(`${routes.ViewpointCollection.path[0]}/${id}`);
        showSuccessNotification(
          t("common:viewpoint_collection.clone_successfully")
        );
        handleCancelCloneViewpointCollection();
      }
    } catch (error) {
      if (error.code === "ViewPointCollectionNameExisted") {
        cloneForm.setFields([
          {
            name: "name",
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

  // handle check and uncheck viewpoint
  const handleCheckViewpoint = (checkedKeysValue: React.Key[], info: any) => {
    setCheckedKeys(checkedKeysValue);
    setSelectedViewpoints([...checkedKeysValue, ...info.halfCheckedKeys]);
  };

  useEffect(() => {
    (async () => {
      if (valueSelect) {
        try {
          setLoadingClone(true); // set loading for list of viewpoints to select for calling api
          const response =
            await viewpointCollectionAPI.getViewpointCollectionById(
              valueSelect?.id
            );
          setCurrentVPCollection(response?.data);

          // set default domain list of cloned viewpoint collection like domain list of viewpoint collection be cloned
          cloneForm.setFieldValue(
            "domainIds",
            response?.data?.domains.map((domain: Domain) => {
              return { label: domain?.detail?.name, value: domain?.id };
            })
          );

          const treeData = deepCopy(response.data?.hierachyViewPointDetail); // copy tree data from response data
          const selectedAllViewpoint = []; // temp variable to store all viewpoint id of viewpoint collection
          const flattenedData = []; // temp variable to store flattened viewpoint of viewpoint collection
          getAllIdTreeData(selectedAllViewpoint, treeData); // get all viewpoint id of viewpoint collection
          generateFlattenedTreeList(treeData, flattenedData); // generate flattened tree data
          setCheckedKeys(selectedAllViewpoint); // set all viewpoint id of viewpoint collection to show on UI
          setSelectedViewpoints(selectedAllViewpoint); // set all viewpoint id of viewpoint collection to call api
          setFlattenedTreeData(flattenedData); // set flattened viewpoint of viewpoint collection
        } catch (error) {
          if (error?.code) {
            showErrorNotification(t(`responseMessage:${error?.code}`));
          }
        } finally {
          setLoadingClone(false);
        }
      }
    })();
  }, [isModalOpen, valueSelect]);

  return (
    <Modal
      title={t("common:viewpoint_collection.modal_clone")}
      visible={isModalOpen}
      onCancel={handleCancelCloneViewpointCollection}
      width={1000}
      footer={[
        <Button
          key="cancel"
          htmlType="button"
          onClick={handleCancelCloneViewpointCollection}
        >
          {t("common:common.cancel")}
        </Button>,
        <Button
          key="clone"
          form="cloneViewpointCollection"
          type="primary"
          loading={loading}
          htmlType="submit"
        >
          {t("common:common.clone")}
        </Button>,
      ]}
      style={{ top: 20 }}
    >
      <Form
        id="cloneViewpointCollection"
        layout="vertical"
        onFinish={handleCloneViewpointCollection}
        autoComplete="off"
        form={cloneForm}
        initialValues={{
          name: "",
          description: "",
          domainIds: [],
          ProcessingStatus: PROCESSING_STATUS.ON_GOING,
          PublishStatus: PUBLISH_STATUS.PUBLISHING,
        }}
      >
        <Form.Item
          label={t("common:common.name")}
          name="name"
          required
          rules={[
            validateInput({
              messageRequired: t(
                "validate:viewpoint_collection.name_is_required"
              ),
              messageTrimSpace: t(
                "validate:viewpoint_collection.name_trim_space"
              ),
              messageNotContainSpecialCharacter: t(
                "validate:viewpoint_collection.name_can_not_contains_special_characters"
              ),
              maxLength: MAX_LENGTH_INPUT_NAME_FIELD,
              messageMaxLength: t(
                "validate:viewpoint_collection.name_max_length",
                {
                  MAX_LENGTH_INPUT_NAME_FIELD: MAX_LENGTH_INPUT_NAME_FIELD,
                }
              ),
            }),
          ]}
          validateTrigger={VALIDATE_TRIGGER}
        >
          <Input
            placeholder={t("common:viewpoint_collection.name_placeholder")}
          />
        </Form.Item>
        <Form.Item
          label={t("common:common.domain")}
          name="domainIds"
          rules={[
            {
              required: true,
              message: t("validate:common.please_select_domain"),
            },
          ]}
          validateTrigger={VALIDATE_TRIGGER}
        >
          {/* <Cascader
            options={treeDataDomainSelector}
            // placeholder={t("common:common.select_domain")}
          /> */}
          <TreeSelect
            treeData={treeDataDomainSelector}
            treeCheckable={true}
            treeDefaultExpandAll
            treeCheckStrictly={true}
            multiple
            showCheckedStrategy={TreeSelect.SHOW_PARENT}
            placeholder={t("common:common.select_domain")}
            filterTreeNode={(search, item) => {
              if (item?.title) {
                return (
                  item.title
                    .toString()
                    .toLowerCase()
                    .indexOf(search.toLowerCase()) >= 0
                );
              }
            }}
          />
        </Form.Item>
        <Form.Item
          label={t("common:common.description")}
          name="description"
          validateTrigger={VALIDATE_TRIGGER}
          rules={[
            validateInput({
              messageTrimSpace: t(
                "validate:viewpoint_collection.description_trim_space"
              ),
              maxLength: MAX_LENGTH_TEXT_AREA,
              messageMaxLength: t(
                "validate:viewpoint_collection.description_max_length",
                {
                  MAX_LENGTH_TEXT_AREA: MAX_LENGTH_TEXT_AREA,
                }
              ),
            }),
          ]}
        >
          <Input.TextArea
            rows={4}
            showCount
            maxLength={MAX_LENGTH_TEXT_AREA}
            placeholder={t(
              "common:viewpoint_collection.description_placeholder"
            )}
          />
        </Form.Item>
        <Form.Item
          label={t("common:common.processing_status")}
          name="ProcessingStatus"
        >
          <Select style={{ width: 180 }} disabled>
            <Select.Option value={PROCESSING_STATUS.ON_GOING}>
              {t("common:status.on_going")}
            </Select.Option>
            <Select.Option value={PROCESSING_STATUS.UPDATING}>
              {t("common:status.updating")}
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label={t("common:common.publishing_status")}
          name="PublishStatus"
        >
          <Select style={{ width: 180 }} disabled>
            <Select.Option value={PUBLISH_STATUS.PUBLISHING}>
              {t("common:status.publishing")}
            </Select.Option>
            <Select.Option value={PUBLISH_STATUS.PUBLISHED}>
              {t("common:status.published")}
            </Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          label={t("common:viewpoint_collection.detail_new_viewpoint")}
        >
          <Spin spinning={loadingClone}>
            {currentVPCollection?.hierachyViewPointDetail?.length > 0 ? (
              <div
                style={{
                  marginTop: "10px",
                }}
              >
                <Tree
                  checkable
                  height={800}
                  defaultExpandAll
                  onCheck={handleCheckViewpoint}
                  checkedKeys={checkedKeys}
                  treeData={loopAllLockNode(
                    currentVPCollection?.hierachyViewPointDetail
                  )}
                  rootStyle={{
                    backgroundColor: "var(--background-color-element)",
                    color: "var(--clr-text)",
                    padding: "20px",
                  }}
                />
              </div>
            ) : (
              <Empty style={{ marginTop: "10px" }} />
            )}
          </Spin>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalClone;
