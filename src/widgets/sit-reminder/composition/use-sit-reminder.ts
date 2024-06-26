import { useWidgetData } from '@widget-js/vue3'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import {
  BrowserWindowApi,
  DeviceApi,
  NotificationApi,
  WidgetApiEvent,
  WidgetPackageApi,
} from '@widget-js/core'
import {
  useIntervalFn,
  useStorage,
} from '@vueuse/core'
import { onMounted } from 'vue'
import { SitReminder } from '@/widgets/sit-reminder/model/SitReminder'

dayjs.extend(duration)

/**
 * 久坐提醒
 */
function useSitReminder() {
  const sitReminder = new SitReminder()
  const cancelBroadcast = `${sitReminder.name}.cancel`
  const confirmBroadcast = `${sitReminder.name}.confirm`
  let breakUrl = ''
  const loadBreakUrl = async (minute: number) => {
    const url = await WidgetPackageApi.getEntryUrl('cn.widgetjs.widgets')
    breakUrl = `${url}#/widget/sit_reminder/break?win_fullscreen=true&win_always_on_top=true&duration=${minute * 60}`
  }
  const { widgetData: sitReminderData } = useWidgetData<SitReminder>(SitReminder, {
    defaultData: sitReminder,
    loadDataByWidgetName: true,
    widgetName: sitReminder.name,
    useBroadcastEvent: [cancelBroadcast, confirmBroadcast, WidgetApiEvent.DATA_CHANGED],
    onBroadcastEvent: async (broadcastEvent) => {
      if (broadcastEvent.event == confirmBroadcast) {
        await BrowserWindowApi.openUrl(breakUrl)
      }
    },
    onDataLoaded() {
      loadBreakUrl(sitReminderData.value.breakInterval)
    },
  })

  const lastUsedAtData = useStorage(`${sitReminder.name}.last_used_at`, dayjs().toISOString())
  const usageCount = useStorage(`${sitReminder.name}.usage_count`, 0)
  let lastUsedAt = dayjs(lastUsedAtData.value)
  const interval = 10
  let lastPoint = {
    x: 0,
    y: 0,
  }

  onMounted(() => {
    BrowserWindowApi.hide()
  })

  useIntervalFn(async () => {
    const now = dayjs()

    const duration = dayjs.duration(now.diff(lastUsedAt))
    if (duration.asSeconds() > sitReminderData.value.mouseCheckInterval * 60 + interval) {
      usageCount.value = 0
    }
    else {
      usageCount.value = usageCount.value + interval
      if (usageCount.value < 20 && (await BrowserWindowApi.existsByUrl(breakUrl))) {
        usageCount.value = 0
      }
    }
    const point = await DeviceApi.getCursorScreenPoint()
    if (point.x != lastPoint.x || point.y != lastPoint.y) {
      lastPoint = point
      lastUsedAt = now
    }
    // sitReminderData.value.sitInterval * 60
    if (usageCount.value >= sitReminderData.value.sitInterval * 60) {
      await NotificationApi.reminder({
        title: '久坐提醒',
        message: `您已经连续使用电脑${sitReminderData.value.sitInterval}分钟`,
        icon: 'computer_line',
        confirmButtonText: '休息一下',
        cancelButtonText: '知道了',
        cancelBroadcast,
        confirmBroadcast,
        duration: 10000,
      })
      usageCount.value = 0
    }
  }, interval * 1000)
}

export default useSitReminder
