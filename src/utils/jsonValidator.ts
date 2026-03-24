export interface JsonError {
  message: string;
  position?: number;
  line?: number;
  column?: number;
  suggestion?: string;
}

export interface ValidationResult {
  isValid: boolean;
  error?: JsonError;
}

export const parseError = (error: Error): JsonError => {
  const errorMessage = error.message;
  const result: JsonError = { message: errorMessage };

  const positionMatch = errorMessage.match(/position (\d+)/);
  const lineMatch = errorMessage.match(/line (\d+)/);
  const columnMatch = errorMessage.match(/column (\d+)/);

  if (positionMatch) {
    result.position = parseInt(positionMatch[1], 10);
  }

  if (lineMatch) {
    result.line = parseInt(lineMatch[1], 10);
  }

  if (columnMatch) {
    result.column = parseInt(columnMatch[1], 10);
  }

  result.suggestion = getSuggestion(errorMessage);

  return result;
};

const getSuggestion = (errorMessage: string): string | undefined => {
  if (errorMessage.includes("Unexpected token")) {
    return "检查是否有未转义的特殊字符或语法错误";
  }

  if (errorMessage.includes("Unexpected end of JSON input")) {
    return "JSON字符串不完整，请检查是否缺少闭合括号或引号";
  }

  if (errorMessage.includes("Expected property name")) {
    return "请检查对象属性名是否使用了双引号";
  }

  if (errorMessage.includes("Expected ',' or '}'")) {
    return "请检查对象属性之间是否缺少逗号";
  }

  if (errorMessage.includes("Expected ',' or ']'")) {
    return "请检查数组元素之间是否缺少逗号";
  }

  if (errorMessage.includes("Duplicate key")) {
    return "对象中存在重复的键名，请删除重复项";
  }

  return undefined;
};

export const validateJson = (jsonString: string): ValidationResult => {
  if (!jsonString.trim()) {
    return { isValid: true };
  }

  try {
    JSON.parse(jsonString);
    return { isValid: true };
  } catch (error) {
    const jsonError = error instanceof Error ? parseError(error) : { message: "Unknown error" };
    return { isValid: false, error: jsonError };
  }
};

export const fixJson = (jsonString: string): { fixed: string; error?: string } => {
  let fixed = jsonString;

  const fixes: Array<{ name: string; apply: (s: string) => string }> = [
    {
      name: "单引号转双引号",
      apply: (s) => s.replace(/'/g, '"'),
    },
    {
      name: "移除JavaScript注释",
      apply: (s) => s.replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, ""),
    },
    {
      name: "移除尾随逗号",
      apply: (s) => s.replace(/,(\s*[}\]])/g, "$1"),
    },
    {
      name: "修复未加引号的键名",
      apply: (s) => s.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g, '$1"$2":'),
    },
    {
      name: "修复JavaScript对象属性简写",
      apply: (s) => s.replace(/([{,]\s*)([a-zA-Z_$][a-zA-Z0-9_$]*)\s*([,}\]])/g, '$1"$2": undefined$3'),
    },
    {
      name: "修复未转义的控制字符",
      apply: (s) => s.replace(/[\u0000-\u001F\u007F-\u009F]/g, (match) => {
        const code = match.charCodeAt(0);
        return `\\u${code.toString(16).padStart(4, "0")}`;
      }),
    },
    {
      name: "修复未转义的换行符",
      apply: (s) => s.replace(/\n/g, "\\n").replace(/\r/g, "\\r").replace(/\t/g, "\\t"),
    },
    {
      name: "修复undefined为null",
      apply: (s) => s.replace(/\bundefined\b/g, "null"),
    },
    {
      name: "修复NaN为null",
      apply: (s) => s.replace(/\bNaN\b/g, "null"),
    },
    {
      name: "修复Infinity为null",
      apply: (s) => s.replace(/\bInfinity\b/g, "null"),
    },
  ];

  const appliedFixes: string[] = [];

  for (const fix of fixes) {
    const before = fixed;
    fixed = fix.apply(fixed);
    if (before !== fixed) {
      appliedFixes.push(fix.name);
    }
  }

  try {
    JSON.parse(fixed);
    return { fixed };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return {
      fixed,
      error: `无法自动修复: ${errorMessage}${appliedFixes.length > 0 ? `\n已应用的修复: ${appliedFixes.join(", ")}` : ""}`,
    };
  }
};

export const getErrorLineAndColumn = (jsonString: string, position: number): { line: number; column: number } => {
  const lines = jsonString.substring(0, position).split("\n");
  const line = lines.length;
  const column = lines[lines.length - 1].length + 1;
  return { line, column };
};
