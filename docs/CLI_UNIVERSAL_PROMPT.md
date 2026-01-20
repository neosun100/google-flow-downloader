# Python CLI 工具开发 - 通用 Prompt

> **设计理念：** 灵活适配各种需求，AI 自动推断最佳实践

---

## 🎯 使用方式

**第一步：** 描述你的需求（越详细越好）

**第二步：** 复制下方 Prompt，粘贴到对话中

**第三步：** AI 自动完成所有工作

---

## 📋 通用 Prompt

```
我需要创建一个专业的 Python CLI 工具，请帮我完成从开发到发布的完整流程。

【我的需求】
（在这里详细描述你的需求，AI 会自动理解并实现）

例如：
- 我想做一个批量下载工具
- 我有一个 API 需要封装成命令行
- 我想把现有脚本改造成 CLI 工具
- 我需要一个数据处理工具
- ...

【技术栈要求】
请使用以下技术栈和最佳实践：

1. **UI 框架**
   - Rich 库：美化所有输出
   - 进度条：包含速度、时间、下载量
   - 表格、面板、树形视图
   - 统一配色方案

2. **核心功能**
   - 自动去重（智能检测已处理项目）
   - 增量更新（支持多次运行）
   - 绝对路径（默认 ~/Code/GenAI/[合适的目录]）
   - 环境变量（所有敏感信息）
   - 错误处理和重试

3. **质量保证**
   - 完整的自动化测试（8+ 测试用例）
   - 发布前检查脚本
   - 隐私信息扫描
   - 所有测试必须通过

4. **文档规范**
   - GitHub 最佳实践 README
   - 徽章、图标、emoji
   - 折叠 FAQ
   - Mermaid 流程图
   - 完整的使用文档

5. **发布流程**
   - 发布到 PyPI（从 ~/.env 读取凭据）
   - 推送到 GitHub（neosun100）
   - 如果是 macOS，通过 SSH MCP 工具的 nginx 服务器推送
   - 创建 Git 标签
   - 验证远程安装

6. **关键配置**（避免常见错误）
   ```toml
   [project]
   license = {text = "MIT"}  # 不要用 {file = "LICENSE"}
   
   [tool.setuptools]
   license-files = []  # 避免 PyPI 上传错误
   ```

【执行要求】
1. 自动推断合适的项目名、命令名、包名
2. 根据功能设计合理的命令结构
3. 实现完整功能，不要省略细节
4. 每个阶段完成后进行验证
5. 发布前运行所有测试
6. 清理所有临时开发文件
7. 提供最终的使用说明

【参考项目】
https://github.com/neosun100/google-flow-downloader
（这是一个成功案例，可以参考其结构和实现）

【重要提醒】
- 所有路径使用绝对路径
- 进度条必须包含速度和时间
- 发布前必须通过所有测试
- macOS 系统通过 nginx 服务器推送 GitHub
- 不要硬编码任何敏感信息
```

---

## 💡 使用示例

### 示例 1：API 封装工具

```
【我的需求】
我想创建一个工具来批量下载某个 API 的数据。

API 文档：https://api.example.com/docs
主要功能：
- 调用 API 获取列表
- 批量下载文件
- 支持断点续传
- 自动去重

需要的环境变量：
- API_KEY
- API_SECRET
```

### 示例 2：数据处理工具

```
【我的需求】
我有一个 Python 脚本 ~/Code/process.py，想改造成 CLI 工具。

功能：
- 读取 CSV 文件
- 数据清洗和转换
- 导出为多种格式
- 支持批量处理

特殊需求：
- 需要显示处理进度
- 支持配置文件
```

### 示例 3：浏览器自动化工具

```
【我的需求】
创建一个工具，通过浏览器脚本收集数据，然后批量处理。

功能：
- 提供浏览器 JS 脚本
- 用户在浏览器运行脚本导出 JSON
- CLI 工具读取 JSON 并处理
- 支持增量更新

特殊需求：
- macOS 一键复制脚本到剪贴板
- 支持多个项目
```

