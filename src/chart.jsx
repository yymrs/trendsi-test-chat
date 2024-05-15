import Chat, { Bubble, useMessages } from "@chatui/core";

const initialMessages = [
  {
    type: "text",
    content: { text: "主人好，我是智能助理，你的贴心小助手~" },
    user: {
      avatar: "//gw.alicdn.com/tfs/TB1DYHLwMHqK1RjSZFEXXcGMXXa-56-62.svg",
    },
  },
  {
    type: "image",
    content: {
      picUrl: "//img.alicdn.com/tfs/TB1p_nirYr1gK0jSZR0XXbP8XXa-300-300.png",
    },
  },
];

// 默认快捷短语，可选
const defaultQuickReplies = [
  {
    icon: "message",
    name: "联系人工服务",
    isNew: true,
    isHighlight: true,
  },
  {
    name: "短语1",
    isNew: true,
  },
  {
    name: "短语2",
    isHighlight: true,
  },
  {
    name: "短语3",
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
function Ch() {
  // 消息列表
  const b = 2;
  const { messages, appendMsg, setTyping } = useMessages(initialMessages);

  // 发送回调
  function handleSend(type, val) {
    if (type === "text" && val.trim()) {
      // TODO: 发送请求
      appendMsg({
        type: "text",
        content: { text: val },
        position: "right",
      });

      setTyping(true);

      // 模拟回复消息
      setTimeout(() => {
        appendMsg({
          type: "text",
          content: { text: "亲，您遇到什么问题啦？请简要描述您的问题~" },
        });
      }, 1000);
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
    const data = {
      command: "get info",
      payload: {
        test: "sss",
      },
    };
    window.ReactNativeWebView.postMessage(JSON.stringify(data));
    // window.postMessage(JSON.stringify(data))
    handleSend("text", item.name);
  }

  function renderMessageContent(msg) {
    const { type, content } = msg;

    // 根据消息类型来渲染
    switch (type) {
      case "text":
        return <Bubble content={content.text} />;
      case "image":
        return (
          <Bubble type="image">
            <img src={content.picUrl} alt="" />
          </Bubble>
        );
      default:
        return null;
    }
  }
  return (
    <Chat
      className="mt-2"
      navbar={{ title: "智能助理" }}
      messages={messages}
      renderMessageContent={renderMessageContent}
      quickReplies={defaultQuickReplies}
      onQuickReplyClick={handleQuickReplyClick}
      onSend={handleSend}
    />
  );
}
export default Ch;
