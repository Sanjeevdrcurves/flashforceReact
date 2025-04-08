import { useState, useEffect, Fragment } from "react";
import { Mail, Phone, MessageCircle, Send, Search, Paperclip, ChevronDown, ChevronUp, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import EmailView from "./EmailView";

//email compose
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // ✅ Import the Quill CSS
import EmojiPicker from "emoji-picker-react";
//import FileUploader from "./FileUploader";
import { useDropzone } from "react-dropzone";
import { useSelector } from 'react-redux';

import axios from "axios";
import { parseJSON } from "date-fns";

const conversationsTmp = [
  {
    id: 1,
    name: "Anas Ijaz",
    messages: [
      { id: 1, text: "Hello, how can I help you?", type: "sent" },
      { id: 2, text: "I need details about your services.", type: "received" },
      { id: 3, text: "Sure! Here is the information you requested.", type: "sent" },
      { id: 4, text: "Thank to so much.", type: "received" }
    ],
    status: "New",
  },
  {
    id: 2,
    name: "(678) 883-6215",
    messages: [
      { id: 1, text: "Missed call from this number.", type: "received" }
    ],
    status: "Missed",
  },
];

const userDetails = {
  name: "Anas Ijaz",
  email: "anas.ijaz.bhatti@gmail.com",
  phone: "(302) 850-8732",
  owner: "Unassigned",
  followers: ["John Doe", "Jane Smith"],
};

export default function ConversationsView() {
    const API_URL = import.meta.env.VITE_FLASHFORCE_API_URL;
    const [loading, setLoading] = useState(false);
    const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(conversations.length > 0 ? conversations[0] : null);
  const [selectedTab, setSelectedTab] = useState("SMS");
  const [isTabExpanded, setIsTabExpanded] = useState(true);
  const [isUserPanelVisible, setIsUserPanelVisible] = useState(true);
  //const [emails, setEmails] = useState([]);
  const userEmail = 'anas@drcurves.com';
  const userName = 'Flash Force';

  // email compose
  const [emailBody, setEmailBody] = useState("");
  const [attachments, setAttachments] = useState([]);
  //const [showPicker, setShowPicker] = useState(false);
  const [emailDetails, setEmailDetails] = useState({ to: "", subject: "" });
  const [showPicker, setShowPicker] = useState(false);
  const {userId,companyId}=useSelector(state=>state.AuthReducerKey);
  
  useEffect(() => {
        const fetchEmails = async () => {
            try {
              setLoading(true);
                const response = await axios.get(`${API_URL}/email/fetch/${userId}`);
                // Convert emails to conversations
                //const conversations = convertEmailsToConversations(response.data);
                setConversations(convertEmailsToConversations(response.data));
                setLoading(false);
                //setEmails(response.data);
            } catch (error) {
              setLoading(false);
                console.error("Error fetching emails", error);
            }
        };

        fetchEmails();
    }, []);

    function convertEmailsToConversations(emails) {
        const conversationsMap = new Map();
        var tmpUsers = [];
        emails.forEach((email, index) => {
          const senderName = email.sender.split(" <")[0]; // Extract sender's name
            const senderEmail = email.sender.match(/<(.+?)>/); // Extract sender's email
            const senderId = senderEmail ? senderEmail[1] : senderName;

            var key = senderId;
            
            // if email sent
            if(senderId != userEmail)
              tmpUsers[key] = {name:senderName.replaceAll('"',''), email:key}

            
        });
    
        emails.forEach((email, index) => {
            const senderName = email.sender.split(" <")[0]; // Extract sender's name
            const senderEmail = email.sender.match(/<(.+?)>/); // Extract sender's email
            const receiverEmail = email.receiver.match(/<(.+?)>/); // Extract sender's email
            const senderId = senderEmail ? senderEmail[1] : senderName;
            const receiverId = receiverEmail ? receiverEmail[1] : userEmail;
            //console.log("receiver: "+receiverId)
            var key = senderId;
            
            // if email sent
            if(senderId == userEmail)
                key = receiverId;

            if (!conversationsMap.has(key)) {
                conversationsMap.set(key, {
                    id: conversationsMap.size + 1, // Unique ID for each conversation
                    name: tmpUsers[key].name, // Use sender name if available
                    email: key,
                    messages: [],
                    status: "Missed",
                });
            }
            
            // conversationsMap.get(key).messages.push({
            //     id: index + 1,
            //     text: `${email.subject}: ${email.snippet}`, // Format message text
            //     type: senderId == userEmail? "sent" : "received",
            // });
            //debugger;
            conversationsMap.get(key).messages.push({
              id: index + 1, //email.id,
              subject: email.subject,
              sender: email.sender,
              name: senderId == userEmail? userName: tmpUsers[key].name,
              receiver: email.receiver,
              body: email.body, // Full email content in HTML
              attachments: email.attachments || [], // Attachments list
              type: senderId == userEmail? "sent" : "received",
            });
            
        });
        
       // Reverse messages to display recent messages in last 
        var arr = Array.from(conversationsMap.values());
        arr.forEach((item, index) => {
          const messages = item.messages;
          item.messages = messages.reverse();
        });
        //console.log("emails: "+JSON.stringify(arr))
        return arr;
    }

    const onDrop = (acceptedFiles) => {
        setAttachments([...attachments, ...acceptedFiles]);
    };
    const handleEmojiClick = (event, emojiObject) => {
      debugger;
      setEmailBody(emailBody + event.emoji);
  };

  const sendEmail = async () => {
    const subject = "Reply from "+userEmail;

      const formData = new FormData();
    //formData.append("accessToken", accessToken);
    formData.append("type", "GMAIL");
    formData.append("fromEmail", userEmail);
    formData.append("toEmail", userDetails.email);
    formData.append("subject", subject);
    formData.append("body", emailBody);

    attachments.forEach((file) => {
        formData.append("attachments", file);
    });

    try {
        const response = await axios.post(`${API_URL}/email/send-email`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("Email Sent:", response.data);

        //removing html tags e.g. <p> from emailBody
        // const tempDiv = document.createElement("div");
        // tempDiv.innerHTML = emailBody;
        // const cleanedStr = tempDiv.textContent || tempDiv.innerText;

        // Push message to conversation area
        const newId = selectedConversation.messages.length > 0 
            ? Math.max(...selectedConversation.messages.map(msg => msg.id)) + 1 
            : 1;
        const newMessage = {
          // id: newId,
          // text: cleanedStr, 
          // type: "sent" ,

          id: newId, //email.id,
          subject: subject,
          sender: userEmail,
          name: userName,
          receiver: userDetails.email,
          body: emailBody, // Full email content in HTML
          attachments: attachments || [], // Attachments list
          type: "sent",
        };
        selectedConversation.messages.push(newMessage);
        setEmailBody("");
        setAttachments([]);
        alert("Email Sent Successfully!");
    } catch (error) {
        console.error("Error Sending Email:", error);
        alert("Failed to send email.");
    }
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <Fragment>
        <div className="container-fixed ps-1" >
    <div className="flex h-screen bg-gray-100">
      {/* Left Sidebar - Conversations */}
      
      <div className="w-1/4 bg-white p-1 shadow-lg rounded-lg flex flex-col">
        <div className="flex items-center gap-2 mb-4">
          <Search className="text-gray-500" />
          <Input placeholder="Search conversations..." className="w-full" />
        </div>
        {loading ? 'Please wait...' : (
        <div className="space-y-2 overflow-auto">
          {conversations.map((conv) => (
            <Card
              key={conv.id}
              className={`p-3 cursor-pointer hover:bg-gray-200 transition ${selectedConversation?.id === conv.id ? "bg-blue-100" : ""}`}
              onClick={() => setSelectedConversation(conv)}
            >
              <CardContent className="p-2 pt-0 flex justify-between items-center">
                <div className="w-full">
                  <h4 className="font-semibold">{conv.name}</h4>
                  <p className="text-sm text-gray-500 truncate">{conv.messages[conv.messages.length - 1]?.text || "No messages yet"}</p>
                </div>
                {conv.status === "New" && <span className="text-blue-500 font-bold">New</span>}
              </CardContent>
            </Card>
          ))}
        </div>)}
      </div>

      {/* Middle Section - Conversation Content & Messaging Area */}
      <div className="flex-1 bg-white p-1 shadow-lg rounded-lg ml-2 flex flex-col">
        {selectedConversation ? (
          <>
            <h2 className="text-xl font-bold">New Message: {selectedConversation.name}</h2>
            {/* <div className="mt-2 bg-gray-100 p-1 rounded-lg flex-1 overflow-auto">
              {selectedConversation.messages.map((msg) => (
                <div key={msg.id} className={`mb-2 p-1 rounded-lg ${msg.type === "sent" ? "bg-blue-500 self-end ml-auto" : "bg-gray-200 self-start mr-auto"} w-fit max-w-xs`}>
                  {msg.type == "sent" && (<span className="text-sm text-white">You</span>)}
                  <EmailView selectedEmail={msg} />
                </div>
              ))}
            </div> */}
            <div className="mt-2 bg-gray-100 p-1 rounded-lg flex-1 overflow-auto">
              {selectedConversation.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-2 p-1 rounded-lg ${msg.type === "sent" ? "bg-blue-500 self-end ml-auto" : "bg-gray-200 self-start mr-auto"} w-fit max-w-lg`} // ⬅️ Increased `max-w-xs` to `max-w-lg`
                >
                  {msg.type === "sent" && <span className="text-sm text-white">You</span>}
                  <EmailView selectedEmail={msg} />
                </div>
              ))}
            </div>
          </>
        ) : (
          <p className="text-gray-500">Select a conversation to view messages.</p>
        )}

        {/* Tabs for Message Type with Collapse Toggle */}
        <div className="mt-4 flex justify-between border-b items-center">
          <div>
            {['SMS', 'WhatsApp', 'Email'].map((tab) => (
              <button
                key={tab}
                className={`px-4 py-2 font-medium ${selectedTab === tab ? "border-b-2 border-blue-500 text-blue-500" : "text-gray-500"}`}
                onClick={() => setSelectedTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>
          <button onClick={() => setIsTabExpanded(!isTabExpanded)}>
            {isTabExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>

        {/* Collapsible Message Composition Area */}
        {isTabExpanded && selectedConversation && (
          // <div className="overflow-auto max-h-64">
          <div className="overflow-auto">
            {selectedTab === "SMS" && (
              <div className="mt-6 bg-gray-100 p-4 rounded-lg flex flex-col gap-2">
                <label className="text-sm font-medium">To:</label>
                <Input className="mt-1" value={userDetails.phone} disabled />
                <Textarea className="mt-2" placeholder="Type your message..." />
                <div className="flex items-center gap-2 mt-2">
                  <Button className="ml-auto" variant="primary"><Send size={18} /> Send</Button>
                </div>
              </div>
            )}
            {selectedTab === "Email" && (
              // <div className="mt-6 bg-gray-100 p-4 rounded-lg">
              //   <label className="text-sm font-medium">From:</label>
              //   <Input className="mt-1" value="developers@drcurves.com" disabled />
              //   <label className="text-sm font-medium">To:</label>
              //   <Input className="mt-1" value={userDetails.email} disabled />
              //   <label className="text-sm font-medium">Subject:</label>
              //   <Input className="mt-1" placeholder="Enter subject..." />
              //   <Textarea className="mt-2" placeholder="Type your message..." />
              //   <div className="flex items-center gap-2 mt-2">
              //     <Button variant="outline"><Paperclip size={18} /> Attach</Button>
              //     <Button className="ml-auto" variant="primary"><Send size={18} /> Send</Button>
              //   </div>
              // </div>
              <div style={{ padding: "10px" }}>
                  {/* <ReactQuill value={emailBody} onChange={setEmailBody} />
                  <FileUploader onFilesSelected={setAttachments} />
                  <Button className="ml-auto" variant="primary" onClick={sendEmail}><Send size={18} /> Send</Button> */}
                <div className="flex items-center gap-2 mt-2">
                  <label className="text-sm font-medium">To:</label>
                  <input type="email" placeholder="To" onChange={(e) => setEmailDetails({ ...emailDetails, to: e.target.value })} value={userDetails.email} disabled/>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <label className="text-sm font-medium">Subject:</label>
                  <input type="text" placeholder="Subject" onChange={(e) => setEmailDetails({ ...emailDetails, subject: e.target.value })} value="Reply" disabled/>
                </div>
                  
                  
                <button onClick={() => setShowPicker(!showPicker)}>😀</button>
                {showPicker && <EmojiPicker onEmojiClick={handleEmojiClick} />}
                  {/* Rich Text Editor */}
                  <ReactQuill value={emailBody} onChange={setEmailBody} modules={{
                    toolbar: [
                        [{ header: [1, 2, false] }],
                        ["bold", "italic", "underline"],
                        [{ list: "ordered" }, { list: "bullet" }],
                        ["link", "image"]
                    ],
                    clipboard: {
                        matchVisual: false,
                    }
                }}/>

                  {/* File Upload */}
                  <div {...getRootProps()} style={{ border: "1px dashed gray", padding: "20px", marginTop: "10px" }}>
                      <input {...getInputProps()} />
                      <p>Drag & drop attachments here, or click to select files</p>
                  </div>

                  <ul>
                      {attachments.map((file, index) => (
                          <li key={index}>{file.name}</li>
                      ))}
                  </ul>
                  <Button className="ml-auto" variant="primary" onClick={sendEmail}><Send size={18} /> Send</Button>
                  
              </div>
            )}
          </div>
        )}
      </div>

      {/* Right Sidebar - User Details */}
      <div className={`bg-white p-1 shadow-lg rounded-lg ml-4 transition-all ${isUserPanelVisible ? "w-1/4" : "w-0 overflow-hidden"}`}>
        <button onClick={() => setIsUserPanelVisible(!isUserPanelVisible)} className="absolute right-4 top-4">
          {isUserPanelVisible ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
        {isUserPanelVisible && (
          <>
            <h3 className="text-lg font-bold">{userDetails.name}</h3>
            <p className="text-sm text-gray-500">Email: {userDetails.email}</p>
            <p className="text-sm text-gray-500">Phone: {userDetails.phone}</p>
            <p className="text-sm text-gray-500">Owner: {userDetails.owner}</p>
            <p className="text-sm text-gray-500">Followers:</p>
            <ul className="list-disc list-inside text-sm text-gray-500">
              {userDetails.followers.map((follower, index) => (
                <li key={index}>{follower}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
    </div>
    </Fragment>
  );
}
