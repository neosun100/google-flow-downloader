// Google Flow 全自动提取脚本 - 自动滚动 + 网络拦截
// 在浏览器 Console 运行，自动完成所有操作

window.flowAutoCollector = {
    images: new Map(),
    requestCount: 0,
    running: false,
    
    // 拦截网络请求
    setupInterceptor: function() {
        const self = this;
        const originalFetch = window.fetch;
        
        window.fetch = async function(...args) {
            const response = await originalFetch(...args);
            
            if (args[0] && args[0].includes('searchProjectWorkflows')) {
                self.requestCount++;
                
                const clone = response.clone();
                try {
                    const data = await clone.json();
                    const workflows = data?.result?.data?.json?.result?.workflows || [];
                    
                    workflows.forEach(wf => {
                        wf.workflowSteps?.forEach(step => {
                            step.mediaGenerations?.forEach(media => {
                                const key = media?.mediaGenerationId?.mediaKey;
                                const url = media?.mediaData?.imageData?.fifeUri;
                                if (key && url) {
                                    self.images.set(key, url);
                                }
                            });
                        });
                    });
                } catch(e) {}
            }
            
            return response;
        };
    },
    
    // 自动滚动
    autoScroll: async function() {
        this.running = true;
        console.log('🚀 开始自动滚动...\n');
        
        // 找到滚动容器
        const container = document.querySelector('[role="main"]') || 
                         document.querySelector('div[style*="overflow"]') ||
                         document.documentElement;
        
        let noChangeCount = 0;
        let lastCount = 0;
        let scrollAttempts = 0;
        const maxScrolls = 1000;  // 最多滚动1000次
        
        while (this.running && scrollAttempts < maxScrolls) {
            const currentCount = this.images.size;
            
            // 显示进度
            if (currentCount !== lastCount) {
                console.log(`📥 已收集 ${currentCount} 张图片 (请求 ${this.requestCount} 次, 滚动 ${scrollAttempts} 次)`);
                noChangeCount = 0;
            } else {
                noChangeCount++;
            }
            
            // 连续 30 次无变化则停止
            if (noChangeCount >= 30) {
                console.log('\n✅ 连续30次无新数据，收集完成！');
                break;
            }
            
            lastCount = currentCount;
            scrollAttempts++;
            
            // 滚动到底部
            const scrollHeight = container.scrollHeight;
            container.scrollTo({
                top: scrollHeight,
                behavior: 'smooth'
            });
            
            // 等待 2.5 秒让页面加载
            await new Promise(r => setTimeout(r, 2500));
        }
        
        this.running = false;
        
        if (scrollAttempts >= maxScrolls) {
            console.log(`\n⚠️  已达到最大滚动次数 (${maxScrolls})，停止`);
        }
        
        console.log(`\n✅ 收集完成！共 ${this.images.size} 张图片`);
        
        // 只在自动完成时导出，手动 stop 时不重复导出
        if (this.images.size > 0) {
            this.export();
        }
    },
    
    // 导出
    export: function() {
        const imageList = Array.from(this.images.entries()).map(([key, url]) => ({key, url}));
        
        if (imageList.length === 0) {
            console.log('❌ 没有图片可导出');
            return;
        }
        
        const blob = new Blob([JSON.stringify(imageList, null, 2)], {type: 'application/json'});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `google_flow_complete_${imageList.length}.json`;
        a.click();
        
        console.log(`\n📁 已导出: google_flow_complete_${imageList.length}.json`);
        console.log(`📊 总计: ${imageList.length} 张图片`);
        console.log(`📡 网络请求: ${this.requestCount} 次`);
    },
    
    // 手动停止
    stop: function() {
        if (!this.running) {
            console.log('⚠️  已经停止了');
            return;
        }
        this.running = false;
        console.log('⏹️  已停止，正在导出...');
        this.export();
    },
    
    // 开始
    start: function() {
        this.setupInterceptor();
        this.autoScroll();
    }
};

// 自动启动
flowAutoCollector.start();

console.log('\n💡 命令:');
console.log('  flowAutoCollector.stop()   - 手动停止');
console.log('  flowAutoCollector.export() - 立即导出');
