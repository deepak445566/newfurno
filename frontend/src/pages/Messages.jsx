// frontend/src/pages/Messages.jsx

import React, { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../utils/axios";
import io from "socket.io-client";

const Messages = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [chats, setChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  // MOBILE
  const [showChatMobile, setShowChatMobile] = useState(false);

  const messagesEndRef = useRef(null);
  const socketRef = useRef(null);
  const isSendingRef = useRef(false);

  useEffect(() => {
    api
      .get("/api/auth/me", { withCredentials: true })
      .then((res) => setCurrentUser(res.data.user || res.data))
      .catch(() => navigate("/login"));
  }, []);

  const fetchChats = async () => {
    try {
      const res = await api.get("/api/chat", {
        withCredentials: true,
      });

      setChats(res.data);

      if (location.state?.chatId) {
        const chat = res.data.find(
          (c) => c._id === location.state.chatId
        );

        if (chat) {
          setSelectedChat(chat);
          setShowChatMobile(true);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (chatId) => {
    try {
      const res = await api.get(
        `/api/chat/${chatId}/messages`,
        {
          withCredentials: true,
        }
      );

      setMessages(res.data);

      setTimeout(() => {
        scrollToBottom();
      }, 100);
    } catch (error) {
      console.error(error);
      setMessages([]);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  };

  const sendMessage = async (e) => {
    e.preventDefault();

    if (
      !newMessage.trim() ||
      !selectedChat ||
      isSendingRef.current
    )
      return;

    const text = newMessage.trim();

    const userId =
      currentUser?._id || currentUser?.id;

    isSendingRef.current = true;

    setNewMessage("");

    const tempId = `temp_${Date.now()}`;

    const tempMessage = {
      _id: tempId,
      chatId: selectedChat._id,
      senderId: userId,
      text,
      createdAt: new Date().toISOString(),
      isTemp: true,
    };

    setMessages((prev) => [...prev, tempMessage]);

    scrollToBottom();

    try {
      const response = await api.post(
        "/api/chat/send",
        {
          chatId: selectedChat._id,
          text,
        },
        {
          withCredentials: true,
        }
      );

      setMessages((prev) =>
        prev.map((msg) =>
          msg._id === tempId
            ? response.data
            : msg
        )
      );
    } catch (error) {
      console.error(error);

      setMessages((prev) =>
        prev.filter((msg) => msg._id !== tempId)
      );

      alert("Failed to send message");
    } finally {
      setTimeout(() => {
        isSendingRef.current = false;
      }, 500);
    }
  };

  useEffect(() => {
    if (!currentUser?._id && !currentUser?.id)
      return;

    const userId =
      currentUser._id || currentUser.id;

    const socket = io("http://localhost:5000", {
      withCredentials: true,
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("register", userId);
    });

    socket.on("receiveMessage", (message) => {
      if (isSendingRef.current) return;

      setMessages((prev) => {
        const exists = prev.some(
          (m) => m._id === message._id
        );

        if (
          !exists &&
          selectedChat &&
          message.chatId === selectedChat._id
        ) {
          setTimeout(() => scrollToBottom(), 50);

          return [...prev, message];
        }

        return prev;
      });

      setChats((prev) =>
        prev.map((chat) =>
          chat._id === message.chatId
            ? {
                ...chat,
                lastMessage: message.text,
                lastMessageAt: new Date(),
              }
            : chat
        )
      );
    });

    return () => socket.disconnect();
  }, [currentUser, selectedChat?._id]);

  useEffect(() => {
    if (!selectedChat?._id || !socketRef.current)
      return;

    socketRef.current.emit(
      "joinChat",
      selectedChat._id
    );

    fetchMessages(selectedChat._id);

    isSendingRef.current = false;
  }, [selectedChat?._id]);

  useEffect(() => {
    if (currentUser) {
      fetchChats();
    }
  }, [currentUser]);

  const getOtherUser = (chat) => {
    if (!currentUser || !chat?.participants)
      return null;

    const userId =
      currentUser._id || currentUser.id;

    return chat.participants.find(
      (p) => p._id !== userId
    );
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#f5f5f7] flex flex-col overflow-hidden">

      {/* HEADER */}
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 h-[70px] flex items-center justify-between shrink-0">

        <div className="flex items-center gap-3">

          <button
            onClick={() => {
              if (showChatMobile) {
                setShowChatMobile(false);
              } else {
                navigate(-1);
              }
            }}
            className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center hover:bg-gray-100 transition"
          >
            ←
          </button>

          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900">
              Messages
            </h1>

            <p className="text-xs sm:text-sm text-gray-500">
              Chat with buyers & sellers
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">

        {/* SIDEBAR */}
        <div
          className={`
          ${
            showChatMobile
              ? "hidden md:flex"
              : "flex"
          }
          w-full md:w-[350px] lg:w-[380px]
          bg-white border-r border-gray-200
          flex-col
        `}
        >

          <div className="p-4 border-b border-gray-100">
            <div className="bg-gray-100 rounded-2xl px-4 h-12 flex items-center">
              <input
                type="text"
                placeholder="Search chats..."
                className="bg-transparent outline-none w-full text-sm"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">

            {chats.length === 0 ? (
              <div className="h-full flex items-center justify-center text-center px-6">
                <div>
                  <div className="text-5xl mb-3">
                    💬
                  </div>

                  <h2 className="font-bold text-lg text-gray-800">
                    No Conversations
                  </h2>

                  <p className="text-gray-500 text-sm mt-2">
                    Start chatting with sellers
                  </p>
                </div>
              </div>
            ) : (
              chats.map((chat) => {
                const other = getOtherUser(chat);

                if (!other) return null;

                return (
                  <button
                    key={chat._id}
                    onClick={() => {
                      setSelectedChat(chat);
                      setShowChatMobile(true);
                    }}
                    className={`w-full px-4 py-4 flex items-start gap-3 border-b border-gray-100 transition text-left hover:bg-gray-50 ${
                      selectedChat?._id === chat._id
                        ? "bg-black text-white"
                        : ""
                    }`}
                  >

                    {/* AVATAR */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg shrink-0 ${
                        selectedChat?._id ===
                        chat._id
                          ? "bg-white text-black"
                          : "bg-black text-white"
                      }`}
                    >
                      {other.name
                        ?.charAt(0)
                        .toUpperCase()}
                    </div>

                    {/* CONTENT */}
                    <div className="flex-1 min-w-0">

                      <div className="flex items-center justify-between gap-2">

                        <h2 className="font-semibold truncate">
                          {other.name || "User"}
                        </h2>

                        <span className="text-[10px] opacity-70 whitespace-nowrap">
                          {chat.lastMessageAt
                            ? new Date(
                                chat.lastMessageAt
                              ).toLocaleDateString()
                            : ""}
                        </span>
                      </div>

                      <p
                        className={`text-sm truncate mt-1 ${
                          selectedChat?._id ===
                          chat._id
                            ? "text-white/70"
                            : "text-gray-500"
                        }`}
                      >
                        {chat.lastMessage ||
                          "Start chatting"}
                      </p>

                      {chat.listingId && (
                        <div
                          className={`text-xs mt-1 truncate ${
                            selectedChat?._id ===
                            chat._id
                              ? "text-white/60"
                              : "text-gray-400"
                          }`}
                        >
                          📍 {chat.listingId.title}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* CHAT AREA */}
        <div
          className={`
          ${
            showChatMobile
              ? "flex"
              : "hidden md:flex"
          }
          flex-1 flex-col
        `}
        >

          {!selectedChat ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center px-6">

                <div className="text-7xl mb-5">
                  💬
                </div>

                <h2 className="text-2xl font-black text-gray-800">
                  Select a Chat
                </h2>

                <p className="text-gray-500 mt-2">
                  Choose a conversation to start messaging
                </p>
              </div>
            </div>
          ) : (
            <>
              {/* CHAT HEADER */}
              <div className="h-[75px] bg-white border-b border-gray-200 px-4 sm:px-6 flex items-center justify-between shrink-0">

                <div className="flex items-center gap-3">

                  {/* MOBILE BACK */}
                  <button
                    onClick={() =>
                      setShowChatMobile(false)
                    }
                    className="md:hidden w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center"
                  >
                    ←
                  </button>

                  <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg">
                    {getOtherUser(selectedChat)
                      ?.name?.charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <h2 className="font-bold text-gray-900">
                      {getOtherUser(selectedChat)
                        ?.name || "User"}
                    </h2>

                    <p className="text-sm text-green-600">
                      ● Online
                    </p>
                  </div>
                </div>
              </div>

              {/* MESSAGES */}
              <div className="flex-1 overflow-y-auto px-3 sm:px-6 py-5 space-y-4">

                {messages.length === 0 ? (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl mb-4">
                        👋
                      </div>

                      <p className="text-gray-500">
                        Send your first message
                      </p>
                    </div>
                  </div>
                ) : (
                  messages.map((msg, i) => {
                    const userId =
                      currentUser?._id ||
                      currentUser?.id;

                    const isMe =
                      msg.senderId === userId ||
                      msg.senderId?._id === userId;

                    return (
                      <div
                        key={msg._id || i}
                        className={`flex ${
                          isMe
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`
                          max-w-[85%] sm:max-w-[70%]
                          px-4 py-3 rounded-3xl
                          ${
                            isMe
                              ? "bg-black text-white rounded-br-md"
                              : "bg-white text-gray-900 rounded-bl-md shadow-sm"
                          }
                        `}
                        >
                          <p className="text-sm break-words leading-relaxed">
                            {msg.text}
                          </p>

                          <p
                            className={`text-[11px] mt-2 ${
                              isMe
                                ? "text-gray-300"
                                : "text-gray-400"
                            }`}
                          >
                            {msg.createdAt
                              ? new Date(
                                  msg.createdAt
                                ).toLocaleTimeString(
                                  [],
                                  {
                                    hour: "2-digit",
                                    minute:
                                      "2-digit",
                                  }
                                )
                              : ""}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* INPUT */}
              <form
                onSubmit={sendMessage}
                className="bg-white border-t border-gray-200 p-3 sm:p-4 shrink-0"
              >
                <div className="flex items-center gap-3">

                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) =>
                      setNewMessage(
                        e.target.value
                      )
                    }
                    placeholder="Type your message..."
                    className="flex-1 h-12 sm:h-14 px-5 rounded-2xl bg-gray-100 outline-none border border-transparent focus:border-black transition"
                  />

                  <button
                    type="submit"
                    disabled={
                      !newMessage.trim() ||
                      isSendingRef.current
                    }
                    className="h-12 sm:h-14 px-5 sm:px-8 rounded-2xl bg-black text-white font-semibold hover:scale-[1.03] transition disabled:opacity-50"
                  >
                    Send
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;