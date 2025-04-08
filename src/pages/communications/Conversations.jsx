import { PageNavbar } from "@/pages/account";
import { Toolbar, ToolbarHeading } from "@/partials/toolbar";
import clsx from 'clsx';
import ReactSimplyCarousel from 'react-simply-carousel';

import { KeenIcon } from '@/components';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ContentLoader } from "../../components/loaders/ContentLoader";
dayjs.extend(relativeTime);

const LARAVEL_URL = import.meta.env.VITE_APP_LARAVEL_URL;

const overflowEllipsis = (text, length = 20) => {
  return text.length > length ? text.substr(0, length) + ".." : text;
};

export default function Conversations() {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [currentInstaUser, setCurrentInstaUser] = useState(null);
  const [conversationUser, setConversationUser] = useState(null);
  const [isLoadingConversations, setIsLoadingConversations] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);
  const [lastPageCursor, setLastPageCursor] = useState(null);

  useEffect(() => {
    // Fetch Conversations
    getConversations();
  }, []);

  const getConversations = async (isNextPage = false) => {
    if (isNextPage && !lastPageCursor) return;

    await new Promise((resolve, reject) => {
      fetch(`${LARAVEL_URL}/insta-conversations?cursor=${lastPageCursor}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data.data);
          setConversations(data.conversations.data);
          setCurrentInstaUser(data.currentInstaUser);
          data?.conversations?.data[0] && handleConversationClick(data.conversations.data[0], data.currentInstaUser);
          setIsLoadingConversations(false);
          setLastPageCursor(data.conversations.paging?.cursors?.after);
          resolve();
        }).catch((error) => {
          reject(error);
        });
    });
  };

  const handleConversationClick = async (conversation, currentUser = currentInstaUser) => {
    if (!conversation || conversation.id === activeConversation?.id) return;

    console.log(conversation);
    setIsLoadingMessages(true);
    setActiveConversation(conversation);
    setMessages([]);
    setConversationUser(null);

    const conversationParticipantId = conversation.participants.data.find(
      (participant) => participant.username !== currentUser.username
    ).id;

    // Fetch Messages
    fetch(
      `${LARAVEL_URL}/insta-messages?conversationId=${conversation.id}&conversationUserId=${conversationParticipantId}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data.messages);
        setMessages(data.messages.data.reverse().filter(msg => msg.message || msg.attachments));
        setConversationUser(data.conversationUser);
        setIsLoadingMessages(false);
      });
  };

  return (
    <>
      <PageNavbar />
      <div className="container-fixed">
        <Toolbar>
          <ToolbarHeading>
            <h1 className="text-xl font-medium leading-none text-gray-900">
              Communication Screen
            </h1>
            <div
              className="flex items-center gap-2 text-sm font-normal text-gray-700"
              id="BillingEnterprisePage"
            >
              <div className="flex items-center gap-2 text-sm font-medium">
                <span className="text-gray-800 font-medium">
                  Enhance Workflows with Advanced Integrations.
                </span>
              </div>
            </div>
          </ToolbarHeading>
        </Toolbar>

        <div className="card min-w-full">
          <div className="grid grid-cols-[3fr_6fr_3fr]">
            <div className="border-r border-r-gray-200 dark:lg:border-r-gray-100">
              <ConversationsList
                isLoadingConversations={isLoadingConversations}
                isLoadingMessages={isLoadingMessages}
                conversations={conversations}
                handleConversationClick={handleConversationClick}
                activeConversation={activeConversation}
                loadMore={getConversations}
              />
            </div>
            <div>
              <Messages
                isLoadingMessages={isLoadingMessages}
                messages={messages}
                conversationUser={conversationUser}
                currentInstaUser={currentInstaUser}
                handleMsgSend={(msg) => {
                  setMessages([...messages, msg]);
                }}
              />
            </div>
            <div className="border-l border-l-gray-200 dark:lg:border-l-gray-100">
              <ContactInfo
                conversationUser={conversationUser}
                currentInstaUser={currentInstaUser}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

const ConversationsList = ({ 
  isLoadingConversations,
  isLoadingMessages,
  conversations,
  activeConversation,
  handleConversationClick,
  loadMore,
}) => {
  const [checkedConversations, setCheckedConversations] = useState([]);
  const loaderRef = useRef();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        console.log('Load more conversations');
        loadMore(true);
      }
    }, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    });

    const element = loaderRef.current;

    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, []);

  return (
    <>
      <div className="border-b border-b-gray-200 dark:lg:border-b-gray-100">
        <h3 className="card-title px-7 py-5 flex items-center"><KeenIcon icon='directbox-default' className='mr-2' /> Conversations</h3>
      </div>
      <div className="h-[calc(100vh-400px)] overflow-y-auto">
        {conversations?.map((conversation) => (
          <div 
            className={clsx("flex items-center gap-1 lg:gap-2.5 w-full px-7 py-4 cursor-pointer group hover:pl-2", {
              'border-b border-b-gray-200 dark:border-b-gray-100': true,
              'bg-primary-light dark:bg-primary-lighter border-r-3 border-r-blue-600': activeConversation?.id === conversation.id,
              'pl-2': checkedConversations.length > 0,
              'disabled:opacity-50 cursor-not-allowed': isLoadingMessages,
            })} 
            key={conversation.id}
            onClick={() => !isLoadingMessages && handleConversationClick(conversation)}
          >
            <input type="checkbox" className={clsx("form-checkbox h-4 w-4 hidden group-hover:block", {
              '!block': checkedConversations.length > 0,
            })} 
              checked={checkedConversations.includes(conversation.id)}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => {
                e.stopPropagation();
                if (e.target.checked) {
                  setCheckedConversations([...checkedConversations, conversation.id]);
                } else {
                  setCheckedConversations(checkedConversations.filter((id) => id !== conversation.id));
                }
              }}
            />
            <div className="flex items-center gap-0">
              <div className="font-semibold rounded-full p-4 bg-gray-200 dark:bg-gray-100 w-10 h-10 flex items-center justify-center">
                {conversation.name.split(" ").map((word) => word[0]).join("").substr(0, 2)}
              </div>
              <KeenIcon icon='instagram' style='' className="text-[#E1306C] text-[10px] p-1 bg-gray-100 rounded-full ml-[-11px] mt-3" />
            </div>
            <div className="flex flex-col gap-1 w-full">
              <div className="flex items-center justify-between gap-1 w-full">
                <span className='text-sm font-semibold text-gray-900 overflow-ellipsis'>
                  {overflowEllipsis(conversation.name, 15)}
                </span>
                <span className="text-xs text-gray-700 font-medium">
                  {dayjs().to(dayjs(conversation.updated_time))}
                </span>
              </div>
              <p className="text-xs">{overflowEllipsis(conversation.messages?.data[0]?.message, 30)}</p>
            </div>
          </div>
        ))}
        <div id='conversation-loader' ref={loaderRef}>
          {isLoadingConversations && <div className="flex items-center justify-center mt-8"><ContentLoader /></div>}
        </div>
      </div>
    </>
  );
};

