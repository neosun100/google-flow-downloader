# Python CLI 工具开发完整生命周期 - 标准 Prompt

> **重要性等级：⭐⭐⭐⭐⭐**  
> 这是标准化 CLI 工具开发的权威指南，基于实战经验总结，请严格遵循。

---

## 📖 Prompt 使用说明

将下方的完整 Prompt 发送给 AI，AI 将自动完成从需求分析到发布验证的完整开发流程。

---

## 🎯 标准 Prompt

````markdown
请帮我创建一个专业的 Python CLI 工具，并完成从开发到发布的完整生命周期。

## 【功能需求】

（在此描述工具的核心功能，可以是以下任一形式：）
- 功能描述
- API 文档链接
- 现有代码路径
- 使用场景说明

## 【技术规范】

### 1. Rich UI 集成（必须）
- ✅ 使用 Rich 库美化所有输出
- ✅ 进度条必须包含：
  - SpinnerColumn（旋转图标）
  - BarColumn（进度条，宽度40）
  - DownloadColumn（已下载量）
  - TransferSpeedColumn（传输速度）
  - TimeRemainingColumn（剩余时间）
- ✅ 使用 Panel 显示标题
- ✅ 使用 Table 显示结果（box=box.ROUNDED）
- ✅ 使用 Tree 显示层级信息
- ✅ 统一配色方案：
  - 标题：bold blue/magenta
  - 成功：green
  - 警告：yellow
  - 错误：red
  - 信息：cyan
  - 次要：dim

### 2. 路径管理（必须）
- ✅ 所有路径使用绝对路径
- ✅ 使用 `Path.home()` 或 `os.path.expanduser()`
- ✅ 默认输出目录：`~/Code/GenAI/[项目相关名称]`
- ✅ 支持 `-o` 参数自定义输出目录

### 3. 安全性（必须）
- ✅ 所有敏感信息使用环境变量
- ✅ 支持从 `~/.env` 读取配置
- ✅ 不硬编码任何凭据、ID、密钥
- ✅ 发布前自动检查隐私信息泄漏

### 4. 功能特性（必须）
- ✅ 自动去重（下载/处理前检查已存在）
- ✅ 增量更新（支持多次运行）
- ✅ 完善的错误处理
- ✅ 重试机制（网络请求）
- ✅ 详细的日志输出

### 5. macOS 优化（如适用）
- ✅ 支持 `pbcopy` 复制到剪贴板
- ✅ 添加 `-c/--copy` 参数

## 【项目配置】

### pyproject.toml 关键配置

```toml
[build-system]
requires = ["setuptools>=61.0", "wheel"]
build-backend = "setuptools.build_meta"

[project]
name = "package-name"
version = "1.0.0"
description = "Description"
authors = [{name = "Author Name"}]
readme = "README.md"
license = {text = "MIT"}  # ⚠️ 关键：不要用 {file = "LICENSE"}
requires-python = ">=3.8"
keywords = ["keyword1", "keyword2"]
dependencies = [
    "requests>=2.31.0",
    "rich>=13.0.0",
    "click>=8.1.0",
]

[project.scripts]
cli-name = "package_name.cli:main"

[project.urls]
Homepage = "https://github.com/neosun100/package-name"

[tool.setuptools]
license-files = []  # ⚠️ 关键：避免 license-file 错误

[tool.setuptools.packages.find]
where = ["."]
include = ["package_name*"]
```

### .gitignore

```
*.pyc
__pycache__/
*.egg-info/
build/
dist/
.DS_Store
.env
*.tar.gz
```

## 【测试要求】

### 1. 创建完整测试套件 (tests/test_all.py)

必须包含以下测试：
- ✅ 安装检查（命令存在、版本号）
- ✅ 所有命令的帮助文档
- ✅ 参数验证
- ✅ 核心功能测试
- ✅ 边界条件测试

### 2. 测试通过标准

