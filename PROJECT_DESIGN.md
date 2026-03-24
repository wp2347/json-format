# JSON Formatter 浏览器插件 - 项目设计文档

## 1. 产品概述

### 1.1 产品定位
一款轻量级、简洁的浏览器插件，专为开发者和数据分析师设计，提供便捷的JSON数据格式化和验证功能。

### 1.2 核心价值主张
- **即时格式化**：在浏览器中直接格式化JSON数据，无需切换工具
- **智能验证**：实时检测JSON语法错误，提供视觉反馈
- **简洁界面**：干净直观的popup界面
- **隐私安全**：所有数据处理在本地完成，不上传任何数据
- **跨平台兼容**：支持Chrome、Edge、Firefox等主流浏览器

### 1.3 目标用户
- 前端开发者
- 后端开发者
- API测试工程师
- 数据分析师
- 技术支持人员

## 2. 功能需求

### 2.1 核心功能

#### 2.1.1 JSON格式化
- **输入方式**
  - 文本框粘贴JSON字符串
  - 文件上传（.json文件）
  - 从剪贴板自动检测JSON
  - 右键菜单格式化选中文本

- **格式化选项**
  - 固定使用2空格缩进

- **输出格式**
  - 格式化后的JSON文本
  - 一键复制

#### 2.1.2 JSON验证
- 实时语法检查
- 错误类型提示（通过图标显示）

#### 2.1.3 文件操作
- 上传JSON文件
- 复制JSON到剪贴板
- 粘贴JSON从剪贴板
- 清除所有内容

### 2.2 用户体验功能

#### 2.2.1 简洁界面
- 固定尺寸：400px × 500px
- 编辑/格式化结果切换
- 清晰的状态指示

## 3. 技术架构

### 3.1 技术栈选择

#### 3.1.1 插件框架
- **Manifest Version**: V3（最新标准）
- **支持浏览器**: Chrome 88+, Edge 88+, Firefox 109+

#### 3.1.2 前端技术
- **框架**: React 18+（组件化开发）
- **构建工具**: Vite 5+（快速构建）
- **类型系统**: TypeScript 5+（类型安全）
- **样式方案**: TailwindCSS 3+（原子化CSS）
- **图标库**: Lucide React

### 3.2 项目结构

```
format-json-extension/
├── public/
│   ├── manifest.json          # 插件配置文件
│   ├── icons/                 # 插件图标
│   │   └── icon.svg
│   ├── background.js          # 后台脚本
│   └── content.js           # 内容脚本
├── src/
│   ├── hooks/                # 自定义Hooks
│   │   └── useJsonFormatter.ts
│   ├── utils/                # 工具函数
│   │   └── clipboard.ts      # 剪贴板操作
│   ├── styles/               # 全局样式
│   │   └── globals.css
│   ├── PopupApp.tsx          # Popup组件
│   ├── Popup.tsx            # Popup入口
│   └── main.tsx             # 主入口文件
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

### 3.3 核心模块设计

#### 3.3.1 JSON格式化模块

```typescript
// src/hooks/useJsonFormatter.ts
interface UseJsonFormatterReturn {
  rawJson: string;
  formattedJson: string;
  isValid: boolean;
  setRawJson: (json: string) => void;
  formatJson: () => void;
  clearAll: () => void;
}

export const useJsonFormatter = (): UseJsonFormatterReturn => {
  const [rawJson, setRawJson] = useState('');
  const [formattedJson, setFormattedJson] = useState('');
  const [isValid, setIsValid] = useState(true);

  const formatJson = useCallback(() => {
    try {
      const parsed = JSON.parse(rawJson);
      const formatted = JSON.stringify(parsed, null, 2);
      setFormattedJson(formatted);
      setIsValid(true);
    } catch (error) {
      setIsValid(false);
    }
  }, [rawJson]);

  const clearAll = useCallback(() => {
    setRawJson('');
    setFormattedJson('');
    setIsValid(true);
  }, []);

  return {
    rawJson,
    formattedJson,
    isValid,
    setRawJson,
    formatJson,
    clearAll
  };
};
```

### 3.4 数据流设计

```
用户输入 → Textarea → JSON验证 → 格式化处理 → 显示结果
    ↓
