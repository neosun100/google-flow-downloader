# PyPI 发布快速参考

## 🚨 最常见错误及解决方案

### ❌ `unrecognized or malformed field 'license-file'`

**原因：** setuptools 自动添加了 `Dynamic: license-file` 字段

**解决：**
```toml
[project]
license = {text = "MIT"}  # 不要用 {file = "LICENSE"}

[tool.setuptools]
license-files = []  # 关键：禁用自动包含
```

---

## ✅ 正确的 pyproject.toml 模板

```toml
[build-system]
requires = ["setuptools>=61.0", "wheel"]
build-backend = "setuptools.build_meta"

[project]
name = "your-package"
version = "1.0.0"
description = "Description"
authors = [{name = "Your Name"}]
readme = "README.md"
license = {text = "MIT"}
requires-python = ">=3.8"
dependencies = ["requests>=2.31.0"]

[project.scripts]
your-cli = "your_package.cli:main"

[tool.setuptools]
license-files = []  # 必须添加

[tool.setuptools.packages.find]
where = ["."]
include = ["your_package*"]
```

---

## 📋 发布检查清单

```bash
# 1. 清理
rm -rf build dist *.egg-info

# 2. 检查隐私
grep -r "敏感信息" --include="*.py" --include="*.toml" .

# 3. 构建
python3 -m build

# 4. 检查（关键步骤）
twine check dist/*

# 5. 检查 METADATA（确认无 Dynamic: license-file）
unzip -p dist/*.whl */METADATA | grep -i dynamic

# 6. 上传
source ~/.env
twine upload dist/* -u "$PYPI_USERNAME" -p "$PYPI_PASSWORD"

# 7. 验证
pipx install --force your-package
```

---

## 🔧 调试命令

```bash
# 查看生成的元数据
unzip -p dist/*.whl */METADATA | head -30

# 查看包内容
tar -tzf dist/*.tar.gz | head -20

# 检查特定字段
unzip -p dist/*.whl */METADATA | grep -E "License|Dynamic"
```

---

## 💡 关键经验

1. **永远不要用** `license = {file = "LICENSE"}`
2. **必须添加** `[tool.setuptools] license-files = []`
3. **发布前检查** METADATA 中是否有 `Dynamic:` 字段
4. **本地测试** 安装后再上传
5. **保留 LICENSE.txt** 文件在仓库中（给用户看），但不包含在包里

---

## 📚 相关文档

- [PyPI Publishing Guide](./PYPI_PUBLISHING_GUIDE.md) - 完整指南
- [setuptools 文档](https://setuptools.pypa.io/)
- [twine 文档](https://twine.readthedocs.io/)
