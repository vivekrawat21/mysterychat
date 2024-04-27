"use client";
import { useCallback, useEffect, useState } from "react";
import { Message } from "@/model/User";
import { useToast } from "@/components/ui/use-toast";
import { useSession } from "next-auth/react";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { set } from "mongoose";
import { Button } from "@/components/ui/button";
import { Switch } from "@radix-ui/react-switch";
import { Separator } from "@radix-ui/react-separator";
import { Loader2 } from "lucide-react";
import { RefreshCcw } from "lucide-react";
import MessageCard from "@/components/MessageCard";
import { User } from "next-auth";

function page() {
  const [message, setMessage] = useState<Message[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState<boolean>(false);

  const { toast } = useToast();

  const handleDeleteMessage = async (messageid: string) => {
    setMessage(message.filter((msg) => msg._id !== messageid));
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;

  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessages);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message,
        variant: "destructive",
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean = false) => {
      setLoading(true);
      setIsSwitchLoading(true);

      try {
        const response = await axios.get<ApiResponse>("api/get-messages");
        setMessage(response.data.messages || []);
        if (refresh) {
          toast({
            title: "Refreshed messages",
            description: "Showing latest messages",
            variant: "default",
          });
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast({
          title: "Error",
          description: axiosError.response?.data.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setLoading, setMessage]
  );

  useEffect(() => {
    if (!session || !session.user) {
      return;
    } else {
      fetchAcceptMessage();
      fetchMessages();
    }
  }, [session, setValue, fetchAcceptMessage, fetchMessages]);

  const handleSwitchChange = async () => {
    const response = await axios.post<ApiResponse>("/api/accept-messages", {
      acceptMessages: !acceptMessages,
    });
    setValue("acceptMessages", !acceptMessages);
    toast({
      title: response.data.message,
      variant: "default",
    });
 };
   //copy clipboard thing
   const { username } = session?.user as User;
   //todo do more research
   const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const profileUrl = `${baseUrl}/u/${username}`;

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(profileUrl);
    toast({
      title: "URL copied",
      description: "Profile url has been copied to clipboard",
      variant: "default",
    });
  };

  if (!session || session?.user) {
    return <div>please login</div>;
  }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{" "}
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </span>
      </div>
      <Separator />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {message.length > 0 ? (
          message.map((message, index) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteMessage}
            />
          ))
        ) : (
          <p>No messages to display.</p>
        )}
      </div>
    </div>
  );
}

export default page;
