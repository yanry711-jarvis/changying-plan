import fs from 'node:fs/promises';
import { SpreadsheetFile, Workbook } from '@oai/artifact-tool';

const outputDir = 'outputs/sample_bank_data';
await fs.mkdir(outputDir, { recursive: true });

const wb = Workbook.create();
const guide = wb.worksheets.add('导入说明');
const banks = wb.worksheets.add('银行参数');
const dividends = wb.worksheets.add('分红历史');
const portfolios = wb.worksheets.add('组合模板');

const colors = { green: '#1D5A42', sage: '#EAF2E9', gold: '#B98645', pale: '#F7F8F5', border: '#D9E3D8', blue: '#0000FF' };
const titleStyle = { fill: colors.green, font: { bold: true, color: '#FFFFFF', size: 16 }, horizontalAlignment: 'left', verticalAlignment: 'center' };
const headerStyle = { fill: colors.sage, font: { bold: true, color: colors.green }, horizontalAlignment: 'center', verticalAlignment: 'center', wrapText: true, borders: { preset: 'outside', style: 'thin', color: colors.border } };
const bodyStyle = { borders: { preset: 'inside', style: 'thin', color: '#E6ECE5' }, verticalAlignment: 'center' };

guide.mergeCells('A1:H1');
guide.getRange('A1').values = [['银行股测算 · 模拟导入数据']];
guide.getRange('A1:H1').format = titleStyle;
guide.getRange('A1:H1').format.rowHeight = 30;
guide.getRange('A3:B8').values = [
  ['版本', 'v0.1-demo'],
  ['数据状态', '全部为模拟数据，仅用于开发联调，不可用于投资决策'],
  ['数据截至日期', new Date('2026-07-27')],
  ['上传方式', '管理员后台上传 Excel；校验通过后即时生效'],
  ['必填工作表', '银行参数、分红历史、组合模板'],
  ['百分比填写', '输入 5.2% 即可；请勿输入 5.2 或 520%'],
];
guide.getRange('A3:A8').format = { fill: colors.sage, font: { bold: true, color: colors.green }, borders: { preset: 'outside', style: 'thin', color: colors.border } };
guide.getRange('B3:B8').format = { borders: { preset: 'outside', style: 'thin', color: colors.border }, wrapText: true };
guide.getRange('B5').format.numberFormat = 'yyyy-mm-dd';
guide.getRange('A10:H10').values = [['字段约定', '说明', '示例', '校验规则', '', '', '', '']];
guide.getRange('A10:H10').format = headerStyle;
guide.getRange('A11:D16').values = [
  ['bank_id', '银行唯一标识，组合和历史表用此字段关联', 'CMB', '必填、不可重复'],
  ['default_dividend_yield', '用户选择银行时预填的税前股息率', '5.2%', '必填，0%–30%'],
  ['default_dividend_growth', '用户选择银行时预填的股息年增长假设', '3.0%', '必填，-20%–30%'],
  ['default_price_growth', '用户选择银行时预填的股价年增长假设', '4.0%', '必填，-50%–50%'],
  ['weight', '组合内的配置比例', '25.0%', '同一模板权重合计应为 100%'],
  ['source_note', '数据来源与口径说明', '模拟样例', '必填'],
];
guide.getRange('A11:D16').format = bodyStyle;
guide.getRange('A1:D16').format.autofitColumns();
guide.getRange('B1:B16').format.columnWidth = 42;
guide.showGridLines = false;

const bankHeaders = ['bank_id', '股票代码', '银行名称', '市场', '状态', '默认税前股息率', '默认股息增长率', '默认股价增长率', '数据截至日期', 'source_note', '备注'];
const bankRows = [
  ['CMB', '600036.SH', '招商银行', 'A股', '启用', 0.052, 0.030, 0.040, new Date('2026-07-27'), '模拟样例', '默认展示银行'],
  ['CIB', '601166.SH', '兴业银行', 'A股', '启用', 0.058, 0.025, 0.035, new Date('2026-07-27'), '模拟样例', ''],
  ['PAB', '000001.SZ', '平安银行', 'A股', '启用', 0.045, 0.020, 0.040, new Date('2026-07-27'), '模拟样例', ''],
  ['NBCB', '002142.SZ', '宁波银行', 'A股', '启用', 0.032, 0.060, 0.060, new Date('2026-07-27'), '模拟样例', ''],
  ['BOCOM', '601328.SH', '交通银行', 'A股', '启用', 0.066, 0.015, 0.025, new Date('2026-07-27'), '模拟样例', ''],
  ['BOC', '601988.SH', '中国银行', 'A股', '启用', 0.062, 0.015, 0.025, new Date('2026-07-27'), '模拟样例', ''],
  ['CEB', '601818.SH', '光大银行', 'A股', '启用', 0.060, 0.020, 0.030, new Date('2026-07-27'), '模拟样例', ''],
  ['CITIC', '601998.SH', '中信银行', 'A股', '启用', 0.055, 0.020, 0.030, new Date('2026-07-27'), '模拟样例', ''],
];
banks.getRange('A1:K1').values = [bankHeaders];
banks.getRange(`A2:K${bankRows.length + 1}`).values = bankRows;
banks.getRange('A1:K1').format = headerStyle;
banks.getRange(`A2:K${bankRows.length + 1}`).format = bodyStyle;
banks.getRange(`F2:H${bankRows.length + 1}`).format.numberFormat = '0.0%';
banks.getRange(`I2:I${bankRows.length + 1}`).format.numberFormat = 'yyyy-mm-dd';
banks.getRange(`F2:H${bankRows.length + 1}`).format.font = { color: colors.blue };
banks.getRange(`A1:K${bankRows.length + 1}`).format.autofitColumns();
banks.getRange('K:K').format.columnWidth = 18;
banks.freezePanes.freezeRows(1);
banks.showGridLines = false;

