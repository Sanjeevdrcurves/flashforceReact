import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // ✅ Import the Quill CSS
import EmojiPicker from "emoji-picker-react";
import FileUploader from "./FileUploader";
import axios from "axios";

const EmailCompose = () => {
    const [emailBody, setEmailBody] = useState("");
    const [attachments, setAttachments] = useState([]);
    const [showPicker, setShowPicker] = useState(false);

    const sendEmail = async () => {
        const formData = new FormData();
        formData.append("body", emailBody);
        attachments.forEach(file => formData.append("attachments", file));
        await axios.post("https://yourbackend.com/api/emails/send", formData);
    };

    return (
        <div style={{ width: "80%", margin: "auto", padding: "20px", background: "#fff" }}>
            <h2>Compose Email</h2>
            <ReactQuill value={emailBody} onChange={setEmailBody} />
            <FileUploader onFilesSelected={setAttachments} />
            <button onClick={sendEmail}>Send Email</button>
        </div>
    );
};

export default EmailCompose;
