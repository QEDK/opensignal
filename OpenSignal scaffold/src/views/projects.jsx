import { SyncOutlined } from "@ant-design/icons";
import { utils } from "ethers";
import { Button, Card, DatePicker, Divider, Col, Row, List, Progress, Slider, Spin, Switch } from "antd";
import React, { useState } from "react";
import { Address, Balance } from "../components";
import { CaretDownOutlined, CaretUpOutlined } from "@ant-design/icons";
import { useGetProjects } from "../network";

const Projects = ({
  purpose,
  setPurposeEvents,
  address,
  mainnetProvider,
  localProvider,
  yourLocalBalance,
  price,
  tx,
  readContracts,
  writeContracts,
}) => {
  const projects = useGetProjects();
  return (
    <div style={{ border: "1px solid #cccccc", padding: "3rem" }}>
      {/*
        ⚙️ Here is an example UI that displays and sets the purpose in your smart contract:
      */}
      <div
        style={{
          border: "1px solid #cccccc",
          boxShadow: "0 0 15px 8px #bababa",
          padding: "2rem",
          margin: "auto",
          marginTop: 64,
        }}
      >
        <h2>Projects:</h2>
        <Divider />
        <div style={{ padding: 16, backgroundColor: "grey" }} className="site-card-wrapper">
          <Row gutter={16}>
            {projects.map((project, i) => {
              return (
                <Col span={8}>
                  <Card
                    style={{ margin: "0.5rem 0", boxShadow: "-2px 2px 5px 1px rgba(200,200,200,1)" }}
                    title={
                      <div style={{ textAlign: "left" }}>
                        <h3 style={{ margin: 0 }}> {project.name} </h3>
                        <p style={{ fontSize: "0.75rem", color: "grey" }}>{project.creator}</p>
                      </div>
                    }
                    bordered={false}
                    cover={<img style={{ height: "12rem" }} alt="example" src={project.image} />}
                  >
                    Signal
                    <Card>{project.signal}</Card>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <CaretDownOutlined
                        className="btn"
                        key="downsignal"
                        style={{ flex: 1, color: "red", fontSize: "3rem" }}
                      />

                      <CaretUpOutlined
                        className="btn"
                        key="upsignal"
                        style={{ flex: 1, color: "green", fontSize: "3rem" }}
                      />
                    </div>
                    <div style={{ borderTop: "1px solid grey" }}>
                      <p
                        style={{ textAlign: "left", margin: "0.5rem 0", color: "#aaa", fontSize: "0.7rem" }}
                      >{`creator: ${project.creator} `}</p>
                      <p
                        style={{ textAlign: "left", margin: "0.5rem 0", color: "#aaa", fontSize: "0.7rem" }}
                      >{`self stake: ${project.selfstake} `}</p>
                    </div>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </div>
      </div>
    </div>
  );
};

export { Projects };