const dividendHeaders = ['bank_id', '股票代码', '银行名称', '财年', '每股现金分红（元）', '历史股息率', '派息公告日', '除权除息日', 'source_note'];
const dividendRows = [];
const history = {
  CMB: [1.20, 1.35, 1.52, 1.68, 1.82], CIB: [0.78, 0.86, 0.95, 1.02, 1.10],
  PAB: [0.18, 0.20, 0.22, 0.24, 0.26], NBCB: [0.50, 0.60, 0.70, 0.82, 0.95],
  BOCOM: [0.33, 0.36, 0.38, 0.40, 0.42], BOC: [0.21, 0.22, 0.23, 0.24, 0.25],
  CEB: [0.16, 0.17, 0.18, 0.19, 0.20], CITIC: [0.28, 0.30, 0.32, 0.34, 0.36],
};
const lookup = Object.fromEntries(bankRows.map(row => [row[0], row]));
Object.entries(history).forEach(([id, values]) => values.forEach((cash, index) => {
  const bank = lookup[id];
  dividendRows.push([id, bank[1], bank[2], 2021 + index, cash, Math.max(0.02, bank[5] - (4 - index) * 0.002), new Date(2022 + index, 4, 20), new Date(2022 + index, 6, 15), '模拟样例']);
}));
dividends.getRange('A1:I1').values = [dividendHeaders];
dividends.getRange(`A2:I${dividendRows.length + 1}`).values = dividendRows;
dividends.getRange('A1:I1').format = headerStyle;
dividends.getRange(`A2:I${dividendRows.length + 1}`).format = bodyStyle;
dividends.getRange(`E2:E${dividendRows.length + 1}`).format.numberFormat = '0.00';
dividends.getRange(`F2:F${dividendRows.length + 1}`).format.numberFormat = '0.0%';
dividends.getRange(`G2:H${dividendRows.length + 1}`).format.numberFormat = 'yyyy-mm-dd';
dividends.getRange(`A1:I${dividendRows.length + 1}`).format.autofitColumns();
dividends.freezePanes.freezeRows(1);
dividends.showGridLines = false;

const portfolioHeaders = ['template_id', '组合名称', 'bank_id', '银行名称', '权重', '状态', '备注'];
const portfolioRows = [
  ['DIV_CORE', '稳健高股息银行组合', 'CMB', '招商银行', 0.25, '启用', '模拟组合'],
  ['DIV_CORE', '稳健高股息银行组合', 'CIB', '兴业银行', 0.25, '启用', '模拟组合'],
  ['DIV_CORE', '稳健高股息银行组合', 'BOCOM', '交通银行', 0.25, '启用', '模拟组合'],
  ['DIV_CORE', '稳健高股息银行组合', 'BOC', '中国银行', 0.25, '启用', '模拟组合'],
  ['GROWTH', '成长银行组合', 'CMB', '招商银行', 0.35, '启用', '模拟组合'],
  ['GROWTH', '成长银行组合', 'NBCB', '宁波银行', 0.35, '启用', '模拟组合'],
  ['GROWTH', '成长银行组合', 'PAB', '平安银行', 0.30, '启用', '模拟组合'],
];
portfolios.getRange('A1:G1').values = [portfolioHeaders];
portfolios.getRange(`A2:G${portfolioRows.length + 1}`).values = portfolioRows;
portfolios.getRange('A1:G1').format = headerStyle;
portfolios.getRange(`A2:G${portfolioRows.length + 1}`).format = bodyStyle;
portfolios.getRange(`E2:E${portfolioRows.length + 1}`).format.numberFormat = '0.0%';
portfolios.getRange(`E2:E${portfolioRows.length + 1}`).format.font = { color: colors.blue };
portfolios.getRange(`A1:G${portfolioRows.length + 1}`).format.autofitColumns();
portfolios.freezePanes.freezeRows(1);
portfolios.showGridLines = false;

const file = await SpreadsheetFile.exportXlsx(wb);
await file.save(`${outputDir}/银行股测算_模拟导入数据.xlsx`);

const preview = await wb.render({ sheetName: '银行参数', range: 'A1:K10', scale: 1.5, format: 'png' });
await fs.writeFile(`${outputDir}/银行参数预览.png`, new Uint8Array(await preview.arrayBuffer()));

const inspection = await wb.inspect({ kind: 'table', range: '银行参数!A1:K10', include: 'values,formulas', tableMaxRows: 10, tableMaxCols: 11 });
console.log(inspection.ndjson);
const errors = await wb.inspect({ kind: 'match', searchTerm: '#REF!|#DIV/0!|#VALUE!|#NAME\\?|#N/A', options: { useRegex: true, maxResults: 50 }, summary: 'formula error scan' });
console.log(errors.ndjson);