```bash
python3 tests/test_all.py
# 必须输出：✅ 所有测试通过！可以安全发布
```

### 3. 发布前检查脚本 (scripts/pre-publish-check.sh)

```bash
#!/bin/bash
set -e

echo "🚀 发布前检查..."

# 1. 运行测试
python3 tests/test_all.py

# 2. 检查隐私
if grep -r "敏感词1\|敏感词2" --include="*.py" --include="*.toml" --include="*.md" --exclude-dir=build . 2>/dev/null; then
    echo "❌ 发现隐私信息"
    exit 1
fi

# 3. 构建
rm -rf build dist *.egg-info
python3 -m build > /dev/null 2>&1

# 4. 检查包
twine check dist/* > /dev/null 2>&1

# 5. 检查元数据（关键）
if unzip -p dist/*.whl */METADATA | grep -i "^Dynamic:" > /dev/null 2>&1; then
    echo "⚠️  发现 Dynamic 字段"
fi

echo "✅ 所有检查通过！"
```

## 【文档规范】

### 1. README.md 结构

```markdown
<div align="center">

# 🎯 项目名称

**一句话描述**

[![PyPI](badge)] [![Python](badge)] [![License](badge)]

[安装](#安装) • [快速开始](#快速开始) • [文档](#文档)

</div>

---

## 📖 简介

## 🚀 安装

## ⚡ 快速开始

## ✨ 功能特性

<table>
<tr>
<td width="50%">
### 🎯 特性1
</td>
<td width="50%">
### 📦 特性2
</td>
</tr>
</table>

## 📚 命令详解

## 🔧 配置

## 💡 常见问题

<details>
<summary><b>问题1</b></summary>
答案
</details>

## 🛠️ 工作原理

```mermaid
graph LR
    A[步骤1] --> B[步骤2]
```

## 🧪 测试

## 🤝 贡献

## 📄 许可证

<div align="center">
Made with ❤️ by [neosun100](https://github.com/neosun100)
</div>
```

### 2. 必须包含的文档

- `README.md` - 主文档
- `docs/PYPI_PUBLISHING_GUIDE.md` - PyPI 发布指南
- `docs/QUICK_REFERENCE.md` - 快速参考
- `docs/DEVELOPMENT.md` - 开发指南
- `LICENSE.txt` - MIT 许可证

## 【发布流程】

### 步骤 1: 发布前检查

```bash
cd project-directory
./scripts/pre-publish-check.sh
```

### 步骤 2: 发布到 PyPI

```bash
# 读取凭据
source ~/.env

# 上传（使用经过验证的配置）
twine upload dist/* -u "$PYPI_USERNAME" -p "$PYPI_PASSWORD"
```

**关键经验：**
- ⚠️ 如果遇到 `license-file` 错误，检查 `[tool.setuptools] license-files = []` 是否存在
- ⚠️ 构建前必须清理：`rm -rf build dist *.egg-info`
- ⚠️ 上传前检查 METADATA：`unzip -p dist/*.whl */METADATA | grep Dynamic`

### 步骤 3: 推送到 GitHub

#### 3.1 检测操作系统

```python
import platform
is_macos = platform.system() == "Darwin"
```

#### 3.2 macOS 系统推送流程

```bash
# 1. 检查 SSH MCP 工具
ssh_list_servers  # 查找 nginx 服务器

# 2. 打包项目
tar -czf project.tar.gz project-directory/

# 3. 上传到 nginx 服务器
ssh_upload --server nginx --local project.tar.gz --remote /tmp/project.tar.gz

# 4. 在服务器上推送
ssh_execute --server nginx --command "
cd /tmp && 
tar -xzf project.tar.gz && 
cd project-directory && 
git config --global --add safe.directory /tmp/project-directory &&
git remote add origin https://github.com/neosun100/project-name.git &&
git push -u origin main --tags &&
rm -rf /tmp/project*
"
```

#### 3.3 其他系统推送流程

