import Chat, { Bubble, useMessages } from "@chatui/core";
import { getChartDataApi } from "@/api/index.cjs";
import { Icon } from "@chatui/core";
import { Stepper, Step } from "@chatui/core";
/**
 * 1.模拟打字效果
 * 2qa.点击的时候标题展示出来
 */
const renderType = {
  text: "text",
  /**
   * @description 默认问题简洁查询
   */
  qaList: "qaList",
  /**
   * @description 订单流程状态
   */
  orderScheduling: "orderScheduling",
  /**
   * @description 订单汇总表格
   */
  orderSummary: "orderSummary",
  image: "image",
};
const initialMessages = [
  {
    type: "text",
    content: { answerRes: { headText: "Hi,I am your exclusive intelligent assistant JJ." } },
  },
  {
    type: "qaList",
    content: [
      {
        show: false,
        title: "1.How to check order status?",
        info: `Trendsi offers products that ship from both the US and overseas. Estimated shipping times are 2-7 business days or 5-10 business days.
        Please confirm via the Trendsi app whether your order is still within the delivery time.`,
      },
      {
        show: false,
        title: "2.Why my order delayed?",
        info: `Trendsi offers products that ship from both the US and overseas. Estimated shipping times are 2-7 business days or 5-10 business days.
        Please confirm via the Trendsi app whether your order is still within the delivery time.
        We suggest reviewing the shipping status in the Trendsi app and reach out to us again if your order is taking longer than the guaranteed time.`,
      },
      {
        show: false,
        title: "3.How order fulfillment works?",
        info: `
        1. Connect to your Shopify store and select products to sell. Trendsi integrates 100% with Shopify. Download the Trendsi Shopify app to get started.
        2. Pay product cost once you receive an order. 
         When your customer places an order containing Trendsi products, it will automatically sync to your Trendsi app. All you need to do is pay for the product cost and we will start processing. To automate this entire process, we even offer an auto checkout feature you can toggle on/off in the Order Management settings.
        3. We quality check and ship directly to your customers.
         Your business reputation is very important to us. We have an entire quality control team that will check products before they are shipped to your customers.
        4. Your customer receives their order with your branded invoice.
        Using a dropshipping partner doesn't mean you have to lose your branding. Take advantage of Trendsi's Branded Invoice to add your logo, order message, and even return policy.`,
      },
    ],
  },
];

