# AgentPage - 小程序Page代理构造函数

## 说明
AgentPag是小程序Page对象代理构造函数。方便赋予页面全局公共属性和公共方法，以及对公共生命周期的提取，做全局分享配置、加入全局公共变量、日志上报的全局处理，加入通用的全局方法等。


接入`miniprogram-diff`做data diff处理，优化页面渲染性能。

## 使用
```javascript
import AgentPage from './agentApage';

new AgentPage({
    data: {
        items: [1, 2, 3],
        foo: 'Foo',
        bar: {
            key: 'Bar',
            obj: {
                value: 'OBJ'
            }
        }
    },
    onLoad() {
        // 先diff patch，再setData
        this.set({
            bar: {
                key: 'Far',
                obj: {
                    value: 'OBJ',
                    item: 'ITEM'
                },
            }
        })
    }
});
```