---

## 🎓 AI 会自动处理的事项

AI 收到 Prompt 后，会自动：

### 智能推断
- ✅ 合适的项目名称
- ✅ 简洁的命令名
- ✅ 合理的参数设计
- ✅ 适当的默认值
- ✅ 必要的环境变量

### 标准实现
- ✅ Rich UI 完整集成
- ✅ 进度条（速度、时间、大小）
- ✅ 自动去重机制
- ✅ 增量更新支持
- ✅ 错误处理和重试

### 质量保证
- ✅ 8+ 自动化测试
- ✅ 发布前检查脚本
- ✅ 隐私信息扫描
- ✅ 所有测试通过

### 文档生成
- ✅ GitHub 最佳实践 README
- ✅ 徽章和图标
- ✅ 折叠 FAQ
- ✅ Mermaid 流程图
- ✅ 完整使用文档

### 发布部署
- ✅ 发布到 PyPI
- ✅ 推送到 GitHub（macOS 通过 nginx）
- ✅ 创建版本标签
- ✅ 验证远程安装

### 清理收尾
- ✅ 删除临时开发文件
- ✅ 只保留项目目录和输出目录
- ✅ 提供最终使用说明

---

## ⚠️ 关键要点（AI 必须遵循）

### 1. PyPI 发布配置

```toml
[project]
license = {text = "MIT"}  # 永远不要用 {file = "LICENSE"}

[tool.setuptools]
license-files = []  # 必须添加，避免 license-file 错误
```

### 2. 路径管理

```python
# ❌ 错误
OUTPUT_DIR = "./output"

# ✅ 正确
OUTPUT_DIR = Path.home() / "Code/GenAI/output_name"
```

### 3. 进度条完整配置

```python
with Progress(
    SpinnerColumn(),
    TextColumn("[bold blue]{task.description}"),
    BarColumn(bar_width=40),
    TextColumn("[progress.percentage]{task.percentage:>3.0f}%"),
    DownloadColumn(),              # 必须
    TransferSpeedColumn(),         # 必须
    TimeRemainingColumn(),         # 必须
    console=console
) as progress:
    # 处理逻辑
```

### 4. macOS GitHub 推送

```python
# 检测系统
if platform.system() == "Darwin":
    # 使用 SSH MCP 工具
    # 1. ssh_list_servers 找到 nginx
    # 2. 打包项目
    # 3. ssh_upload 上传
    # 4. ssh_execute 在服务器上推送
```

### 5. 自动去重

```python
# 必须实现
existing = get_existing_items(output_dir)
to_process = [item for item in all_items if item not in existing]
```

---

## 📊 预期结果

完成后你将得到：

- 📦 **PyPI 包**：可通过 `pipx install` 安装
- 🔗 **GitHub 仓库**：专业的 README 和完整文档
- ✅ **测试覆盖**：所有功能经过测试
- 📚 **完整文档**：使用指南、API 文档、最佳实践
- 🎨 **美观 UI**：Rich 库美化的终端输出
- 🔒 **安全可靠**：无隐私泄漏，环境变量管理

---

## 🚀 开始使用

1. 复制上方【通用 Prompt】
2. 填写【我的需求】部分
3. 发送给 AI
4. 等待 60-100 分钟
5. 获得专业的 CLI 工具

---

## 📚 参考资源

- 🎯 [成功案例](https://github.com/neosun100/google-flow-downloader)
- 📖 [PyPI 发布指南](./PYPI_PUBLISHING_GUIDE.md)
- ⚡ [快速参考](./QUICK_REFERENCE.md)

---

<div align="center">

**这个 Prompt 适用于任何 Python CLI 工具开发**

**AI 会根据你的需求自动调整实现细节**

**保证质量，遵循最佳实践**

</div>

---

**版本：** v2.0  
**更新：** 2026-01-20  
**维护：** neosun100
