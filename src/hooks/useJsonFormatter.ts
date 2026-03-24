import { useState } from "react";
import { validateJson, fixJson, JsonError } from "../utils/jsonValidator";

export const useJsonFormatter = () => {
  const [rawJson, setRawJson] = useState("");
  const [formattedJson, setFormattedJson] = useState("");
  const [isValid, setIsValid] = useState(true);
  const [error, setError] = useState<JsonError | undefined>(undefined);

  const formatJson = () => {
    const result = validateJson(rawJson);
    setIsValid(result.isValid);

    if (result.isValid) {
      try {
        const parsed = JSON.parse(rawJson);
        const formatted = JSON.stringify(parsed, null, 2);
        setFormattedJson(formatted);
        setError(undefined);
      } catch (error) {
        setIsValid(false);
      }
    } else {
      setError(result.error);
    }
  };

  const fixJsonErrors = () => {
    const result = fixJson(rawJson);
    if (!result.error) {
      setRawJson(result.fixed);
      formatJson();
    }
  };

  const clearAll = () => {
    setRawJson("");
    setFormattedJson("");
    setIsValid(true);
    setError(undefined);
  };

  return {
    rawJson,
    formattedJson,
    isValid,
    error,
    setRawJson,
    formatJson,
    fixJsonErrors,
    clearAll,
  };
};
