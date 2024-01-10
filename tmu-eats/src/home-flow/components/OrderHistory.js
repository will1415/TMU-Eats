import { Avatar, Divider, List, Skeleton, Collapse } from "antd";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import { CalendarTwoTone } from "@ant-design/icons";
import { db, getUserOrderHistory } from "../../api/Firebase";
import OrderList from "./OrderList";
const { Panel } = Collapse;
const OrderHistory = ({ refreshData, setRefreshDataState }) => {
  const [loading, setLoading] = useState(false);
  const [dbDataLength, setDBDataLength] = useState();
  const [data, setData] = useState([]);
  const [time, setTime] = useState(Date.now());

  const loadMoreData = async () => {
    console.log("in api call");
    if (loading) {
      return;
    }
    setLoading(true);
    //await call from firebase --here
    getUserOrderHistory()
      .then((body) => {
        setDBDataLength(body.length);
        if (data.length != body.length) {
          setData([...data, ...body]);
          setLoading(false);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    const interval = setInterval(() => setTime(Date.now()), 3000);
    console.log("in use effect");
    if (refreshData) {
      setData([]);
      setRefreshDataState(false);
    }
    if (data.length != dbDataLength) {
      loadMoreData();
    }
    return () => {
      clearInterval(interval);
    };
  }, [time, refreshData]);

  function formatOrderItems(orderItems) {
    let formattedArray = [];
    orderItems.map((item, index) => {
      if (index == 0) {
        formattedArray[index] = "\u2022 " + item + " ";
      } else {
        formattedArray[index] = "|| \u2022 " + item;
      }
    });
    console.log(formattedArray);
    return formattedArray;
  }

  return (
    <div
      id="scrollableDiv"
      style={{
        height: "50vh",
        overflow: "auto",
        //padding: "0 16px",
        border: "1px solid rgba(140, 140, 140, 0.35)",
      }}
    >
      <InfiniteScroll
        dataLength={data.length}
        next={loadMoreData}
        hasMore={data.length != dbDataLength}
        loader={
          <Skeleton
            avatar
            paragraph={{
              rows: 1,
            }}
            active
          />
        }
        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
        scrollableTarget="scrollableDiv"
      >
        <List
          dataSource={data}
          renderItem={(item) => (
            <Collapse>
              <Panel
                header={
                  <div>
                    <CalendarTwoTone />
                    <p style={{ display: "inline", marginLeft: "1vh" }}>
                      {item.data().date}
                    </p>
                  </div>
                }
              >
                <List.Item key={item.email}>
                  <List.Item.Meta
                    title={
                      <a href="https://ant.design">{item.data().restaurant}</a>
                    }
                    description={formatOrderItems(item.data().itemsOrdered)}
                  />
                  <div>{item.data().totalPrice}</div>
                </List.Item>
              </Panel>
            </Collapse>
          )}
        />
      </InfiniteScroll>
    </div>
  );
};
export default OrderHistory;
