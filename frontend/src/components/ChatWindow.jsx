import React, { useState, useRef, useEffect } from "react";


import { Box, TextField, Typography, Tooltip, CircularProgress } from "@mui/material";


import { motion, AnimatePresence } from "framer-motion";


import {


  SendOutlined, AutoAwesomeOutlined, PersonOutlined,


  ExpandMoreOutlined, ExpandLessOutlined, SettingsOutlined,


  ContentCopyOutlined, KeyOutlined, SearchOutlined,


  SummarizeOutlined, LightbulbOutlined,


} from "@mui/icons-material";


import { useNavigate } from "react-router-dom";


import { useAppTheme, P } from "../context/ThemeContext";


import { askQuestion } from "../api/documents";





//  Typing dots 


function TypingDots() {


  return (


    <Box display="flex" alignItems="center" gap={0.6} py={0.25}>


      {[0, 1, 2].map((i) => (


        <motion.div


          key={i}


          animate={{ scale: [0.5, 1, 0.5], opacity: [0.2, 1, 0.2] }}


          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}


          style={{ width: 6, height: 6, borderRadius: "50%", background: "#3F72AF" }}


        />


      ))}


    </Box>


  );


}





//  Streaming text reveal 


function StreamText({ text, isDark }) {


  const [displayed, setDisplayed] = useState("");


  useEffect(() => {


    setDisplayed("");


    if (!text) return;


    let i = 0;


    const id = setInterval(() => {


      i++;


      setDisplayed(text.slice(0, i));


      if (i >= text.length) clearInterval(id);


    }, 7);


    return () => clearInterval(id);


  }, [text]);


  return (


    <Typography sx={{ fontSize: "0.88rem", lineHeight: 1.75, color: isDark ? "rgba(219,226,239,0.92)" : "rgba(17,45,78,0.9)", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>


      {displayed}


      {displayed.length < text.length && (


        <motion.span


          animate={{ opacity: [1, 0] }}


          transition={{ duration: 0.5, repeat: Infinity }}


          style={{ display: "inline-block", width: 2, height: "1em", background: "#3F72AF", marginLeft: 2, verticalAlign: "text-bottom" }}


        />


      )}


    </Typography>


  );


}





//  Command palette 


const COMMANDS = [


  { cmd: "/summarize", icon: <SummarizeOutlined sx={{ fontSize: 14 }} />, hint: "Summarize the entire document" },


  { cmd: "/search", icon: <SearchOutlined sx={{ fontSize: 14 }} />, hint: "Semantic search within document" },


  { cmd: "/analyze", icon: <AutoAwesomeOutlined sx={{ fontSize: 14 }} />, hint: "Analyze key themes and topics" },


  { cmd: "/extract", icon: <LightbulbOutlined sx={{ fontSize: 14 }} />, hint: "Extract the main key points" },


  { cmd: "/insights", icon: <LightbulbOutlined sx={{ fontSize: 14 }} />, hint: "Generate AI insights" },


];





function CommandPalette({ query, onSelect }) {


  const filtered = COMMANDS.filter((c) => c.cmd.startsWith(query) || query === "/");


  if (!filtered.length) return null;


  return (


    <motion.div


      initial={{ opacity: 0, y: 8, scale: 0.97 }}


      animate={{ opacity: 1, y: 0, scale: 1 }}


      exit={{ opacity: 0, y: 4 }}


      transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}


      style={{


        position: "absolute", bottom: "calc(100% + 8px)", left: 0, right: 0,


        background: isDark ? "rgba(10,28,55,0.97)" : "rgba(249,247,247,0.98)", backdropFilter: "blur(32px)",


        border: "1px solid rgba(63,114,175,0.2)", borderRadius: 12,


        overflow: "hidden", zIndex: 100,


        boxShadow: "0 0 40px rgba(63,114,175,0.12), 0 20px 60px rgba(0,0,0,0.6)",


      }}


    >


      <Box sx={{ px: 2, py: 1, borderBottom: "1px solid rgba(63,114,175,0.08)" }}>


        <Typography sx={{ fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.12em", color: "rgba(63,114,175,0.4)", textTransform: "uppercase" }}>


          Commands


        </Typography>


      </Box>


      {filtered.map((c, i) => (


        <motion.div


          key={c.cmd}


          initial={{ opacity: 0, x: -8 }}


          animate={{ opacity: 1, x: 0 }}


          transition={{ delay: i * 0.04 }}


          onClick={() => onSelect(c.cmd)}


          style={{ cursor: "pointer" }}


        >


          <Box sx={{


            px: 2, py: 1.25, display: "flex", alignItems: "center", gap: 1.5,


            "&:hover": { background: "rgba(63,114,175,0.07)" },


            transition: "background 0.15s",


          }}>


            <Box sx={{ color: "#3F72AF", display: "flex", opacity: 0.7 }}>{c.icon}</Box>


            <Box>


              <Typography sx={{ fontSize: "0.82rem", fontWeight: 700, color: isDark ? "rgba(219,226,239,0.85)" : "rgba(17,45,78,0.85)" }}>{c.cmd}</Typography>


              <Typography sx={{ fontSize: "0.7rem", color: isDark ? "rgba(219,226,239,0.45)" : "rgba(17,45,78,0.45)" }}>{c.hint}</Typography>


            </Box>


          </Box>


        </motion.div>


      ))}


    </motion.div>


  );


}





//  Message bubble 


function Bubble({ msg, isLatestAI, isDark }) {


  const isUser = msg.role === "user";


  const isError = msg.isError;


  const [showSrc, setShowSrc] = useState(false);


  const [copied, setCopied] = useState(false);





  const copy = () => {


    navigator.clipboard.writeText(msg.content);


    setCopied(true);


    setTimeout(() => setCopied(false), 1800);


  };





  return (


    <motion.div


      initial={{ opacity: 0, y: 16, scale: 0.97 }}


      animate={{ opacity: 1, y: 0, scale: 1 }}


      transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}


    >


      <Box display="flex" flexDirection={isUser ? "row-reverse" : "row"} alignItems="flex-start" gap={1.5} mb={3}>


        <Box sx={{


          width: 30, height: 30, borderRadius: "8px", flexShrink: 0,


          background: isUser ? "linear-gradient(135deg,#3F72AF,#112D4E)" : isError ? "rgba(239,68,68,0.2)" : "rgba(63,114,175,0.08)",


          border: isUser ? "none" : `1px solid ${isError ? "rgba(239,68,68,0.3)" : "rgba(63,114,175,0.2)"}`,


          display: "flex", alignItems: "center", justifyContent: "center",


          boxShadow: isUser ? "0 0 14px rgba(63,114,175,0.3)" : isLatestAI ? "0 0 20px rgba(63,114,175,0.2)" : "none",


          transition: "box-shadow 0.3s",


        }}>


          {isUser


            ? <PersonOutlined sx={{ fontSize: 15, color: "#F9F7F7" }} />


            : <AutoAwesomeOutlined sx={{ fontSize: 15, color: isError ? "#ef4444" : "#3F72AF" }} />}


        </Box>





        <Box maxWidth="80%" minWidth={0}>


          <Box sx={{


            px: 2.5, py: 1.75,


            background: isUser


              ? "linear-gradient(135deg,rgba(63,114,175,0.16),rgba(17,45,78,0.1))"


              : isError ? "rgba(239,68,68,0.07)" : (isDark ? "rgba(17,45,78,0.72)" : "rgba(249,247,247,0.97)"),


            border: "1px solid",


            borderColor: isUser ? "rgba(63,114,175,0.28)" : isError ? "rgba(239,68,68,0.22)" : "rgba(63,114,175,0.1)",


            borderRadius: isUser ? "14px 4px 14px 14px" : "4px 14px 14px 14px",


            backdropFilter: "blur(16px)",


            boxShadow: isLatestAI && !isUser ? "0 0 30px rgba(63,114,175,0.06)" : "none",


            transition: "box-shadow 0.5s",


          }}>


            {isLatestAI && !isUser && !isError


              ? <StreamText text={msg.content} isDark={isDark} />


              : (


                <Typography sx={{


                  fontSize: "0.88rem", lineHeight: 1.75,


                  color: isError ? "#fca5a5" : (isDark ? "rgba(219,226,239,0.92)" : "rgba(17,45,78,0.9)"),


                  whiteSpace: "pre-wrap", wordBreak: "break-word",


                }}>


                  {msg.content}


                </Typography>


              )}


          </Box>





          {!isUser && !isError && (


            <Box display="flex" alignItems="center" gap={1} mt={0.5} ml={0.5}>


              <Tooltip title={copied ? "Copied!" : "Copy"}>


                <Box onClick={copy} sx={{ cursor: "pointer", color: "rgba(63,114,175,0.22)", "&:hover": { color: "#3F72AF" }, display: "flex", transition: "color 0.15s" }}>


                  <ContentCopyOutlined sx={{ fontSize: 12 }} />


                </Box>


              </Tooltip>


              {msg.sources?.length > 0 && (


                <Box onClick={() => setShowSrc((s) => !s)} sx={{


                  display: "inline-flex", alignItems: "center", gap: 0.4,


                  px: 1, py: 0.2, borderRadius: "100px", cursor: "pointer",


                  background: "rgba(63,114,175,0.06)", border: "1px solid rgba(63,114,175,0.14)",


                  color: "rgba(63,114,175,0.55)", fontSize: "0.68rem", fontWeight: 700,


                  "&:hover": { background: "rgba(63,114,175,0.11)", color: "#3F72AF" },


                  transition: "all 0.15s",


                }}>


                  {showSrc ? <ExpandLessOutlined sx={{ fontSize: 11 }} /> : <ExpandMoreOutlined sx={{ fontSize: 11 }} />}


                  {msg.sources.length} sources


                </Box>


              )}


            </Box>


          )}





          <AnimatePresence>


            {showSrc && msg.sources?.length > 0 && (


              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.22 }}>


                <Box mt={1} display="flex" flexDirection="column" gap={0.75}>


                  {msg.sources.map((s, i) => (


                    <Box key={i} sx={{ p: 1.5, borderRadius: "8px", background: "rgba(63,114,175,0.03)", border: "1px solid rgba(63,114,175,0.09)" }}>


                      <Typography sx={{ fontSize: "0.7rem", color: isDark ? "rgba(219,226,239,0.5)" : "rgba(17,45,78,0.5)", lineHeight: 1.5 }}>{s}</Typography>


                    </Box>


                  ))}


                </Box>


              </motion.div>


            )}


          </AnimatePresence>


        </Box>


      </Box>


    </motion.div>


  );


}





