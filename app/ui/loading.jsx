import React from "react";
import { Alert, Flex, Spin } from "antd";
const contentStyle = {
  padding: 50,
  background: "rgba(0, 0, 0, 0.05)",
  borderRadius: 4,
};
const content = <div style={contentStyle} />;
const App = () => (
  <Spin tip="資料載入中，請稍後...">
    {/* <Alert message="" description="" type="info" /> */}
    {content}
  </Spin>
);
export default App;
