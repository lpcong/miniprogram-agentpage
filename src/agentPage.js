/**
 * 微信小程序Page对象代理构造函数
 * @author andypliang
 * @description 小程序项目页面中公共属性及公共函数的提取，拥有公共的生命周期便于日志上报
 */
import diff from './libs/diff';
const systemInfo = wx.getSystemInfoSync && wx.getSystemInfoSync() || {};
const OBJECTTYPE = '[object Object]';
const SHARE_CONFIG = {
    title: '全局分享标题，放心买保险',
    path: '/pages/home/index',
    imageUrl: 'https://cdn.domain.com/shareImage.png'
};
const GLOBAL_DATA = {
    SRC_PATH: 'https://cdn.domain.com/',  // global source path prefix
    iPhoneX: systemInfo.model && systemInfo.model.indexOf('iPhone X') >= 0 
};
const GLOBAL_LIFE_CIRCLE = {
    onLoad(options) {

        // the `this` object is pointing to the AgentPage
        Object.defineProperties(this, {
            'set': {
                value(data) {
                    return new Promise((resolve, reject) => {
                        if (Object.prototype.toString.call(data) !== OBJECTTYPE) {
                            reject('Error data type');
                            return;
                        }
                        let diffResult = diff(data, this.data);
                        if (Object.keys(diffResult)[0] === '') {
                            diffResult = diffResult[''];
                        }
                        if (!Object.keys(diffResult).length) {
                            resolve(null);
                            return;
                        }
                        this.setData(diffResult, () => {
                            resolve(diffResult);
                        });
                    });
                },
                writable: false,
                configurable: false
            }
        });
    },
    onShow() {
        console.log('global show func');
    },
    onHide() {
        console.log('global hide func');
    },
    onUnload() {
        console.log('global unload func');
    }
}

 class AgentPage {

    constructor(params) {
        Object.assign(this, { params });
        this.target = {};
        this._init();
        this.target.onShareAppMessage = params.onShareAppMessage || (() => SHARE_CONFIG);
        Page(this.target);
    }

    _init() {
        this._initDatas();
        this._initMethods();
        this._initLifeCircle();
        this._customDatas();
    }

    /**
     * init data
     */
    _initDatas() {
        this.target.data = this.params.data || {};
    }

    /** 
     * init methods
     */
    _initMethods() {
        const params =  this.params;
        if (!params || typeof params !== 'object') return;
        this._customLifeCircle();
        for (let key in params) {
            if (!params.hasOwnProperty(key) || typeof params[key] !== 'function') continue;
            if (typeof GLOBAL_LIFE_CIRCLE[key] === 'function') {
                this.LIFE_CIRCLE_FUNC[key].push(params[key]);
            } else {
                this.target[key] = params[key];
            }
        }
    }
    
    /**
     * add global life circle
     */
    _customLifeCircle() {
        this.LIFE_CIRCLE_FUNC = [];
        for(let func in GLOBAL_LIFE_CIRCLE) {
            this.LIFE_CIRCLE_FUNC[func] = [GLOBAL_LIFE_CIRCLE[func]];
        }
    }

    /** 
     * add life circle
     */
    _initLifeCircle() {
        const _this = this;
        for (let circle in this.LIFE_CIRCLE_FUNC) {
            this.target[circle] = (...args) => {
                for (let fn of _this.LIFE_CIRCLE_FUNC[circle]) {
                    fn.apply(this, args);
                }
            };
        }
    }

    /**
     * add global datas
     */
    _customDatas() {
        for(let item in GLOBAL_DATA) {
            this.target.data[item] = GLOBAL_DATA[item];
        }
    }
 }

 export default AgentPage;