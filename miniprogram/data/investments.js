const banks = [
  { id:'CMB', code:'600036.SH', name:'招商银行', yield:0.052, dividendGrowth:0.030, priceGrowth:0.040, updated:'2026-07-27' },
  { id:'CIB', code:'601166.SH', name:'兴业银行', yield:0.058, dividendGrowth:0.025, priceGrowth:0.035, updated:'2026-07-27' },
  { id:'PAB', code:'000001.SZ', name:'平安银行', yield:0.045, dividendGrowth:0.020, priceGrowth:0.040, updated:'2026-07-27' },
  { id:'NBCB', code:'002142.SZ', name:'宁波银行', yield:0.032, dividendGrowth:0.060, priceGrowth:0.060, updated:'2026-07-27' },
  { id:'BOCOM', code:'601328.SH', name:'交通银行', yield:0.066, dividendGrowth:0.015, priceGrowth:0.025, updated:'2026-07-27' },
  { id:'BOC', code:'601988.SH', name:'中国银行', yield:0.062, dividendGrowth:0.015, priceGrowth:0.025, updated:'2026-07-27' },
  { id:'CEB', code:'601818.SH', name:'光大银行', yield:0.060, dividendGrowth:0.020, priceGrowth:0.030, updated:'2026-07-27' },
  { id:'CITIC', code:'601998.SH', name:'中信银行', yield:0.055, dividendGrowth:0.020, priceGrowth:0.030, updated:'2026-07-27' }
]
const portfolios = [
  { id:'DIV_CORE', name:'稳健高股息银行组合', members:[['CMB',.25],['CIB',.25],['BOCOM',.25],['BOC',.25]] },
  { id:'GROWTH', name:'成长银行组合', members:[['CMB',.35],['NBCB',.35],['PAB',.30]] }
]
function getBank(id) { return banks.find(item => item.id === id) || banks[0] }
function getPortfolio(id) { return portfolios.find(item => item.id === id) || portfolios[0] }
function portfolioAssumptions(id) {
  const p = getPortfolio(id)
  return p.members.reduce((result, [bankId, weight]) => {
    const bank = getBank(bankId)
    result.yield += bank.yield * weight
    result.dividendGrowth += bank.dividendGrowth * weight
    result.priceGrowth += bank.priceGrowth * weight
    return result
  }, { yield:0, dividendGrowth:0, priceGrowth:0 })
}
module.exports = { banks, portfolios, getBank, getPortfolio, portfolioAssumptions }