```bash
git remote add origin https://github.com/neosun100/project-name.git
git push -u origin main --tags
```

### 步骤 4: 验证发布

```bash
# 1. 卸载本地版本
pipx uninstall package-name

# 2. 从 PyPI 安装
pipx install package-name

# 3. 测试功能
cli-name --version
cli-name --help

# 4. 运行测试
python3 tests/test_all.py
```

### 步骤 5: 清理临时文件

```bash
# 清理开发过程中的临时文件
cd parent-directory
ls -1 | grep -E "temp|test|debug|v[0-9]" | grep -v "project-directory"
# 确认后删除
```

## 【关键陷阱及解决方案】

### 🚨 陷阱 1: license-file 错误

**症状：**
```
ERROR InvalidDistribution: unrecognized or malformed field 'license-file'
```

**根本原因：**
setuptools 自动添加 `Dynamic: license-file` 字段，twine 无法识别。

**解决方案：**
```toml
[project]
license = {text = "MIT"}  # 不要用 {file = "LICENSE"}

[tool.setuptools]
license-files = []  # 必须添加
```

**验证：**
```bash
unzip -p dist/*.whl */METADATA | grep -i "^Dynamic:"
# 应该无输出
```

### 🚨 陷阱 2: 隐私信息泄漏

**检查命令：**
```bash
grep -r "敏感词1\|敏感词2\|email@domain" \
  --include="*.py" --include="*.toml" --include="*.md" \
  --exclude-dir=build --exclude-dir=dist .
```

**常见泄漏点：**
- pyproject.toml 的 authors
- README.md 的示例
- 代码中的默认值
- 测试数据

### 🚨 陷阱 3: 相对路径问题

**错误：**
```python
OUTPUT_DIR = "./output"  # ❌ 在不同目录运行会出错
```

**正确：**
```python
OUTPUT_DIR = Path.home() / "Code/GenAI/output"  # ✅ 绝对路径
```

### 🚨 陷阱 4: macOS 无法推送 GitHub

**原因：**
本地机器没有 GitHub 推送权限。

**解决：**
使用 SSH MCP 工具通过远程服务器推送：
1. 找到 nginx 服务器
2. 上传项目
3. 在服务器上执行 git push

### 🚨 陷阱 5: 包名冲突

**检查：**
```bash
pip search package-name  # 检查是否已存在
```

**解决：**
选择唯一的包名。

## 【完整执行流程】

### Phase 1: 项目初始化 ⏱️ 5-10 分钟

```bash
# 1. 创建项目目录
mkdir -p ~/Code/GenAI/project-name
cd ~/Code/GenAI/project-name

# 2. 创建标准结构
mkdir -p package_name tests docs scripts dev_scripts

# 3. 创建核心文件
touch package_name/__init__.py
touch package_name/cli.py
touch tests/test_all.py
touch scripts/pre-publish-check.sh
touch .gitignore
touch LICENSE.txt
touch README.md
touch pyproject.toml

# 4. 初始化 Git
git init
```

### Phase 2: 核心开发 ⏱️ 20-30 分钟

**cli.py 模板：**

