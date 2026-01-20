# PyPI 发布最佳实践 - 避免常见错误

本文档记录了发布 Python 包到 PyPI 时遇到的问题及解决方案，帮助未来避免相同错误。

## 问题：`InvalidDistribution: unrecognized or malformed field 'license-file'`

### 错误现象

```bash
twine upload dist/*
# ERROR: InvalidDistribution: Invalid distribution metadata: 
# unrecognized or malformed field 'license-file'
```

### 根本原因

这是 **setuptools 和 twine 版本兼容性问题**：

1. setuptools 在构建时自动添加 `Dynamic: license-file` 字段到 METADATA
2. twine 6.x 版本无法识别这个字段
3. 即使 LICENSE 文件存在且格式正确，也会报错

### 解决方案

#### 方案 1：禁用自动 license-file（推荐）

在 `pyproject.toml` 中添加：

```toml
[tool.setuptools]
license-files = []  # 禁用自动包含 LICENSE 文件
```

同时使用：

```toml
[project]
license = {text = "MIT"}  # 直接在元数据中声明
```

#### 方案 2：使用 SPDX 格式（未来推荐）

```toml
[project]
license = "MIT"  # SPDX 标识符
```

但需要较新版本的 setuptools。

#### 方案 3：完全移除 LICENSE 文件引用

如果不需要在包中包含 LICENSE 文件：

```toml
[project]
license = {text = "MIT"}
# 不要使用 license = {file = "LICENSE"}
```

## 完整的 pyproject.toml 模板

### 最小可用配置

```toml
[build-system]
requires = ["setuptools>=61.0", "wheel"]
build-backend = "setuptools.build_meta"

[project]
name = "your-package-name"
version = "1.0.0"
description = "Your package description"
authors = [{name = "Your Name"}]
readme = "README.md"
license = {text = "MIT"}
requires-python = ">=3.8"
dependencies = [
    "requests>=2.31.0",
]

[project.scripts]
your-cli = "your_package.cli:main"

[tool.setuptools]
license-files = []  # 关键：避免 license-file 错误

[tool.setuptools.packages.find]
where = ["."]
include = ["your_package*"]
```

### 完整配置（带分类器）

```toml
[build-system]
requires = ["setuptools>=61.0", "wheel"]
build-backend = "setuptools.build_meta"

[project]
name = "your-package-name"
version = "1.0.0"
description = "Your package description"
authors = [{name = "Your Name"}]
readme = "README.md"
license = {text = "MIT"}
requires-python = ">=3.8"
keywords = ["keyword1", "keyword2"]
classifiers = [
    "Development Status :: 4 - Beta",
    "Intended Audience :: Developers",
    "Programming Language :: Python :: 3",
    "Programming Language :: Python :: 3.8",
    "Programming Language :: Python :: 3.9",
    "Programming Language :: Python :: 3.10",
    "Programming Language :: Python :: 3.11",
]
dependencies = [
    "requests>=2.31.0",
    "rich>=13.0.0",
]

[project.scripts]
your-cli = "your_package.cli:main"

[project.urls]
Homepage = "https://github.com/your/repo"

[tool.setuptools]
license-files = []

[tool.setuptools.packages.find]
where = ["."]
include = ["your_package*"]
```

## 发布流程最佳实践

### 1. 发布前检查清单

```bash
# 检查隐私信息
grep -r "敏感词1\|敏感词2" --include="*.py" --include="*.toml" --include="*.md" .

# 运行测试
python3 tests/test_all.py

# 检查包结构
tree -L 2 -I '__pycache__|*.pyc|build|dist|*.egg-info'
```

### 2. 构建包

```bash
# 清理旧构建
rm -rf build dist *.egg-info

# 构建
python3 -m build
```

### 3. 本地验证

```bash
# 检查包
twine check dist/*

# 本地安装测试
pip install dist/*.whl --user --force-reinstall

# 测试命令
your-cli --help
your-cli --version
```

### 4. 上传到 PyPI

```bash
# 设置凭据
source ~/.env  # 包含 PYPI_USERNAME 和 PYPI_PASSWORD

# 上传
twine upload dist/* -u "$PYPI_USERNAME" -p "$PYPI_PASSWORD"
```

### 5. 验证发布

```bash
# 卸载本地版本
pipx uninstall your-package

# 从 PyPI 安装
pipx install your-package

# 测试功能
your-cli --help
```

## 常见错误及解决方案

### 错误 1: `license-file` 字段错误

**症状：**
```
ERROR InvalidDistribution: unrecognized or malformed field 'license-file'
```

**解决：**
```toml
[tool.setuptools]
license-files = []
```

### 错误 2: 包名冲突

**症状：**
```
ERROR Package already exists
```

