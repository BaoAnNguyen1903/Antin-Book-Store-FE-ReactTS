import { useEffect, useState } from "react";
import { App, Divider, Form, Input, Modal } from "antd";
import type { FormProps } from "antd";
import { updateUserAPI } from "@/services/api";

interface IProps {
  openModalUpdate: boolean;
  setOpenModalUpdate: (v: boolean) => void;
  refreshTable: () => void;
  setDataUpdate: (v: IUserTable | null) => void;
  dataUpdate: IUserTable | null;
}

type FieldType = {
  _id: string;
  email: string;
  fullName: string;
  phone: string;
};

const UpdateUser = (props: IProps) => {
  const {
    openModalUpdate,
    setOpenModalUpdate,
    refreshTable,
    setDataUpdate,
    dataUpdate
  } = props;
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const { message, notification } = App.useApp();

  // https://ant.design/components/form#components-form-demo-control-hooks
  const [form] = Form.useForm();

  useEffect(() => {
    if (dataUpdate) {
      form.setFieldsValue({
        _id: dataUpdate._id,
        fullName: dataUpdate.fullName,
        email: dataUpdate.email,
        phone: dataUpdate.phone
      });
    }
  }, [dataUpdate]);

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const { _id, fullName, phone } = values;
    setIsSubmit(true);
    const res = await updateUserAPI(_id, fullName, phone);
    if (res && res.data) {
      message.success("Cập nhật user thành công");
      form.resetFields();
      setOpenModalUpdate(false);
      setDataUpdate(null);
      refreshTable();
    } else {
      notification.error({
        message: "Đã có lỗi xảy ra",
        description: res.message
      });
    }
    setIsSubmit(false);
  };

  return (
    <>
      <Modal
        title="Cập nhật người dùng"
        open={openModalUpdate}
        onOk={() => {
          form.submit();
        }}
        onCancel={() => {
          setOpenModalUpdate(false);
          setDataUpdate(null);
          form.resetFields();
        }}
        okText={"Cập nhật"}
        cancelText={"Hủy"}
        confirmLoading={isSubmit}
      >
        <Divider />

        <Form
          form={form}
          name="form-update"
          style={{ maxWidth: 600 }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item<FieldType>
            hidden
            labelCol={{ span: 24 }}
            label="_id"
            name="_id"
            rules={[{ required: true, message: "Vui lòng nhập _id!" }]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item<FieldType>
            labelCol={{ span: 24 }}
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Email không đúng định dạng!" }
            ]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item<FieldType>
            labelCol={{ span: 24 }}
            label="Tên hiển thị"
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập tên hiển thị!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<FieldType>
            labelCol={{ span: 24 }}
            label="Số điện thoại"
            name="phone"
            rules={[
              { required: true, message: "Vui lòng nhập số điện thoại!" }
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default UpdateUser;
