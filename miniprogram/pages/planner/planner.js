const { banks, portfolios, getBank, getPortfolio, portfolioAssumptions } = require('../../data/investments')
const { simulate, solveMonthly } = require('../../utils/calculator')
Page({
  data: {
    mode:'single', method:'term', goal:'custom', bankIndex:0, portfolioIndex:0,
    bankNames:banks.map(x => x.name), portfolioNames:portfolios.map(x => x.name),
    selectedName:banks[0].name, initial:'100000', monthly:'3000', years:20, target:'5000',
    yieldRate:'5.2', dividendGrowth:'3.0', priceGrowth:'4.0', reinvest:true, updated:'2026-07-27', preset:'industry'
  },
  onLoad(options) { if (options.goal) this.setData({ goal:options.goal }); this.applyDefaults() },
  setMode(e) { this.setData({ mode:e.currentTarget.dataset.mode }, () => this.applyDefaults()) },
  setMethod(e) { this.setData({ method:e.currentTarget.dataset.method }) },
  onBank(e) { this.setData({ bankIndex:e.detail.value }, () => this.applyDefaults()) },
  onPortfolio(e) { this.setData({ portfolioIndex:e.detail.value }, () => this.applyDefaults()) },
  applyDefaults() {
    const d = this.data
    let assumptions, name, updated
    if (d.mode === 'single') { const bank = getBank(banks[d.bankIndex].id); assumptions=bank; name=bank.name; updated=bank.updated }
    else { const portfolio=getPortfolio(portfolios[d.portfolioIndex].id); assumptions=portfolioAssumptions(portfolio.id); name=portfolio.name; updated='2026-07-27' }
    this.setData({ selectedName:name, yieldRate:(assumptions.yield*100).toFixed(1), dividendGrowth:(assumptions.dividendGrowth*100).toFixed(1), priceGrowth:(assumptions.priceGrowth*100).toFixed(1), updated })
  },
  onField(e) { this.setData({ [e.currentTarget.dataset.key]:e.detail.value }) },
  onYears(e) { this.setData({ years:e.detail.value }) },
  setPreset(e) { const preset=e.currentTarget.dataset.preset; const map={industry:'3.0',safe:'1.5',optimistic:'5.0'}; this.setData({ preset, dividendGrowth:map[preset] || this.data.dividendGrowth }) },
  onSwitch(e) { this.setData({ reinvest:e.detail.value }) },
  calculate() {
    const input = { initial:Number(this.data.initial), monthly:Number(this.data.monthly), years:Number(this.data.years), target:Number(this.data.target), yield:Number(this.data.yieldRate)/100, dividendGrowth:Number(this.data.dividendGrowth)/100, priceGrowth:Number(this.data.priceGrowth)/100, reinvest:this.data.reinvest, mode:this.data.mode, selectedName:this.data.selectedName, goal:this.data.goal }
    if (this.data.method === 'target') input.monthly = solveMonthly(input, input.target)
    const result = simulate(input)
    result.recommendedMonthly = this.data.method === 'target' ? input.monthly : null
    getApp().globalData.currentResult = result
    wx.navigateTo({ url:'../result/result' })
  }
})
