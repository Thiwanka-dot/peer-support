import { useEffect, useState } from "react";
import io from "socket.io-client";
import Nav from "../Nav/Nav";
import style from "./chat.module.css";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import { FaArrowLeft, FaEdit, FaSearch, FaTrash } from "react-icons/fa";

const socket = io("http://localhost:5000");

export default function Chat() {
  const { user } = useAuth();

  const [chats, setChats] = useState({ peers: [], communities: [] });
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [showChatRoom, setShowChatRoom] = useState(false);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [showModal, setShowModal] = useState(false);

  // Open edit modal
  const handleOpenModal = () => setShowModal(true);

  // Start editing
  const startEdit = (id, text) => {
    setEditingId(id);
    setEditText(text);
    setShowModal(true);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
    setShowModal(false);
  };

  // Save edited message
  const saveEdit = (id) => {
    if (!editText.trim() || !activeChat) return;

    const chatId =
      activeChat.type === "peer"
        ? [user._id, activeChat.peerId].sort().join("-")
        : activeChat.chatId;

    socket.emit("editMessage", {
      id,
      newText: editText,
      chatId,
      chatType: activeChat.type,
    });

    setEditingId(null);
    setEditText("");
    setShowModal(false);
  };

  // Delete message
  const handleDelete = (id) => {
    if (!activeChat) return;

    const chatId =
      activeChat.type === "peer"
        ? [user._id, activeChat.peerId].sort().join("-")
        : activeChat.chatId;

    socket.emit("deleteMessage", {
      id,
      chatId,
      chatType: activeChat.type,
    });
  };

  // Format incoming messages
  const formatMessage = (msg) => {
    if (!user) return msg;
    const senderId = msg.sender?._id || msg.senderId || "";
    const isCurrentUser = user._id.toString() === senderId.toString();

    let displayName;
    if (msg.isAnonymous) {
        displayName = "Anonymous";
    } else if (isCurrentUser) {
        displayName = user.name;
    } else {
        displayName = msg.sender?.name || "User";
    }

    return {
        ...msg,
        senderId,
        isCurrentUser,
        user: displayName,
        time: new Date(msg.time || Date.now()).toLocaleString(),
    };
};

  // Fetch peers and communities
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/user/chat", {
          withCredentials: true,
        });
        const commRes = await axios.get(
          "http://localhost:5000/api/user/chat/communities",
          { withCredentials: true }
        );

        setChats({
          peers: res.data.peers || [],
          communities: commRes.data.communities.map((c) => ({
            ...c,
            chatId: c._id,
          })),
        });
      } catch (error) {
        console.error("Error loading chats: ", error);
        setChats({ peers: [], communities: [] });
      }
    };
    fetchChats();
  }, []);

  // Join chat room and load messages
  useEffect(() => {
    if (!activeChat || !user) return;

    socket.emit("joinRoom", {
      type: activeChat.type,
      userId: user._id,
      peerId: activeChat.peerId,
      communityId: activeChat.type === "community" ? activeChat.chatId : null,
    });

    setMessages([]); // clear old messages

    socket.on("loadMessages", (msgs) => {
      const formatted = msgs.map(formatMessage);
      setMessages(formatted);
    });

    return () => socket.off("loadMessages");
  }, [activeChat, user]);

  // Listen for new messages
  useEffect(() => {
    socket.on("message", (msg) => {
      const formattedMsg = formatMessage(msg);
      setMessages((prev) => [...prev, formattedMsg]);
    });

    return () => socket.off("message");
  }, [activeChat, user]);

  // Listen for edited or deleted messages
