/*
 * 余杭人才码签到（Quantumult X 适配版）
 * 原脚本：https://raw.githubusercontent.com/sdualasijia/LoonResources/main/yuhang_talent_sign_multi.js
 * QX 定时：1 0 * * * yuhang_talent_sign_qx.js, tag=余杭人才码签到, enabled=true
 */

const TOKEN_STORE_KEY = "yuhang_talent_old_tokens";

// 可选：直接写死 token，多账号用 @ 分隔；留空则从 QX 持久化存储读取
const HARDCODED_TOKENS = "";

const oldTokens = (($prefs.valueForKey(TOKEN_STORE_KEY) || "") || HARDCODED_TOKENS)
    .split("@")
    .map(token => token.trim())
    .filter(Boolean);

const names = [
    "liuyang",
    "wangchangyuan"
];

(async () => {
    if (oldTokens.length === 0) {
        console.log("❌ 未配置 token，请设置 yuhang_talent_old_tokens 或 HARDCODED_TOKENS。");
        $notify("余杭人才码签到", "配置错误", "请配置 oldTokens。");
        $done();
        return;
    }

    console.log(`🚀 检测到 ${oldTokens.length} 个账户，开始执行签到任务...`);
    let summaryMessages = [];
    let flag = true;

    for (let i = 0; i < oldTokens.length; i++) {
        const currentToken = oldTokens[i];
        const accountName = names[i] || `账户${i + 1}`;

        console.log(`\n--- 开始为账户 ${accountName} 签到 ---`);
        try {
            console.log(`[${accountName}] 正在获取 accessToken...`);
            const accessToken = await getAccessToken(currentToken);

            console.log(`[${accountName}] 成功获取 accessToken...✅`);
            console.log(`[${accountName}] 查看是否已经签到...`);
            const signFlag = await getSignFlag(accessToken);
            if (signFlag === '2') {
                console.log(`[${accountName}] 今日已签到，无需重复签到...✅`);
                summaryMessages.push(`[${accountName}]: 今日已签到...✅`);
                continue;
            } else {
                console.log(`ℹ️ [${accountName}] 今日尚未签到，继续执行签到操作...`);
            }

            console.log(`[${accountName}] 正在执行签到...`);
            const signResult = await doSign(accessToken);
            summaryMessages.push(`[${accountName}]: ${signResult}`);
        } catch (error) {
            flag = false;
            console.log(`❌ [${accountName}] 签到失败: ${error.message || error}`);
            summaryMessages.push(`[${accountName}]: 失败 ❌ (${error.message || error})`);
        }
    }

    if (flag) {
        console.log("\n🎉 所有账户签到任务执行完毕。");
        $notify(
            "✅ 余杭人才码签到完成",
            `共处理 ${oldTokens.length} 个账户`,
            summaryMessages.join("\n")
        );
    } else {
        $notify(
            "❌ 余杭人才码签到失败",
            `共处理 ${oldTokens.length} 个账户`,
            summaryMessages.join("\n")
        );
    }
    $done();
})();

function getAccessToken(token) {
    const url = "https://open.iconntech.com/unifyUser/changeToken";
    const headers = {
        "Host": "open.iconntech.com",
        "Accept": "*/*",
        "Sec-Fetch-Site": "cross-site",
        "Accept-Language": "zh-CN,zh-Hans;q=0.9",
        "Sec-Fetch-Mode": "cors",
        "Content-Type": "application/json",
        "Origin": "https://yhrcm.zzb.hzyuhang.cn",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 smkH5ContainerSDK/2.1.2 smkVersion/6.7.18",
        "Referer": "https://yhrcm.zzb.hzyuhang.cn:9443/",
        "Sec-Fetch-Dest": "empty"
    };
    const body = {
        "appId": "541782953399693312",
        "token": token
    };

    return $task.fetch({
        url,
        method: "POST",
        headers,
        body: JSON.stringify(body)
    }).then(response => {
        if (response.statusCode !== 200) {
            throw new Error(`响应状态码异常: ${response.statusCode}`);
        }
        let jsonData;
        try {
            jsonData = JSON.parse(response.body);
        } catch (e) {
            throw new Error(`解析 token 响应失败: ${e.message}`);
        }
        if (jsonData.respCode === '00' && jsonData.data) {
            return jsonData.data;
        }
        throw new Error(`接口返回错误: ${jsonData.message || response.body}`);
    });
}

function doSign(accessToken) {
    const url = "https://yhrcm.zzb.hzyuhang.cn/smkbusper/talent/1.0.0/sign";
    const headers = {
        "Host": "yhrcm.zzb.hzyuhang.cn",
        "Accept": "*/*",
        "sendChl": "hzsmk.h5",
        "Sec-Fetch-Site": "same-origin",
        "Accept-Language": "zh-CN,zh-Hans;q=0.9",
        "Sec-Fetch-Mode": "cors",
        "Content-Type": "application/json;charset=UTF-8",
        "Origin": "https://yhrcm.zzb.hzyuhang.cn",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 smkH5ContainerSDK/2.1.2 smkVersion/6.7.18",
        "sendClient": "hellohzsmk",
        "Referer": "https://yhrcm.zzb.hzyuhang.cn/yhtalentcard/yhtalentcard/index.html",
        "Sec-Fetch-Dest": "empty"
    };
    const body = { "accessToken": accessToken };

    return $task.fetch({
        url,
        method: "POST",
        headers,
        body: JSON.stringify(body)
    }).then(response => {
        let jsonData;
        try {
            jsonData = JSON.parse(response.body);
        } catch (e) {
            throw new Error(`解析响应失败: ${e.message}`);
        }
        if (jsonData.code === 'PY0000') {
            return jsonData.msg;
        }
        throw new Error(jsonData.msg || response.body);
    });
}

function getSignFlag(accessToken) {
    const url = "https://yhrcm.zzb.hzyuhang.cn/smkbusper/talent/1.0.0/getSignFlag";
    const headers = {
        "Host": "yhrcm.zzb.hzyuhang.cn",
        "Accept": "*/*",
        "sendChl": "hzsmk.h5",
        "Sec-Fetch-Site": "same-origin",
        "Accept-Language": "zh-CN,zh-Hans;q=0.9",
        "Sec-Fetch-Mode": "cors",
        "Content-Type": "application/json;charset=UTF-8",
        "Origin": "https://yhrcm.zzb.hzyuhang.cn",
        "User-Agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_6_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 smkH5ContainerSDK/2.1.2 smkVersion/6.7.18",
        "sendClient": "hellohzsmk",
        "Referer": "https://yhrcm.zzb.hzyuhang.cn/yhtalentcard/yhtalentcard/index.html",
        "Sec-Fetch-Dest": "empty"
    };
    const body = { "accessToken": accessToken };

    return $task.fetch({
        url,
        method: "POST",
        headers,
        body: JSON.stringify(body)
    }).then(response => {
        let jsonData;
        try {
            jsonData = JSON.parse(response.body);
        } catch (e) {
            throw new Error(`解析响应失败: ${e.message}`);
        }
        if (jsonData.code === 'PY0000') {
            return jsonData.response.signFlag;
        }
        throw new Error(jsonData.msg || response.body);
    });
}