```python
"""命令行接口"""

import click
import os
from pathlib import Path
from rich.console import Console
from rich.progress import (
    Progress, SpinnerColumn, TextColumn, BarColumn,
    DownloadColumn, TransferSpeedColumn, TimeRemainingColumn
)
from rich.panel import Panel
from rich.table import Table
from rich.tree import Tree
from rich import box

console = Console()
DEFAULT_OUTPUT_DIR = Path.home() / "Code/GenAI/output_name"


@click.group()
@click.version_option()
def main():
    """工具描述"""
    pass


@main.command()
@click.option('--output', '-o', type=click.Path(), 
              default=str(DEFAULT_OUTPUT_DIR), help='输出目录')
@click.option('--token', '-t', envvar='TOOL_TOKEN', 
              help='认证 token (或设置环境变量 TOOL_TOKEN)')
def download(output, token):
    """下载命令"""
    
    output_dir = Path(output)
    output_dir.mkdir(parents=True, exist_ok=True)
    
    console.print(Panel.fit("🚀 开始下载", style="bold blue"))
    
    # 检查已存在（去重）
    existing = get_existing_items(output_dir)
    console.print(f"📊 已存在: [cyan]{len(existing)}[/cyan] 项")
    
    # 获取列表
    with console.status("[bold green]📥 获取列表..."):
        items = fetch_items(token)
    
    console.print(f"📊 总共: [cyan]{len(items)}[/cyan] 项")
    
    # 过滤需要下载的
    to_download = [item for item in items if item not in existing]
    
    if not to_download:
        console.print("[green]✅ 所有项目已下载！[/green]")
        return
    
    console.print(f"📥 需要下载: [yellow]{len(to_download)}[/yellow] 项\n")
    
    # 下载（带完整进度条）
    success = 0
    failed = 0
    total_bytes = 0
    
    with Progress(
        SpinnerColumn(),
        TextColumn("[bold blue]{task.description}"),
        BarColumn(bar_width=40),
        TextColumn("[progress.percentage]{task.percentage:>3.0f}%"),
        DownloadColumn(),
        TransferSpeedColumn(),
        TimeRemainingColumn(),
        console=console
    ) as progress:
        task = progress.add_task("[cyan]下载中...", total=len(to_download))
        
        for item in to_download:
            try:
                size = download_item(item, output_dir)
                total_bytes += size
                success += 1
            except Exception as e:
                failed += 1
            progress.update(task, advance=1)
    
    # 结果表格
    table = Table(title="📊 下载结果", box=box.ROUNDED, show_header=False)
    table.add_row("✅ 成功", f"[green]{success}[/green] 项")
    if failed > 0:
        table.add_row("❌ 失败", f"[red]{failed}[/red] 项")
    table.add_row("📦 大小", f"[cyan]{total_bytes / 1024 / 1024:.1f}[/cyan] MB")
    table.add_row("📊 总计", f"[bold cyan]{len(existing) + success}[/bold cyan] 项")
    table.add_row("📁 位置", f"[dim]{output_dir}[/dim]")
    
    console.print("\n")
    console.print(table)


@main.command()
@click.option('--output', '-o', type=click.Path(), 
              default=str(DEFAULT_OUTPUT_DIR))
def status(output):
    """查看状态"""
    
    output_dir = Path(output)
    
    console.print(Panel.fit("📊 状态", style="bold blue"))
    
    if not output_dir.exists():
        console.print(f"\n[yellow]📁 目录不存在: {output_dir}[/yellow]")
        return
    
    items = get_existing_items(output_dir)
    
    if not items:
        console.print("\n[yellow]📊 还没有任何数据[/yellow]")
        return
    
    # 统计信息
    total_size = sum(
        (output_dir / item).stat().st_size 
        for item in items if (output_dir / item).exists()
    )
    
    # 时间信息
    from datetime import datetime
    oldest = min((output_dir / item).stat().st_mtime for item in items)
    newest = max((output_dir / item).stat().st_mtime for item in items)
    
    table = Table(box=box.ROUNDED, show_header=False, title="📊 统计")
    table.add_row("📦 数量", f"[bold cyan]{len(items)}[/bold cyan] 项")
    table.add_row("💾 大小", f"[cyan]{total_size / 1024 / 1024:.1f}[/cyan] MB")
    table.add_row("📁 位置", f"[dim]{output_dir}[/dim]")
    table.add_row("📅 最早", f"[dim]{datetime.fromtimestamp(oldest).strftime('%Y-%m-%d %H:%M')}[/dim]")
    table.add_row("📅 最新", f"[dim]{datetime.fromtimestamp(newest).strftime('%Y-%m-%d %H:%M')}[/dim]")
    
    console.print("\n")
    console.print(table)
    
    # 显示最近项目（树形视图）
    recent = sorted(items, key=lambda x: (output_dir / x).stat().st_mtime, reverse=True)[:5]
    
    if recent:
        console.print("\n[bold]📸 最近项目:[/bold]")
        tree = Tree("📂 列表", guide_style="dim")
        for item in recent:
            size = (output_dir / item).stat().st_size / 1024
            tree.add(f"[cyan]{item[:30]}...[/cyan] [dim]({size:.1f} KB)[/dim]")
        console.print(tree)


# 辅助函数
def get_existing_items(output_dir):
    """获取已存在的项目"""
    # 实现逻辑
    pass


def fetch_items(token):
    """获取项目列表"""
    # 实现逻辑
    pass


def download_item(item, output_dir):
    """下载单个项目，返回文件大小"""
    # 实现逻辑
    pass


if __name__ == "__main__":
    main()
```

