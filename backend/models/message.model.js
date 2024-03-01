import mongoose from "mongoose";
import crypto from "crypto";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    encryptedMessage: {
      type: String,
      required: true,
    },
    iv: {
      type: String,
      required: true,
    },
    // createdAt, updatedAt
  },
  { timestamps: true }
);

messageSchema.methods.encryptMessage = function (message, secretKey) {
  const iv = crypto.randomBytes(16); // Generate Initialization Vector
  const cipher = crypto.createCipheriv(
    "aes-256-cbc",
    Buffer.from(secretKey),
    iv
  );
  let encrypted = cipher.update(message);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return {
    encryptedMessage: encrypted.toString("hex"),
    iv: iv.toString("hex"),
  };
};

messageSchema.methods.decryptMessage = function (secretKey) {
  const iv = Buffer.from(this.iv, "hex");
  const encryptedText = Buffer.from(this.encryptedMessage, "hex");
  const decipher = crypto.createDecipheriv(
    "aes-256-cbc",
    Buffer.from(secretKey),
    iv
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};

const Message = mongoose.model("Message", messageSchema);

export default Message;
