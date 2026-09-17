import type { db } from "@/lib/db";
import type { UserRole } from "@/types";

export type ChatConversation = {
  id: string;
  coupleId: string;
  vendorId: string;
  bookingId: string | null;
  updatedAt: string;
  partnerName: string;
  latestMessage: string | null;
  unreadCount: number;
};

export type ChatMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  readAt: string | null;
  createdAt: string;
};

type AppDbClient = ReturnType<typeof db>;

export async function getConversationsForUser(
  db: AppDbClient,
  userId: string,
  role: UserRole
) {
  const base = db
    .from("conversations")
    .select("id,couple_id,vendor_id,booking_id,updated_at")
    .order("updated_at", { ascending: false })
    .limit(100);

  const { data: rows, error } = await (role === "couple"
    ? base.eq("couple_id", userId)
    : role === "vendor"
      ? base.eq("vendor_id", userId)
      : base);

  if (error || !rows || rows.length === 0) {
    return [] as ChatConversation[];
  }

  const conversationIds = rows.map((row) => row.id);
  const partnerIds = rows.map((row) => (role === "couple" ? row.vendor_id : row.couple_id));

  const [usersRes, messagesRes] = await Promise.all([
    db.from("users").select("id,full_name").in("id", partnerIds),
    db
      .from("messages")
      .select("id,conversation_id,sender_id,content,read_at,created_at")
      .in("conversation_id", conversationIds)
      .order("created_at", { ascending: false })
      .limit(500),
  ]);

  const partnerMap = new Map(
    (usersRes.data ?? []).map((user) => [user.id, user.full_name || "User"])
  );

  const latestMessageMap = new Map<string, string>();
  const unreadMap = new Map<string, number>();

  for (const message of messagesRes.data ?? []) {
    if (!latestMessageMap.has(message.conversation_id)) {
      latestMessageMap.set(message.conversation_id, message.content);
    }

    if (message.sender_id !== userId && !message.read_at) {
      unreadMap.set(
        message.conversation_id,
        (unreadMap.get(message.conversation_id) ?? 0) + 1
      );
    }
  }

  return rows.map((row) => {
    const partnerId = role === "couple" ? row.vendor_id : row.couple_id;
    return {
      id: row.id,
      coupleId: row.couple_id,
      vendorId: row.vendor_id,
      bookingId: row.booking_id,
      updatedAt: row.updated_at,
      partnerName: partnerMap.get(partnerId) ?? "User",
      latestMessage: latestMessageMap.get(row.id) ?? null,
      unreadCount: unreadMap.get(row.id) ?? 0,
    } satisfies ChatConversation;
  });
}

export async function getMessagesForConversation(
  db: AppDbClient,
  conversationId: string
) {
  const { data, error } = await db
    .from("messages")
    .select("id,conversation_id,sender_id,content,read_at,created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: true })
    .limit(300);

  if (error || !data) {
    return [] as ChatMessage[];
  }

  return data.map((message) => ({
    id: message.id,
    conversationId: message.conversation_id,
    senderId: message.sender_id,
    content: message.content,
    readAt: message.read_at,
    createdAt: message.created_at,
  })) satisfies ChatMessage[];
}
