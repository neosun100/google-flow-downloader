#!/bin/bash
# 发布前自动化检查脚本

set -e

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║              🚀 发布前自动化检查                              ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# 1. 运行测试
echo "🧪 运行自动化测试..."
python3 tests/test_all.py
echo ""

# 2. 检查隐私信息
echo "🔍 检查隐私信息..."
if grep -r "23497835\|ultra1928\|jiasunm@amazon\|ruk.tk" \
    --include="*.py" --include="*.toml" --include="*.md" \
    --exclude-dir=build --exclude-dir=dist \
    . 2>/dev/null; then
    echo "❌ 发现隐私信息，停止发布"
    exit 1
fi
echo "  ✅ 无隐私信息泄漏"
echo ""

# 3. 清理并构建
echo "🔨 构建包..."
rm -rf build dist *.egg-info
python3 -m build > /dev/null 2>&1
echo "  ✅ 构建成功"
echo ""

# 4. 检查包
echo "📦 检查包..."
twine check dist/* > /dev/null 2>&1
echo "  ✅ 包检查通过"
echo ""

# 5. 检查 METADATA
echo "🔍 检查元数据..."
if unzip -p dist/*.whl */METADATA | grep -i "^Dynamic:" > /dev/null 2>&1; then
    echo "  ⚠️  发现 Dynamic 字段，可能导致上传失败"
else
    echo "  ✅ 元数据正常"
fi
echo ""

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║              ✅ 所有检查通过！可以安全发布                    ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "📤 发布命令:"
echo "  source ~/.env"
echo "  twine upload dist/* -u \"\$PYPI_USERNAME\" -p \"\$PYPI_PASSWORD\""
