/*
http://slightly.qx url script-echo-response switchMode.js

hostname=slightly.qx
*/

// ================= 请根据你的配置修改以下 3 项 =================
const POLICY_NAME = "Twitter&Tg";      // 1. 你的 TG 所在的策略组名称（必须完全一致，区分大小写）
const TEMP_NODE   = "direct";        // 2. 临时中转节点名称（填 "direct" 代表临时切一下直连，也可填另一个节点名）
const TARGET_NODE = "🇭🇰 Hong Kong 02";        // 3. 你的主力节点名称（刷新后最终切回的节点）
// ==============================================================

console.log(`[INFO] 开始重置策略组: ${POLICY_NAME}`);

// 1. 先构造并返回正常响应，让快捷指令安心结束
const okResponse = {
  status: "HTTP/1.1 200 OK",
  headers: { "Connection": "Close" },
  body: "good"
};
$done(okResponse);

// 2. 延迟 200 毫秒执行策略组节点切换，仅打断该策略组的旧连接
setTimeout(() => {
  $configuration
    .sendMessage({
      action: "set_policy_state",
      content: { [POLICY_NAME]: TEMP_NODE }
    })
    .then(() => {
      console.log(`[INFO] 策略组 [${POLICY_NAME}] 临时切换至: ${TEMP_NODE}`);
      // 短暂延迟 100 毫秒确保旧连接断开，再切回主力节点
      return new Promise((resolve) => setTimeout(resolve, 100));
    })
    .then(() => {
      return $configuration.sendMessage({
        action: "set_policy_state",
        content: { [POLICY_NAME]: TARGET_NODE }
      });
    })
    .then(() => {
      console.log(`[INFO] 策略组 [${POLICY_NAME}] 已恢复至: ${TARGET_NODE}`);
      $notify("TG 网络重置", "局部连接已刷新", `✅ 已重连至节点：${TARGET_NODE}`);
    })
    .catch((err) => {
      console.log(`[ERROR] 切换失败: ${JSON.stringify(err)}`);
      $notify("TG 网络重置失败", "请检查策略组或节点名称", "名称必须与配置文件完全一致");
    });
}, 200);
