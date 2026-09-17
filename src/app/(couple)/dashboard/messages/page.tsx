import { redirect } from "next/navigation";
import { MessageCircle, Send, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getConversationsForUser, getMessagesForConversation } from "@/lib/chat";
import { createDbSession } from "@/lib/server/auth";

type CoupleMessagesPageProps = {
  searchParams: Promise<{ with?: string; conversation?: string; chat?: string }>;
};

export default async function CoupleMessagesPage({ searchParams }: CoupleMessagesPageProps) {
  const query = await searchParams;
  const session = await createDbSession();
  const { data: { user } } = await session.auth.getUser();

  if (!user) redirect("/login?redirect=/dashboard/messages");

  const conversations = await getConversationsForUser(session, user.id, "couple");
  const selectedConversationId = query.conversation ?? conversations[0]?.id ?? null;
  const selectedConversation = conversations.find((c) => c.id === selectedConversationId);
  const messages = selectedConversationId
    ? await getMessagesForConversation(session, selectedConversationId)
    : [];

  return (
    <div className="space-y-4">
      <div>
        <p className="text-xs font-semibold tracking-widest text-terracotta-500 uppercase">Planning</p>
        <h1 className="mt-1 font-heading text-2xl font-light text-foreground">Messages</h1>
        <p className="mt-1 text-sm text-muted-foreground">Chat with vendors about your bookings.</p>
      </div>

      {query.chat === "sent" && (
        <div className="flex items-center gap-3 rounded-xl border border-sage-200 bg-sage-50 px-4 py-3 text-sm text-sage-700">
          <CheckCheck className="h-4 w-4 shrink-0 text-sage-500" />
          Message sent.
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]" style={{ height: "calc(100vh - 220px)", minHeight: "480px" }}>
        {/* Conversation list */}
        <Card className="shadow-warm overflow-hidden flex flex-col">
          <CardHeader className="border-b border-border/40 pb-3 shrink-0">
            <CardTitle className="font-heading text-base font-semibold">Conversations</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 overflow-y-auto p-2">
            {conversations.length === 0 ? (
              <div className="py-8 text-center">
                <MessageCircle className="mx-auto h-8 w-8 text-muted-foreground/30" />
                <p className="mt-2 text-xs text-muted-foreground">No conversations yet.</p>
              </div>
            ) : (
              <div className="space-y-1">
                {conversations.map((conversation) => (
                  <a
                    key={conversation.id}
                    href={`/dashboard/messages?conversation=${conversation.id}`}
                    className={`flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-muted/40 ${
                      conversation.id === selectedConversationId ? "bg-terracotta-50 border border-terracotta-100" : ""
                    }`}
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-terracotta-100 text-terracotta-700 text-xs font-semibold">
                      {conversation.partnerName?.charAt(0) ?? "V"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-semibold text-foreground truncate">{conversation.partnerName}</p>
                        {conversation.unreadCount > 0 && (
                          <span className="shrink-0 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-terracotta-500 px-1 text-[9px] font-semibold text-white">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 line-clamp-1 text-[10px] text-muted-foreground">
                        {conversation.latestMessage ?? "No messages yet"}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Chat area */}
        <Card className="shadow-warm flex flex-col overflow-hidden">
          <CardHeader className="border-b border-border/40 pb-3 shrink-0">
            <CardTitle className="font-heading text-base font-semibold">
              {selectedConversation ? selectedConversation.partnerName : "Select a conversation"}
            </CardTitle>
          </CardHeader>

          {!selectedConversationId ? (
            <CardContent className="flex flex-1 items-center justify-center">
              <div className="text-center">
                <MessageCircle className="mx-auto h-10 w-10 text-muted-foreground/20" />
                <p className="mt-3 text-sm text-muted-foreground">Choose a conversation to start chatting</p>
              </div>
            </CardContent>
          ) : (
            <>
              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4">
                {messages.length === 0 ? (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-sm text-muted-foreground">No messages yet. Say hello!</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {messages.map((message) => {
                      const isOwn = message.senderId === user.id;
                      return (
                        <div key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                            isOwn
                              ? "rounded-br-sm bg-terracotta-500 text-white"
                              : "rounded-bl-sm bg-muted text-foreground"
                          }`}>
                            {message.content}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>

              {/* Compose */}
              <div className="border-t border-border/40 p-3 shrink-0">
                <div className="flex gap-2">
                  <form action="/api/messages/read" method="POST" className="hidden">
                    <input type="hidden" name="conversationId" value={selectedConversationId} />
                    <input type="hidden" name="returnTo" value={`/dashboard/messages?conversation=${selectedConversationId}`} />
                  </form>
                </div>
                <form action="/api/messages/send" method="POST" className="flex gap-2">
                  <input type="hidden" name="conversationId" value={selectedConversationId} />
                  <input type="hidden" name="returnTo" value={`/dashboard/messages?conversation=${selectedConversationId}&chat=sent`} />
                  <textarea
                    name="content"
                    required
                    rows={2}
                    placeholder="Type a message…"
                    className="flex-1 resize-none rounded-xl border border-border/60 bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-terracotta-300"
                  />
                  <Button type="submit" size="icon" className="h-auto w-10 shrink-0 rounded-xl bg-terracotta-500 text-white hover:bg-terracotta-600">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
}
