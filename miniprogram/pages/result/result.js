const { money } = require('../../utils/calculator')
Page({
  data: { result:null, summary:{}, table:[], chartRows:[] },
  onLoad() {
    const result = getApp().globalData.currentResult
    if (!result) { wx.reLaunch({ url:'../index/index' }); return }
    const summary = { monthly:money(result.monthlyDividend), annual:money(result.finalDividend), value:money(result.value), invested:money(result.invested), total:money(result.totalDividend), years:result.input.years, recommended:result.recommendedMonthly ? money(result.recommendedMonthly) : '' }
    const chartRows = result.rows.map(item => ({ year:item.year, value:item.value, dividend:item.dividend, invested:item.invested }))
    const table = result.rows.slice(0, 10).map(item => ({ year:item.year, invested:money(item.invested), value:money(item.value), dividend:money(item.dividend), monthly:money(item.monthlyDividend) }))
    this.setData({ result, summary, table, chartRows })
  },
  onReady() { this.drawCharts() },
  drawCharts() {
    const rows=this.data.chartRows; if (!rows.length) return
    this.drawLine(rows); this.drawBars(rows)
  },
  drawLine(rows) {
    const ctx=wx.createCanvasContext('asset', this), w=680, h=220, px=30, py=18, max=Math.max(...rows.map(x=>x.value));
    ctx.setStrokeStyle('#E4E9E2'); ctx.setLineWidth(1); [0,1,2].forEach(i=>{const y=py+i*(h-45)/2;ctx.beginPath();ctx.moveTo(px,y);ctx.lineTo(w-5,y);ctx.stroke()})
    ctx.beginPath(); rows.forEach((x,i)=>{const xx=px+i*(w-px-10)/(rows.length-1), y=py+(h-45)*(1-x.value/max); i?ctx.lineTo(xx,y):ctx.moveTo(xx,y)});ctx.lineTo(w-5,h-26);ctx.lineTo(px,h-26);ctx.closePath();ctx.setFillStyle('rgba(47,119,79,.12)');ctx.fill()
    ctx.beginPath(); rows.forEach((x,i)=>{const xx=px+i*(w-px-10)/(rows.length-1), y=py+(h-45)*(1-x.value/max);i?ctx.lineTo(xx,y):ctx.moveTo(xx,y)});ctx.setStrokeStyle('#26714D');ctx.setLineWidth(3);ctx.stroke();ctx.setFillStyle('#87958B');ctx.setFontSize(18);ctx.fillText('1年',px,h-4);ctx.fillText(`${rows.length}年`,w-50,h-4);ctx.draw()
  },
  drawBars(rows) {
    const ctx=wx.createCanvasContext('dividend', this), w=680,h=220,base=190,max=Math.max(...rows.map(x=>x.dividend));ctx.setStrokeStyle('#E4E9E2');ctx.setLineWidth(1);[0,1,2].forEach(i=>{const y=20+i*85;ctx.beginPath();ctx.moveTo(18,y);ctx.lineTo(w-5,y);ctx.stroke()});const bw=Math.max(4,Math.min(22,(w-40)/rows.length-5));rows.forEach((x,i)=>{const height=x.dividend/max*165,xx=22+i*(w-40)/rows.length;ctx.setFillStyle('#438264');ctx.fillRect(xx,base-height,bw,height)});ctx.setFillStyle('#87958B');ctx.setFontSize(18);ctx.fillText('1年',18,215);ctx.fillText(`${rows.length}年`,w-50,215);ctx.draw()
  },
  savePlan() { const r=this.data.result; const plans=wx.getStorageSync('changyingPlans')||[]; const goal=r.input.goal==='retirement'?'退休计划':r.input.goal==='education'?'子女教育金':'我的长期计划'; const item={id:Date.now(),name:goal,monthlyDividend:this.data.summary.monthly,updated:new Date().toLocaleDateString('zh-CN'),input:r.input}; wx.setStorageSync('changyingPlans',[item,...plans]);wx.showToast({title:'方案已保存',icon:'success'}) },
  adjust(){ wx.navigateBack() },
  share(){ wx.navigateTo({url:'../share/share'}) }
})
