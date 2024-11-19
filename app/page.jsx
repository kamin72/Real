"use client";

import { useState, useEffect, useRef } from "react";
import { getTDXAuthToken, getAirlineData } from "./api/tadApi";
import Loading from "./ui/loading";
import Newest_flight from "../app/ui/newestFlight";
import History_flight from "../app/ui/historyFlight";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import {
  faPlaneDeparture,
  faClockRotateLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Airline_info() {
  const [airLine_info, setAirLine_info] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const REFRESH_COOLDOWN = 10000;
  const [collapsed, setCollapsed] = useState(false);
  const [currentKey, setCurrentKey] = useState(null);

  const { Header, Sider, Content } = Layout;
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const onClick = (e) => {
    setCurrentKey(e.key);

    // 根據點擊的菜單項執行相應操作
    switch (e.key) {
      case "1":
        setCurrentKey(
          <Newest_flight
            onButtonClick={fetchData_manual}
            data={airLine_info}
            lastFetchTime={lastFetchTime}
          />
        );

        break;
      case "2":
        setCurrentKey(<History_flight></History_flight>);
        break;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const authToken = await getTDXAuthToken();
        if (!authToken?.access_token) {
          throw new Error("無法獲取授權令牌");
        }

        const airData = await getAirlineData(authToken.access_token);
        if (!airData) {
          throw new Error("無法獲取航班資料");
        }

        setAirLine_info(airData);
        setLastFetchTime(new Date());
        setCurrentKey(
          <Newest_flight
            data={airData}
            lastFetchTime={new Date()}></Newest_flight>
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // 初始調用
    fetchData();
  }, []);

  const fetchData_manual = async () => {
    try {
      const now = Date.now();
      const timeSinceLastFetch = now - lastFetchTime;

      if (timeSinceLastFetch < REFRESH_COOLDOWN) {
        const remainingTime = Math.ceil(
          (REFRESH_COOLDOWN - timeSinceLastFetch) / 1000
        );
        alert(`請稍後再更新，還需等待 ${remainingTime} 秒`);
        return;
      }

      setLoading(true);

      const authToken = await getTDXAuthToken();
      if (!authToken?.access_token) {
        throw new Error("無法獲取授權令牌");
      }

      const airData = await getAirlineData(authToken.access_token);
      if (!airData) {
        throw new Error("無法獲取航班資料");
      }

      setAirLine_info(airData);
      setLastFetchTime(now);
    } catch (err) {
      setError(err.message || "發生未知錯誤");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading></Loading>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Layout>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{ position: "sticky", height: "100vh", top: 0 }}>
        <div className="demo-logo-vertical" />
        <Menu
          onClick={onClick}
          theme="dark"
          mode="inline"
          defaultSelectedKeys={["1"]}
          items={[
            {
              key: "1",
              icon: <FontAwesomeIcon icon={faPlaneDeparture}></FontAwesomeIcon>,
              label: "即時出發航班",
            },
            {
              key: "2",
              icon: (
                <FontAwesomeIcon icon={faClockRotateLeft}></FontAwesomeIcon>
              ),
              label: "歷史航班查詢",
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
          }}>
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
            }}
          />
        </Header>
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}>
          {currentKey}
        </Content>
      </Layout>
    </Layout>
  );
}
