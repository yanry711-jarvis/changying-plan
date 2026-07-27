function simulate(input) {
  const years = Math.max(1, Number(input.years) || 1)
  const months = years * 12
  const monthly = Math.max(0, Number(input.monthly) || 0)
  const priceMonthly = Math.pow(1 + Number(input.priceGrowth || 0), 1 / 12) - 1
  let value = Math.max(0, Number(input.initial) || 0)
  let invested = value, totalDividend = 0, annualDividend = 0
  const rows = []
  for (let month = 1; month <= months; month++) {
    value += monthly
    invested += monthly
    value *= 1 + priceMonthly
    const currentYield = Number(input.yield || 0) * Math.pow(1 + Number(input.dividendGrowth || 0), Math.floor((month - 1) / 12))
    const dividend = value * currentYield / 12
    annualDividend += dividend
    totalDividend += dividend
    if (input.reinvest) value += dividend
    if (month % 12 === 0) {
      rows.push({ year: month / 12, invested, value, dividend: annualDividend, monthlyDividend: annualDividend / 12 })
      annualDividend = 0
    }
  }
  const last = rows[rows.length - 1]
  return { input, rows, invested, value, totalDividend, finalDividend:last.dividend, monthlyDividend:last.monthlyDividend }
}
function solveMonthly(input, target) {
  let low = 0, high = 1000000, answer = high
  for (let i = 0; i < 42; i++) {
    const middle = (low + high) / 2
    const result = simulate(Object.assign({}, input, { monthly: middle }))
    if (result.monthlyDividend >= target) { answer = middle; high = middle } else low = middle
  }
  return Math.ceil(answer)
}
function money(value) { return Math.round(value || 0).toLocaleString('zh-CN') }
module.exports = { simulate, solveMonthly, money }
