"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios, { AxiosError } from "axios";

import { ApiResponse } from "@/types/ApiResponse";
import { useParams } from "next/navigation";
import { toast } from "@/components/ui/use-toast";

const messagepage = () => {
  const username = useParams().username;
  console.log(username);
  const [messageContent, setMessageContent] = useState<string>("");
  const handleSend = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/send-message", {
        username,
        content: messageContent,
      });

      if (response.data.success) {
        toast({
          title: response.data.message,
          variant: "default",
        });
      } else {
        toast({
          title: response.data.message,
          variant: "destructive",
        });
      }
    } catch (error: any) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description:
          axiosError.response?.data.message ??
          "Failed to update message settings",
        variant: "destructive",
      });
    }
  };
  return (
    <>
      
      <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-20">
        Send an anonymous message to {username}
      </h1>
      
      <div className="flex justify-center ">
        <Input
          placeholder="Type a message"
          onChange={(e) => setMessageContent(e.target.value)}
          className="w-[100%]"
        />
        <Button onClick={handleSend}>Send</Button>
      </div>
      </div>
    </>
  );
};

export default messagepage;
