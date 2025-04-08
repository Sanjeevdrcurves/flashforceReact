import { KeenIcon } from "@/components";
import { Dialog, DialogBody, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

const EmailModal = ({ open, onOpenChange, selectedEmail }) => {
  

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="container-fixed max-w-[900px] flex flex-col p-10 overflow-hidden [&>button]:hidden">
        <DialogHeader className="p-0 border-0">
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
          <div className="flex items-center justify-between flex-wrap grow gap-5 pb-7.5">
            <div className="flex flex-col justify-center gap-2">
              <h1 className="text-xl font-semibold leading-none text-gray-900">Add-on Details</h1>
              
            </div>
            <button className="btn btn-sm btn-light" onClick={onOpenChange}>
              Close
            </button>
          </div>
        </DialogHeader>
        <DialogBody className="scrollable-y py-0 mb-5 ps-0 pe-3 -me-7" >
          <div className="bg-white rounded-lg shadow-md w-full">
            <div className="p-4 overflow-y-auto h-full">
            {selectedEmail ? (
              <div>
                <h3 className="font-bold mb-2">{selectedEmail.Subject}</h3>
                <p className="text-gray-700 mb-2">From: {selectedEmail.Sender}</p>
                <p className="text-gray-500 mb-2">{new Date(selectedEmail.CreatedAt).toLocaleString()}</p>
                <div className="border p-4 bg-gray-50 shadow-sm rounded-lg">
                  {/* <div dangerouslySetInnerHTML={{ __html: selectedEmail.body }} /> */}
                  <iframe
              
              srcDoc={selectedEmail.Body}
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
              </div>
            ) : (
              <p className="text-gray-500">Select an email to view its content</p>
            )}
          </div>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
    
  );
};

export default  EmailModal ;
