import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req,res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const {message} = req.body;

        let gotConversation = await Conversation.findOne({
            participants:{$all : [senderId, receiverId]},
        });

        if(!gotConversation){
            gotConversation = await Conversation.create({
                participants:[senderId, receiverId]
            })
        };
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });
        if(newMessage){
            gotConversation.messages.push(newMessage._id);
        };
        

        await Promise.all([gotConversation.save(), newMessage.save()]);
         
        // SOCKET IO
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        return res.status(201).json({
            newMessage
        })
    } catch (error) {
        console.log(error);
    }
}
export const getMessage = async (req,res) => {
    try {
        const receiverId = req.params.id;
        const senderId = req.id;
        const conversation = await Conversation.findOne({
            participants:{$all : [senderId, receiverId]}
        }).populate("messages"); 
        return res.status(200).json(conversation?.messages);
    } catch (error) {
        console.log(error);
    }
}

export const deleteMessage = async (req, res) => {
    try {
      const userId = req.id;
      const messageId = req.params.id;
  
      const message = await Message.findById(messageId);
  
      if (!message) {
        return res.status(404).json({ success: false, message: "Message not found" });
      }
  
      if (message.senderId.toString() !== userId  ) {
        return res.status(403).json({ success: false, message: "you are not owner for thi message" });
      }
  
      await Conversation.updateOne(
        { participants: { $all: [message.senderId, message.receiverId] } },
        { $pull: { messages: messageId } }
      );
  
      await Message.findByIdAndDelete(messageId);
  
     
     
     
      const receiverSocketId = getReceiverSocketId(message.receiverId.toString());
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("messageDeleted", { messageId });
      }
  
     
      res.status(200).json({
        success: true,
        message: "Message deleted successfully",
        messageId
      });
    } catch (error) {
      console.error("Delete message error:", error);
      res.status(500).json({ success: false, message: "Server error" });
    }
  };

  export const editMessage = async (req, res) => {
    try {
        const userId = req.id;
        const messageId = req.params.id;
        const { message } = req.body;

        const messagedata = await Message.findById(messageId);

        if (!messagedata) {
            return res.status(404).json({ error: "Message not found" });
        }

        if (messagedata.senderId.toString() !== userId) {
            return res.status(403).json({ error: "You can only edit your own messages" });
        }

        messagedata.message = message;
        messagedata.updatedAt = new Date();

        await messagedata.save();

        const receiverSocketId = getReceiverSocketId(messagedata.receiverId);
        if (receiverSocketId) {
            io.to(receiverSocketId).emit("messageEdited", {
                _id: messagedata._id,
                message: messagedata.message,
                updatedAt: messagedata.updatedAt
            });
        }

        return res.status(200).json({ message: "Message updated successfully" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Server error" });
    }
};
