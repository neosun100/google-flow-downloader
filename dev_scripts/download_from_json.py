#!/usr/bin/env python3
"""从浏览器导出的 JSON 下载图片"""

import requests
import json
import os
import sys

OUTPUT_DIR = os.path.expanduser("~/Code/GenAI/google_flow_images")

def get_downloaded_keys():
    """获取已下载的 key"""
    keys = set()
    if os.path.exists(OUTPUT_DIR):
        for f in os.listdir(OUTPUT_DIR):
            if f.endswith('.jpg'):
                key = f.replace('.jpg', '').split('_')[-1]
                if len(key) == 36:
                    keys.add(key)
    return keys

def download_image(url, filepath):
    """下载图片"""
    resp = requests.get(url, stream=True, timeout=30)
    resp.raise_for_status()
    with open(filepath, "wb") as f:
        for chunk in resp.iter_content(8192):
            f.write(chunk)

def main():
    if len(sys.argv) < 2:
        print("使用方法: python3 download_from_json.py google_flow_images.json")
        return
    
    json_file = sys.argv[1]
    
    if not os.path.exists(json_file):
        print(f"❌ 文件不存在: {json_file}")
        return
    
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    
    # 读取 JSON
    with open(json_file, 'r') as f:
        images = json.load(f)
    
    print(f"📊 JSON 中有 {len(images)} 张图片")
    
    # 获取已下载
    downloaded = get_downloaded_keys()
    print(f"📊 已下载: {len(downloaded)} 张")
    
    # 过滤需要下载的
    to_download = [img for img in images if img["key"] not in downloaded]
    
    if not to_download:
        print("✅ 所有图片已下载！")
        return
    
    print(f"📥 需要下载: {len(to_download)} 张\n")
    
    success = 0
    failed = 0
    
    for i, img in enumerate(to_download, 1):
        filename = f"{img['key']}.jpg"
        filepath = os.path.join(OUTPUT_DIR, filename)
        
        try:
            download_image(img["url"], filepath)
            success += 1
            if i % 10 == 0 or i == len(to_download):
                print(f"  [{i}/{len(to_download)}] ✓ 已下载 {success} 张")
        except Exception as e:
            failed += 1
            print(f"  [{i}/{len(to_download)}] ✗ {str(e)[:50]}")
    
    print(f"\n✅ 完成！成功 {success} 张，失败 {failed} 张")
    print(f"📁 {os.path.abspath(OUTPUT_DIR)}")
    print(f"📊 总计: {len(downloaded) + success} 张图片")

if __name__ == "__main__":
    main()
