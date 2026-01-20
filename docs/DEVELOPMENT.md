# Google Flow Downloader

Google Flow 图片批量下载工具

## 项目结构

```
google-flow-downloader/
├── google_flow_downloader/    # 主包
│   ├── __init__.py           # 包含浏览器脚本
│   └── cli.py                # CLI 命令
├── dev_scripts/              # 开发脚本
├── docs/                     # 文档
├── pyproject.toml           # 项目配置
├── README.md                # 使用文档
└── LICENSE                  # 许可证
```

## 开发说明

### 本地安装

```bash
cd google-flow-downloader
pipx install -e .
```

### 测试

```bash
gflow --help
gflow status
gflow script -c
```

### 发布

```bash
# 构建
python -m build

# 上传到 PyPI
twine upload dist/*
```
