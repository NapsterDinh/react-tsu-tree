import productAPI from "@services/productAPI";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@utils/notificationUtils";
import { Button, Modal, Rate, Typography } from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Wrapper } from "./ModalRatingProduct.Styled";

interface IProps {
  visible: boolean;
  onCancel: () => void;
  currentProduct: any;
  setCurrentProduct: (any) => void;
}

const ModalRatingProduct = ({
  visible,
  onCancel,
  currentProduct,
  setCurrentProduct,
}: IProps) => {
  const checkRatingBefore = (currentUser, product) => {
    for (let index = 0; index < product?.ratings?.length; index++) {
      const element = product?.ratings[index];
      if (element?.createdBy === currentUser?.id) return element;
    }
    return null;
  };
  const { t } = useTranslation(["common"]);
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const [value, setValue] = useState(() => {
    const element = checkRatingBefore(user, currentProduct);
    if (element) {
      return element?.starRating;
    }
    return 0;
  });
  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);
  const handleOnOk = async () => {
    try {
      setLoading(true);
      if (value === 0) {
        setError(t("common:common.need_choose_level_rating"));
        return;
      }
      setError("");
      const response = await productAPI.ratingProduct(
        currentProduct?.id,
        value
      );
      const newRatings = [...currentProduct.ratings];
      newRatings.push(response.data);

      setCurrentProduct({
        ...currentProduct,
        avgRating: response?.data?.product?.avgRating,
        ratings: newRatings,
        countUserRating: response?.data?.product?.countUserRating,
      });
      showSuccessNotification(t("common:product.rating_successfully"));
    } catch (error) {
      if (error?.code) {
        showErrorNotification(t(`responseMessage:${error?.code}`));
      }
      setValue(0);
    } finally {
      setLoading(false);
      if (value !== 0) {
        onCancel();
      }
    }
  };

  useEffect(() => {
    const element = checkRatingBefore(user, currentProduct);
    element ? setValue(element?.starRating) : setValue(0);
  }, [currentProduct?.avgRating, visible]);

  return (
    <Modal
      title={t("common:detail_product.modal_rating")}
      visible={visible}
      width={500}
      onCancel={() => {
        onCancel();
        setValue(0);
      }}
      footer={[
        <Button
          key="cancel"
          htmlType="button"
          onClick={() => {
            onCancel();
            setValue(0);
          }}
        >
          {t("common:common.cancel")}
        </Button>,
        !checkRatingBefore(user, currentProduct) && (
          <Button
            disabled={value === 0}
            onClick={handleOnOk}
            key="clone"
            type="primary"
            loading={loading}
            htmlType="submit"
          >
            {t("common:common.rating")}
          </Button>
        ),
      ]}
    >
      {checkRatingBefore(user, currentProduct) && (
        <span className="color-red">
          {t("common:common.already_rating_before")}
        </span>
      )}
      <Wrapper>
        <Typography.Text className="color-text">
          {t("common:common.rating")}:
        </Typography.Text>
        <Rate
          disabled={checkRatingBefore(user, currentProduct)}
          allowHalf
          onChange={setValue}
          value={value} 
          style={{ marginLeft: "100px" }}
        />
      </Wrapper>
      {error !== "" && <span className="color-red">{error}</span>}
    </Modal>
  );
};

export default ModalRatingProduct;
