/*
http://slightly.qx url script-echo-response switchMode.js

hostname=slightly.qx
*/

// ================= 请核对这 3 项名称 =================
const POLICY_NAME = "Twitter&Tg";
const TEMP_NODE   = "direct";
const TARGET_NODE = "🇭🇰 Hong Kong 02";
// ===================================================

console.log(`[INFO] 开始重置策略组: ${POLICY_NAME}`);

// 1. 先检查策略组是否存在，避免名称不匹配导致卡死
$configuration
  .sendMessage({ action: "get_policy_state" })
  .then((res) => {
    const policies = res.ret || {};
    if (!policies.hasOwnProperty(POLICY_NAME)) {
      console.log(`[ERROR] 找不到策略组 "${POLICY_NAME}"！当前所有可用策略组为: ${Object.keys(policies).join(", ")}`);
      throw new Error(`策略组名称不匹配: ${POLICY_NAME}`);
    }

    console.log(`[INFO] 策略组匹配成功，当前选中节点: ${policies[POLICY_NAME]}`);
    // 2. 临时切换到 direct（或备用节点）切断旧连接
    return $configuration.sendMessage({
      action: "set_policy_state",
      content: { [POLICY_NAME]: TEMP_NODE }
    });
  })
  .then(() => {
    console.log(`[INFO] 已临时切换至: ${TEMP_NODE}`);
    // 延迟 150 毫秒确保旧连接彻底断开
    return new Promise((resolve) => setTimeout(resolve, 150));
  })
  .then(() => {
    // 3. 切回主力节点
    return $configuration.sendMessage({
      action: "set_policy_state",
      content: { [POLICY_NAME]: TARGET_NODE }
    });
  })
  .then(() => {
    console.log(`[INFO] 已恢复至主力节点: ${TARGET_NODE}`);
    $notify("TG 网络重置", "局部连接已刷新", `✅ 已重连至：${TARGET_NODE}`);
  })
  .catch((err) => {
    console.log(`[ERROR] 执行异常: ${err.message || JSON.stringify(err)}`);
    $notify("TG 网络重置失败", "请查看脚本日志", err.message || "名称不匹配");
  })
  .finally(() => {
    // 4. 所有动作完成后再返回 200 OK 给快捷指令
    $done({
      status: "HTTP/1.1 200 OK",
      headers: { "Connection": "Close" },
      body: "good"
    });
  });
