import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChatCircleDots,
  PaperPlaneTilt,
  X,
  ArrowDown,
  Trash,
  Copy,
  Check,
  ArrowsCounterClockwise,
} from "@phosphor-icons/react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link } from "react-router-dom";
import { sendChatMessage, type ChatMessage } from "@/services/chatService";
import { useIsMobile } from "@/hooks/use-mobile";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------
interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  time: string;
  isError?: boolean;
}

function timestamp() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const WELCOME: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Hey! 👋 I'm here to help you learn about AFOSI — our programs, opportunities, events, and more. What would you like to know?",
  time: timestamp(),
};

const QUICK_REPLIES = [
  "What jobs are open?",
  "Tell me about the programs",
  "How can I volunteer?",
  "Any recent news?",
];

// ---------------------------------------------------------------------------
// Typing dots
// ---------------------------------------------------------------------------
function TypingDots({ inline = false }: { inline?: boolean }) {
  return (
    <span className={`inline-flex items-center gap-[4px] ${inline ? "ml-1" : "px-3.5 py-3"}`}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className={`block rounded-full ${inline ? "w-[5px] h-[5px] bg-stone-400" : "w-[7px] h-[7px] bg-stone-400 dark:bg-stone-500"}`}
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.14 }}
        />
      ))}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Copy button for bot messages
// ---------------------------------------------------------------------------
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.button
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileTap={{ scale: 0.85 }}
      onClick={handleCopy}
      className="w-6 h-6 rounded-md bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 dark:hover:bg-stone-600 flex items-center justify-center transition-colors shrink-0"
      title={copied ? "Copied!" : "Copy message"}
    >
      {copied ? (
        <Check size={11} weight="bold" className="text-emerald-500" />
      ) : (
        <Copy size={11} weight="bold" className="text-stone-400 dark:text-stone-400" />
      )}
    </motion.button>
  );
}