const Messages = ({
  isLoadingMessages,
  messages,
  conversationUser,
  currentInstaUser,
  handleMsgSend,
}) => {
  
  const ref = useRef();

  useEffect(() => {
    ref.current.scrollTop = ref.current.scrollHeight;
  }, [messages]);

  return (
    <>
      <div>
        <div className="border-b border-b-gray-200 dark:lg:border-b-gray-100">
          <h3 className="card-title px-7 py-5 flex items-center"><KeenIcon icon='messages' className='mr-2' /> {conversationUser?.name || 'Messages'}</h3>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2 p-7 h-[calc(100vh-400px)] overflow-y-auto" ref={ref}>
          {isLoadingMessages && <div className="flex items-center justify-center mt-5"><ContentLoader /></div>}
            {messages?.filter(msg => msg.message || msg.attachments).map((message, idx) => (
              <div
                key={message.id}
                className={`flex gap-2 ${
                  message.from?.id === conversationUser.id
                    ? "justify-start"
                    : "justify-end"
                }`}
              >
                <div className="flex flex-col gap-1 max-w-[70%]">
                  <div className={clsx("flex items-end gap-2", {
                    'flex-row-reverse': message.from?.id !== conversationUser.id,
                  })}>
                    <div className="flex items-center">
                      <img 
                        src={message.from?.id === conversationUser.id ? conversationUser.profile_pic : currentInstaUser.profile_pic}
                        alt={message.from?.id === conversationUser.id ? conversationUser.name : currentInstaUser.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <KeenIcon icon='instagram' style='' className="text-[#E1306C] text-[10px] p-1 bg-gray-100 rounded-full ml-[-5px] mt-3" />
                    </div>
                    <div
                      className={`rounded-lg text-white ${
                        !message.attachments ? (message.from?.id === conversationUser.id ? "bg-gray-500 p-3" : "bg-blue-500 p-3") : ''
                      }`}
                    >
                      {!message.attachments && <p className="text-left">{message.message}</p>}
                      {message.attachments && <AttachmentMsg message={message} />}
                    </div>
                  </div>
                  {(!messages[idx + 1] ||
                    dayjs().to(dayjs(messages[idx + 1].created_time)) !==
                      dayjs().to(dayjs(message.created_time))) && (
                    <span
                      className={`text-xs ${
                        message.from?.id === conversationUser.id
                          ? "self-start"
                          : "self-end"
                      }`}
                    >
                      {dayjs().to(dayjs(message.created_time))}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Reply 
            conversationUser={conversationUser}
            currentInstaUser={currentInstaUser}
            onSendMsg={msgData => {
              handleMsgSend(msgData);
              ref.current.scrollTop = ref.current.scrollHeight;
            }}
          />
        </div>
      </div>
    </>
  );
};

const AttachmentMsg = ({message}) => {

  if (message.attachments.data[0].image_data) {
    return <ImageAttachmentMsg message={message} />;
  } else if (message.attachments.data[0].video_data) {
    return <VideoAttachmentMsg message={message} />;
  }
};

const ImageAttachmentMsg = ({message}) => {
  const imgData = message.attachments.data[0].image_data;

  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  return <>
    <div className="flex justify-center items-center">
      <img 
        {...imgData}
        src={imgData.preview_url}
        className="rounded-xl cursor-pointer"
        onClick={() => {
          setIsFullscreen(!isFullscreen);
          setActiveSlideIndex(0);
        }}
      />
      {message.attachments.data?.length > 1 && <p className="text-gray-900 ml-2">+{message.attachments.data?.length - 1}</p>}
    </div>

    {isFullscreen && <div className="fixed inset-0 z-50 bg-black bg-opacity-90 h-screen w-screen">
      <div className="absolute top-[40px] right-[40px] p-2 z-10"
        onClick={() => setIsFullscreen(false)}
      >
        <KeenIcon
          icon="cross" 
          className="text-white cursor-pointer"
        />
      </div>
      <div>
        <ReactSimplyCarousel
          activeSlideIndex={activeSlideIndex}
          onRequestChange={setActiveSlideIndex}
          itemsToShow={1}
          centerMode={true}
          infinite={true}
          itemsListProps={{
            // className: 'w-screen h-screen',
          }}
          responsiveProps={[
            { minWidth: 0, itemsToShow: 1 },
            { minWidth: 768, itemsToShow: 1 },
            { minWidth: 1024, itemsToShow: 1 },
            { minWidth: 1280, itemsToShow: 1 },
            { minWidth: 1536, itemsToShow: 1 },
          ]}
          forwardBtnProps={{
            style: {
              position: 'absolute',
              right: 40,
              top: '50%',
              transform: 'translateY(-50%)',
              alignSelf: 'center',
              background: 'black',
              border: 'none',
              borderRadius: '50%',
              color: 'white',
              cursor: 'pointer',
              fontSize: '20px',
              height: 30,
              lineHeight: 1,
              textAlign: 'center',
              width: 30,
              zIndex: 50,
            },
            children: <KeenIcon icon="right" className={clsx('text-gray-500')} />,
          }}
          backwardBtnProps={{
            style: {
              position: 'absolute',
              left: 40,
              top: '50%',
              transform: 'translateY(-50%)',
              alignSelf: 'center',
              background: 'black',
              border: 'none',
              borderRadius: '50%',
              color: 'white',
              cursor: 'pointer',
              fontSize: '20px',
              height: 30,
              lineHeight: 1,
              textAlign: 'center',
              width: 30,
              zIndex: 50,
            },
            children: <KeenIcon icon="left" className={clsx('text-gray-500')} />,
          }}
        >
          {message?.attachments?.data?.map((attachment, idx) => <div key={idx} className="w-[90vw] h-[90vh] flex items-center justify-center">
            <img 
              key={idx} 
              src={attachment.image_data.url} 
              className="max-h-full max-w-full"
            />
          </div>)}
        </ReactSimplyCarousel>
      </div>
    </div>}
  </>
};

const VideoAttachmentMsg = ({message}) => {

  return <video 
    controls
    src={message.attachments.data[0].video_data.url}
    className="max-h-64 rounded-xl"
  />
};

const ContactInfo = ({ conversationUser }) => {
  return (
    <>
      <div className="border-b border-b-gray-200 dark:lg:border-b-gray-100">
        <h3 className="card-title px-7 py-5 flex items-center"><KeenIcon icon='user-square' className='mr-2' /> Contact Info</h3>
      </div>
      <div className="p-7">
        <div className="flex gap-2">
          {!!conversationUser?.profile_pic && (
            <img
              src={conversationUser?.profile_pic}
              alt={conversationUser?.name}
              className="w-20 h-20 rounded-full border-2 border-success image-input-empty:border-gray-300"
            />
          )}
          <div>
            <h4 className="text-xl font-medium text-gray-900">
              {conversationUser?.name}
            </h4>
            {!!conversationUser?.username && <Link 
              to={`https://instagram.com/${conversationUser?.username}`} 
              className="text-xs text-primary flex items-center"
              target="_blank"
            >
              <KeenIcon icon='instagram' className='mr-1' /> {conversationUser?.username}
            </Link>}
            {conversationUser && <span className="text-xs flex items-center mt-3">
              <KeenIcon icon='user-tick' className='mr-1' /> 
              {conversationUser?.is_user_follow_business && <span>Follows you</span>}
              {!conversationUser?.is_user_follow_business && <span>{"Doesn't follow you"}</span>}
            </span>}
          </div>
        </div>
      </div>
    </>
  );
};


const Reply = ({
  conversationUser,
  currentInstaUser,
  onSendMsg
}) => {
  const [msg, setMsg] = useState(null);
  const [file, setFile] = useState(null);
  const [fileType, setFileType] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [clearCount, setClearCount] = useState(0);

  useEffect(() => {
    if (file) {
      setMsg(`[Attachment] ${file.name}`);
    } else {
      setMsg("");
    }
  }, [file]);

  const handleFileChange = (file, type) => {
    // check if file size >= 25mb, then return
    if (file.size > 25 * 1024 * 1024) {
      alert('Max file size allowed is 25MB');
      setClearCount(clearCount + 1);
      return;
    }

    setFile(file);
    setFileType(type);
  };

  const handleSendMessage = async () => {
    if (!msg && !file) return;

    setIsLoading(true);
    const formData = new FormData();
    if (file) {
      formData.append("file", file);
      formData.append('type', fileType);
    } else {
      formData.append("message", msg);
    }

    formData.append("recipientId", conversationUser.id);

    const response = await fetch(`${LARAVEL_URL}/insta-message`, {
      method: "POST",
      body: formData,
    });
    const data = await response.json();
    console.log(data);

    if (data.message_id) {
      const msgData = {
        message: msg,
        from: currentInstaUser?.id,
        created_time: new Date().toISOString(),
      };
      if (file) {
        if (fileType === 'image') {
        msgData.attachments = {
            data: [
              {
                image_data: {
                  preview_url: URL.createObjectURL(file),
                  url: URL.createObjectURL(file),
                },
              },
            ]
          }
        } else if (fileType === 'video') {
          msgData.attachments = {
            data: [
              {
                video_data: {
                  url: URL.createObjectURL(file),
                },
              },
            ]
          }
        }
      }

      onSendMsg(msgData);
      setMsg("");
      setFile(null);
    }

    setIsLoading(false);
  };

  return <div className="flex flex-col items-start gap-2 border-t border-t-gray-200 dark:lg:border-t-gray-100 p-7">
    <input
      type="text"
      placeholder="Type a message..."
      className="flex-grow border border-gray-200 rounded-lg p-2"
      value={msg}
      onChange={(e) => setMsg(e.target.value)}
      disabled={isLoading || file}
    />
    <div className="flex items-center gap-2">
      <button
        className="btn btn-primary"
        onClick={handleSendMessage}
        disabled={(!msg && !file) || isLoading}
      >
        Send
      </button>
      <button
        className="btn btn-outline btn-danger"
        onClick={() => {
          setMsg("");
          setFile(null);
          setFileType(null);
          setClearCount(clearCount + 1);
        }}
        disabled={(!msg && !file) || isLoading}
      >
        Clear
      </button>
      <AttachmentReply
        type='image'
        icon='picture'
        accept=".png, .jpg, .jpeg, .gif"
        setFile={handleFileChange}
        clearCount={clearCount}
      />
      <AttachmentReply
        type='video'
        icon='phone'
        accept=".mp4, .ogg, .avi, .mov, .webm"
        setFile={handleFileChange}
        clearCount={clearCount}
      />
      <AttachmentReply
        type='video'
        icon='speaker'
        accept=".aac, .m4a, .wav, .mp4"
        setFile={handleFileChange}
        clearCount={clearCount}
      />
      <span></span>
    </div>
  </div>;
};

const AttachmentReply = ({
  type,
  icon,
  accept,
  setFile,
  clearCount,
}) => {

  const ref = useRef();

  useEffect(() => {
    ref.current.value = '';
  }, [clearCount]);

  return <>
    <input
      ref={ref}
      type="file"
      accept={accept}
      className="hidden"
      onChange={(e) => setFile(e.target.files[0], type)}
    />
    <KeenIcon 
      icon={icon} 
      className="text-xl menu-toggle btn btn-icon btn-icon-lg size-9 rounded-full hover:bg-primary-light hover:text-primary dropdown-open:bg-primary-light dropdown-open:text-primary text-gray-500" onClick={() => ref.current.click()} 
      title={`Attach ${type}`}
    />
  </>
};

