import { App, Button, Col, Divider, Form, Radio, Row, Space } from "antd";
import { DeleteTwoTone } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Input } from "antd";
import { useCurrentApp } from "@/components/context/app.context";
import type { FormProps } from "antd";
import { createOrderAPI, getVNPayUrlAPI } from "@/services/api";
import { isMobile } from "react-device-detect";
import { v4 as uuidv4 } from "uuid";

const { TextArea } = Input;

type UserMethod = "COD" | "BANKING";

type FieldType = {
  fullName: string;
  phone: string;
  address: string;
  method: UserMethod;
};

interface IProps {
  setCurrentStep: (v: number) => void;
}
const Payment = (props: IProps) => {
  const { carts, setCarts, user } = useCurrentApp();
  const [totalPrice, setTotalPrice] = useState(0);

  const [form] = Form.useForm();

  const [isSubmit, setIsSubmit] = useState(false);
  const { message, notification } = App.useApp();
  const { setCurrentStep } = props;

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        fullName: user.fullName,
        phone: user.phone,
        method: "COD"
      });
    }
  }, [user]);

  useEffect(() => {
    if (carts && carts.length > 0) {
      let sum = 0;
      carts.map((item) => {
        sum += item.quantity * item.detail.price;
      });
      setTotalPrice(sum);
    } else {
      setTotalPrice(0);
    }
  }, [carts]);

  const handleRemoveBook = (_id: string) => {
    const cartStorage = localStorage.getItem("carts");
    if (cartStorage) {
      //update
      const carts = JSON.parse(cartStorage) as ICart[];
      const newCarts = carts.filter((item) => item._id !== _id);
      localStorage.setItem("carts", JSON.stringify(newCarts));
      //sync React Context
      setCarts(newCarts);
    }
  };

  const handlePlaceOrder: FormProps<FieldType>["onFinish"] = async (values) => {
    const { address, fullName, method, phone } = values;

    const detail = carts.map((item) => ({
      _id: item._id,
      quantity: item.quantity,
      bookName: item.detail.mainText
    }));

    setIsSubmit(true);
    let res = null;
    const paymentRef = uuidv4();

    if (method === "COD") {
      res = await createOrderAPI(
        fullName,
        address,
        phone,
        totalPrice,
        method,
        detail
      );
    } else {
      res = await createOrderAPI(
        fullName,
        address,
        phone,
        totalPrice,
        method,
        detail,
        paymentRef
      );
    }

    if (res?.data) {
      localStorage.removeItem("carts");
      setCarts([]);
      if (method === "COD") {
        message.success("Mua hàng thành công!");
        setCurrentStep(2);
      } else {
        //redirect to vnpay
        const r = await getVNPayUrlAPI(totalPrice, "vn", paymentRef);
        if (r.data) {
          window.location.href = r.data.url;
        } else {
          notification.error({
            message: "Có lỗi xảy ra",
            description:
              r.message && Array.isArray(r.message) ? r.message[0] : r.message,
            duration: 5
          });
        }
      }
    } else {
      notification.error({
        message: "Có lỗi xảy ra",
        description:
          res.message && Array.isArray(res.message)
            ? res.message[0]
            : res.message,
        duration: 5
      });
    }

    setIsSubmit(false);
  };

  return (
    <div style={{ overflow: "hidden" }}>
      <Row gutter={[20, 20]}>
        <Col md={16} xs={24}>
          {carts?.map((item, index) => {
            const currentBookPrice = item?.detail?.price ?? 0;
            return (
              <div
                className="order-book"
                key={`index-${index}`}
                style={isMobile ? { flexDirection: "column" } : {}}
              >
                {!isMobile ? (
                  <>
                    <div className="book-content">
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${
                          item?.detail?.thumbnail
                        }`}
                      />
                      <div className="title">{item?.detail?.mainText}</div>
                      <div className="price">
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND"
                        }).format(currentBookPrice)}
                      </div>
                    </div>
                    <div className="action">
                      <div className="quantity">Số lượng: {item?.quantity}</div>
                      <div className="sum">
                        Tổng:{" "}
                        {new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND"
                        }).format(currentBookPrice * (item?.quantity ?? 0))}
                      </div>
                      <DeleteTwoTone
                        style={{ cursor: "pointer" }}
                        onClick={() => handleRemoveBook(item._id)}
                        twoToneColor="#eb2f96"
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>{item?.detail?.mainText}</div>
                    <div className="book-content " style={{ width: "100%" }}>
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL}/images/book/${
                          item?.detail?.thumbnail
                        }`}
                      />
                      <div className="action">
                        <div className="quantity">
                          Số lượng: {item?.quantity}
                        </div>
                        <DeleteTwoTone
                          style={{ cursor: "pointer" }}
                          onClick={() => handleRemoveBook(item._id)}
                          twoToneColor="#eb2f96"
                        />
                      </div>
                    </div>
                    <div className="sum">
                      Tổng:{" "}
                      {new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND"
                      }).format(currentBookPrice * (item?.quantity ?? 0))}
                    </div>
                  </>
                )}
              </div>
            );
          })}

          <div>
            <span
              style={{ cursor: "pointer" }}
              onClick={() => setCurrentStep(0)}
            >
              Quay trở lại
            </span>
          </div>
        </Col>
        <Col md={8} xs={24}>
          <Form
            form={form}
            name="payment-form"
            onFinish={handlePlaceOrder}
            autoComplete="off"
            layout="vertical"
          >
            <div className="order-sum">
              <Form.Item<FieldType> label="Hình thức thanh toán" name="method">
                <Radio.Group>
                  <Space direction="vertical">
                    <Radio value={"COD"}>Thanh toán khi nhận hàng</Radio>
                    <Radio value={"BANKING"}>Thanh toán bằng ví VNPAY</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>

              <Form.Item<FieldType>
                label="Họ tên"
                name="fullName"
                rules={[
                  { required: true, message: "Họ tên không được để trống!" }
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item<FieldType>
                label="Số điện thoại"
                name="phone"
                rules={[
                  {
                    required: true,
                    message: "Số điện thoại không được để trống!"
                  }
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item<FieldType>
                label="Địa chỉ nhận hàng"
                name="address"
                rules={[
                  { required: true, message: "Địa chỉ không được để trống!" }
                ]}
              >
                <TextArea rows={4} />
              </Form.Item>

              <div className="calculate">
                <span> Tạm tính</span>
                <span>
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND"
                  }).format(totalPrice || 0)}
                </span>
              </div>
              <Divider style={{ margin: "10px 0" }} />
              <div className="calculate">
                <span> Tổng tiền</span>
                <span className="sum-final">
                  {new Intl.NumberFormat("vi-VN", {
                    style: "currency",
                    currency: "VND"
                  }).format(totalPrice || 0)}
                </span>
              </div>
              <Divider style={{ margin: "10px 0" }} />
              <Button
                color="danger"
                variant="solid"
                htmlType="submit"
                loading={isSubmit}
              >
                Đặt Hàng ({carts?.length ?? 0})
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </div>
  );
};

export default Payment;
