/*
http://slightly.qx/kill url script-echo-response switchMode.js

hostname=slightly.qx
*/

// 1. 先构造并返回正常响应，让快捷指令安心结束
const okResponse = {
  status: "HTTP/1.1 200 OK",
  headers: { "Connection": "Close" },
  body: "good"
};
$done(okResponse);

// 2. 延迟 200 毫秒后再切换运行模式，避免切断快捷指令的连接
setTimeout(() => {
  $configuration
    .sendMessage({
      action: "set_running_mode",
      content: { running_mode: "all_direct" }
    })
    .then(() => {
      console.log("[INFO] 切换到直连模式");
      return $configuration.sendMessage({
        action: "set_running_mode",
        content: { running_mode: "filter" }
      });
    })
    .then(() => {
      console.log("[INFO] 切换到规则模式");
      $notify("网络变化", "打断请求", "🅰 你已重新连入网络");
    });
}, 200);
