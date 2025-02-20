"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { db } from "../config/Firebase/FirebaseConfig";
import { useTranslations } from "next-intl";
import InfiniteScroll from "react-infinite-scroll-component";

import {
  collection,
  query,
  onSnapshot,
  doc,
  getDoc,
  setDoc,
  arrayUnion,
  orderBy,
  limit,
  startAfter,
} from "firebase/firestore";
import moment from "moment";
import LoaderSpinner from "../components/Spinner";
import { useSelector } from "react-redux";

interface Message {
  id: string;
  text: string;
  timestamp: number;
  senderId: string;
  senderName: string;
  senderStatus: string;
}

interface User {
  id: string;
  name: string;
  status: string;
  lastMessage: string;
  lastMessageTimestamp?: number;
}

const ChatInterface: React.FC = () => {
  const t = useTranslations("chats");
  const searchData = useSelector((state: any) => state.search.search);
  const [users, setUsers] = useState<User[]>([]);
  const [allusers , setAllUsers]= useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showChat, setShowChat] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ userId: string } | null>(
    null
  );
  const [lastVisible, setLastVisible] = useState<any>(null);
  const [messageLength, setMessageLength] = useState<number>(0);
  const [chatId, setChatId] = useState("");

  

  useEffect(() => {
    const user = localStorage.getItem("currentUser");
    if (user) {
      setCurrentUser(JSON.parse(user));
    }
  }, []);

  const senderId = currentUser?.userId;

  // Fetch chat list with user name and status
  useEffect(() => {
    const fetchChatList = async () => {
      const chatsRef = collection(db, "chats");
      const q = query(chatsRef);

      const unsubscribeChats = onSnapshot(q, async (snapshot) => {
        const chatUserIds = snapshot.docs.map((chatDoc) => chatDoc.id);

        const unsubscribeUsers = onSnapshot(
          collection(db, "users"),
          (userSnapshot) => {
            const fetchedUsers: User[] = userSnapshot.docs
              .filter((userDoc) => chatUserIds.includes(userDoc.id))
              .map((userDoc) => {
                const userData = userDoc.data();
                const chatData = snapshot.docs
                  .find((chatDoc) => chatDoc.id === userDoc.id)
                  ?.data();

                return {
                  id: userDoc.id,
                  name: userData.fullName || "Unknown",
                  status: userData.online ? "online" : "offline",
                  lastMessage: chatData?.lastMessage?.text || "",
                  lastMessageTimestamp:
                    chatData?.lastMessage?.timestamp || null,
                };
              });

            // Sort users by the last message timestamp (most recent first)
            fetchedUsers.sort(
              (a, b) =>
                (b.lastMessageTimestamp || 0) - (a.lastMessageTimestamp || 0)
            );

            setUsers(fetchedUsers);
            setAllUsers(fetchedUsers);
          }
        );

        return () => unsubscribeUsers();
      });

      return () => unsubscribeChats();
    };

    fetchChatList();
  }, []);
 

  

  useEffect(() => {
    if (searchData.trim() !== "") {
      const formattedSearchData = searchData.trim().toLowerCase();
  
      const filterData = allusers.filter(
        (data: any) =>
          data.name && data.name.toLowerCase().includes(formattedSearchData)
      );
  
      setUsers(filterData);
    } else {
      setUsers(allusers);
    }
  }, [searchData]);
  



  const fetchMessages = useCallback(() => {
    if (selectedUser) {
      const chatRef = doc(db, "chats", selectedUser.id);

      const unsubscribe = onSnapshot(chatRef, (docSnapshot) => {
        if (docSnapshot.exists()) {
          const allMessages = docSnapshot.data().messages || [];

          console.log("Fetched Messages:", allMessages);

          setMessages(allMessages);
        } else {
          console.log("No document found for this chat.");
          setMessages([]);
        }
      });

      return () => unsubscribe();
    }
  }, [selectedUser]);


  const fetchMore = () => {
    if (selectedUser && hasMore) {
      const chatRef = doc(db, "chats", selectedUser.id);

      getDoc(chatRef).then((docSnapshot) => {
        if (docSnapshot.exists()) {
          // Retrieve and sort messages by timestamp
          const allMessages = (docSnapshot.data().messages || []).sort(
            (a: any, b: any) => a.timestamp - b.timestamp // Sort in ascending order of timestamp
          );

          // Determine the starting point for fetching more messages
          const startIndex =
            allMessages.findIndex((msg: any) => msg.id === lastVisible.id) - 20;
          const validStartIndex = Math.max(startIndex, 0); // Ensure the index is not negative
          const additionalMessages = allMessages.slice(
            validStartIndex,
            validStartIndex + 20
          );

          // Append messages intelligently to avoid duplicates
          setMessages((prevMessages) => {
            const newUniqueMessages = additionalMessages.filter(
              (msg: any) =>
                !prevMessages.some((prevMsg) => prevMsg.id === msg.id)
            );
            return [...prevMessages, ...newUniqueMessages.reverse()];
          });

          // Update lastVisible to the last message in the newly fetched batch
          if (additionalMessages.length > 0) {
            setLastVisible(additionalMessages[0]); // First message in the batch is now the last visible
          }

          // Update hasMore to indicate if more messages are available
          setHasMore(validStartIndex > 0);
        }
      });
    }
  };

  

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  const handleScroll = () => {
    if (hasMore) {
      fetchMessages(); // Fetch more messages as user scrolls
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedUser || !senderId) return;

    try {
      const senderDetails = await fetchSenderDetails(senderId);

      const message: Message = {
        id: `${selectedUser.id}`,
        text: newMessage.trim(),
        senderId,
        timestamp: Date.now(),
        senderName: senderDetails.fullName,
        senderStatus: senderDetails.status,
      };

      const chatId = [senderId, selectedUser.id].sort().join("_");
      const chatRef = doc(db, "chats", selectedUser.id);

      await setDoc(
        chatRef,
        {
          messages: arrayUnion(message),
          lastMessage: {
            text: newMessage.trim(),
            timestamp: Date.now(),
          },
        },
        { merge: true }
      );

      setNewMessage("");
    } catch (error) {
      console.error((t('Error sending message')), error);
    }
  };

  const reversedMessages = messages.slice().reverse();

  const fetchSenderDetails = async (senderId: string) => {
    try {
      const senderRef = doc(db, "users", senderId);
      const senderDoc = await getDoc(senderRef);

      if (senderDoc.exists()) {
        const senderData = senderDoc.data();
        return {
          fullName: senderData.fullName || "Unknown",
          status: senderData.online ? "online" : "offline",
          sender: senderId,
        };
      } else {
        console.error(t("Sender_not_found"));
        return { fullName: "Unknown", status: "offline" };
      }
    } catch (error) {
      console.error((t('Error fetching sender details')), error);
      return { fullName: "Unknown", status: "offline" };
    }
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to the bottom of the messages
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleUserSelect = (user: User) => {
    const userRef = doc(db, "users", user.id);

    // Listen to changes in the selected user's data
    const unsubscribe = onSnapshot(userRef, (docSnapshot) => {
      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();

        setSelectedUser({
          id: user.id,
          name: userData.fullName || "Unknown",
          status: userData.online ? "online" : "offline",
          lastMessage: userData.lastMessage?.text || "",
        });
      } else {
        console.error(t('Selected_user_not_exist'));
      }
    });

    // Optionally manage cleanup for previous listeners if required
    return () => unsubscribe();
  };

  // Send message when click on enter
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      buttonRef.current?.click();
    }
  };

  return (
    <div className="flex h-screen">
      {/* Chat List */}
      <div
        className={`${
          showChat ? "hidden" : "block"
        } w-full md:w-1/3 lg:w-1/4 bg-white shadow-lg border-r md:block`}
      >
        <div className="relative h-full max-w-full">
          <div className="h-full p-2 space-y-4 fixed overflow-y-auto w-full">
            {users.length === 0 ? (
              <div className="flex justify-center items-center w-full h-full">
                <p className="text-gray-600 text-xl">No chats available</p>
              </div>
            ) : (
              users.map((user) => (
                <div
                  key={user.id}
                  onClick={() => {
                    setShowChat(true);
                    handleUserSelect(user);
                  }}
                  className="flex items-center p-4 cursor-pointer transition-all mb-2 w-full"
                >
                  <div className="w-10 h-10 rounded-full bg-[#00BFFF] flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {user.name.charAt(0)}
                    </span>
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-gray-800">{user.name}</h3>
                    <p className="text-sm text-gray-600">
                      {user.lastMessage.length > 5
                        ? user.lastMessage.substring(0, 10) + "..."
                        : user.lastMessage}
                      <span className="text-xs text-gray-500 ml-1">
                        {user.lastMessageTimestamp
                          ? moment(user.lastMessageTimestamp).format("LT")
                          : ""}
                      </span>
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div
        className={`${
          showChat ? "block" : "hidden md:flex"
        } flex-1 flex flex-col z-10 bg-gray-100`}
      >
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="bg-white p-4 shadow-md flex items-center sticky top-0 z-10 border-b">
              <button
                className="md:hidden mr-3"
                onClick={() => setShowChat(false)}
              >
                <svg
                  className="w-6 h-6 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
              </button>
              <div className="w-10 h-10 rounded-full bg-[#00BFFF] flex items-center justify-center">
                <span className="text-white font-semibold">
                  {selectedUser.name.charAt(0)}
                </span>
              </div>
              <div className="ml-4">
                <h2 className="font-semibold text-gray-800">
                  {selectedUser.name}
                </h2>
                <p
                  className={`text-sm ${
                    selectedUser.status === "online"
                      ? "text-green-500"
                      : "text-gray-500"
                  }`}
                >
                  {selectedUser.status}
                </p>
              </div>
            </div>

            {/* Messages Container */}
            <div
              id="scrollableDiv"
              className=" flex-1 pb-[20px] bg-[#F5F7FA] w-full h-full overflow-hidden overflow-y-auto max-h-screen"
            >
              <InfiniteScroll
                dataLength={messages.length}
                next={fetchMore}
                style={{ display: "flex", flexDirection: "column-reverse" }}
                inverse={true}
                hasMore={messages.length < messageLength}
                loader={<LoaderSpinner />}
                scrollableTarget="scrollableDiv"
              >
                {reversedMessages.map((msg, index) => (
                  <div key={index}>
                    <div
                      className={`flex mx-[20px] mt-4 ${
                        msg.senderId === senderId
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`rounded-lg p-3 max-w-[60%] shadow ${
                          msg.senderId === senderId
                            ? "bg-[#98d7ec]"
                            : "bg-gray-300"
                        }`}
                      >
                        <p>{msg.text}</p>
                        <span className="text-xs text-gray-500">
                          {moment(msg.timestamp).format("LT")}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </InfiniteScroll>
            </div>

            <div className="bg-white p-3 border-t shadow-lg sticky bottom-0 z-10">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t("type_message")}
                  className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring focus:ring-blue-200"
                />
                <button
                  ref={buttonRef}
                  onClick={sendMessage}
                  className="bg-[#00BFFF] text-white p-2 rounded-full hover:bg-blue-600 transition"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <h3 className="text-xl font-semibold text-gray-600">
              {t("select_a_user")}
            </h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
