import { SyncOutlined } from "@ant-design/icons";
import { utils } from "ethers";
import {
  Button,
  Card,
  DatePicker,
  Divider,
  Col,
  Row,
  Upload,
  InputNumber,
  List,
  Progress,
  Slider,
  Spin,
  Typography,
  Input,
} from "antd";
const { Text } = Typography;
import React, { useState } from "react";
import { EtherInput } from "../components";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import { AddProject } from "../network";
import { ethers } from "ethers";
import { UserOutlined, DollarOutlined, LoadingOutlined, PlusOutlined } from "@ant-design/icons";
const NewProject = ({
  userSigner,
  address,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
}) => {
  const [newProjecLoading, setNewProjecLoading] = React.useState(false);
  const [newProjecError, setNewProjecError] = React.useState("");
  const [project, setProject] = React.useState({ name: "", amount: "" });
  const [loading, setLoading] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState("");
  const uploadButton = (
    <div>
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{ marginTop: 8 }}>Upload</div>
    </div>
  );

  const handleChange = info => {
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => {
        setImageUrl(imageUrl);
        setLoading(false);
      });
    }
  };

  const onNewProject = () => {
    if (!project.name || !project.amount) {
      setNewProjecError("make sure inputs are filled correctly");
      return;
    }

    try {
      setNewProjecError("");
      setNewProjecLoading(true);

      const amountInWei = ethers.utils.parseEther(project.amount.toString());
      const contract = writeContracts["OpenSignal"];
      contract
        .createProject(project.name, amountInWei, { from: address })
        .then(async txRes => {
          await txRes.wait();
          AddProject(project, imageUrl)
            .then(_ => {
              setNewProjecLoading(false);
            })
            .catch(err => {
              setNewProjecLoading(false);
              console.log(err);
              if (err && err.message) {
                setNewProjecError(err.message);
              }
            });
        })
        .catch(err => {
          AddProject(project, imageUrl)
            .then(_ => {
              setNewProjecLoading(false);
            })
            .catch(err => {
              setNewProjecLoading(false);
              console.log(err);
              if (err && err.message) {
                setNewProjecError(err.message);
              }
            });
          setNewProjecLoading(false);
          console.log(err);
          if (err && err.data && err.data.message) {
            setNewProjecError(err.data.message);
          }
        });
    } catch (err) {
      console.log(err);
      if (err && err.reason) {
        setNewProjecError(err.reason);
      }
    }
  };
  return (
    <div style={{ border: "1px solid #cccccc", padding: "3rem" }}>
      <div
        style={{
          border: "1px solid #cccccc",
          boxShadow: "0 0 15px 8px #bababa",
          padding: "2rem",
          margin: "auto",
          marginTop: 64,
          width: 400,
        }}
      >
        <h2>New Project:</h2>
        <Divider />
        {newProjecError ? <Text type="danger">{newProjecError}</Text> : null}
        <div style={{ padding: 16 }} className="site-card-wrapper">
          <Row gutter={16}>
            <Input
              value={project.name}
              onChange={e => setProject({ ...project, name: e.target.value })}
              style={{ margin: 16 }}
              size="large"
              placeholder="Project name"
              prefix={<UserOutlined />}
            />
            <EtherInput
              size="large"
              style={{ margin: 16 }}
              autofocus
              price={price}
              placeholder="Initial Stake Amount"
              value={project.amount}
              onChange={value => setProject({ ...project, amount: value })}
            />
          </Row>
          <Row gutter={16}>
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              beforeUpload={beforeUpload}
              onChange={handleChange}
            >
              {imageUrl ? <img src={imageUrl} alt="avatar" style={{ width: "100%" }} /> : uploadButton}
            </Upload>

            <Button
              loading={newProjecLoading}
              type="primary"
              block
              shape="round"
              icon={<PlusOutlined />}
              size={"large"}
              onClick={onNewProject}
            >
              CREATE
            </Button>
          </Row>
        </div>
      </div>
    </div>
  );
};

export { NewProject };

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

function beforeUpload(file) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("You can only upload JPG/PNG file!");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
}
