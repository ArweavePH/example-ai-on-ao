"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createDataItemSigner, dryrun, message } from "@permaweb/aoconnect";
import { ConnectButton } from "arweave-wallet-kit";
import { Send } from "lucide-react";
import { useState } from "react";

interface Message {
  id: number;
  content: string;
  sender: "user" | "bot";
}

// TODO: Add your AI process here
const AI_PROCESS = "9Y4mqBnX0xlfJNuceIjyLsyauP6Hi-1r7iXQk8ANGQA";

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, content: "Hello! How can I assist you today?", sender: "bot" },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputMessage(e.target.value);
  };

  const handleSendMessage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (inputMessage.trim() === "") return;

    const newUserMessage: Message = {
      id: messages.length + 1,
      content: inputMessage,
      sender: "user",
    };

    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInputMessage("");
    setIsThinking(true);
    // TODO: Activity - Finish up this function
    // 1. Send the user's message to the AO process
    // 2. Wait for the AO process to send a response back
    // 3. Add the response to the messages array

    // --- PUT YOUR CODE HERE ---

    const response = await message({
      process: AI_PROCESS,
      tags: [
        {
          name: "Action",
          value: "Prompt",
        },
      ],
      signer: createDataItemSigner(window.arweaveWallet),
      data: inputMessage,
    });
    console.log("response", response);

    const res = await dryrun({
      process: AI_PROCESS,
      signer: createDataItemSigner(window.arweaveWallet),
      tags: [{ name: "Action", value: "GetResponse" }],
    });

    console.log("res.Messages[0].Data", res.Messages);

    // const newAIResponse: Message = {
    //   id: messages.length + 2,
    //   content: res.Messages[0].Data,
    //   sender: "bot",
    // };
    // setMessages((prevMessages) => [...prevMessages, newAIResponse]);
    // setIsThinking(false);
  };

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-8">
      <ConnectButton />
      <div className="flex flex-col h-[600px] w-full max-w-md mx-auto border rounded-lg overflow-hidden bg-background">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Arweave PH - AI Chat</h2>
        </div>
        <ScrollArea className="flex-grow p-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              } mb-4`}
            >
              <div
                className={`flex ${
                  message.sender === "user" ? "flex-row-reverse" : "flex-row"
                } items-start`}
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback>
                    {message.sender === "user" ? "U" : "B"}
                  </AvatarFallback>
                  <AvatarImage
                    src={
                      message.sender === "user"
                        ? "/user-avatar.png"
                        : "/bot-avatar.png"
                    }
                  />
                </Avatar>
                <div
                  className={`mx-2 p-3 rounded-lg ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {isThinking &&
                  message.sender === "bot" &&
                  message.id === messages.length + 1
                    ? "..."
                    : message.content}
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
        <div className="p-4 border-t">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Input
              type="text"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={handleInputChange}
              className="flex-grow"
            />
            <Button type="submit" size="icon">
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
