import React from "react";
import { Alert, Flex, Spin, ConfigProvider } from "antd";

const spin_contentStyle = {
  minHeight: "100vh",
  padding: 50,
  background: "rgba(0, 0, 0, 0.05)",
  borderRadius: 4,
};
const content = <div style={spin_contentStyle} />;
const App = () => (
  <ConfigProvider
    theme={{
      components: {
        Spin: {
          contentHeight: 1000,
        },
      },
    }}>
    <Spin tip="資料載入中，請稍後..." size="large" contentHeight="0">
      {/* <Alert message="" description="" type="info" /> */}
      {content}
    </Spin>
  </ConfigProvider>
);
export default App;