错误检测 → 错误提示 → 用户修正 → 重新验证
```

## 4. 用户界面设计

### 4.1 Popup界面

```
┌─────────────────────────────┐
│  JSON Formatter            │
├─────────────────────────────┤
│ ✓/✗ 状态指示器            │
├─────────────────────────────┤
│ ┌───────────────────────┐   │
│ │                       │   │
│ │   编辑/格式化区域     │   │
│ │                       │   │
│ │      Textarea         │   │
│ │                       │   │
│ └───────────────────────┘   │
├─────────────────────────────┤
│ [Format/Edit] [📋] [📝] [📤] [🗑️] │
└─────────────────────────────┘
```

### 4.2 右键菜单

```
右键菜单
└─ 格式化JSON
```

## 5. 技术实现细节

### 5.1 Manifest配置

```json
{
  "manifest_version": 3,
  "name": "JSON Formatter",
  "version": "1.0.0",
  "description": "Format, validate, and visualize JSON data in your browser",
  "permissions": [
    "storage",
    "clipboardRead",
    "clipboardWrite",
    "contextMenus"
  ],
  "host_permissions": [
    "<all_urls>"
  ],
  "action": {
    "default_popup": "popup.html",
    "default_icon": "icons/icon.svg"
  },
  "background": {
    "service_worker": "background.js"
  },
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content.js"],
      "run_at": "document_idle"
    }
  ],
  "icons": {
    "16": "icons/icon.svg",
    "32": "icons/icon.svg",
    "48": "icons/icon.svg",
    "128": "icons/icon.svg",
    "512": "icons/icon.svg"
  },
  "commands": {
    "format-json": {
      "suggested_key": {
        "default": "Ctrl+Shift+J"
      },
      "description": "Format JSON"
    }
  }
}
```

### 5.2 核心组件实现

#### 5.2.1 PopupApp组件

```typescript
// src/PopupApp.tsx
const PopupApp: React.FC = () => {
  const { rawJson, formattedJson, isValid, setRawJson, formatJson, clearAll } =
    useJsonFormatter();

  const [showFormatted, setShowFormatted] = useState(false);

  const handleFormat = () => {
    formatJson();
    setShowFormatted(true);
  };

  const handleEdit = () => {
    setShowFormatted(false);
  };

  const handleCopy = async () => {
    const textToCopy = showFormatted ? formattedJson : rawJson;
    if (textToCopy) {
      await copyToClipboard(textToCopy);
    }
  };

  const handlePaste = async () => {
    const text = await pasteFromClipboard();
    if (text) {
      setRawJson(text);
    }
  };

  return (
    <div className="w-[400px] h-[500px] bg-white dark:bg-gray-900 flex flex-col">
      {/* 头部：标题 */}
      <div className="flex items-center justify-between px-4 py-3 bg-blue-600 text-white">
        <h1 className="text-lg font-bold">JSON Formatter</h1>
      </div>

      {/* 状态栏：显示JSON有效性 */}
      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        {rawJson && (
          <div className="flex items-center gap-1 text-sm">
            {isValid ? (
              <CheckCircle2 className="w-4 h-4 text-green-600" />
            ) : (
              <XCircle className="w-4 h-4 text-red-600" />
            )}
          </div>
        )}
      </div>

      {/* 主内容区：编辑框或格式化结果 */}
      <div className="flex-1 p-4">
        {showFormatted ? (
          <textarea
            value={formattedJson}
            readOnly
            placeholder="Formatted JSON will appear here..."
            className="w-full h-full p-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-mono resize-none bg-gray-50 dark:bg-gray-800 dark:text-gray-200"
          />
        ) : (
          <textarea
            value={rawJson}
            onChange={(e) => setRawJson(e.target.value)}
            placeholder="Paste your JSON here..."
            className="w-full h-full p-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-mono resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:text-gray-200"
          />
        )}
      </div>

      {/* 底部工具栏：操作按钮 */}
      <div className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          {showFormatted ? (
            <button onClick={handleEdit}>Edit</button>
          ) : (
            <button onClick={handleFormat}>Format</button>
          )}
          <button onClick={handleCopy}>Copy</button>
          <button onClick={handlePaste}>Paste</button>
          <button onClick={handleUpload}>Upload</button>
          <button onClick={clearAll}>Clear</button>
        </div>
      </div>
    </div>
  );
};
```

### 5.3 工具函数实现

#### 5.3.1 剪贴板操作

```typescript
// src/utils/clipboard.ts
export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    throw error;
  }
};

