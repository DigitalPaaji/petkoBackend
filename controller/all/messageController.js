import Message from "../../model/messageModel.js";

export const createMessage = async (req, res) => {
  try {
    const { name, email, number, product_id, message } = req.body;

    // 1️⃣ Validate required fields
    if (!name || !email || !number || !product_id || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields (name, email, number, product_id, message) are required.",
      });
    }

    // 2️⃣ Create new message
    const newMessage = await Message.create({
      name,
      email,
      number,
      product_id,
      message,
    });

    // 3️⃣ Send success response
    return res.status(201).json({
      success: true,
      message: "Message created successfully.",
    });

  } catch (error) {
    console.error("Error creating message:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};


export const getAllMessage = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 }).populate("product_id"); // newest first

    return res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Validate message ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Message ID is required.",
      });
    }

    // 2️⃣ Find message
    const message = await Message.findById(id);
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    // 3️⃣ Delete message
    await Message.deleteOne({ _id: id });

    // 4️⃣ Respond success
    return res.status(200).json({
      success: true,
      message: "Message deleted successfully.",
    });

  } catch (error) {
    console.error("Error deleting message:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};

export const seenMessage = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Validate message ID
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Message ID is required.",
      });
    }

    // 2️⃣ Find and update message
    const message = await Message.findByIdAndUpdate(
      id,
      { read: true },
      { new: true } // returns updated document
    );

    // 3️⃣ Check if message exists
    if (!message) {
      return res.status(404).json({
        success: false,
        message: "Message not found.",
      });
    }

    // 4️⃣ Success response
    return res.status(200).json({
      success: true,
      message: "Message marked as read successfully.",
    });

  } catch (error) {
    console.error("Error marking message as read:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error.",
      error: error.message,
    });
  }
};