useEffect(() => {
  // Edited message
  socket.on("updateMessage", ({ _id, text }) => {
    setMessages(prev =>
      prev.map(msg => (msg._id === _id ? { ...msg, text } : msg))
    );
  });

  // Deleted message
  socket.on("removeMessage", ({ _id }) => {
    setMessages(prev => prev.filter(msg => msg._id !== _id));
  });

  return () => {
    socket.off("updateMessage");
    socket.off("removeMessage");
  };
}, [activeChat]);


  // Send message
  const sendMessage = () => {
    if (!user || !activeChat || !newMessage.trim()) return;

    const chatId =
      activeChat.type === "peer"
        ? [user._id, activeChat.peerId].sort().join("-")
        : activeChat.chatId;

    const msgData = {
      chatType: activeChat.type,
      chatId,
      sender: user._id,
      text: newMessage,
      isAnonymous,
    };

    socket.emit("sendMessage", msgData);
    setNewMessage("");
  };

  // Select chat
  const handleChatSelect = (chat) => {
    setActiveChat(chat);
    setShowChatRoom(true);
  };

  const filteredPeers = chats.peers.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );
  const filteredCommunities = chats.communities.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={style.dashboard}>
      <Nav />
      <div className={style.content}>
        <div className={style.chatContainer}>
          {/* Left Panel */}
          <div
            className={`${style.chatList} ${
              showChatRoom ? style.hideOnMobile : ""
            }`}
          >
            <div className={style.searchCommunity}>
              <form>
                <input
                  type="search"
                  placeholder="Search peers or communities..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button>
                  <FaSearch className={style.searchIcon} />
                </button>
              </form>
            </div>

            <h3>Peers</h3>
            <ul>
              {filteredPeers.map((peer, i) => (
                <li
                  key={peer._id || i}
                  onClick={() =>
                    handleChatSelect({
                      type: "peer",
                      name: peer.name,
                      userId: user._id,
                      peerId: peer._id,
                    })
                  }
                  className={
                    activeChat?.name === peer.name ? style.activeChat : ""
                  }
                >
                  {peer.name}
                </li>
              ))}
            </ul>

            <h3>Communities</h3>
            <ul>
              {filteredCommunities.map((comm, i) => (
                <li
                  key={comm._id || i}
                  onClick={() =>
                    handleChatSelect({
                      type: "community",
                      name: comm.name,
                      chatId: comm._id,
                    })
                  }
                  className={
                    activeChat?.name === comm.name ? style.activeChat : ""
                  }
                >
                  {comm.name}
                </li>
              ))}
            </ul>
          </div>

          {/* Right Panel */}
          <div
            className={`${style.chatRoom} ${
              !showChatRoom ? style.hideOnMobile : ""
            }`}
          >
            {activeChat ? (
              <>
                <div className={style.chatHeader}>
                  <button
                    className={style.backBtn}
                    onClick={() => setShowChatRoom(false)}
                  >
                    <FaArrowLeft />
                    <p>Back</p>
                  </button>

                  <h2>
                    {activeChat.type === "peer"
                      ? "Chat with "
                      : "Community: "}
                    {activeChat.name}
                  </h2>

                  {activeChat.type === "community" && (
                    <div className={style.anonToggleWrapper}>
                      {!isAnonymous ? (
                        <button
                          onClick={() => setIsAnonymous(true)}
                          className={style.anonBtn}
                        >
                          Stay Anonymous
                        </button>
                      ) : (
                        <button
                          onClick={() => setIsAnonymous(false)}
                          className={style.identityBtn}
                        >
                          Show Identity
                        </button>
                      )}
                    </div>
                  )}
                </div>

                <div className={style.messages}>
                  {messages.map((msg, i) => (
                    <div
                      key={msg._id || i}
                      className={`${style.message} ${
                        msg.isCurrentUser
                          ? style.myMessage
                          : style.peerMessage
                      }`}
                    >
                      <strong>{msg.user}</strong>: <br />
                      {msg.text} <br />
                      <small>{msg.time}</small>

                      {msg.isCurrentUser && (
                        <div className={style.msgActions}>
                          <button
                            className={style.editBtn}
                            onClick={() => startEdit(msg._id, msg.text)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className={style.deleteBtn}
                            onClick={() => handleDelete(msg._id)}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {showModal && (
                  <div className={style.modalBackdrop}>
                    <div className={style.modal}>
                      <h2>Edit Message</h2>
                      <form className={style.form}>
                        <label>Message:</label>
                        <input
                          type="text"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                        />
                      </form>
                      <div className={style.modalBtns}>
                        <button
                          onClick={() => saveEdit(editingId)}
                          className={style.saveBtn}
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={cancelEdit}
                          className={style.cancelBtn}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div className={style.inputArea}>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                  />
                  <button onClick={sendMessage}>Send</button>
                </div>
              </>
            ) : (
              <div className={style.noChat}>
                <div className={style.noChatTxt}>
                  <p>Select a peer or community to start chatting</p>
                  <img src="./src/assets/internet.png" alt="No Chat" />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