export const pasteFromClipboard = async (): Promise<string> => {
  try {
    const text = await navigator.clipboard.readText();
    return text;
  } catch (error) {
    console.error('Failed to paste from clipboard:', error);
    throw error;
  }
};
```

## 6. 开发计划

### 6.1 阶段划分

#### Phase 1: MVP开发（已完成）
- 项目搭建
- 基础UI框架
- JSON格式化功能
- JSON验证功能
- 文件操作功能
- 右键菜单集成

## 7. 质量保证

### 7.1 测试策略

#### 7.1.1 功能测试
- JSON格式化功能测试
- JSON验证功能测试
- 文件上传功能测试
- 剪贴板操作测试

### 7.2 性能指标
- 格式化响应时间: < 100ms (1MB JSON)
- 插件加载时间: < 500ms
- 内存占用: < 50MB

### 7.3 兼容性测试
- Chrome 88+
- Edge 88+
- Firefox 109+

## 8. 安全与隐私

### 8.1 数据安全
- 所有数据处理在本地完成
- 不上传任何用户数据
- 不收集用户使用数据
- 不包含第三方追踪代码

### 8.2 权限最小化
- 仅请求必要的浏览器权限
- 明确说明每个权限的用途
- 用户可随时撤销权限

### 8.3 代码安全
- 使用CSP（内容安全策略）
- 防止XSS攻击
- 输入验证和清理

## 9. 发布计划

### 9.1 Chrome Web Store
- 开发者账号注册
- 应用商店资料准备
- 图标和截图设计
- 隐私政策撰写
- 提交审核

### 9.2 Microsoft Edge Add-ons
- 开发者账号注册
- 应用商店资料准备
- 提交审核

### 9.3 Firefox Add-ons
- 开发者账号注册
- 应用商店资料准备
- 提交审核

## 10. 后续迭代计划

### 10.1 V2.0 功能规划
- 自定义缩进选项
- 键盘快捷键支持
- 历史记录功能
- 主题切换

### 10.2 V3.0 功能规划
- 树形视图展示
- JSON Schema验证
- JSON Diff比较
- 数据转换功能（XML、CSV、YAML）

## 11. 成功指标

### 11.1 用户指标
- 月活跃用户数（MAU）
- 用户留存率
- 用户满意度评分

### 11.2 技术指标
- 插件稳定性（崩溃率 < 0.1%）
- 性能指标（响应时间、加载速度）
- Bug修复率

### 11.3 商业指标
- 下载量
- 评分和评论
- 用户推荐率（NPS）

## 12. 风险评估

### 12.1 技术风险
- **风险**: 浏览器API变更导致兼容性问题
- **缓解**: 定期更新插件，关注浏览器更新

- **风险**: 大文件处理性能问题
- **缓解**: 实现流式处理，优化算法

### 12.2 市场风险
- **风险**: 竞品激烈
- **缓解**: 提供差异化功能，优化用户体验

### 12.3 合规风险
- **风险**: 应用商店审核不通过
- **缓解**: 严格遵守商店政策，提前了解审核要求

## 13. 附录

### 13.1 技术参考文档
- [Chrome Extension Documentation](https://developer.chrome.com/docs/extensions/)
- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [TailwindCSS Documentation](https://tailwindcss.com/docs)

### 13.2 开发工具
- VS Code
- Chrome DevTools
- Postman

---

**文档版本**: 2.0
**最后更新**: 2026-01-23
**维护者**: 产品团队
