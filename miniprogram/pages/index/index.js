const { money } = require('../../utils/calculator')
Page({
  data: { plans: [], summary: { monthlyDividend:'8,620', years:20 } },
  onShow() {
    const plans = wx.getStorageSync('changyingPlans') || []
    const result = getApp().globalData.currentResult
    this.setData({ plans: plans.slice(0, 2), summary: result ? { monthlyDividend:money(result.monthlyDividend), years:result.input.years } : { monthlyDividend:'8,620', years:20 } })
  },
  startPlan(e) { wx.navigateTo({ url:'../planner/planner?goal=' + (e.currentTarget.dataset.goal || 'custom') }) },
  openPlans() { wx.navigateTo({ url:'../plans/plans' }) }
})
