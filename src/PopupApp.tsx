// 导入React核心库和hooks
import React, { useRef, useState } from "react";
// 导入JSON格式化hook
import { useJsonFormatter } from "./hooks/useJsonFormatter";
// 导入剪贴板工具函数
import { copyToClipboard, pasteFromClipboard } from "./utils/clipboard";
// 导入图标组件
import {
  CheckCircle2,
  XCircle,
  Copy,
  Trash2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Wrench,
} from "lucide-react";

// 弹窗应用组件
const PopupApp: React.FC = () => {
  const {
    rawJson,
    formattedJson,
    isValid,
    error,
    setRawJson,
    formatJson,
    fixJsonErrors,
    clearAll,
  } = useJsonFormatter();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showFormatted, setShowFormatted] = useState(false);
  const [showErrorDetails, setShowErrorDetails] = useState(false);

  // 处理格式化操作
  const handleFormat = () => {
    formatJson();
    // 切换到格式化结果显示模式
    setShowFormatted(true);
  };

  // 处理编辑操作，返回到编辑模式
  const handleEdit = () => {
    setShowFormatted(false);
  };

  // 处理复制操作
  const handleCopy = async () => {
    // 根据当前模式选择要复制的内容
    const textToCopy = showFormatted ? formattedJson : rawJson;
    if (textToCopy) {
      await copyToClipboard(textToCopy);
    }
  };

  // 处理粘贴操作
  const handlePaste = async () => {
    const text = await pasteFromClipboard();
    if (text) {
      setRawJson(text);
    }
  };

  // 处理文件选择变化
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      // 文件读取完成后的回调
      reader.onload = (event) => {
        const content = event.target?.result as string;
        setRawJson(content);
      };
      reader.readAsText(file);
    }
  };

  // 处理文件上传，触发文件选择对话框
  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-[400px] h-[500px] bg-white dark:bg-gray-900 flex flex-col">
      {/* 头部：标题 */}
      <div className="flex items-center justify-between px-4 py-3 bg-blue-600 text-white">
        <h1 className="text-lg font-bold">JSON Formatter</h1>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* 状态栏：显示JSON有效性 */}
        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            {rawJson && (
              <div className="flex items-center gap-1 text-sm">
                {isValid ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
                <span className={isValid ? "text-green-600" : "text-red-600"}>
                  {isValid ? "Valid JSON" : "Invalid JSON"}
                </span>
                {!isValid && error && (
                  <button
                    onClick={() => setShowErrorDetails(!showErrorDetails)}
                    className="ml-2 text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    {showErrorDetails ? (
                      <ChevronUp size={16} />
                    ) : (
                      <ChevronDown size={16} />
                    )}
                    Details
                  </button>
                )}
              </div>
            )}
          </div>
          {showErrorDetails && error && (
            <div className="mt-2 p-2 bg-red-50 dark:bg-red-900/20 rounded-md text-xs">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="font-medium text-red-700 dark:text-red-400 mb-1">
                    {error.message}
                  </p>
                  {(error.line || error.column) && (
                    <p className="text-red-600 dark:text-red-300">
                      {error.line && `Line: ${error.line}`}
                      {error.column && ` Column: ${error.column}`}
                    </p>
                  )}
                  {error.suggestion && (
                    <p className="mt-1 text-gray-600 dark:text-gray-300">
                      💡 {error.suggestion}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 主内容区：根据模式显示编辑框或格式化结果 */}
        <div className="flex-1 p-4">
          {showFormatted ? (
            // 格式化结果显示（只读）
            <textarea
              value={formattedJson}
              readOnly
              placeholder="Formatted JSON will appear here..."
              className="w-full h-full p-3 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-mono resize-none bg-gray-50 dark:bg-gray-800 dark:text-gray-200"
            />
          ) : (
            // 编辑模式（可编辑）
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
            {!isValid && rawJson && (
              <button
                onClick={fixJsonErrors}
                className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <Wrench size={16} />
                Auto Fix
              </button>
            )}
            {showFormatted ? (
              <button
                onClick={handleEdit}
                className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                Edit
              </button>
            ) : (
              <button
                onClick={handleFormat}
                disabled={!rawJson || !isValid}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
              >
                Format
              </button>
            )}
            <button
              onClick={handleCopy}
              disabled={!rawJson}
              className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Copy"
            >
              <Copy size={18} />
            </button>
            <button
              onClick={handlePaste}
              className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              title="Paste"
            >
              <CheckCircle2 size={18} />
            </button>
            <button
              onClick={handleUpload}
              className="px-3 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              title="Upload"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
            </button>
            <button
              onClick={clearAll}
              disabled={!rawJson}
              className="px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-md hover:bg-red-200 dark:hover:bg-red-900/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              title="Clear"
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* 隐藏的文件输入框 */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default PopupApp;
