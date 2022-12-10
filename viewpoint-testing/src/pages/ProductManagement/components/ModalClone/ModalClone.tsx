import {
  Domain,
  ICloneProductDataBody,
  IDomainFilter,
  IResponseData,
  IResponseProduct
} from "@models/model";
import productAPI from "@services/productAPI";
import { PROCESSING_STATUS, PUBLISH_STATUS } from "@utils/constants";
import {
  MAX_LENGTH_INPUT_NAME_FIELD,
  MAX_LENGTH_TEXT_AREA
} from "@utils/constantsUI";
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
  Button,
  Empty,
  Form,
  Input,
  Modal,
  Select,
  Spin, Tree, TreeSelect
} from "antd";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { routes } from "routes";

interface IProps {
  loading: boolean;
  isModalOpen: boolean;
  valueSelect: IResponseProduct;
  treeDataDomainSelector: IDomainFilter[];
  setLoading: Dispatch<SetStateAction<boolean>>;
  setIsModalOpen: Dispatch<SetStateAction<boolean>>;
  setValueSelect: Dispatch<SetStateAction<IResponseProduct>>;
}

const ModalClone = ({
  loading,
  isModalOpen,
  valueSelect,
  treeDataDomainSelector,
  setLoading,
  setIsModalOpen,
  setValueSelect,
}: IProps) => {
  const { t } = useTranslation(["common", "validate", "responseMessage"]); // languages
  const navigate = useNavigate();
  const [cloneForm] = Form.useForm(); // clone form
  const [flattenedTreeData, setFlattenedTreeData] = useState([]); // flattened tree data has converted from response tree data from BE
  const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([]); // list of selected functions to handle call api
  const [selectedFunctions, setSelectedFunctions] = useState([]); // list of selected keys to show checked function in UI
  const [currentProduct, setCurrentProduct] = useState(null); // response data product from BE
  const [loadingClone, setLoadingClone] = useState<boolean>(false); // loading for list functions of selected product on clone form

  // handle cancel clone form
  // reset all state
  const handleCancelCloneProduct = () => {
    setCheckedKeys([]);
    setSelectedFunctions([]);
    setFlattenedTreeData([]);
    setIsModalOpen(false);
    setValueSelect(null);
    setCurrentProduct(null);
    cloneForm.resetFields();
  };

  // handle submit clone collection
  const handleCloneProduct = async (values: any) => {
    try {
      setLoading(true); // set loading on modal clone product
      const contentLanguage: string = localStorage.getItem("dataLanguage"); // get content language in local storage
      const clonedFunctionList = []; // temp variable to store list of functions

      // map in flattened tree data product to find list of selected functions
      flattenedTreeData?.map((productFunction) => {
        if (selectedFunctions.includes(productFunction.key)) {
          const orderList: string[] = productFunction.orderStrings.filter(
            (id: string) => selectedFunctions.includes(id)
          );
          clonedFunctionList.push({
            id: productFunction.key,
            viewDetail: JSON.stringify([productFunction.viewDetail]),
            productId: productFunction.productId,
            parentId: productFunction.parentId,
            orderStrings: JSON.stringify(orderList),
            isLocked: productFunction.isLocked,
          });
        }
      });

      // filter list of orderStrings using selected functions
      const orderParentList: string[] = currentProduct?.orderStrings.filter(
        (id: string) => selectedFunctions.includes(id)
      );

      // data body to send to the server
      const dataBody: ICloneProductDataBody = {
        detail: JSON.stringify([
          {
            name: values?.name?.trim(),
            language: contentLanguage,
            description: values?.description?.trim(),
          },
        ]),
        processingStatus: +PROCESSING_STATUS.ON_GOING,
        publishStatus: +PUBLISH_STATUS.PUBLISHING,
        cloneProductId: currentProduct?.id,
        domainIds: values?.domainIds?.map((item) => item?.value),
        functions: clonedFunctionList,
        orderStrings: orderParentList,
      };

      const response: IResponseData = await productAPI.cloneProduct({
        payload: dataBody,
      });

      if (response?.isSucceeded) {
        const id = response.data.id;
        navigate(`${routes.ProductManagement.path[0]}/${id}`);
        handleCancelCloneProduct();
        showSuccessNotification(t("common:product.clone_successfully"));
      }
    } catch (error) {
      if (error.code === "ProductNameExisted") {
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

  // handle check and uncheck function
  const handleCheckFunction = (checkedKeysValue: string[], info: any) => {
    setSelectedFunctions([...checkedKeysValue, ...info.halfCheckedKeys]);
    setCheckedKeys(checkedKeysValue);
  };

  useEffect(() => {
    (async () => {
      if (valueSelect) {
        try {
          setLoadingClone(true); // set loading for list of functions to select for calling api
          const response = await productAPI.getProductById(valueSelect?.id);
          setCurrentProduct(response?.data);

          cloneForm.setFieldValue(
            "domainIds",
            valueSelect?.domains.map((domain: Domain) => {
              return { label: domain?.detail.name, value: domain.id };
            })
          );

          const treeData = deepCopy(response.data?.hierachyProductDetail); // copy tree data from response data
          const selectedAllFunction: string[] = []; // temp variable to store all functions id of product
          const flattenedData = []; // temp variable to store flattened function of product
          getAllIdTreeData(selectedAllFunction, treeData); // get all function id of product
          generateFlattenedTreeList(treeData, flattenedData); // generate flattened tree data
          setCheckedKeys(selectedAllFunction); // set all function id of product to show on UI
          setSelectedFunctions(selectedAllFunction); // set all function id of product to call api
          setFlattenedTreeData(flattenedData); // set flattened function of product
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
      title={t("common:product.modal_clone")}
      visible={isModalOpen}
      onCancel={handleCancelCloneProduct}
      width={1000}
      footer={[
        <Button
          key="cancel"
          htmlType="button"
          onClick={handleCancelCloneProduct}
        >
          {t("common:common.cancel")}
        </Button>,
        <Button
          key="clone"
          form="cloneProduct"
          type="primary"
          htmlType="submit"
          loading={loading}
        >
          {t("common:common.clone")}
        </Button>,
      ]}
      style={{ top: 20 }}
    >
      <Form
        id="cloneProduct"
        layout="vertical"
        onFinish={handleCloneProduct}
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
          validateTrigger={VALIDATE_TRIGGER}
        >
          <Input placeholder={t("common:product.name_placeholder")} />
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
            placeholder={t("common:common.select_domain")}
          /> */}
          <TreeSelect
            treeData={treeDataDomainSelector}
            treeDefaultExpandAll
            treeCheckable={true}
            treeCheckStrictly={true}
            showCheckedStrategy={TreeSelect.SHOW_PARENT}
            placeholder={t("common:common.select_domain")}
            style={{
              width: "100%",
            }}
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
              messageTrimSpace: t("validate:product.description_trim_space"),
              maxLength: MAX_LENGTH_TEXT_AREA,
              messageMaxLength: t("validate:product.description_max_length", {
                MAX_LENGTH_TEXT_AREA: MAX_LENGTH_TEXT_AREA,
              }),
            }),
          ]}
        >
          <Input.TextArea
            placeholder={t("common:product.description_placeholder")}
            showCount
            maxLength={MAX_LENGTH_TEXT_AREA}
            rows={4}
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
        <Form.Item label={t("common:product.detail_new_product")}>
          <Spin spinning={loadingClone}>
            {currentProduct?.hierachyProductDetail &&
            currentProduct?.hierachyProductDetail?.length > 0 ? (
              <div
                style={{
                  marginTop: "10px",
                }}
              >
                <Tree
                  checkable
                  height={800}
                  onCheck={handleCheckFunction}
                  checkedKeys={checkedKeys}
                  treeData={loopAllLockNode(
                    currentProduct?.hierachyProductDetail
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