### Phase 3: 测试开发 ⏱️ 10-15 分钟

运行测试并确保全部通过：
```bash
python3 tests/test_all.py
```

### Phase 4: 文档编写 ⏱️ 15-20 分钟

按照上述规范创建所有文档。

### Phase 5: 发布到 PyPI ⏱️ 5-10 分钟

```bash
# 1. 运行检查
./scripts/pre-publish-check.sh

# 2. 发布
source ~/.env
twine upload dist/* -u "$PYPI_USERNAME" -p "$PYPI_PASSWORD"

# 3. 验证
pipx install --force package-name
cli-name --version
```

### Phase 6: 推送到 GitHub ⏱️ 5-10 分钟

**如果是 macOS：**

```bash
# 1. 使用 SSH MCP 工具
ssh_list_servers  # 找到 nginx

# 2. 打包上传
tar -czf project.tar.gz project-directory/
ssh_upload --server nginx --local project.tar.gz --remote /tmp/project.tar.gz

# 3. 在服务器上推送
ssh_execute --server nginx --command "
cd /tmp && 
mkdir -p project-directory &&
tar -xzf project.tar.gz -C project-directory --strip-components=1 &&
cd project-directory &&
git config --global --add safe.directory /tmp/project-directory &&
git remote add origin https://github.com/neosun100/project-name.git &&
git push -u origin main --tags &&
rm -rf /tmp/project*
"
```

**如果是其他系统：**

```bash
git remote add origin https://github.com/neosun100/project-name.git
git push -u origin main --tags
```

### Phase 7: 清理和验证 ⏱️ 5 分钟

```bash
# 1. 清理临时文件
cd parent-directory
rm -f *.tar.gz

# 2. 清理开发脚本
ls -1 | grep -E "test_|debug_|temp_|_v[0-9]" | grep -v "project-directory"
# 确认后删除

# 3. 最终验证
pipx install --force package-name
cli-name --help
python3 project-directory/tests/test_all.py
```

## 【检查清单】

发布前必须确认：

- [ ] ✅ 所有测试通过 (8/8 或更多)
- [ ] ✅ 无隐私信息泄漏
- [ ] ✅ pyproject.toml 包含 `license-files = []`
- [ ] ✅ 使用绝对路径
- [ ] ✅ Rich UI 完整集成
- [ ] ✅ 进度条包含速度和时间
- [ ] ✅ README 符合 GitHub 最佳实践
- [ ] ✅ 包含完整文档（4个文档）
- [ ] ✅ Git 仓库已初始化
- [ ] ✅ 版本标签已创建
- [ ] ✅ PyPI 发布成功
- [ ] ✅ GitHub 推送成功
- [ ] ✅ 远程安装验证通过
- [ ] ✅ 临时文件已清理

## 【环境配置】

### ~/.env 文件

```bash
# PyPI 凭据
export PYPI_USERNAME=__token__
export PYPI_PASSWORD=pypi-你的token

# 工具特定配置
export TOOL_TOKEN=你的token
export TOOL_API_KEY=你的key
```

