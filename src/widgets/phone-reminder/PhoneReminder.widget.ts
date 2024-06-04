import {
  DeployMode,
  Widget,
  WidgetKeyword,
} from '@widget-js/core'

const name = 'cn.widgetjs.widgets.phone_reminder'
// 组件标题
const title = { 'zh-CN': '来电提醒' }
// 组件描述
const description = { 'zh-CN': '用灵动通知加语音，提醒重要事项' }
// 组件关键词
const keywords = [WidgetKeyword.RECOMMEND]
// 组件路由地址
const url = '/widget/phone_reminder'
// 配置页路由地址
const configUrl = '/widget/config/phone_reminder'
// 组件关键词
const PhoneReminderWidgetDefine = new Widget({
  name,
  title,
  description,
  keywords,
  lang: 'zh-CN',
  width: 6,
  height: 4,
  minWidth: 1,
  supportDeployMode: DeployMode.BACKGROUND,
  maxWidth: 2,
  categories: ['fun'],
  minHeight: 2,
  maxHeight: 2,
  backgroundThrottling: false,
  previewImage: '/images/preview_phone_reminder.png',
  path: url,
  configPagePath: configUrl,
})

export default PhoneReminderWidgetDefine
