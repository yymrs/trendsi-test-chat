// import Chat, { Bubble, useMessages } from "@chatui/core";
// import { useState, useEffect } from "react";

// function Wpbubble() {
//   const [textStr, setTextStr] = useState("");
//   const deft = "123213123213213123123123123123";
//   useEffect(() => {
//     const delay = 1000; // 每个字符之间的延时，单位毫秒
//     let cursor = 0; // 当前光标位置
//     const type = () => {
//       if (cursor < deft.length) {
//         setTextStr(deft.substring(0, cursor++));
//         setTimeout(type, delay);
//       }
//     };

//     setTimeout(type, delay); // 开始打字效果
//   }, [textStr]);
//   return (
//     <>
//     </>
//   );
// }
// export default Wpbubble;

import { useState, useEffect } from "react";
import { Bubble } from "@chatui/core";

const Typewriter = ({ text }) => {
  const [displayText, setDisplayText] = useState("");
  let de = 30;
  if (text.length > 200) {
    de = 20;
  }
  useEffect(() => {
    let charIndex = 0;
    const typingInterval = setInterval(() => {
      if (charIndex < text.length) {
        setDisplayText((prevText) => prevText + text.charAt(charIndex));
        charIndex++;
      } else {
        clearInterval(typingInterval);
      }
    }, de); // 每个字符的打字间隔时间，可以根据需要调整
    return () => clearInterval(typingInterval);
  }, [text]);

  return <Bubble className="Bubble text !mr-0">{displayText}</Bubble>;
};

export default Typewriter;
