import { redirect } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getConversationsForUser, getMessagesForConversation } from "@/lib/chat";
import { createDbSession } from "@/lib/server/auth";

type VendorMessagesPageProps = {
  searchParams: Promise<{ conversation?: string; chat?: string }>;
};

export default async function VendorMessagesPage({
  searchParams,
}: VendorMessagesPageProps) {
  const query = await searchParams;
  const session = await createDbSession();
  const {
    data: { user },
  } = await session.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/vendor/messages");
  }

  const conversations = await getConversationsForUser(session, user.id, "vendor");
  const selectedConversationId = query.conversation ?? conversations[0]?.id ?? null;
  const messages = selectedConversationId
    ? await getMessagesForConversation(session, selectedConversationId)
    : [];

  return (
    <div className="space-y-4">
      <h1 className="font-heading text-3xl font-bold">Messages</h1>
      <p className="text-muted-foreground">
        Manage conversations with couples in one inbox.
      </p>

      {query.chat === "sent" ? (
        <p className="rounded-md border border-emerald-300 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Message sent.
        </p>
      ) : null}

      <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Conversations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {conversations.length === 0 ? (
              <p className="text-sm text-muted-foreground">No conversations yet.</p>
            ) : (
              conversations.map((conversation) => (
                <a
                  key={conversation.id}
                  href={`/vendor/messages?conversation=${conversation.id}`}
                  className="block rounded-md border p-3 hover:bg-muted/40"
                >
                  <div className="mb-1 flex items-center justify-between gap-2">
                    <p className="text-sm font-medium">{conversation.partnerName}</p>
                    {conversation.unreadCount > 0 ? (
                      <Badge variant="secondary">{conversation.unreadCount}</Badge>
                    ) : null}
                  </div>
                  <p className="line-clamp-1 text-xs text-muted-foreground">
                    {conversation.latestMessage ?? "No messages yet"}
                  </p>
                </a>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Chat</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {!selectedConversationId ? (
              <p className="text-sm text-muted-foreground">
                Select a conversation to start messaging.
              </p>
            ) : (
              <>
                <div className="max-h-96 space-y-2 overflow-y-auto rounded-md border p-3">
                  {messages.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No messages yet.</p>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                          message.senderId === user.id
                            ? "ml-auto rounded-br-sm bg-terracotta-500 text-white"
                            : "rounded-bl-sm bg-muted text-foreground"
                        }`}
                      >
                        <p>{message.content}</p>
                      </div>
                    ))
                  )}
                </div>

                <div className="flex flex-wrap gap-2">
                  <form action="/api/messages/read" method="POST">
                    <input type="hidden" name="conversationId" value={selectedConversationId} />
                    <input type="hidden" name="returnTo" value={`/vendor/messages?conversation=${selectedConversationId}`} />
                    <Button type="submit" size="sm" variant="outline">
                      Mark as read
                    </Button>
                  </form>
                </div>

                <form action="/api/messages/send" method="POST" className="space-y-2">
                  <input type="hidden" name="conversationId" value={selectedConversationId} />
                  <input type="hidden" name="returnTo" value={`/vendor/messages?conversation=${selectedConversationId}`} />
                  <textarea
                    name="content"
                    required
                    rows={3}
                    placeholder="Write your message..."
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                  />
                  <Button type="submit" size="sm">
                    Send message
                  </Button>
                </form>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
