import thumbnailImage from "@assets/svg/thumbnail_login.svg";
import { rootState } from "@models/type";
import { authActions } from "@redux/slices";

import {
  Button,
  Col,
  Form,
  Input,
  message,
  Row,
  Space,
  Typography,
} from "antd";
import React from "react";
import { useTranslation } from "react-i18next";
import { AiOutlineLock, AiOutlineUser } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { FormLogin, ThumbnailLogin, WrapperLogin } from "./LoginPageStyled";

import { checkContainsSpecialCharacter } from "@utils/helpersUtils";

const { Title, Text } = Typography;

import { showErrorNotification } from "@utils/notificationUtils";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = (): JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loginLoading, errorLogin } = useSelector(
    (state: rootState) => state.auth
  );
  const { theme } = useSelector((state: rootState) => state.theme);
  const [form] = Form.useForm<{
    username: string;
    password: string;
    remember: boolean;
  }>();
  const { t } = useTranslation(["common", "validate", "responseMessage"]);

  // function handle login
  const onFinishLogin = (values) => {
    dispatch(
      authActions.login({
        phone: values.username.trim(),
        password: values.password.trim(),
        onSuccess: () => {
          // navigate("/", { replace: true });
          // dispatch(
          //   authActions.getCurrentUser({
          //     onSuccess: () => navigate("/", { replace: true }),
          //   })
          // );
        },
      })
    );
  };

  // function handle failed login
  const onFinishFailed = (errorInfo: any) => {
    message.error(errorInfo);
  };

  return (
    <WrapperLogin>
      <Row gutter={8}>
        <Col xs={0} md={12}>
          <ThumbnailLogin src={thumbnailImage} />
        </Col>
        <Col xs={24} md={12}>
          <FormLogin>
            <Space align="center" size={0}>
              <Title level={2}>{t("common:login.name")}</Title>
              <Text type="secondary">
                {t("common:common.sign_in_internal_platform")}
              </Text>
            </Space>
            <Form
              form={form}
              onFinish={onFinishLogin}
              onFinishFailed={onFinishFailed}
              layout="vertical"
              autoComplete="off"
            >
              <Form.Item
                name="username"
                label={t("common:login.username")}
                rules={[
                  {
                    required: true,
                    message: t("validate:login.username_required"),
                  },
                  {
                    validator: (_, value) => {
                      if (checkContainsSpecialCharacter(value)) {
                        return Promise.reject(
                          t(
                            "validate:login.username_can_not_contains_special_characters"
                          )
                        );
                      } else {
                        return Promise.resolve();
                      }
                    },
                  },
                ]}
                validateTrigger={["onBlur", "onChange"]}
              >
                <Input
                  maxLength={16}
                  prefix={<AiOutlineUser className="site-form-item-icon" />}
                  placeholder={t("common:login.username_placeholder")}
                  size="large"
                />
              </Form.Item>
              {errorLogin !== "" && (
                <p
                  style={{ marginBottom: "0px", marginTop: "-20px" }}
                  className="color-red"
                >
                  {errorLogin}
                </p>
              )}
              <Form.Item
                name="password"
                label={t("common:login.password")}
                rules={[
                  {
                    required: true,
                    message: t("validate:login.password_is_required"),
                  },
                ]}
                validateTrigger={["onBlur", "onChange"]}
              >
                <Input.Password
                  maxLength={20}
                  prefix={<AiOutlineLock className="site-form-item-icon" />}
                  placeholder={t("common:login.password_placeholder")}
                  size="large"
                />
              </Form.Item>
              <Button
                style={{ marginTop: "20px" }}
                type="primary"
                htmlType="submit"
                size="large"
                loading={loginLoading}
              >
                {t("common:login.name")}
              </Button>
            </Form>
          </FormLogin>
        </Col>
      </Row>
    </WrapperLogin>
  );
};

export default LoginPage;
