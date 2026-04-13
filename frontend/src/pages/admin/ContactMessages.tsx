import { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Textarea } from '../../components/ui/Textarea';
import { api } from '../../lib/api';
import { toast } from '../../lib/toast';
import { Mail, Phone, User, Calendar, MessageSquare, Send, Trash2, CheckCircle } from 'lucide-react';
import { formatDate, formatTime } from '../../lib/utils';

interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'RESPONDED' | 'CLOSED';
  response?: string;
  respondedBy?: string;
  respondedAt?: string;
  createdAt: string;
}

export const ContactMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [responseText, setResponseText] = useState('');
  const [isResponding, setIsResponding] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('');

  const loadMessages = async () => {
    setLoading(true);
    try {
      const params = filterStatus ? { status: filterStatus } : {};
      const resp = await api.get('/contact/messages', { params });
      setMessages(resp.data.data.messages || []);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [filterStatus]);

  const handleRespond = async () => {
    if (!selectedMessage || !responseText.trim()) {
      toast.error('Please enter a response');
      return;
    }

    setIsResponding(true);
    try {
      await api.patch(`/contact/messages/${selectedMessage.id}/respond`, {
        response: responseText,
      });
      toast.success('Response sent successfully!');
      setResponseText('');
      setSelectedMessage(null);
      loadMessages();
    } catch (error) {
      console.error('Error sending response:', error);
      toast.error('Failed to send response');
    } finally {
      setIsResponding(false);
    }
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await api.patch(`/contact/messages/${id}/status`, { status });
      toast.success('Status updated successfully');
      loadMessages();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;

    try {
      await api.delete(`/contact/messages/${id}`);
      toast.success('Message deleted successfully');
      loadMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      PENDING: { variant: 'warning', label: 'Pending' },
      IN_PROGRESS: { variant: 'info', label: 'In Progress' },
      RESPONDED: { variant: 'success', label: 'Responded' },
      CLOSED: { variant: 'default', label: 'Closed' },
    };
    const { variant, label } = variants[status] || variants.PENDING;
    return <Badge variant={variant}>{label}</Badge>;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
            <p className="text-gray-600 mt-1">Manage inquiries from website visitors</p>
          </div>
          <Button onClick={loadMessages} variant="outline">
            Refresh
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="py-4">
            <div className="flex gap-3">
              <Button
                variant={filterStatus === '' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('')}
              >
                All
              </Button>
              <Button
                variant={filterStatus === 'PENDING' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('PENDING')}
              >
                Pending
              </Button>
              <Button
                variant={filterStatus === 'IN_PROGRESS' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('IN_PROGRESS')}
              >
                In Progress
              </Button>
              <Button
                variant={filterStatus === 'RESPONDED' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus('RESPONDED')}
              >
                Responded
              </Button>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <Card>
            <CardContent className="py-12 text-center">
              <div className="text-gray-600">Loading messages...</div>
            </CardContent>
          </Card>
        ) : messages.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Mail className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <div className="text-gray-600">No messages found</div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6">
            {messages.map((message) => (
              <Card key={message.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <CardTitle className="text-xl">{message.fullName}</CardTitle>
                        {getStatusBadge(message.status)}
                      </div>
                      {message.subject && (
                        <p className="text-gray-600 font-medium">{message.subject}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {message.status === 'PENDING' && (
                        <Button
                          size="sm"
                          onClick={() => {
                            setSelectedMessage(message);
                            setResponseText('');
                          }}
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          Respond
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDelete(message.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail className="w-4 h-4" />
                      {message.email}
                    </div>
                    {message.phone && (
                      <div className="flex items-center gap-2 text-gray-600">
                        <Phone className="w-4 h-4" />
                        {message.phone}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {formatDate(new Date(message.createdAt))} {formatTime(new Date(message.createdAt))}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Message:</p>
                    <p className="text-gray-900 whitespace-pre-wrap">{message.message}</p>
                  </div>

                  {message.response && (
                    <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                      <p className="text-sm font-medium text-blue-900 mb-2">Your Response:</p>
                      <p className="text-blue-900 whitespace-pre-wrap">{message.response}</p>
                      {message.respondedAt && (
                        <p className="text-xs text-blue-700 mt-2">
                          Responded on {formatDate(new Date(message.respondedAt))} at {formatTime(new Date(message.respondedAt))}
                        </p>
                      )}
                    </div>
                  )}

                  {selectedMessage?.id === message.id && (
                    <div className="bg-white border-2 border-blue-200 rounded-lg p-4 space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Your Response
                        </label>
                        <Textarea
                          value={responseText}
                          onChange={(e) => setResponseText(e.target.value)}
                          placeholder="Type your response here..."
                          rows={5}
                          className="w-full"
                        />
                      </div>
                      <div className="flex gap-3">
                        <Button
                          onClick={handleRespond}
                          disabled={isResponding}
                          className="flex-1"
                        >
                          {isResponding ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                              Sending...
                            </>
                          ) : (
                            <>
                              <Send className="w-4 h-4 mr-2" />
                              Send Response
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setSelectedMessage(null);
                            setResponseText('');
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
