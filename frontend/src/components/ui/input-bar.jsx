import { memo, useState, useCallback, useRef, useEffect } from "react";
import { cn } from "../../lib/utils";

/*  Icons  */
const SendIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="19" x2="12" y2="5" />
    <polyline points="5 12 12 5 19 12" />
  </svg>
);

const StopIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
    <rect x="6" y="6" width="12" height="12" rx="1.5" />
  </svg>
);

/*  Send / Stop button  */
function SendButton({ state, onClick }) {
  const isStreaming = state === "streaming";
  const isActive    = state === "typing" || isStreaming;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={isStreaming ? "Stop" : "Send"}
      style={{
        width: 36,
        height: 36,
        borderRadius: "10px",
        border: "none",
        cursor: isActive ? "pointer" : "not-allowed",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
        transition: "all 0.2s",
        background: isActive
          ? "linear-gradient(135deg, #3F72AF, #2d5a8e)"
          : "rgba(63,114,175,0.08)",
        color: isActive ? "#fff" : "rgba(63,114,175,0.28)",
        boxShadow: isActive ? "0 0 18px rgba(63,114,175,0.4)" : "none",
      }}
    >
      {isStreaming ? <StopIcon /> : <SendIcon />}
    </button>
  );
}

/*  Main InputBar  */
export const InputBar = memo(function InputBar({
  onSend,
  onStop,
  status = "ready",
  placeholder = "Ask anything  type / for commands...",
  className,
  value: controlledValue,
  onChange: controlledOnChange,
  onKeyDown: externalKeyDown,
  disabled,
  autoFocus,
  inputRef: externalRef,
}) {
  const [internalInput, setInternalInput] = useState("");
  const isControlled = controlledValue !== undefined;
  const input   = isControlled ? controlledValue : internalInput;
  const setInput = useCallback(
    (v) => {
      if (isControlled) controlledOnChange?.(v);
      else setInternalInput(v);
    },
    [isControlled, controlledOnChange],
  );

  const internalRef = useRef(null);
  const textareaRef = externalRef || internalRef;

  const isStreaming = status === "streaming" || status === "submitted";
  const hasInput    = input.trim().length > 0;

  /* auto-resize textarea */
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "0";
    const next = Math.min(el.scrollHeight, 140);
    el.style.height = `${next}px`;
    el.style.overflowY = el.scrollHeight > 140 ? "auto" : "hidden";
  }, [input]);

  useEffect(() => {
    if (autoFocus) textareaRef.current?.focus();
  }, [autoFocus]);

  const handleSubmit = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming || disabled) return;
    onSend?.({ role: "user", content: trimmed });
    setInput("");
  }, [input, isStreaming, disabled, onSend, setInput]);

  const handleKeyDown = useCallback(
    (e) => {
      externalKeyDown?.(e);          // let ChatWindow handle Escape etc.
      if (e.defaultPrevented) return;
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
    },
    [handleSubmit, externalKeyDown],
  );

  const handleContainerClick = useCallback((e) => {
    if (
      e.target === e.currentTarget ||
      !e.target.closest("button, textarea")
    ) {
      textareaRef.current?.focus();
    }
  }, []);

  const sendState = isStreaming
    ? "streaming"
    : hasInput && !disabled
      ? "typing"
      : "idle";

  return (
    <div
      onClick={handleContainerClick}
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: 10,
        padding: "10px 14px",
        borderRadius: 14,
        background: "rgba(10, 25, 50, 0.72)",
        backdropFilter: "blur(24px)",
        border: "1px solid rgba(63,114,175,0.18)",
        boxShadow: "0 0 0 0 rgba(63,114,175,0)",
        transition: "border-color 0.2s, box-shadow 0.2s",
        cursor: "text",
      }}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = "rgba(63,114,175,0.5)";
        e.currentTarget.style.boxShadow   = "0 0 0 3px rgba(63,114,175,0.09)";
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
          e.currentTarget.style.borderColor = "rgba(63,114,175,0.18)";
          e.currentTarget.style.boxShadow   = "0 0 0 0 rgba(63,114,175,0)";
        }
      }}
      className={className}
    >
      <textarea
        ref={textareaRef}
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        rows={1}
        style={{
          flex: 1,
          resize: "none",
          border: "none",
          outline: "none",
          background: "transparent",
          fontSize: "0.875rem",
          lineHeight: 1.65,
          color: "rgba(219,226,239,0.92)",
          fontFamily: "Inter, sans-serif",
          opacity: disabled ? 0.45 : 1,
          cursor: disabled ? "not-allowed" : "text",
          overflow: "hidden",
          padding: 0,
          /* placeholder color via CSS var */
          "--placeholder-color": "rgba(90,120,160,0.45)",
        }}
        onMouseEnter={() => {}}  /* placeholder colour handled in index.css */
      />

      <SendButton
        state={sendState}
        onClick={() => {
          if (isStreaming) onStop?.();
          else if (hasInput) handleSubmit();
        }}
      />
    </div>
  );
});

export default InputBar;
