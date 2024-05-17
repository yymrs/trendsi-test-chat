import httpsServer from "@/httpsServer/index.cjs";

/**
 * @description 获取消息
 */
export async function getChartDataApi(params = {}) {
  const res = await httpsServer.post("https://d-app.trendsi.cc/api/v1/robot/chat", {
    msgType: "2", // 消息类型1：text；2：pic；3：media；4：file；5emoji；
    device_id: "148189",
    channel: "3",
    userID: "",
    userName: "ben",
    ...params,
  });
  console.log(res);
  return res;
}