**解决：**
- 更改包名（PyPI 上的包名是全局唯一的）
- 或者增加版本号

### 错误 3: README 格式错误

**症状：**
```
ERROR The description failed to render
```

**解决：**
- 确保 README.md 是有效的 Markdown
- 检查特殊字符和链接格式

### 错误 4: 依赖版本冲突

**症状：**
```
ERROR Invalid requirement
```

**解决：**
```toml
dependencies = [
    "package>=2.0.0",  # 使用 >= 而不是 ==
]
```

### 错误 5: 缺少必需字段

**症状：**
```
ERROR Metadata is missing required fields: Name, Version
```

**解决：**
- 检查 `[project]` 部分是否完整
- 确保 `name` 和 `version` 字段存在

## 环境配置

### ~/.env 文件

```bash
# PyPI 凭据
export PYPI_USERNAME=__token__
export PYPI_PASSWORD=pypi-你的token

# 使用方式
source ~/.env
twine upload dist/* -u "$PYPI_USERNAME" -p "$PYPI_PASSWORD"
```

### 获取 PyPI Token

1. 登录 https://pypi.org
2. Account Settings → API tokens
3. Add API token
4. 复制 token（格式：`pypi-...`）

## 版本管理

### 语义化版本

```
主版本.次版本.修订号
1.0.0 → 1.0.1 → 1.1.0 → 2.0.0
```

- **主版本**：不兼容的 API 变更
- **次版本**：向后兼容的功能新增
- **修订号**：向后兼容的问题修正

### Git 标签

```bash
# 创建标签
git tag v1.0.0

# 推送标签
git push origin v1.0.0

# 查看标签
git tag -l
```

## 项目结构最佳实践

```
your-package/
├── your_package/          # 包名用下划线
│   ├── __init__.py
│   └── cli.py
├── tests/                 # 测试
│   └── test_all.py
├── docs/                  # 文档
├── .gitignore
├── LICENSE.txt            # 注意：不要用 LICENSE（避免自动包含）
├── README.md
└── pyproject.toml
```

## 调试技巧

### 检查生成的元数据

```bash
# 查看 wheel 中的 METADATA
unzip -p dist/package-1.0.0-py3-none-any.whl package-1.0.0.dist-info/METADATA

# 查看 tar.gz 中的 PKG-INFO
tar -xzOf dist/package-1.0.0.tar.gz package-1.0.0/PKG-INFO
```

### 查找问题字段

```bash
# 搜索 Dynamic 字段
unzip -p dist/*.whl */METADATA | grep -i dynamic

# 搜索 License 相关
unzip -p dist/*.whl */METADATA | grep -i license
```

## 工具版本推荐

```bash
# 推荐版本（2026-01）
pip install --upgrade setuptools>=80.0.0
pip install --upgrade build>=1.0.0
pip install --upgrade twine>=6.0.0
```

## 完整发布脚本

```bash
#!/bin/bash
# publish.sh - 自动化发布脚本

set -e

echo "🚀 开始发布流程..."

# 1. 清理
echo "📦 清理旧构建..."
rm -rf build dist *.egg-info

# 2. 运行测试
echo "🧪 运行测试..."
python3 tests/test_all.py

# 3. 检查隐私信息
echo "🔍 检查隐私信息..."
if grep -r "敏感词" --include="*.py" --include="*.toml" . 2>/dev/null; then
    echo "❌ 发现隐私信息，停止发布"
    exit 1
fi

# 4. 构建
echo "🔨 构建包..."
python3 -m build

# 5. 检查包
echo "✅ 检查包..."
twine check dist/*

# 6. 上传
echo "📤 上传到 PyPI..."
source ~/.env
twine upload dist/* -u "$PYPI_USERNAME" -p "$PYPI_PASSWORD"

# 7. 验证
echo "🔍 验证安装..."
sleep 5
pipx install --force your-package-name

echo "✅ 发布成功！"
```

## 总结

### 关键要点

1. ✅ **使用 `license = {text = "MIT"}`** 而不是 `{file = "LICENSE"}`
2. ✅ **添加 `[tool.setuptools] license-files = []`** 禁用自动包含
3. ✅ **发布前检查隐私信息**
4. ✅ **运行自动化测试**
5. ✅ **本地验证后再上传**

### 快速检查命令

```bash
# 一键检查
python3 -m build && twine check dist/* && echo "✅ 可以上传"
```

### 遇到问题时

1. 检查 METADATA 文件内容
2. 搜索 `Dynamic:` 字段
3. 调整 `[tool.setuptools]` 配置
4. 重新构建并检查

---

**最后更新：** 2026-01-20  
**适用版本：** setuptools>=80.0, twine>=6.0, build>=1.0
