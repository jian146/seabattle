export const getIsPc=()=> { 
    var userAgentInfo = navigator.userAgent;
    var Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPod", "iPad"];
    var flag = true;
    for (var i = 0; i < Agents.length; i++) {
        if (userAgentInfo.indexOf(Agents[i]) > 0) {
            flag = false;
            break;
        }
    }
    return flag;
} 

export const getIsPcBySize=()=>{
    const height=window.innerHeight
    const width=window.innerWidth
    return width>1000
}

/**
 * 判断是否是Safari
 * @returns 
 */
export const isTPSafari=()=>{
//Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36
// Mozilla/5.0 (iPhone; CPU iPhone OS 16_3_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 TokenPocket_iOS
// Mozilla/5.0 (Linux; Android 12; PGZ110 Build/SP1A.210812.016; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/97.0.4692.98 Mobile Safari/537.36 TokenPocket_Android
    return navigator.userAgent.search("iPhone") >= 0 && navigator.userAgent.search("TokenPocket_iOS") >= 0
}