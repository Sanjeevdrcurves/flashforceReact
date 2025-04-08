import React, { useRef, useEffect, useState } from "react";
import DOMPurify from "dompurify";
import "./communication.css";


const EmailView = ({ selectedEmail }) => {
  const iframeRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    
    const adjustIframeSize = () => {
      setTimeout(() => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
          const iframeDocument = iframeRef.current.contentWindow.document;
          const body = iframeDocument.body;

          if (body) {
            // Adjust height dynamically
            var h = parseInt(body.scrollHeight);
            //adding 20 px for proper adjustment
            h = h+35;
            iframeRef.current.style.height = h + "px";

            // Set minimum width to prevent squeezing
            const contentWidth = body.scrollWidth;
            iframeRef.current.style.width = contentWidth + "px"; 

            // Optional: Prevent it from overflowing parent container
            iframeRef.current.style.maxWidth = "100%";
          }
        }
      }, 100); // Timeout ensures images and other content load properly
    };

    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener('load', adjustIframeSize);
    }

    return () => {
      if (iframe) {
        iframe.removeEventListener('load', adjustIframeSize);
      }
    };
  }, [isExpanded]);

  if (!selectedEmail) {
    return <div>Select an email to view</div>;
  }

  return (
    <div className="mt-2 bg-gray-100 p-1 rounded-lg flex-1 overflow-auto">
      {/* <h2 className="text-lg font-bold">{selectedEmail.subject}</h2>
      <p className="text-sm text-gray-600">{selectedEmail.sender} → {selectedEmail.receiver}</p> */}

      {/* Email Header */}
      <div className="flex justify-between items-center gap-2">
        <div>
        <span className="text-sm font-bold">{selectedEmail.name}</span>
        <span className="ms-2 text-sm text-gray-600">{selectedEmail.subject}</span>
        </div>
        
        <button
          className="btn btn-sm btn-light transition"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <i className={`ki-duotone ${isExpanded ? "ki-down" : "ki-up"}`}></i>
          {/* {isExpanded ? "Collapse" : "Expand"} */}
        </button>
      </div>

      {/* Collapsible Iframe Container */}
      {/* Render rich email content */}
      {/* important note: react global css styling are leaking here.  */}
      {/* <div className="tableNoBorder">
        <div 
          className="mt-2 p-2 bg-white shadow rounded-lg max-w-2xl"
          // dangerouslySetInnerHTML={{ __html: selectedEmail.body }} 
          dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(selectedEmail.body) }} 

          style={{
            all: 'initial', // Reset global styles
            fontFamily: 'inherit', // Keep original email font
            display: 'block',
          }}
        />
      </div> */}
      
      {/* <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
        <iframe
          ref={iframeRef}
          srcDoc={selectedEmail.body}
          style={{
            border: "none",
            display: "block",
            width: "100%",
            'min-width': '300px',
            aspectRatio: "16/9", // Ensures aspect ratio consistency
            maxWidth: "100%",
          }}
          title="Email Preview"
        />
      </div> */}
      {isExpanded && (
        <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <iframe
            ref={iframeRef}
            srcDoc={selectedEmail.body}
            style={{
              border: "none",
              display: "block",
              width: "100%",
              minWidth: "300px",
              aspectRatio: "16/9",
              maxWidth: "100%",
              transition: "height 0.3s ease-in-out", // Smooth expand/collapse effect
            }}
            title="Email Preview"
          />
        </div>
      )}
      {/* Display attachments */}
      {selectedEmail.attachments?.length > 0 && (
        <div className="mt-4">
          <h3 className="text-md font-semibold">Attachments:</h3>
          <ul>
            {selectedEmail.attachments.map((attachment, index) => (
              <li key={index}>
                <a
                  href={`data:${attachment.mimeType};base64,${attachment.data}`}
                  download={attachment.filename}
                  className="text-blue-600 hover:underline"
                >
                  {attachment.filename}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default EmailView;
