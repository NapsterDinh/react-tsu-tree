import { SearchOutlined } from "@ant-design/icons";
import { LocaleProvider } from "@components";
import { detailProductActions } from "@redux/slices/detailProductSlice";
import { RootState } from "@redux/store";
import productAPI from "@services/productAPI";
import { MAX_LENGTH_INPUT_NAME_FIELD } from "@utils/constantsUI";
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
  Typography,
} from "antd";
import type { SelectProps } from "antd/es/select";
import * as React from "react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";

const ModalClone = ({
  currentProduct,
  isModalOpen,
  setIsModalOpen,
  getData,
}) => {
  const { t } = useTranslation(["common", "validate", "responseMessage"]);
  const [loading, setLoading] = useState(false);
  const [loadingProductTree, setLoadingProductTree] = useState(false);
  const [flattenedTreeData, setFlattenedTreeData] = useState([]);
  const [options, setOptions] = useState<SelectProps<object>["options"]>([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedFunctions, setSelectedFunctions] = useState([]);
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]);
  const { resultSearch, loadingSearch } = useSelector(
    (state: RootState) => state.detailProduct
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
              {!item?.cloneProductId && (
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

  const handleSearch = async (value) => {
    if (value.trim() === "") {
      setOptions([]);
      return;
    }
    try {
      dispatch(
        detailProductActions.searchProduct({
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
    if (currentProduct) {
      setOptions(
        searchResult(
          resultSearch
            .filter((item) => item.id !== currentProduct.id)
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
      setLoadingProductTree(true);
      const response = await productAPI.getProductById(option.id);
      setSelectedProduct(response?.data);
    } catch (error) {
      if (error?.code) {
        showErrorNotification(t(`responseMessage:${error?.code}`));
      }
    } finally {
      setLoadingProductTree(false);
    }
  };

  const handleCancelModal = () => {
    setSelectedFunctions([]);
    setIsModalOpen(false);
    setSelectedProduct(null);
    setCheckedKeys([]);
    setFlattenedTreeData([]);
    setLoading(false);
    form.resetFields();
  };

  const onCheck = (checkedKeysValue: React.Key[], info) => {
    setSelectedFunctions([...checkedKeysValue, ...info.halfCheckedKeys]);
    setCheckedKeys(checkedKeysValue);
  };

  const handleCloneProduct = async () => {
    try {
      if (selectedProduct) {
        setLoading(true);
        const clonedFunctionList = [];
        flattenedTreeData?.map((productFunction) => {
          if (selectedFunctions.includes(productFunction.key)) {
            const orderList = productFunction.orderStrings.filter(
              (id: string) => selectedFunctions.includes(id)
            );
            clonedFunctionList.push({
              id: productFunction.key,
              viewDetail: JSON.stringify([productFunction.viewDetail]),
              productId: productFunction.productId,
              parentId: productFunction.parentId,
              orderStrings: JSON.stringify(orderList),
            });
          }
        });

        const orderParentList = selectedProduct?.orderStrings.filter(
          (id: string) => selectedFunctions.includes(id)
        );

        const dataBody = {
          copyProductId: currentProduct?.id,
          functions: clonedFunctionList,
          orderStrings: orderParentList,
        };

        await productAPI.cloneProduct({
          payload: dataBody,
        });

        await getData();
        showSuccessNotification(t("common:detail_product.copy_successfully"));
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
    if (selectedProduct) {
      const treeData = deepCopy(selectedProduct?.hierachyProductDetail);
      const flattenedData = [];
      const selectedAllFunction = [];
      getAllIdTreeData(selectedAllFunction, treeData);
      generateFlattenedTreeList(treeData, flattenedData);
      setCheckedKeys(selectedAllFunction);
      setSelectedFunctions(selectedAllFunction);
      setFlattenedTreeData(flattenedData);
    }
  }, [selectedProduct]);

  return (
    <Modal
      title={t("common:detail_product.modal_copy")}
      visible={isModalOpen}
      onCancel={handleCancelModal}
      width={900}
      style={{ top: 20 }}
      footer={[
        <Button key="cancel" htmlType="button" onClick={handleCancelModal}>
          {t("common:common.cancel")}
        </Button>,
        <Button
          disabled={!selectedProduct || selectedFunctions?.length === 0}
          form="importProduct"
          onClick={handleCloneProduct}
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
              messageRequired: t("validate:product.name_is_required"),
              messageTrimSpace: t("validate:product.name_trim_space"),
              messageNotContainSpecialCharacter: t(
                "validate:product.name_can_not_contains_special_characters"
              ),
              maxLength: MAX_LENGTH_INPUT_NAME_FIELD,
              messageMaxLength: t("validate:product.name_max_length", {
                MAX_LENGTH_INPUT_NAME_FIELD: MAX_LENGTH_INPUT_NAME_FIELD,
              }),
            }),
          ]}
          required
          label={t("common:detail_product.search_product_copy")}
          name="mergeInto"
        >
          <AutoComplete
            className="auto-complete"
            options={options}
            onSelect={onSelectAutoCompleted}
            onSearch={(value) => {
              handleSearch(value);
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

      {selectedProduct && (
        <Space direction="vertical">
          <Typography.Text className="color-text">
            {t("common:detail_product.your_selected_function")}
          </Typography.Text>
          <Typography.Title level={4} className="color-text">
            {selectedProduct?.detail?.name}
          </Typography.Title>
        </Space>
      )}
      <div>
        <Typography.Text className="color-text">
          {t("common:product.detail_new_product")}
        </Typography.Text>
        <Spin spinning={loadingProductTree}>
          {selectedProduct?.hierachyProductDetail &&
          selectedProduct?.hierachyProductDetail?.length > 0 ? (
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
                  selectedProduct?.hierachyProductDetail
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