### 必需工具

```bash
pip install --upgrade setuptools build twine
pipx install pipx  # 如果未安装
```

## 【质量标准】

### 代码质量
- ✅ 类型提示（如适用）
- ✅ 文档字符串
- ✅ 错误处理
- ✅ 日志记录

### 用户体验
- ✅ 清晰的帮助文档
- ✅ 友好的错误提示
- ✅ 进度反馈
- ✅ 彩色输出

### 可维护性
- ✅ 模块化设计
- ✅ 清晰的项目结构
- ✅ 完整的文档
- ✅ 自动化测试

## 【成功标准】

项目完成的标志：

1. ✅ 在任何机器上运行 `pipx install package-name` 成功
2. ✅ 所有命令正常工作
3. ✅ 测试全部通过
4. ✅ GitHub 仓库完整
5. ✅ PyPI 页面正常显示
6. ✅ README 专业美观
7. ✅ 无隐私信息泄漏

## 【示例对话】

**用户：**
```
请帮我创建一个专业的 Python CLI 工具，并完成从开发到发布的完整生命周期。

【功能需求】
创建一个批量下载 API 数据的工具，支持增量更新和去重。

【技术规范】
（按照上述标准）

【GitHub 用户名】
neosun100
```

**AI 响应：**
```
好的！我将创建一个专业的 CLI 工具，包含完整的开发、测试、发布流程。

【步骤 1】创建项目结构...
【步骤 2】开发核心功能...
【步骤 3】创建自动化测试...
【步骤 4】编写文档...
【步骤 5】发布到 PyPI...
【步骤 6】推送到 GitHub...
【步骤 7】清理和验证...

✅ 完成！
```

## 【参考项目】

本 Prompt 基于以下实战项目总结：
- 📦 [google-flow-downloader](https://github.com/neosun100/google-flow-downloader)
- 🔗 [PyPI](https://pypi.org/project/google-flow-downloader/)

## 【版本历史】

- **v1.0** (2026-01-20) - 初始版本，基于 google-flow-downloader 项目经验

---

## 🎓 关键经验总结

### 1. PyPI 发布的黄金法则

```toml
[project]
license = {text = "MIT"}  # 永远不要用 {file = "LICENSE"}

[tool.setuptools]
license-files = []  # 必须添加，避免 Dynamic 字段
```

### 2. 进度条的完整配置

```python
with Progress(
    SpinnerColumn(),              # 旋转图标
    TextColumn("[bold blue]{task.description}"),  # 描述
    BarColumn(bar_width=40),      # 进度条
    TextColumn("[progress.percentage]{task.percentage:>3.0f}%"),  # 百分比
    DownloadColumn(),             # 已下载量
    TransferSpeedColumn(),        # 速度
    TimeRemainingColumn(),        # 剩余时间
    console=console
) as progress:
    task = progress.add_task("[cyan]处理中...", total=total)
```

### 3. macOS GitHub 推送的标准流程

```python
# 1. 检测系统
import platform
if platform.system() == "Darwin":
    # 使用 SSH MCP 工具
    
# 2. 找到 nginx 服务器
ssh_list_servers()

# 3. 打包上传
tar + ssh_upload

# 4. 远程推送
ssh_execute
```

### 4. 自动化测试的最小集合

- 安装检查
- 帮助命令
- 核心功能
- 参数验证
- 边界条件

### 5. 文档的必备元素

- 徽章（PyPI、Python、License）
- 导航链接
- 折叠 FAQ
- Mermaid 流程图
- 贡献指南
- 统计徽章

---

## 🚀 快速启动命令

```bash
# 复制此 Prompt，替换【功能需求】部分，发送给 AI
# AI 将自动完成所有步骤
```

---

**最后更新：** 2026-01-20  
**维护者：** neosun100  
**状态：** ✅ 生产就绪

---

<div align="center">

**这是经过实战验证的标准流程，请严格遵循！**

</div>
````
