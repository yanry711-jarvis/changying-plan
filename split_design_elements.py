"""Export full-canvas, white-background component layers from flattened UI prototypes.

Each exported PNG has the exact dimensions of its source. The visual component is
pasted at its original coordinates, so importing all PNGs as layers in Photoshop
requires no positioning adjustment.
"""
from pathlib import Path
import csv
from PIL import Image

ROOT = Path(r"C:\Users\Jarvis\.codex\generated_images\019fa25c-4fb2-7833-a58d-3abb4d6157a0")
OUT = Path("design")

# Coordinates are deliberately grouped as visual modules. The source images are
# flattened renders; a module is the smallest reliable non-destructive extraction.
SPECS = {
    "share": ("exec-2b29ad36-6116-4f73-ac54-f6225e4fcb78.png", [
        ("01_back", "返回箭头", (33, 39, 73, 83)),
        ("02_page_title", "页面标题", (349, 38, 595, 83)),
        ("03_mini_program_menu", "小程序菜单", (718, 34, 914, 96)),
        ("04_share_poster", "分享海报卡片（含海报内部内容）", (93, 143, 848, 1329)),
        ("05_generate_poster", "生成长图按钮", (136, 1367, 436, 1442)),
        ("06_save_image", "保存图片按钮", (502, 1367, 806, 1442)),
        ("07_share_button", "分享给朋友主按钮", (84, 1474, 856, 1577)),
        ("08_privacy_note", "隐私说明", (255, 1607, 696, 1652)),
    ]),
    "home": ("exec-0522d470-2cfa-4e64-b071-d592b6edebe5.png", [
        ("01_brand", "品牌标识与名称", (35, 42, 285, 123)),
        ("02_mini_program_menu", "小程序菜单", (646, 43, 835, 117)),
        ("03_my_plans", "我的计划按钮", (639, 165, 842, 233)),
        ("04_hero_title", "首页主标题", (48, 253, 625, 471)),
        ("05_leaf_decoration", "右侧植物装饰", (620, 257, 863, 518)),
        ("06_forecast_card", "分红预测主卡片（含金额、图表、按钮）", (30, 517, 834, 1379)),
        ("07_retirement_goal", "退休计划卡片", (30, 1401, 412, 1702)),
        ("08_education_goal", "子女教育金卡片", (436, 1401, 829, 1702)),
        ("09_risk_notice", "风险提示", (30, 1723, 832, 1820)),
    ]),
    "results": ("exec-26930b04-49a5-4430-8d0f-b2a44fb65535.png", [
        ("01_back", "返回箭头", (32, 24, 76, 72)),
        ("02_page_title", "页面标题", (362, 21, 576, 74)),
        ("03_more", "更多按钮", (857, 31, 909, 63)),
        ("04_income_hero", "月分红预测主卡片", (29, 101, 912, 423)),
        ("05_goal_progress", "目标达成进度条", (31, 439, 912, 540)),
        ("06_asset_stat", "期末资产指标卡", (31, 560, 465, 723)),
        ("07_contribution_stat", "累计投入指标卡", (477, 560, 910, 723)),
        ("08_asset_chart", "资产增长趋势图", (30, 740, 912, 1026)),
        ("09_dividend_chart", "年度分红现金流图", (30, 1044, 912, 1340)),
        ("10_section_title", "关键节点标题", (34, 1363, 219, 1410)),
        ("11_milestone_one", "第12年里程碑卡", (35, 1421, 464, 1549)),
        ("12_milestone_two", "第20年里程碑卡", (477, 1421, 907, 1549)),
        ("13_adjust_button", "调整方案按钮", (36, 1562, 907, 1656)),
    ]),
    "calculator": ("exec-42303529-0e07-46c4-92ed-f0d809a3d7cb.png", [
        ("01_back", "返回箭头", (36, 38, 77, 82)),
        ("02_page_title", "页面标题", (385, 39, 563, 83)),
        ("03_mini_program_menu", "小程序菜单", (714, 35, 918, 97)),
        ("04_mode_selector", "单只银行股与组合测算切换", (52, 145, 889, 228)),
        ("05_portfolio_selector", "优质银行股组合选择器", (53, 260, 887, 404)),
        ("06_investment_plan", "投入计划输入卡", (54, 434, 887, 1064)),
        ("07_income_assumptions", "收益假设与股息增长率选项", (54, 1095, 887, 1512)),
        ("08_predict_button", "查看现金流预测按钮", (53, 1534, 889, 1640)),
    ]),
}


def export_component(source, target, box):
    image = Image.open(source).convert("RGB")
    w, h = image.size
    left, top, right, bottom = box
    left, top = max(0, left), max(0, top)
    right, bottom = min(w, right), min(h, bottom)
    layer = Image.new("RGB", (w, h), "white")
    layer.paste(image.crop((left, top, right, bottom)), (left, top))
    layer.save(target, "PNG", optimize=True)
    return (left, top, right - left, bottom - top)


def main():
    OUT.mkdir(exist_ok=True)
    rows = []
    for screen, (filename, components) in SPECS.items():
        source = ROOT / filename
        folder = OUT / screen
        folder.mkdir(exist_ok=True)
        image = Image.open(source)
        base = Image.new("RGB", image.size, "white")
        base.save(folder / "00_white_canvas.png", "PNG", optimize=True)
        for name, label, box in components:
            final_box = export_component(source, folder / f"{name}.png", box)
            rows.append({
                "screen": screen, "file": f"{screen}/{name}.png", "element": label,
                "x": final_box[0], "y": final_box[1], "width": final_box[2], "height": final_box[3],
                "canvas": f"{image.size[0]}x{image.size[1]}",
            })
    with (OUT / "elements_manifest.csv").open("w", newline="", encoding="utf-8-sig") as handle:
        writer = csv.DictWriter(handle, fieldnames=["screen", "file", "element", "x", "y", "width", "height", "canvas"])
        writer.writeheader()
        writer.writerows(rows)


if __name__ == "__main__":
    main()