//  Suggestion chips 


const SUGGESTIONS = [


  "Summarize this document",


  "What are the key points?",


  "Extract main topics",


  "What conclusions are drawn?",


];





//  Main ChatWindow 


export default function ChatWindow({ document, aiConfigured, onRefreshAI }) {


  const { mode } = useAppTheme();


  const isDark = mode === "dark";


  const navigate = useNavigate();


  const [messages, setMessages] = useState([]);


  const [input, setInput] = useState("");


  const [loading, setLoading] = useState(false);


  const [sessionId, setSessionId] = useState(null);


  const [showCommands, setShowCommands] = useState(false);


  const [latestAIIndex, setLatestAIIndex] = useState(-1);


  const bottomRef = useRef(null);


  const inputRef = useRef(null);





  useEffect(() => {


    setMessages([]); setSessionId(null); setInput("");


    setLatestAIIndex(-1); setShowCommands(false);


  }, [document?.id]);





  useEffect(() => {


    bottomRef.current?.scrollIntoView({ behavior: "smooth" });


  }, [messages, loading]);





  const handleInputChange = (e) => {


    const val = e.target.value;


    setInput(val);


    setShowCommands(val.startsWith("/"));


  };





  const handleCommandSelect = (cmd) => {


    const prompts = {


      "/summarize": "Please provide a comprehensive summary of this document.",


      "/search": "Search this document for: ",


      "/analyze": "Analyze the key themes and topics in this document.",


      "/extract": "Extract and list the most important points from this document.",


      "/insights": "What are the most valuable insights from this document?",


    };


    setInput(prompts[cmd] || cmd + " ");


    setShowCommands(false);


    setTimeout(() => inputRef.current?.focus(), 50);


  };





  const send = async (overrideText) => {


    const q = (overrideText || input).trim();


    if (!q || loading) return;


    setMessages((p) => [...p, { role: "user", content: q }]);


    setInput("");


    setShowCommands(false);


    setLoading(true);


    try {


      const { data } = await askQuestion(document.id, q, sessionId);


      setSessionId(data.session_id);


      setMessages((p) => {


        const next = [...p, { role: "assistant", content: data.answer, sources: data.sources }];


        setLatestAIIndex(next.length - 1);


        return next;


      });


    } catch (err) {


      const detail = err.response?.data?.detail || "Something went wrong. Please try again.";


      setMessages((p) => [...p, { role: "assistant", content: detail, isError: true }]);


      if (detail.toLowerCase().includes("api key") && onRefreshAI) onRefreshAI();


    } finally {


      setLoading(false);


      setTimeout(() => inputRef.current?.focus(), 80);


    }


  };





  const onKey = (e) => {


    if (e.key === "Escape") { setShowCommands(false); return; }


    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }


  };





  // No document selected


  if (!document) {


    return (


      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%" gap={3} px={4}>


        <motion.div animate={{ y: [-6, 6, -6], rotate: [-1, 1, -1] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>


          <Box sx={{


            width: 80, height: 80, borderRadius: "20px",


            background: "rgba(63,114,175,0.07)", border: "1px solid rgba(63,114,175,0.18)",


            display: "flex", alignItems: "center", justifyContent: "center",


            boxShadow: "0 0 40px rgba(63,114,175,0.1)",


          }}>


            <AutoAwesomeOutlined sx={{ fontSize: 36, color: "#3F72AF" }} />


          </Box>


        </motion.div>


        <Box textAlign="center">


          <Typography variant="h6" fontWeight={700} mb={0.75} sx={{ color: isDark ? "#F9F7F7" : "#112D4E" }}>Neural Search Ready</Typography>


          <Typography sx={{ fontSize: "0.85rem", color: isDark ? "rgba(219,226,239,0.45)" : "rgba(17,45,78,0.45)", lineHeight: 1.6 }}>


            Select a document from the sidebar<br />to begin semantic analysis


          </Typography>


        </Box>


        <Box display="flex" gap={1} flexWrap="wrap" justifyContent="center" mt={1}>


          {["Upload PDF", "Semantic Search", "AI Analysis"].map((tag) => (


            <Box key={tag} sx={{


              px: 1.5, py: 0.4, borderRadius: "100px",


              background: "rgba(63,114,175,0.06)", border: "1px solid rgba(63,114,175,0.14)",


              fontSize: "0.7rem", color: "rgba(63,114,175,0.5)", fontWeight: 600,


            }}>


              {tag}


            </Box>


          ))}


        </Box>


      </Box>


    );


  }





  if (aiConfigured === null) {


    return (


      <Box display="flex" alignItems="center" justifyContent="center" height="100%">


        <CircularProgress sx={{ color: "#3F72AF" }} size={28} />


      </Box>


    );


  }





  return (


    <Box display="flex" flexDirection="column" height="100%" sx={{ position: "relative" }}>


      {/* Scanning line when AI is thinking */}


      <AnimatePresence>


        {loading && (


          <motion.div


            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}


            style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, zIndex: 10 }}


          >


            <motion.div


              animate={{ x: ["-100%", "100%"] }}


              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}


              style={{ height: "100%", width: "40%", background: "linear-gradient(90deg,transparent,#3F72AF,transparent)" }}


            />


          </motion.div>


        )}


      </AnimatePresence>





      {/* Header */}


      <Box sx={{


        px: 3, py: 1.5,


        borderBottom: "1px solid rgba(63,114,175,0.08)",


        background: isDark ? "rgba(12,32,60,0.6)" : "rgba(249,247,247,0.97)", backdropFilter: "blur(24px)",


        display: "flex", alignItems: "center", justifyContent: "space-between",


      }}>


        <Box display="flex" alignItems="center" gap={1.5}>


          <Box sx={{


            width: 8, height: 8, borderRadius: "50%",


            bgcolor: document.status === "ready" ? "#22c55e" : "#f59e0b",


            boxShadow: document.status === "ready" ? "0 0 8px #22c55e" : "0 0 8px #f59e0b",


            animation: document.status !== "ready" ? "bdpulse 1.5s infinite" : "none",


            "@keyframes bdpulse": { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.3 } },


          }} />


          <Box>


            <Typography sx={{ fontWeight: 700, fontSize: "0.88rem", color: isDark ? "#f0f6ff" : "#112D4E" }} noWrap>


              {document.original_name}


            </Typography>


            <Typography sx={{ fontSize: "0.65rem", color: "rgba(63,114,175,0.4)" }}>


              {document.status === "ready"


                ? `${document.chunk_count} semantic chunks  ready`


                : "Indexing document..."}


            </Typography>


          </Box>


        </Box>


        <Tooltip title="AI Settings">


          <Box onClick={() => navigate("/settings")} sx={{ cursor: "pointer", color: "rgba(63,114,175,0.28)", "&:hover": { color: "#3F72AF" }, display: "flex", transition: "color 0.15s" }}>


            <SettingsOutlined sx={{ fontSize: 16 }} />


          </Box>


        </Tooltip>


      </Box>





      {/* Messages */}


      <Box flex={1} overflow="auto" px={3} py={3} sx={{


        "&::-webkit-scrollbar": { width: "3px" },


        "&::-webkit-scrollbar-thumb": { background: "rgba(63,114,175,0.15)", borderRadius: "2px" },


      }}>


        {messages.length === 0 && (


          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>


            <Box textAlign="center" mt={6} mb={4}>


              <motion.div animate={{ y: [-4, 4, -4] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>


                <AutoAwesomeOutlined sx={{ fontSize: 38, color: "rgba(63,114,175,0.22)", mb: 2 }} />


              </motion.div>


              <Typography variant="h6" fontWeight={700} mb={0.75} sx={{ color: isDark ? "#F9F7F7" : "#112D4E" }}>Ask anything</Typography>


              <Typography sx={{ fontSize: "0.8rem", color: isDark ? "rgba(90,120,160,0.38)" : "rgba(17,45,78,0.4)", mb: 3 }}>


                {document.original_name}


              </Typography>


              <Box display="flex" flexWrap="wrap" gap={1} justifyContent="center">


                {SUGGESTIONS.map((s) => (


                  <motion.div key={s} whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}>


                    <Box


                      onClick={() => document.status === "ready" && send(s)}


                      sx={{


                        px: 2, py: 0.75, borderRadius: "100px",


                        cursor: document.status === "ready" ? "pointer" : "not-allowed",


                        background: "rgba(63,114,175,0.05)", border: "1px solid rgba(63,114,175,0.14)",


                        fontSize: "0.75rem", color: "rgba(63,114,175,0.6)", fontWeight: 600,


                        "&:hover": document.status === "ready"


                          ? { background: "rgba(63,114,175,0.1)", color: "#3F72AF", borderColor: "rgba(63,114,175,0.3)" }


                          : {},


                        transition: "all 0.15s",


                      }}


                    >


                      {s}


                    </Box>


                  </motion.div>


                ))}


              </Box>


              <Typography sx={{ fontSize: "0.68rem", color: "rgba(63,114,175,0.2)", mt: 2 }}>


                Type / for commands  Enter to send


              </Typography>


            </Box>


          </motion.div>


        )}





        {messages.map((m, i) => (


          <Bubble key={i} msg={m} isLatestAI={i === latestAIIndex && m.role === "assistant"} isDark={isDark} />


        ))}





        {loading && (


          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>


            <Box display="flex" alignItems="flex-start" gap={1.5} mb={3}>


              <Box sx={{


                width: 30, height: 30, borderRadius: "8px",


                background: "rgba(63,114,175,0.08)", border: "1px solid rgba(63,114,175,0.2)",


                display: "flex", alignItems: "center", justifyContent: "center",


                animation: "bdglow 1.5s ease-in-out infinite",


                "@keyframes bdglow": {


                  "0%,100%": { boxShadow: "0 0 10px rgba(63,114,175,0.15)" },


                  "50%": { boxShadow: "0 0 25px rgba(63,114,175,0.4)" },


                },


              }}>


                <AutoAwesomeOutlined sx={{ fontSize: 15, color: "#3F72AF" }} />


              </Box>


              <Box sx={{


                px: 2.5, py: 1.75, background: isDark ? "rgba(17,45,78,0.7)" : "rgba(249,247,247,0.97)",


                border: "1px solid rgba(63,114,175,0.1)",


                borderRadius: "4px 14px 14px 14px", backdropFilter: "blur(16px)",


              }}>


                <TypingDots />


              </Box>


            </Box>


          </motion.div>


        )}


        <div ref={bottomRef} />


      </Box>





      {/* Input area */}


      <Box sx={{ px: 3, py: 2, borderTop: "1px solid rgba(63,114,175,0.08)", background: isDark ? "rgba(12,32,60,0.6)" : "rgba(249,247,247,0.97)", backdropFilter: "blur(24px)" }}>


        {document.status !== "ready" && (


          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>


            <Box sx={{


              display: "flex", alignItems: "center", gap: 1,


              px: 2, py: 0.9, mb: 1.5, borderRadius: "8px",


              background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.16)",


            }}>


              <Box sx={{


                width: 5, height: 5, borderRadius: "50%", bgcolor: "#f59e0b",


                animation: "bdpulse 1.5s infinite",


              }} />


              <Typography sx={{ fontSize: "0.73rem", color: "#f59e0b" }}>


                Indexing document  please wait


              </Typography>


            </Box>


          </motion.div>


        )}





        <Box sx={{ position: "relative" }}>


          <AnimatePresence>


            {showCommands && (


              <CommandPalette query={input} onSelect={handleCommandSelect} />


            )}


          </AnimatePresence>





          <Box display="flex" gap={1.5} alignItems="flex-end">


            <TextField


              inputRef={inputRef}


              fullWidth multiline maxRows={5}


              placeholder={document.status === "ready" ? "Ask anything  type / for commands..." : "Waiting for document..."}


              value={input}


              onChange={handleInputChange}


              onKeyDown={onKey}


              disabled={loading || document.status !== "ready"}


              size="small"


              sx={{


                "& .MuiOutlinedInput-root": {


                  borderRadius: "12px", fontSize: "0.88rem",


                  background: "rgba(63,114,175,0.03)",


                  "& fieldset": { borderColor: "rgba(63,114,175,0.12)" },


                  "&:hover fieldset": { borderColor: "rgba(63,114,175,0.25)" },


                  "&.Mui-focused fieldset": { borderColor: "#3F72AF", boxShadow: "0 0 0 3px rgba(63,114,175,0.07)" },


                },


              }}


            />


            <motion.button


              whileHover={input.trim() && !loading ? { scale: 1.1, boxShadow: "0 0 28px rgba(63,114,175,0.55)" } : {}}


              whileTap={input.trim() && !loading ? { scale: 0.92 } : {}}


              onClick={() => send()}


              disabled={!input.trim() || loading || document.status !== "ready"}


              style={{


                width: 42, height: 42, borderRadius: 11, border: "none", flexShrink: 0,


                background: input.trim() && !loading


                  ? "linear-gradient(135deg,#3F72AF,#2d5a8e)"


                  : "rgba(63,114,175,0.07)",


                color: input.trim() && !loading ? "#000" : "rgba(63,114,175,0.22)",


                cursor: input.trim() && !loading ? "pointer" : "not-allowed",


                display: "flex", alignItems: "center", justifyContent: "center",


                boxShadow: input.trim() && !loading ? "0 0 18px rgba(63,114,175,0.3)" : "none",


                transition: "all 0.2s",


              }}


            >


              <SendOutlined style={{ fontSize: 17 }} />


            </motion.button>


          </Box>


        </Box>


      </Box>


    </Box>


  );


}

















