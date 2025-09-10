import userModel from "../models/userModel.js";
import messageModel from "../models/messageModel.js";

export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("New Client connected: ", socket.id);

    // Join room
    socket.on("joinRoom", async ({ type, userId, peerId, communityId }) => {
      try {
        let roomName;
        let chatId;

        if (type === "peer") {
          roomName = [userId, peerId].sort().join("-");
          chatId = roomName; // saved in DB as chatId
        } else {
          roomName = `community-${communityId}`;
          chatId = communityId; // save as plain _id in DB
        }

        socket.join(roomName);

        const msgs = await messageModel
          .find({ chatType: type, chatId })
          .populate("sender", "name")
          .sort({ createdAt: 1 })
          .lean();

        const formattedMsgs = msgs.map((m) => ({
          _id: m._id,
          sender: m.sender,
          text: m.text,
          time: new Date(m.createdAt).toISOString(),
          isAnonymous: m.isAnonymous,
        }));

        socket.emit("loadMessages", formattedMsgs);
      } catch (error) {
        console.error("Error loading messages:", error);
      }
    });

    // Send message
    socket.on("sendMessage", async ({ chatType, chatId, sender, text, isAnonymous }) => {
      try {
        const userDoc = await userModel.findById(sender);

        const newMsg = await messageModel.create({
          chatType,
          chatId,
          sender,
          text,
          isAnonymous,
        });

        const fullMsg = {
          _id: newMsg._id,
          sender: { _id: userDoc._id, name: userDoc.name },
          user: isAnonymous ? "Anonymous" : userDoc.name,
          text,
          time: new Date(newMsg.createdAt).toLocaleString(),
          isAnonymous,
        };

        const roomName = chatType === "peer" ? chatId : `community-${chatId}`;
        io.to(roomName).emit("message", fullMsg);
      } catch (error) {
        console.error("Error saving message: ", error);
      }
    });

    // Edit message
    socket.on("editMessage", async ({ id, newText, chatId, chatType }) => {
      try {
        const msg = await messageModel.findById(id);
        if (!msg) return;

        msg.text = newText;
        await msg.save();

        const roomName = chatType === "peer" ? chatId : `community-${chatId}`;
        io.to(roomName).emit("updateMessage", { _id: id, text: newText });
      } catch (error) {
        console.error("Error editing message:", error);
      }
    });

    // Delete message
    socket.on("deleteMessage", async ({ id, chatId, chatType }) => {
      try {
        await messageModel.findByIdAndDelete(id);

        const roomName = chatType === "peer" ? chatId : `community-${chatId}`;
        io.to(roomName).emit("removeMessage", { _id: id });
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected: ", socket.id);
    });
  });
};
