import viewpointCollectionAPI from "@services/viewpointCollectionAPI";
import {
  showErrorNotification,
  showSuccessNotification,
} from "@utils/notificationUtils";
import { Button, Modal, Rate, Typography } from "antd";
import * as React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Wrapper } from "./ModalRatingVPCollection.Styled";

interface IProps {
  visible: boolean;
  onCancel: () => void;
  currentVPCollection: any;
  setCurrentVPCollection: (any) => void;
}

const ModalRatingVPCollection = ({
  visible,
  onCancel,
  currentVPCollection,
  setCurrentVPCollection,
}: IProps) => {
  const checkRatingBefore = (currentUser, vpCollection) => {
    for (let index = 0; index < vpCollection?.ratings?.length; index++) {
      const element = vpCollection?.ratings[index];
      if (element?.createdBy === currentUser?.id) return element;
    }
    return null;
  };
  const { t } = useTranslation(["common"]);
  const user = localStorage.getItem("user")
    ? JSON.parse(localStorage.getItem("user"))
    : null;
  const [value, setValue] = useState(() => {
    const element = checkRatingBefore(user, currentVPCollection);
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
      const response = await viewpointCollectionAPI.ratingViewpointCollection(
        currentVPCollection?.id,
        value
      );
      const newRatings = [...currentVPCollection.ratings];
      newRatings.push(response.data);
      setCurrentVPCollection({
        ...currentVPCollection,
        avgRating: response?.data?.viewPointCollection?.avgRating,
        countUserRating: response?.data?.viewPointCollection?.countUserRating,
        ratings: newRatings,
        updatedAt: response?.data?.updatedAt,
      });
      showSuccessNotification(
        t("common:viewpoint_collection.rating_successfully")
      );
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

  React.useEffect(() => {
    const element = checkRatingBefore(user, currentVPCollection);
    element ? setValue(element?.starRating) : setValue(0);
  }, [currentVPCollection?.avgRating, visible]);

  return (
    <Modal
      title={t("common:viewpoint_collection.modal_rating")}
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
        !checkRatingBefore(user, currentVPCollection) && (
          <Button
            disabled={value === 0}
            onClick={handleOnOk}
            key="clone"
            type="primary"
            htmlType="submit"
            loading={loading}
          >
            {t("common:common.rating")}
          </Button>
        ),
      ]}
    >
      {checkRatingBefore(user, currentVPCollection) && (
        <span className="color-red">
          {t("common:common.already_rating_before")}
        </span>
      )}
      <Wrapper>
        <Typography.Text className="color-text">
          {t("common:common.rating")}:
        </Typography.Text>
        <Rate
          disabled={checkRatingBefore(user, currentVPCollection)}
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

export default ModalRatingVPCollection;