// 默认快捷短语，可选
const defaultQuickReplies = [
  {
    icon: "message",
    name: "Customer service",
    isHighlight: true,
  },
  {
    name: "Order summary",
  },
];
// window.document.addEventListener('message', function (e) {
//     const message = e.data
//     alert('postMessage')
//     console.log(e, message);
// })
window.addEventListener("message", function (e) {
  const message = e.data;
  let params = {};
  try {
    params = JSON.parse(e.data);
  } catch (error) {
    params = {};
  }
  if (params.origin == "Trendsi") {
    alert("postMessage");
  }
  console.log(e, message);
});
// function onRNMessage(data) {
//     // 为了更好的查看效果，建议采用document.get
//     console.log('html收到RN端的调用，并传递了数据，data = ' + data)
//     alert('injectJavaScript')
// }
function ChDom() {
  // 消息列表
  const { messages, appendMsg, setTyping } = useMessages(initialMessages);
  async function handleSend(type, val) {
    console.log(type, val);
    if (type === "text" && val.trim()) {
      // TODO: 发送请求
      appendMsg({
        type: renderType.text,
        content: { answerRes: { headText: val } },
        position: "right",
      });
      setTyping(true);
      const res = await getChartDataApi({ question: val }).catch((res) => res);
      console.log(res);
      if (res.code == 200) {
        const { isSorry, cardId, answer, sorryMsg } = res.result;
        let renderTypeValue;
        if (isSorry == 0) {
          const answerRes = JSON.parse(answer);
          console.log(answerRes);
          // 卡片ID1：文本卡片：2：图文卡片；3：表格卡片；4：timeline卡片；
          switch (cardId) {
            case 1:
              renderTypeValue = renderType.text;
              break;
            case 2:
              renderTypeValue = renderType.image;
              break;
            case 3:
              renderTypeValue = renderType.orderSummary;
              break;
            case 4:
              appendMsg({
                type: renderType.text,
                content: { answerRes: { headText: answerRes.headText } },
              });
              renderTypeValue = renderType.orderScheduling;
              break;
            default:
              renderTypeValue = renderType.text;
              break;
          }

          appendMsg({
            type: renderTypeValue,
            content: { answerRes },
          });
        } else {
          appendMsg({
            type: renderType.text,
            content: { answerRes: { headText: sorryMsg } },
          });
        }
      } else {
        appendMsg({
          type: renderType.text,
          content: { answerRes: { headText: "Service error!" } },
        });
      }
    }
  }

  // 快捷短语回调，可根据 item 数据做出不同的操作，这里以发送文本消息为例
  function handleQuickReplyClick(item) {
    console.log(item);
    // window.parent.postMessage({
    //     event: 'order',
    //     params: {
    //         id: 2222
    //     },...item
    // }, '*');
    // window.ReactNativeWebView.postMessage({
    //     event: 'order',
    //     params: {
    //         id: 2222
    //     },...item
    // }, '*');
    // window.postMessage('hi! RN')
    // const data = {
    //   command: "get info",
    //   payload: {
    //     test: "sss",
    //   },
    // };
    // window.ReactNativeWebView.postMessage(JSON.stringify(data));
    // window.postMessage(JSON.stringify(data))
    handleSend("text", item.name);
  }
  /**
   * @description 点击展示qa问题
   * @param {*} event
   * @returns
   */
  function showQAInfoHandle(event) {
    const i = event.currentTarget.dataset.index;
    const qaList = initialMessages.find((item) => item.type == "qaList");
    const content = qaList.content[i];
    if (content.show) return;
    appendMsg({
      type: renderType.text,
      content: { answerRes: { headText: content.title } },
      position: "right",
    });
    setTyping(true);
    content.show = true;
    setTimeout(() => {
      appendMsg({
        type: renderType.text,
        content: { answerRes: { headText: content.info } },
      });
    }, 1000);
  }
  function renderQaListNode(content = []) {
    console.log(content);
    const style = {
      color: "#fbc35c",
    };
    const h2Style = {
      borderBottom: "1px solid #eee",
    };
    const defaultQAList = content.map((item, i) => {
      return (
        <>
          <h2
            className={i == 0 ? "!mt-0 text-[16px] mt-3 flex items-center" : "text-[16px] mt-3 flex items-center"}
            style={h2Style}
            data-index={i}
            onClick={showQAInfoHandle}
            key={i}
          >
            <span className={i == 0 ? "!mt-0 text-[16px]" : "text-[16px]"}>{item.title}</span>

            <Icon className="text-[16px]" type="chevron-right"></Icon>
          </h2>
        </>
      );
    });
    return (
      <>
        <div className="qslist-box flex">
          <div className="left-text text-[24px] self-center mr-2" style={style}>
            Q&A
          </div>
          <div>{defaultQAList}</div>
        </div>
      </>
    );
    // return content.map((item) => {
    //   return
    // });
  }
  /**
   * @description 根据不同类型展示问答
   * @param {*} msg
   * @returns
   */
  function renderMessageContent(msg) {
    console.log(msg);
    const { type, content } = msg;

    // 根据消息类型来渲染
    switch (type) {
      case renderType.text:
        return <Bubble className="Bubble text !mr-0" content={content.answerRes.headText} />;
      case renderType.image:
        return (
          <Bubble type="image">
            <img src={content.picUrl} alt="" />
          </Bubble>
        );
      case renderType.qaList:
        return <Bubble className="Bubble text !mr-0">{renderQaListNode(content)}</Bubble>;
      case renderType.orderScheduling:
        return <Bubble className="Bubble text !mr-0">{renderOrderScheduling(content)}</Bubble>;
      case renderType.orderSummary:
        return <Bubble className="Bubble text !mr-0">{renderOrderSummary(content)}</Bubble>;
      default:
        return null;
    }
  }
  /**
   * @description 展示用户查询的订单状态
   * @param {*} event
   * @returns
   */
  function renderOrderScheduling(data) {
    const content = JSON.parse(data.answerRes.content)[0];
    console.log(content, "contentcontentcontent");
    const { orderPayTime } = content;
    // const headText = data.answerRes.headText;
    return (
      <>
        <div>
          <Stepper current={3}>
            <Step title="Paid" desc={orderPayTime} />
            <Step title="Processing" desc={orderPayTime} />
            <Step title="Shipped" desc={orderPayTime} />
            <Step title="Delivered" desc={orderPayTime} />
            <Step title="Completed" />
          </Stepper>
        </div>
      </>
    );
  }
  /**
   * @description 展示订单汇总的数据
   * @param {*} event
   * @returns
   */
  function renderOrderSummary(data) {
    const content = JSON.parse(data.answerRes.content)[0];
    const headText = data.answerRes.headText;
    const orderStatusList = [
      {
        label: "待订货",
        value: "",
        key: "fulfilmentActualQuantity",
      },
      {
        label: "待到货",
        value: "",
        key: "actualTransitQuantity",
      },
      {
        label: "待入库",
        value: "",
        key: "toBeInQuantity",
      },
      {
        label: "待出库",
        value: "",
        key: "toBeOutQuantity",
      },
      {
        label: "待送达",
        value: "",
        key: "toBeDeliveredQuantity",
      },
      {
        label: "待确认",
        value: "",
        key: "toBeConfirmQuantity",
      },
      {
        label: "已确认",
        value: "",
        key: "confirmQuantity",
      },
      {
        label: "缺发数",
        value: "",
        key: "failedQuantity",
      },
    ];
    function getStyle(i) {
      const style = {
        border: "1px solid transparent",
      };
      if (i % 4 != 0) {
        style.borderRight = "1px solid #eee";
      }
      if (i >= 4) {
        style.borderBottom = "1px solid #eee";
      }
      return style;
    }
    const chidOrderItem = orderStatusList.map((item, i) => {
      return (
        <>
          <div className="flex flex-col text-center" style={getStyle(i + 1)}>
            <span className="p-2 inline-block bg-[#fbfafa]">{item.label}</span>
            <span className="px-2 py-3 inline-block bg-[#e4f7f3]">{content[item.key] || 0}</span>
          </div>
        </>
      );
    });
    return (
      <>
        <div className="p-3">
          <h2 className="text-[16px]">{headText}</h2>
          <div style={{ border: "1px solid #eee" }} className="mt-4 grid grid-rows-2 grid-cols-4">
            {chidOrderItem}
          </div>
        </div>
      </>
    );
  }
  const inputType = "text";
  return (
    <Chat
      className="mt-2"
      navbar={{ title: "TRENDSI" }}
      messages={messages}
      inputType={inputType}
      placeholder="ask JJ please"
      renderMessageContent={renderMessageContent}
      quickReplies={defaultQuickReplies}
      onQuickReplyClick={handleQuickReplyClick}
      onSend={handleSend}
      toolbar={[
        {
          type: "image",
          icon: "image",
          title: "",
        },
      ]}
    />
  );
}
export default ChDom;
