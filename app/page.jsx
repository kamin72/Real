"use client";

import { useState, useEffect, useRef } from "react";
import { getTDXAuthToken, getAirlineData } from "./api/tadApi";
import Loading from "./ui/loading";
import Newest_flight from "../app/ui/newestFlight";

export default function Airline_info() {
  const [airLine_info, setAirLine_info] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastFetchTime, setLastFetchTime] = useState(0);
  const REFRESH_COOLDOWN = 10000;

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
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // 初始調用
    fetchData();
  }, []);

  const fetchData = async () => {
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
    <div>
      <Newest_flight
        onButtonClick={fetchData}
        data={airLine_info}
        lastFetchTime={lastFetchTime}
      />
    </div>
  );
}
