
仅供学习交流使用，请勿用作商业用途。  

#### 说在前面

- 影视采集、播放于一体。
- 免疼讯、爱骑艺、悠酷视频vip就能看视频。
- 可以本地跑起来🏃追剧、看电影。
- 技术栈是 koa + swig模板引擎 + jQuery，代码清晰明了很容易理解。
- 采集到的资源以 `json` 文件格式本地化了，不用安装数据库！
- 目前仅做了最大资源网的资源接入，后续可以自己集成、扩展。（百度搜索关键字：`影视资源采集`）

#### 运作流程
- 输入关键字按下搜索后，会根据`对应的类型`去不同的资源网搜索资源，再将搜索到的结果和本地对应`list.json`文件做一个比较。  

- 如果已经有此资源，则显示`在线播放`和`更新`按钮，在线播放直接跳到详情页，拉起模板渲染引擎，渲染详情页面对应的json文件。  

- 如果没有此资源，则只显示`采集并播放`按钮，过程是先将此资源采集至本地后，再跳转到详情页，渲染......  

![搜索：送你一朵小红花](https://static.iiter.cn/article/4dd92cb3c141beddd752a8334bed6e89.png)

采集至本地有两步操作，拿`最大资源网`举例来说：

`views/zuidazy/`文件夹底下则是采集到的最大资源网对应的所有数据。

1.`views/zuidazy/list.json`文件相当于是`zuidazy`类型对应的一个索引，采集的时候跟它做对比可以清楚当前资源是否已经存在，免去重复采集的操作。
2.`views/zuidazy/json/`文件夹中则是所有采集到的资源详情数据，这一份json文件，描述的是一个影视资源的详情页面，文件命名方式跟`list.json`中的`id`是一一对应的。详情的数据格式如下：
```json
{
  "imagePic": "http://tupian.gg-zui.com/pic/upload/vod/2021-01-06/202101061609936935.jpg",
  "name": "送你一朵小红花",
  "playGrade": "HD1280高清国语中字版",
  "score": "7.5",
  "otherName": "A Little Red Flower",
  "daoyan": "韩延",
  "zhuyan": "易烊千玺,刘浩存,朱媛媛,高亚麟,夏雨,岳云鹏,李晓川,孔琳,吴晓亮,张绍刚,孙强,安笑歌,李增辉,姚未平,张浩天,柴陆",
  "type": "剧情片 剧情",
  "place": "大陆",
  "language": "国语",
  "showTime": "2020",
  "updateTime": "2021-03-04 18:30:36",
  "introduce": "两个抗癌家庭，两组生活轨迹。影片讲述了一个温情的现实故事，思考和直面了每一个普通人都会面临的终极问题——想象死亡随时可能到来，我们唯一要做的就是爱和珍惜。",
  "playInfo": [
    {
      "grade": "HD1280高清国语中字版",
      "url": "https://douban.donghongzuida.com/20210304/18796_ce5e6fcb/index.m3u8"
    }
  ],
  "downloadInfo": [
    {
      "grade": "HD1280高清国语中字版",
      "url": "http://vipxz.bocai-zuida.com/2103/送你一朵小红花.HD1280高清国语中字版.mp4"
    }
  ]
}
```
![播放详情页](https://static.iiter.cn/article/162536a6aa2a376a300688494c7df20c.png)

采集至本地的好处是，免数据库，详情页渲染快！一次采集，`N次`使用。

当然，有能力的同学，可以将`读写文件`的操作`数据库化`，这在实现层面上并不是问题。


#### 运作流程图

![运作流程](https://static.iiter.cn/article/54f9f95ea29e2ffd23c300b79e0bb709.png)

#### 目录结构

- `config` 存放当前工程全局配置信息。
- `public` 存放全局样式、页面交互 js 等
- `routes` 存放工程相关路由
  - `index.js`处理动态路由匹配(换源)
  - `collection.js`负责采集文件相关
  - `details.js`处理资源详情页面
  - `search.js`处理用户搜索
- views 中存放 swig 模板、采集到的 json 文件等

#### 如何运行

1.打开github地址: [https://github.com/isnl/koa-video](https://github.com/isnl/koa-video)  

2.打开后把右上角这个东西点一下  

![star](https://static.iiter.cn/article/3bbc16ffb5beb901ac739b76872dd69e.png)  

3.克隆本仓库至本地
```bash
https://github.com/isnl/koa-video.git
```
4.安装依赖
```bash
npm i
```
5.本地运行
```bash
npm run dev
```
6.打开浏览器访问 [http://localhost:3000](http://localhost:3000)

#### 艾特网 - 程序员导航站：

[https://iiter.cn](https://iiter.cn)

1. 看到这里啦，点个 `赞` 支持一下吧。
2. 关注公众号 `前端糖果屋` 互相学习鸭。
3. 添加微信 `itRobot` ，拉你进 `技术交流群` 探讨人生。
   ![扫码立即关注](https://static.iiter.cn/mp_footer.png)