// ---------------------------------------------------------------------------
// Message bubble
// ---------------------------------------------------------------------------
function Bubble({
  msg,
  onRetry,
}: {
  msg: Message;
  onRetry?: () => void;
}) {
  const isUser = msg.role === "user";
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className={`flex flex-col gap-1 ${isUser ? "items-end" : "items-start"}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="text-[10px] font-medium tracking-wide text-stone-400 dark:text-stone-500 px-1">
        {isUser ? "You" : "Afosi"}
      </span>

      <div className={`flex items-end gap-1.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        <div
          className={
            isUser
              ? "max-w-[80%] bg-stone-900 dark:bg-stone-100 text-white dark:text-stone-900 text-[13.5px] leading-relaxed px-4 py-2.5 rounded-2xl rounded-br-[5px] shadow-sm"
              : msg.isError
              ? "max-w-[85%] bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 text-[13.5px] leading-relaxed px-4 py-2.5 rounded-2xl rounded-bl-[5px] border border-red-200 dark:border-red-900 shadow-sm"
              : "max-w-[85%] bg-stone-50 dark:bg-stone-800 text-stone-800 dark:text-stone-100 text-[13.5px] leading-relaxed px-4 py-2.5 rounded-2xl rounded-bl-[5px] border border-stone-200/80 dark:border-stone-700 shadow-sm"
          }
        >
          {isUser ? (
            msg.content
          ) : (
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
                code: ({ children, className }) => {
                  const isBlock = className?.includes("language-");
                  return isBlock ? (
                    <code className={`${className} block w-full`}>{children}</code>
                  ) : (
                    <code className="bg-stone-200 dark:bg-stone-700 text-orange-600 dark:text-orange-400 rounded px-1 py-0.5 text-[12px] font-mono">
                      {children}
                    </code>
                  );
                },
                pre: ({ children }) => (
                  <pre className="bg-stone-900 dark:bg-black text-stone-100 rounded-lg px-3 py-2.5 text-[12px] font-mono overflow-x-auto my-2 leading-relaxed">
                    {children}
                  </pre>
                ),
                ul: ({ children }) => <ul className="list-none space-y-1 my-2">{children}</ul>,
                li: ({ children }) => (
                  <li className="flex items-start gap-2">
                    <span className="mt-[5px] w-1.5 h-1.5 rounded-full bg-orange-400 shrink-0" />
                    <span>{children}</span>
                  </li>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside space-y-1 my-2 marker:text-orange-500 marker:font-semibold">
                    {children}
                  </ol>
                ),
                // Smart link: internal paths use React Router Link, external open new tab
                a: ({ href, children }) => {
                  const isInternal = href?.startsWith("/");
                  return isInternal ? (
                    <Link
                      to={href!}
                      className="text-orange-500 underline underline-offset-2 hover:text-orange-600 transition-colors font-medium"
                    >
                      {children}
                    </Link>
                  ) : (
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-500 underline underline-offset-2 hover:text-orange-600 transition-colors"
                    >
                      {children}
                    </a>
                  );
                },
                blockquote: ({ children }) => (
                  <blockquote className="border-l-2 border-orange-400 pl-3 my-2 text-stone-500 dark:text-stone-400 italic">
                    {children}
                  </blockquote>
                ),
                h1: ({ children }) => <p className="font-heading font-bold text-base mb-1">{children}</p>,
                h2: ({ children }) => <p className="font-heading font-semibold mb-1">{children}</p>,
                h3: ({ children }) => <p className="font-semibold mb-1">{children}</p>,
                hr: () => <hr className="border-stone-200 dark:border-stone-700 my-2" />,
              }}
            >
              {msg.content}
            </ReactMarkdown>
          )}
        </div>

        {/* Copy button — appears on hover for bot messages */}
        {!isUser && (
          <AnimatePresence>
            {hovered && !msg.isError && (
              <CopyButton key="copy" text={msg.content} />
            )}
          </AnimatePresence>
        )}
      </div>

      <div className="flex items-center gap-2 px-1">
        <span className="text-[10px] text-stone-400 dark:text-stone-600">{msg.time}</span>
        {/* Retry button on error messages */}
        {msg.isError && onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center gap-1 text-[10px] font-medium text-orange-500 hover:text-orange-600 transition-colors"
          >
            <ArrowsCounterClockwise size={10} weight="bold" />
            Try again
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Main widget
// ---------------------------------------------------------------------------
const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [atBottom, setAtBottom] = useState(true);
  const [lastFailedText, setLastFailedText] = useState<string | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const isMobile = useIsMobile();

  // Only show quick reply chips when no conversation has started
  const showChips = messages.length === 1 && messages[0].id === "welcome";

  useEffect(() => {
    if (atBottom) bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, atBottom]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setAtBottom(el.scrollHeight - el.scrollTop - el.clientHeight < 40);
  };

  useEffect(() => {
    if (open) {
      setHasUnread(false);
      setAtBottom(true);
      setTimeout(() => textareaRef.current?.focus(), 280);
    }
  }, [open]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 100)}px`;
  };

  const clearConversation = () => {
    setMessages([{ ...WELCOME, time: timestamp() }]);
    setLastFailedText(null);
  };

  const sendMessage = useCallback(
    async (overrideText?: string) => {
      const text = (overrideText ?? input).trim();
      if (!text || loading) return;

      const userMsg: Message = {
        id: crypto.randomUUID(),
        role: "user",
        content: text,
        time: timestamp(),
      };
      setMessages((prev) => [...prev, userMsg]);
      if (!overrideText) {
        setInput("");
        if (textareaRef.current) textareaRef.current.style.height = "auto";
      }
      setLoading(true);
      setAtBottom(true);
      setLastFailedText(null);

      try {
        const history: ChatMessage[] = messages
          .filter((m) => m.id !== "welcome" && !m.isError)
          .map((m) => ({ role: m.role, content: m.content }));
        history.push({ role: "user", content: text });

        const reply = await sendChatMessage(history);

        const botMsg: Message = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: reply,
          time: timestamp(),
        };
        setMessages((prev) => [...prev, botMsg]);
        if (!open) setHasUnread(true);
      } catch {
        setLastFailedText(text);
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: "Something went wrong. Please try again.",
            time: timestamp(),
            isError: true,
          },
        ]);
      } finally {
        setLoading(false);
      }
    },
    [input, loading, messages, open]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // ---------------------------------------------------------------------------
  // Panel styles — floating on desktop, bottom sheet on mobile
  // ---------------------------------------------------------------------------
  const panelStyle: React.CSSProperties = isMobile
    ? {
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        maxHeight: "80dvh",
        borderRadius: "20px 20px 0 0",
        border: "1px solid hsl(var(--border))",
        borderBottom: "none",
        boxShadow: "0 -8px 40px rgba(0,0,0,0.15)",
        zIndex: 40,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }
    : {
        position: "fixed",
        bottom: "6.5rem",
        right: "1.5rem",
        width: "344px",
        maxHeight: "530px",
        borderRadius: "20px",
        border: "1px solid hsl(var(--border))",
        boxShadow: "0 20px 60px -10px rgba(0,0,0,0.18), 0 4px 16px -4px rgba(0,0,0,0.08)",
        zIndex: 40,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      };

  const panelMotion = isMobile
    ? {
        initial: { opacity: 0, y: "100%" },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: "100%" },
        transition: { type: "spring" as const, stiffness: 380, damping: 34 },
      }
    : {
        initial: { opacity: 0, y: 16, scale: 0.95 },
        animate: { opacity: 1, y: 0, scale: 1 },
        exit: { opacity: 0, y: 16, scale: 0.95 },
        transition: { type: "spring" as const, stiffness: 380, damping: 30 },
      };

  return (
    <>
      {/* Mobile backdrop */}
      <AnimatePresence>
        {open && isMobile && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-black/30 backdrop-blur-[2px]"
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------------ */}
      {/* Chat panel                                                           */}
      {/* ------------------------------------------------------------------ */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="panel"
            {...panelMotion}
            style={panelStyle}
            aria-label="Chat with Afosi"
            role="dialog"
          >
            {/* Header */}
            <div className="shrink-0 flex items-center gap-3 px-4 py-3 bg-white dark:bg-[#161616] border-b border-stone-100 dark:border-stone-800">
              <div className="relative shrink-0">
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white font-heading font-bold text-sm select-none"
                  style={{ background: "#f97316" }}
                >
                  A
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white dark:border-[#161616]" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-heading font-semibold text-stone-900 dark:text-stone-50 text-sm leading-none mb-0.5">
                  Afosi
                </p>
                {/* Header status — changes to "typing…" when loading */}
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.span
                      key="typing"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center text-[11px] text-orange-500 font-medium"
                    >
                      Typing <TypingDots inline />
                    </motion.span>
                  ) : (
                    <motion.p
                      key="online"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-[11px] text-stone-400 dark:text-stone-500"
                    >
                      Online · Ask me anything
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>

              {/* Clear conversation */}
              <button
                onClick={clearConversation}
                className="w-7 h-7 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-center transition-colors"
                aria-label="Clear conversation"
                title="Clear conversation"
              >
                <Trash size={13} weight="bold" className="text-stone-400 dark:text-stone-500" />
              </button>

              {/* Close */}
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-full hover:bg-stone-100 dark:hover:bg-stone-800 flex items-center justify-center transition-colors"
                aria-label="Close"
              >
                <X size={14} weight="bold" className="text-stone-500 dark:text-stone-400" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4 bg-white dark:bg-[#111111]"
            >
              {messages.map((msg) => (
                <Bubble
                  key={msg.id}
                  msg={msg}
                  onRetry={msg.isError && lastFailedText ? () => sendMessage(lastFailedText) : undefined}
                />
              ))}

              {/* Quick reply chips — only before first user message */}
              <AnimatePresence>
                {showChips && !loading && (
                  <motion.div
                    key="chips"
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ delay: 0.15 }}
                    className="flex flex-wrap gap-2 pt-1"
                  >
                    {QUICK_REPLIES.map((chip) => (
                      <button
                        key={chip}
                        onClick={() => sendMessage(chip)}
                        className="text-[12px] font-medium px-3 py-1.5 rounded-full border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:border-orange-300 hover:text-orange-600 dark:hover:border-orange-700 dark:hover:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/20 transition-all duration-150 shadow-sm"
                      >
                        {chip}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Typing bubble */}
              <AnimatePresence>
                {loading && (
                  <motion.div
                    key="typing-bubble"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="self-start"
                  >
                    <div className="bg-stone-50 dark:bg-stone-800 border border-stone-200/80 dark:border-stone-700 rounded-2xl rounded-bl-[5px] shadow-sm">
                      <TypingDots />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={bottomRef} />
            </div>

            {/* Scroll-to-bottom nudge */}
            <AnimatePresence>
              {!atBottom && (
                <motion.button
                  key="scroll-down"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => {
                    setAtBottom(true);
                    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-600 text-stone-600 dark:text-stone-300 rounded-full px-3 py-1.5 text-xs font-medium shadow-md flex items-center gap-1.5 hover:bg-stone-50 transition-colors"
                >
                  <ArrowDown size={11} weight="bold" />
                  New messages
                </motion.button>
              )}
            </AnimatePresence>

            {/* Input */}
            <div className="shrink-0 bg-white dark:bg-[#161616] border-t border-stone-100 dark:border-stone-800 px-3 py-3">
              <div className="flex items-end gap-2 bg-stone-50 dark:bg-stone-900 rounded-[14px] border border-stone-200 dark:border-stone-700 px-3 py-2">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Message Afosi…"
                  rows={1}
                  className="flex-1 resize-none bg-transparent text-[13.5px] text-stone-800 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-600 outline-none leading-relaxed py-0.5 max-h-24 overflow-y-auto"
                  style={{ minHeight: "28px" }}
                />
                <motion.button
                  whileTap={{ scale: 0.86 }}
                  onClick={() => sendMessage()}
                  disabled={!input.trim() || loading}
                  className="shrink-0 w-8 h-8 rounded-[10px] flex items-center justify-center transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  style={{ background: input.trim() && !loading ? "#f97316" : "#e7e5e4" }}
                  aria-label="Send"
                >
                  <PaperPlaneTilt
                    size={15}
                    weight="fill"
                    color={input.trim() && !loading ? "white" : "#a8a29e"}
                  />
                </motion.button>
              </div>
              <p className="text-center text-[10px] text-stone-300 dark:text-stone-700 mt-2">
                Powered by AFOSI · info@afosi.org
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------------ */}
      {/* Toggle button — bottom-24, above the back-to-top at bottom-8        */}
      {/* ------------------------------------------------------------------ */}
      <motion.button
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-24 right-6 z-40 w-[52px] h-[52px] rounded-full flex items-center justify-center"
        style={{
          background: open ? "#1c1917" : "#f97316",
          boxShadow: open
            ? "0 4px 20px rgba(0,0,0,0.35)"
            : "0 4px 20px rgba(249,115,22,0.4), 0 1px 4px rgba(249,115,22,0.2)",
          transition: "background 0.25s ease, box-shadow 0.25s ease",
        }}
        aria-label={open ? "Close chat" : "Chat with Afosi"}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="x"
              initial={{ rotate: -45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 45, opacity: 0 }}
              transition={{ duration: 0.16 }}
            >
              <X size={20} weight="bold" color="white" />
            </motion.span>
          ) : (
            <motion.span
              key="chat"
              initial={{ rotate: 45, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -45, opacity: 0 }}
              transition={{ duration: 0.16 }}
            >
              <ChatCircleDots size={24} weight="fill" color="white" />
            </motion.span>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {hasUnread && !open && (
            <motion.span
              key="badge"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: "spring", stiffness: 500, damping: 20 }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white text-white text-[8px] font-bold flex items-center justify-center"
            >
              !
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>
    </>
  );
};

export default ChatWidget;
