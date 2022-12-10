import { SearchOutlined } from "@ant-design/icons";
import { LocaleProvider } from "@components";
import { detailViewpointActions } from "@redux/slices";
import { RootState } from "@redux/store";
import viewpointCollectionAPI from "@services/viewpointCollectionAPI";
import { MAX_LENGTH_INPUT_NAME_FIELD } from "@utils/constantsUI";
import { deepCopy } from "@utils/helpersUtils";
import {
  showErrorNotification,
  showSuccessNotification
} from "@utils/notificationUtils";
import {
  generateFlattenedTreeList,
  getAllIdTreeData,
  loopAllLockNode
} from "@utils/treeUtils";
import { validateInput, VALIDATE_TRIGGER } from "@utils/validateFormUtils";
import {
  AutoComplete,
  Button,
  Empty,
  Form,
  Input,
  Modal,
  Space,
  Spin,
  Tag,
  Tree,
  Typography
} from "antd";
import type { SelectProps } from "antd/es/select";
import * as React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

const ModalClone = ({
  currentVPCollection,
  isModalOpen,
  setIsModalOpen,
  getData,
}) => {
  const { t } = useTranslation(["common", "validate", "responseMessage"]);
  const [loading, setLoading] = useState(false);
  const [loadingViewpointTree, setLoadingViewpointTree] = useState(false);
  const [flattenedTreeData, setFlattenedTreeData] = useState([]);
  const [options, setOptions] = useState<SelectProps<object>["options"]>([]);
  const [selectedVPCollection, setSelectedVPCollection] = useState(null);
  const [selectedViewpoints, setSelectedViewpoints] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const { resultSearch, loadingSearch } = useSelector(
    (state: RootState) => state.detailViewpoint
  );
  const [form] = Form.useForm();
  const dispatch = useDispatch();

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
    try {
      setLoadingViewpointTree(true);
      const response = await viewpointCollectionAPI.getViewpointCollectionById(
        option.id
      );
      setSelectedVPCollection(response?.data);
    } catch (error) {
      if (error?.code) {
        showErrorNotification(t(`responseMessage:${error?.code}`));
      }
    } finally {
      setLoadingViewpointTree(false);
    }
  };

  const handleCancelModal = () => {
    setSelectedViewpoints([]);
    setIsModalOpen(false);
    setSelectedVPCollection(null);
    setFlattenedTreeData([]);
    setCheckedKeys([]);
    setLoading(false);
    form.resetFields();
  };

  const onCheck = (checkedKeysValue: React.Key[], info: any) => {
    setSelectedViewpoints([...checkedKeysValue, ...info.halfCheckedKeys]);
    setCheckedKeys(checkedKeysValue);
  };

  const handleCloneViewpointCollection = async () => {
    try {
      if (selectedVPCollection) {
        setLoading(true);
        const clonedViewpointList = [];
        flattenedTreeData?.map((viewpoint) => {
          if (selectedViewpoints.includes(viewpoint.key)) {
            const orderList = viewpoint.orderStrings.filter((id) =>
              selectedViewpoints.includes(id)
            );
            clonedViewpointList.push({
              id: viewpoint.key,
              viewDetail: JSON.stringify([viewpoint.viewDetail]),
              viewPointCollectionId: viewpoint.viewPointCollectionId,
              parentId: viewpoint.parentId,
              orderStrings: JSON.stringify(orderList),
            });
          }
        });

        const orderParentList = selectedVPCollection.orderStrings.filter(
          (id: string) => selectedViewpoints.includes(id)
        );

        const dataBody = {
          copyCollectionId: currentVPCollection?.id,
          viewPoints: clonedViewpointList,
          orderStrings: orderParentList,
        };

        await viewpointCollectionAPI.cloneCollection({
          payload: dataBody,
        });

        await getData();
        showSuccessNotification(
          t("common:detail_viewpoint_collection.copy_viewpoint_successfully")
        );
      }
    } catch (error) {
      if (error?.code) {
        showErrorNotification(t(`responseMessage:${error?.code}`));
      }
    } finally {
      handleCancelModal();
    }
  };

  useEffect(() => {
    if (selectedVPCollection) {
      const treeData = deepCopy(selectedVPCollection?.hierachyViewPointDetail);
      const flattenedData = [];
      const selectedAllViewpoint = [];
      getAllIdTreeData(selectedAllViewpoint, treeData);
      generateFlattenedTreeList(treeData, flattenedData);
      setCheckedKeys(selectedAllViewpoint);
      setSelectedViewpoints(selectedAllViewpoint);
      setFlattenedTreeData(flattenedData);
    }
  }, [selectedVPCollection]);

  return (
    <Modal
      title={t("common:detail_viewpoint_collection.modal_copy")}
      visible={isModalOpen}
      onCancel={handleCancelModal}
      width={900}
      style={{ top: 20 }}
      footer={[
        <Button key="cancel" htmlType="button" onClick={handleCancelModal}>
          {t("common:common.cancel")}
        </Button>,
        <Button
          disabled={!selectedVPCollection || selectedViewpoints?.length === 0}
          form="importViewpointCollection"
          onClick={handleCloneViewpointCollection}
          key="import"
          type="primary"
          htmlType="submit"
          loading={loading}
        >
          {t("common:common.copy")}
        </Button>,
      ]}
    >
      <Form
        id={"createMergeRequest"}
        form={form}
        name="basic"
        autoComplete="off"
        layout="vertical"
      >
        <Form.Item
          style={{ marginBottom: 10 }}
          validateTrigger={VALIDATE_TRIGGER}
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
          required
          label={t(
            "common:detail_viewpoint_collection.search_viewpoint_collection"
          )}
          name="mergeInto"
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
          >
            <Input.Search
              loading={loadingSearch}
              className="search-box"
              placeholder={t("common:common.search_placeholder")}
              enterButton={<SearchOutlined />}
            />
          </AutoComplete>
        </Form.Item>
      </Form>

      {selectedVPCollection && (
        <Space direction="vertical">
          <Typography.Text className="color-text">
            {t("common:detail_viewpoint_collection.your_selected_viewpoint")}
          </Typography.Text>
          <Typography.Title level={4} className="color-text">
            {selectedVPCollection?.detail?.name}
          </Typography.Title>
        </Space>
      )}
      <div>
        <Typography.Text className="color-text">
          {t("common:viewpoint_collection.detail_new_viewpoint")}
        </Typography.Text>
        <Spin spinning={loadingViewpointTree}>
          {selectedVPCollection?.hierachyViewPointDetail &&
          selectedVPCollection?.hierachyViewPointDetail?.length > 0 ? (
            <div
              style={{
                marginTop: "10px",
              }}
            >
              <Tree
                checkable
                blockNode
                height={800}
                checkedKeys={checkedKeys}
                onCheck={onCheck}
                treeData={loopAllLockNode(
                  selectedVPCollection?.hierachyViewPointDetail
                )}
                rootStyle={{
                  backgroundColor: "var(--background-color-element)",
                  color: "var(--clr-text)",
                  padding: "20px",
                }}
              />
            </div>
          ) : (
            <div
              style={{
                marginTop: "10px",
                borderRadius: "var(--border-radius-element)",
              }}
            >
              <LocaleProvider>
                <Empty style={{ marginTop: "10px" }} />
              </LocaleProvider>
            </div>
          )}
        </Spin>
      </div>
    </Modal>
  );
};

export default ModalClone;
