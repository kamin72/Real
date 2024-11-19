import { useState, useEffect } from "react";
import static_data from "../../public/response_data.json";
import { Table, Tag } from "antd";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons";

const handleChange = (value) => {
  console.log(`selected ${value}`);
};

export default function Newest_flight_table({
  onButtonClick,
  data,
  lastFetchTime,
}) {
  const fontSize = "text-base";
  const columns = [
    {
      title: "班機號碼",
      dataIndex: "FlightNumber",
      className: fontSize,
    },
    {
      title: "航空公司",
      dataIndex: "AirlineID",
      className: fontSize,
    },
    {
      title: "起點機場",
      dataIndex: "DepartureAirportID",
      className: fontSize,
    },
    {
      title: "抵達機場",
      dataIndex: "ArrivalAirportID",
      className: fontSize,
    },
    {
      title: "航廈",
      dataIndex: "Terminal",
      className: fontSize,
    },
    // {
    //   title: "登機門",
    //   dataIndex: "Gate",
    //   className: fontSize,
    // },
    {
      title: "預訂出發時間",
      dataIndex: "ScheduleDepartureTime",
      className: fontSize,
    },
    // {
    //   title: "實際出發時間",
    //   dataIndex: "ActualDepartureTime",
    //   className: fontSize,
    // },
    {
      title: "預估出發時間",
      dataIndex: "EstimatedDepartureTime",
      className: fontSize,
    },
    {
      title: "班機狀態",
      key: "tags",
      dataIndex: "tags",
      render: (_, { tags }) => (
        <>
          {tags.map((tag) => {
            let color = tag.includes("準時") ? "geekblue" : "volcano";

            return (
              <Tag color={color} key={tag} className="text-xl">
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </>
      ),
    },
  ];

  const parsedData = JSON.parse(JSON.stringify(static_data)) || [];
  console.log(parsedData[0].FIDSDeparture);
  // console.log(parsedData[0].FIDSDeparture);
  let depart;
  // console.log(parsedData[0].FIDSDeparture);
  // console.log(new Date(parsedData[0].FIDSArrival[0].ScheduleArrivalTime));
  if (parsedData.length > 0) {
    depart = parsedData[0].FIDSDeparture.map((data, index) => {
      let schedule_date = new Date(data.ScheduleDepartureTime);
      let estimate_date = new Date(data.ScheduleDepartureTime);
      return {
        key: index,
        FlightNumber: data.FlightNumber,
        AirlineID: data.AirlineID,
        DepartureAirportID: data.DepartureAirportID,
        ArrivalAirportID: data.ArrivalAirportID,
        Terminal: data.Terminal,
        ScheduleDepartureTime: `${schedule_date.getFullYear()}/${
          schedule_date.getMonth() + 1
        }/${schedule_date.getDate()} ${schedule_date.getHours()}:${
          schedule_date.getMinutes() < 10
            ? "0" + schedule_date.getMinutes()
            : schedule_date.getMinutes()
        }`,
        EstimatedDepartureTime: `${estimate_date.getFullYear()}/${
          estimate_date.getMonth() + 1
        }/${estimate_date.getDate()} ${estimate_date.getHours()}:${
          estimate_date.getMinutes() < 10
            ? "0" + estimate_date.getMinutes()
            : estimate_date.getMinutes()
        }`,
        tags: [data.DepartureRemark],
      };
    }).sort((a, b) => b.key - a.key);
  }

  return (
    <>
      <Table
        columns={columns}
        dataSource={depart}
        bordered
        title={() => {
          return (
            <>
              {/* <div className="text-4xl mb-[10px] font-bold">最新航班資訊</div> */}
              <div className="mb-[5px]">
                最後更新時間: {new Date(lastFetchTime).toLocaleString()}
              </div>
              <button
                className="w-[30px] h-[30px] border relative rounded-md bg-sky-400 active:bg-sky-600 active:outline active:outline-[1px] active:border-indigo-900"
                onClick={onButtonClick}>
                <div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
                  <FontAwesomeIcon
                    icon={faRotateRight}
                    className="text-lg text-white active:text-[16px]"></FontAwesomeIcon>
                </div>
              </button>
            </>
          );
        }}
        // footer={() => "Footer"}
      />
    </>
  );
}
