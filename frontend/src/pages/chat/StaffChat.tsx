import { useEffect, useMemo, useRef, useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ProfileAvatar } from '../../components/ui/ProfileAvatar';
import { api, getStoredAuth } from '../../lib/api';
import { toast } from '../../lib/toast';

interface ChatUser {
  id: string;
  fullName: string;
  role: string;
  department?: string;
  profilePhoto?: string | null;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  createdAt: string;
  isOwn: boolean;
}

interface PeerInfo {
  id: string;
  fullName: string;
  role: string;
  department?: string | null;
  email?: string | null;
  profilePhoto?: string | null;
}

function formatRole(r: string) {
  return r.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('');
}

function dayKey(iso: string) {
  try {
    return new Date(iso).toDateString();
  } catch {
    return '';
  }
}

export const StaffChat = () => {
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [activeUserId, setActiveUserId] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [peer, setPeer] = useState<PeerInfo | null>(null);
  const [draft, setDraft] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const me = getStoredAuth()?.user as { id?: string; fullName?: string; role?: string } | undefined;
  const myName = me?.fullName || 'You';

  const activeUser = useMemo(() => users.find((u) => u.id === activeUserId), [users, activeUserId]);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadUsers = async () => {
    try {
      const resp = await api.get('/chat/users');
      const rows = resp.data?.data || [];
      setUsers(rows);
      if (!activeUserId && rows.length > 0) {
        setActiveUserId(rows[0].id);
      }
    } catch (_error) {
      toast.error('Failed to load chat users.');
      setUsers([]);
    }
  };

  const loadConversation = async (userId: string) => {
    setIsLoading(true);
    try {
      const resp = await api.get(`/chat/conversations/${userId}`);
      const payload = resp.data?.data;
      if (payload?.messages && Array.isArray(payload.messages)) {
        setMessages(payload.messages);
        setPeer(payload.peer || null);
      } else {
        // Legacy shape: plain array
        setMessages(Array.isArray(payload) ? payload : []);
        setPeer(null);
      }
    } catch (_error) {
      toast.error('Failed to load conversation.');
      setMessages([]);
      setPeer(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadUsers();
  }, []);

  useEffect(() => {
    if (!activeUserId) {
      return;
    }
    void loadConversation(activeUserId);
    const interval = setInterval(() => {
      void loadConversation(activeUserId);
    }, 4000);
    return () => clearInterval(interval);
  }, [activeUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, activeUserId]);

  const sendMessage = async () => {
    if (!activeUserId || !draft.trim()) {
      return;
    }
    setIsSending(true);
    try {
      await api.post('/chat/messages', {
        recipientId: activeUserId,
        message: draft.trim(),
      });
      setDraft('');
      await loadConversation(activeUserId);
    } catch (_error) {
      toast.error('Failed to send message.');
    } finally {
      setIsSending(false);
    }
  };

  const headerPeer = peer || activeUser;
  const headerName = headerPeer?.fullName || 'Select a colleague';
  const headerRole = headerPeer ? formatRole(headerPeer.role) : '';
  const headerDept = headerPeer && 'department' in headerPeer ? headerPeer.department : undefined;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-50">Staff chat</h1>
            <p className="text-sm text-slate-400 mt-1">
              Signed in as <span className="text-slate-200 font-medium">{myName}</span>
              {me?.role && (
                <span className="text-slate-500"> · {formatRole(me.role)}</span>
              )}
            </p>
          </div>
          <Button variant="outline" onClick={() => void loadUsers()}>
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 min-h-[70vh]">
          <Card className="p-0 md:col-span-2 overflow-hidden border border-slate-800 bg-slate-900/40">
            <div className="px-4 py-3 border-b border-slate-800">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Colleagues</p>
              <p className="text-sm text-slate-400">Tap someone to open the thread</p>
            </div>
            <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1">
              {users.length === 0 && (
                <p className="text-sm text-slate-500 px-2 py-4 text-center">No staff available.</p>
              )}
              {users.map((user) => {
                const sel = activeUserId === user.id;
                return (
                  <button
                    key={user.id}
                    type="button"
                    className={`w-full rounded-xl px-3 py-3 text-left flex items-center gap-3 transition-colors ${
                      sel ? 'bg-sky-500/15 border border-sky-500/40' : 'border border-transparent hover:bg-slate-800/80'
                    }`}
                    onClick={() => setActiveUserId(user.id)}
                  >
                    <ProfileAvatar
                      photoUrl={user.profilePhoto}
                      fullName={user.fullName}
                      size="md"
                      className="shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-slate-100 truncate">{user.fullName}</p>
                      <p className="text-xs text-slate-500 truncate">
                        {formatRole(user.role)}
                        {user.department ? ` · ${user.department}` : ''}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </Card>

          <Card className="p-0 md:col-span-3 flex flex-col border border-slate-800 bg-slate-900/40 min-h-[70vh]">
            <div className="px-4 py-4 border-b border-slate-800 flex items-center gap-3">
              <ProfileAvatar
                photoUrl={headerPeer?.profilePhoto}
                fullName={headerName}
                size="lg"
                className="shrink-0"
              />
              <div className="min-w-0 flex-1">
                <p className="text-lg font-semibold text-slate-50 truncate">{headerName}</p>
                {headerPeer && (
                  <p className="text-xs text-slate-400 truncate">
                    {headerRole}
                    {headerDept ? ` · ${headerDept}` : ''}
                    {peer?.email ? ` · ${peer.email}` : ''}
                  </p>
                )}
                {!headerPeer && <p className="text-xs text-slate-500">Choose a person on the left</p>}
              </div>
            </div>

            <div className="px-4 py-2 bg-slate-900/60 border-b border-slate-800">
              <p className="text-xs text-slate-500">
                <span className="text-sky-400 font-medium">Your messages</span> appear on the right with &quot;You&quot;.
                <span className="text-slate-400"> Messages from {headerPeer?.fullName || 'them'} </span>
                on the left under their name.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3 bg-gray-50/50">
              {isLoading && messages.length === 0 && (
                <p className="text-center text-sm text-slate-500 py-8">Loading messages…</p>
              )}
              {messages.map((message, idx) => {
                const prev = messages[idx - 1];
                const showDay =
                  idx === 0 || (prev && dayKey(prev.createdAt) !== dayKey(message.createdAt));
                const time = new Date(message.createdAt).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <div key={message.id}>
                    {showDay && (
                      <div className="flex justify-center my-4">
                        <span className="text-[11px] uppercase tracking-wide text-slate-500 bg-slate-800/80 px-3 py-1 rounded-full">
                          {dayKey(message.createdAt)}
                        </span>
                      </div>
                    )}
                    <div className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
                      <div
                        className={`max-w-[85%] rounded-2xl px-3 py-2 shadow-sm ${
                          message.isOwn
                            ? 'bg-sky-600 text-white rounded-br-md'
                            : 'bg-slate-800 text-slate-100 border border-slate-700 rounded-bl-md'
                        }`}
                      >
                        {!message.isOwn && (
                          <p className="text-[11px] font-semibold text-sky-300 mb-1">{message.senderName}</p>
                        )}
                        {message.isOwn && (
                          <p className="text-[10px] font-semibold text-sky-200/90 mb-1 text-right">You</p>
                        )}
                        <p className="text-sm whitespace-pre-wrap break-words">{message.message}</p>
                        <p
                          className={`text-[10px] mt-1 tabular-nums ${
                            message.isOwn ? 'text-sky-100/80 text-right' : 'text-slate-500'
                          }`}
                        >
                          {time}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div ref={bottomRef} />
              {!isLoading && activeUserId && messages.length === 0 && (
                <p className="text-center text-sm text-slate-500 py-12">
                  No messages yet. Say hello below — {activeUser?.fullName || 'they'} will see it in their inbox.
                </p>
              )}
            </div>

            <div className="p-3 border-t border-slate-800 bg-slate-900/80">
              <div className="flex gap-2">
                <input
                  type="text"
                  className="flex-1 rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-500 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none"
                  placeholder={activeUserId ? `Message ${activeUser?.fullName || '…'}` : 'Select a colleague first'}
                  value={draft}
                  disabled={!activeUserId}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      void sendMessage();
                    }
                  }}
                />
                <Button variant="primary" onClick={() => void sendMessage()} isLoading={isSending} disabled={!activeUserId}>
                  Send
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
