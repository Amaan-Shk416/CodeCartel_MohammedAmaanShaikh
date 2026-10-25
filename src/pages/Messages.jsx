import React, { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const DEFAULT_CONVERSATIONS = [
  {
    id: 'c-rahul',
    workerId: 'w-rahul',
    name: 'Rahul Sharma',
    verified: true,
    tradeBadge: 'Master Plumber',
    tradeSubtitle: 'Plumbing · Leak Repair',
    tradeIcon: 'plumbing',
    online: true,
    statusText: 'Available · Typically replies in 5 mins',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCqG2Pu0wmbt9W8nyeauFC5QgXVEBgN2iJ5PvQaZgvcfG18IaU8nzclYaLL8llhvv7WAVeFNmNA_kTrGR8zP7uSTDLck7SDbduUMg3rmdQM7bJpzAyhf6Y9fcGNZhNYftxNzg2aI-HQO72lOn6kDSnfmUKqyag6Wfb8jzcS6YDK3kmI-eTKdMzL8bw39jw2eBHYZZo2NAle3lzmlLAFI8hNyJ6rZ_oDzzRrL46JK91-B96PUYvtD6jjsg',
    chatAvatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCSARfBoxk0f5wpS9XLI6zG0jOsSAbKhjyaA6dCTRuY0dizznWXM_j6PCmRqNA47suNvpAyBd1GN9_sg5WuuEg5zFy2Hf0XMTMb9u5RU7BKnF0qgNHVzYOOVKgA2ScYLZ2jfrKLGNK5Nl0Fo52ceY3WuNUF3Lc4gdgeKRhBPJgj6ctlpKHkBvXemAqZc15OkJZTOuf0irrYDVl5hzy3Vh1Rn_t73-dYcE47A8yvGKZBMWafqav3YBZHQg',
    phone: '+91 98201 54321',
    bookingId: 'BK-101',
    bookingTitle: 'Service: Kitchen Leak Repair',
    appointmentTime: 'Appointment: Tomorrow, 10:00 AM',
    agreedPrice: 'Agreed Price: ₹650',
    unreadCount: 1,
    filterTag: 'active',
    lastMessageTime: '9:41 AM',
    messages: [
      {
        id: 'm1',
        sender: 'worker',
        text: "Hello! I've confirmed your appointment for tomorrow morning at 10:00 AM.",
        time: '9:30 AM',
      },
      {
        id: 'm2',
        sender: 'customer',
        text: 'Thanks Rahul! The leak is under the kitchen sink. It drips continuously whenever the main tap is running.',
        time: '9:33 AM',
        status: 'Read',
      },
      {
        id: 'm3',
        sender: 'worker',
        text: 'Understood. Could you share a quick photo of the pipe and the joint beneath the sink? It will help me bring the exact replacement ring.',
        time: '9:36 AM',
      },
      {
        id: 'm4',
        sender: 'customer',
        text: "Here is the under-sink fitting and where it's dripping right at the PVC P-trap joint:",
        time: '9:39 AM',
        status: 'Read',
        image:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuBwt6vhV-R6uYt3Zo94pRzHxW-Ykre-YWsojT867MqrD21WfxKbEsC6kFBWQVrsr6ieWIKjnIlyc0qPSkcM5s5XuFYAwCTOFYuJVP9cFFAjZcNaqd-Wb4G0MmKbLIF8a72VG8srG5vF6N6YxGKpZPe0oneLvETnf5886NjatCXIJIbPDqsnnSLrj76HmFIBxP24LRdvOXMSIo63k47TukOqcDTnpy8uSYrUiCxptj90yQxrro-xQTQHuw',
        imageName: 'IMG_sink_trap.jpg',
      },
    ],
  },
  {
    id: 'c-priya',
    workerId: 'w-priya',
    name: 'Priya Nair',
    verified: false,
    tradeBadge: 'Deep Cleaning Specialist',
    tradeSubtitle: 'Deep Cleaning Specialist',
    tradeIcon: 'cleaning_services',
    online: false,
    statusText: 'Offline · Last seen yesterday',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDmzFlCJR2RkLZJ7JwbedVqB1INrx-fmG3UCbIZBQUEaYekKz0eVQfTfLuRq5gLs8sB4WAkzZUfnWEHqkik2OyR5nkfamBOCGG9KxQBcNF8Ct0bMg6gXfVMcUdGwCUDb-3ub1NN3Sug0ryOlazyTnrrJuxMhVLXx2rrgU8DSq2ISspVTQWMmYRTvrvFh3dv3XfrO0omGl8FVUiV_svqGf7gekYjSIDbJvg9jX16ZyLdgwDHBgd_kotqgA',
    chatAvatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDmzFlCJR2RkLZJ7JwbedVqB1INrx-fmG3UCbIZBQUEaYekKz0eVQfTfLuRq5gLs8sB4WAkzZUfnWEHqkik2OyR5nkfamBOCGG9KxQBcNF8Ct0bMg6gXfVMcUdGwCUDb-3ub1NN3Sug0ryOlazyTnrrJuxMhVLXx2rrgU8DSq2ISspVTQWMmYRTvrvFh3dv3XfrO0omGl8FVUiV_svqGf7gekYjSIDbJvg9jX16ZyLdgwDHBgd_kotqgA',
    phone: '+91 98202 67890',
    bookingId: null,
    bookingTitle: 'Service: Balcony & Kitchen Deep Clean',
    appointmentTime: 'Scheduled: Saturday, 2:00 PM',
    agreedPrice: 'Agreed Price: ₹1,200',
    unreadCount: 0,
    filterTag: 'archived',
    lastMessageTime: 'Yesterday',
    messages: [
      {
        id: 'mp1',
        sender: 'customer',
        text: 'Hi Priya, I need deep cleaning for our kitchen and balcony area this weekend.',
        time: 'Yesterday 3:15 PM',
        status: 'Read',
      },
      {
        id: 'mp2',
        sender: 'worker',
        text: 'Could you share a photo of the area? That will help me bring the right cleaning solutions.',
        time: 'Yesterday 3:45 PM',
      },
    ],
  },
  {
    id: 'c-amit',
    workerId: 'w-amit',
    name: 'Amit Kumar',
    verified: true,
    tradeBadge: 'Electrician Pro',
    tradeSubtitle: 'Electrical Repair',
    tradeIcon: 'bolt',
    online: true,
    statusText: 'Available · En route nearby',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCPD1x-8Kw2JXLELb3IzijtmOauCQ7eTT4bPHlC9KlRkoaxQSeQHyWPLkik83McOjcUdCrnIeigPZwbGGOws80w51BpirE1mUAIKChcLrtIJvc7op3KkMPKZY3T9UrsE3y2bJpaxO27V3QLNT1IRWkNsvoh10KJMIgabdKbeqStT1BoTGPIff8V-VBoEBLW0xOU0xGTgv7Hk05IPahe6vqfqzpvH1n94L04ZegqAN7jbo2T1U9SCz1Jjg',
    chatAvatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCPD1x-8Kw2JXLELb3IzijtmOauCQ7eTT4bPHlC9KlRkoaxQSeQHyWPLkik83McOjcUdCrnIeigPZwbGGOws80w51BpirE1mUAIKChcLrtIJvc7op3KkMPKZY3T9UrsE3y2bJpaxO27V3QLNT1IRWkNsvoh10KJMIgabdKbeqStT1BoTGPIff8V-VBoEBLW0xOU0xGTgv7Hk05IPahe6vqfqzpvH1n94L04ZegqAN7jbo2T1U9SCz1Jjg',
    phone: '+91 98203 78901',
    bookingId: 'BK-102',
    bookingTitle: 'Service: Circuit Breaker Inspection',
    appointmentTime: 'Appointment: Today, 4:00 PM',
    agreedPrice: 'Agreed Price: ₹450',
    unreadCount: 2,
    filterTag: 'active',
    lastMessageTime: 'Yesterday',
    messages: [
      {
        id: 'ma1',
        sender: 'customer',
        text: 'Amit, our kitchen switchboard is sparking when the heavy appliance starts.',
        time: 'Yesterday 5:10 PM',
        status: 'Read',
      },
      {
        id: 'ma2',
        sender: 'worker',
        text: "Please keep the main MCB breaker switched off! I'll arrive in 20 minutes with voltage tester.",
        time: 'Yesterday 5:14 PM',
      },
    ],
  },
  {
    id: 'c-vikram',
    workerId: 'w-vikram',
    name: 'Vikram Patel',
    verified: false,
    tradeBadge: 'Master Carpenter',
    tradeSubtitle: 'Wood Repair & Joinery',
    tradeIcon: 'carpenter',
    online: false,
    statusText: 'Offline · Completed job on Monday',
    avatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA60mpgCbAUBtWvKzbK2lZr5sYrloBwIWIg0fZhz5wsKhqgZdnYMtPrU03IcdJVBxog9oxNJrrS0J7usYE7BsWAm4qcwk1zCwChwyYRJl3gLE4AEHGu9Ccd5clsu8ELGQPjtiwLdHaLgvtHbl97I_HBONPvPrLThwrU_-N-c1rAQ39-lvfD-7us1r6_pLRcsLVmf3f4ce9bNv1QDKvmdM-vO2rs4O5irVAtf2QLGSuoJGWAbScZBYS13Q',
    chatAvatar:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA60mpgCbAUBtWvKzbK2lZr5sYrloBwIWIg0fZhz5wsKhqgZdnYMtPrU03IcdJVBxog9oxNJrrS0J7usYE7BsWAm4qcwk1zCwChwyYRJl3gLE4AEHGu9Ccd5clsu8ELGQPjtiwLdHaLgvtHbl97I_HBONPvPrLThwrU_-N-c1rAQ39-lvfD-7us1r6_pLRcsLVmf3f4ce9bNv1QDKvmdM-vO2rs4O5irVAtf2QLGSuoJGWAbScZBYS13Q',
    phone: '+91 98204 89012',
    bookingId: null,
    bookingTitle: 'Service: Wardrobe Hydraulic Hinges',
    appointmentTime: 'Completed: Monday',
    agreedPrice: 'Agreed Price: ₹550',
    unreadCount: 0,
    filterTag: 'archived',
    lastMessageTime: 'Monday',
    messages: [
      {
        id: 'mv1',
        sender: 'worker',
        text: 'Thank you for booking! The hydraulic hinge replacement is complete and tested.',
        time: 'Monday 11:30 AM',
      },
      {
        id: 'mv2',
        sender: 'customer',
        text: 'Works smoothly now, thanks Vikram!',
        time: 'Monday 11:45 AM',
        status: 'Read',
      },
    ],
  },
];

const QUICK_SHORTCUTS = [
  'I have shared the photos of the issue.',
  'Could you confirm your estimated arrival time?',
  'I am currently at home and ready for the appointment.',
  'Please let me know if any spare parts are required.',
];

const EMOJI_LIST = ['👍', '🔧', '🙏', '⏱️', '📍', '👏', '✅', '🏠'];

export default function Messages() {
  const [searchParams] = useSearchParams();

  // Load conversations from localStorage or fallback
  const [conversations, setConversations] = useState(() => {
    try {
      const stored = window.localStorage.getItem('kaarya_chat_conversations');
      return stored ? JSON.parse(stored) : DEFAULT_CONVERSATIONS;
    } catch {
      return DEFAULT_CONVERSATIONS;
    }
  });

  // Selected conversation ID
  const [selectedId, setSelectedId] = useState(() => {
    const urlRecipient = searchParams.get('recipient');
    if (urlRecipient) {
      const match = DEFAULT_CONVERSATIONS.find(
        (c) => c.id === urlRecipient || c.workerId === urlRecipient || c.name.toLowerCase().includes(urlRecipient.toLowerCase())
      );
      if (match) return match.id;
    }
    return 'c-rahul';
  });

  // Filter & Search states
  const [activeFilter, setActiveFilter] = useState('all'); // 'all' | 'unread' | 'active' | 'archived'
  const [searchQuery, setSearchQuery] = useState('');

  // Mobile conversation view toggle: on small screens, true shows active chat, false shows conversation list
  const [mobileChatOpen, setMobileChatOpen] = useState(false);

  // Message composer input
  const [inputText, setInputText] = useState('');

  // Interactive popovers & modals
  const [expandedImage, setExpandedImage] = useState(null);
  const [showCallModal, setShowCallModal] = useState(null); // 'audio' | 'video' | null
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showConciergeModal, setShowConciergeModal] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [showBanner, setShowBanner] = useState(true);

  const messagesEndRef = useRef(null);

  // Active conversation object
  const activeChat = conversations.find((c) => c.id === selectedId) || conversations[0];

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [activeChat?.messages?.length, selectedId]);

  // Save to localStorage whenever conversations change
  useEffect(() => {
    try {
      window.localStorage.setItem('kaarya_chat_conversations', JSON.stringify(conversations));
    } catch (e) {
      console.warn('Could not save conversations to localStorage:', e);
    }
  }, [conversations]);

  const showToast = (msg) => {
    setToastMessage(msg);
    window.clearTimeout(window.__msg_toast_timer);
    window.__msg_toast_timer = window.setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleSelectConversation = (convId) => {
    setSelectedId(convId);
    setMobileChatOpen(true);
    // Mark as read locally
    setConversations((prev) =>
      prev.map((c) => (c.id === convId ? { ...c, unreadCount: 0 } : c))
    );
  };

  const handleSendMessage = (e) => {
    if (e) e.preventDefault();
    const trimmed = inputText.trim();
    if (!trimmed) return;

    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const timeString = `${formattedHours}:${minutes} ${ampm}`;

    const newMsg = {
      id: `m_${Date.now()}`,
      sender: 'customer',
      text: trimmed,
      time: timeString,
      status: 'Sent',
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === selectedId) {
          return {
            ...c,
            lastMessageTime: timeString,
            messages: [...c.messages, newMsg],
          };
        }
        return c;
      })
    );

    setInputText('');
    setShowShortcuts(false);
    setShowEmojiPicker(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAddEmoji = (emoji) => {
    setInputText((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleSelectShortcut = (shortcutText) => {
    setInputText(shortcutText);
    setShowShortcuts(false);
  };

  const handleSimulateAttachment = () => {
    showToast('Attachment picker: Select JPEG or PNG up to 10MB (Prototype)');
  };

  // Filtered conversations
  const filteredConversations = conversations.filter((c) => {
    // Filter pill check
    if (activeFilter === 'unread' && c.unreadCount === 0) return false;
    if (activeFilter === 'active' && c.filterTag !== 'active') return false;
    if (activeFilter === 'archived' && c.filterTag !== 'archived') return false;

    // Search query check
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = c.name.toLowerCase().includes(q);
      const matchTrade = c.tradeSubtitle.toLowerCase().includes(q);
      const matchMsg = c.messages.some((m) => m.text.toLowerCase().includes(q));
      if (!matchName && !matchTrade && !matchMsg) return false;
    }

    return true;
  });

  const totalUnread = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  return (
    <div className="bg-[#F8F9FF] font-sans text-brand-dark antialiased min-h-[calc(100vh-4rem)] flex-1 overflow-hidden flex items-center justify-center relative p-2 sm:p-4 md:p-6 selection:bg-brand-pink/20 selection:text-brand-purple">
      {/* Subtle Ambient Aurora Blur Spots */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden z-0">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#FF1493]/15 blur-3xl" />
        <div className="absolute top-1/3 -right-32 w-[28rem] h-[28rem] rounded-full bg-[#0080FF]/15 blur-3xl" />
        <div className="absolute -bottom-24 left-1/3 w-80 h-80 rounded-full bg-[#8B00FF]/15 blur-3xl" />
      </div>

      {/* The Isolated 2-Panel Messaging Workspace Container */}
      <div className="relative z-10 w-full max-w-7xl h-[calc(100vh-6rem)] min-h-[580px] max-h-[900px] rounded-2xl md:rounded-3xl border border-purple-100/70 bg-white shadow-2xl shadow-indigo-500/10 overflow-hidden flex flex-col md:flex-row">
        
        {/* LEFT PANEL: Conversations (~30% width, min-w-[320px] max-w-[380px]) */}
        <aside
          className={`${
            mobileChatOpen ? 'hidden md:flex' : 'flex'
          } w-full md:w-[340px] lg:w-[370px] flex-shrink-0 flex-col bg-white border-r border-[#EFF2F8] h-full`}
        >
          {/* Header */}
          <div className="p-4 pb-3 flex flex-col gap-3 border-b border-[#F4F6FB]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link
                  to="/"
                  className="w-7 h-7 rounded-lg bg-gradient-to-tr from-brand-pink to-brand-purple flex items-center justify-center text-white shadow-xs hover:scale-105 transition-transform"
                  title="Return to Kaarya Home"
                >
                  <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                </Link>
                <h2 className="font-bold text-brand-dark text-lg tracking-tight">Conversations</h2>
                {totalUnread > 0 && (
                  <span className="bg-pink-50 text-brand-pink text-xs font-semibold px-2.5 py-0.5 rounded-full border border-pink-200/50 shadow-xs">
                    {totalUnread} unread
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={() => showToast('New chat: Choose a verified professional from Find Professionals')}
                aria-label="New conversation"
                className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-brand-muted hover:text-brand-dark flex items-center justify-center transition-colors"
                title="New conversation"
              >
                <span className="material-symbols-outlined text-[18px]">edit_square</span>
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative w-full">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-brand-blue">
                search
              </span>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search messages, trades..."
                className="w-full pl-9 pr-8 py-2 rounded-xl bg-[#F8F9FE] text-brand-dark text-sm placeholder:text-brand-muted/70 border border-slate-200/70 focus:outline-none focus:border-brand-purple/50 focus:ring-2 focus:ring-brand-purple/10 transition-all"
              />
              {searchQuery ? (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-dark flex items-center"
                >
                  <span className="material-symbols-outlined text-[16px]">close</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setActiveFilter(activeFilter === 'unread' ? 'all' : 'unread')}
                  aria-label="Filter"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-dark flex items-center"
                >
                  <span className="material-symbols-outlined text-[16px]">tune</span>
                </button>
              )}
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
              <button
                type="button"
                onClick={() => setActiveFilter('all')}
                className={`px-3 py-1 rounded-full text-xs font-semibold shadow-xs flex-shrink-0 transition-colors ${
                  activeFilter === 'all'
                    ? 'bg-brand-dark text-white'
                    : 'bg-[#F4F5F9] hover:bg-slate-200/70 text-brand-muted hover:text-brand-dark font-medium'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('unread')}
                className={`px-3 py-1 rounded-full text-xs flex-shrink-0 flex items-center gap-1 transition-colors ${
                  activeFilter === 'unread'
                    ? 'bg-brand-dark text-white font-semibold'
                    : 'bg-[#F4F5F9] hover:bg-slate-200/70 text-brand-muted hover:text-brand-dark font-medium'
                }`}
              >
                <span>Unread</span>
                <span className="w-4 h-4 rounded-full bg-brand-pink text-white text-[10px] font-bold flex items-center justify-center">
                  {totalUnread}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('active')}
                className={`px-3 py-1 rounded-full text-xs flex-shrink-0 transition-colors ${
                  activeFilter === 'active'
                    ? 'bg-brand-dark text-white font-semibold'
                    : 'bg-[#F4F5F9] hover:bg-slate-200/70 text-brand-muted hover:text-brand-dark font-medium'
                }`}
              >
                Active Bookings
              </button>
              <button
                type="button"
                onClick={() => setActiveFilter('archived')}
                className={`px-3 py-1 rounded-full text-xs flex-shrink-0 transition-colors ${
                  activeFilter === 'archived'
                    ? 'bg-brand-dark text-white font-semibold'
                    : 'bg-[#F4F5F9] hover:bg-slate-200/70 text-brand-muted hover:text-brand-dark font-medium'
                }`}
              >
                Archived
              </button>
            </div>
          </div>

          {/* Conversation Rows List */}
          <div className="flex-1 overflow-y-auto divide-y divide-transparent space-y-1 p-2">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-brand-muted">
                No conversations found matching &quot;{searchQuery}&quot;
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = conv.id === selectedId;
                const lastMsg = conv.messages[conv.messages.length - 1];

                return (
                  <div
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    className={`relative p-3 rounded-xl flex gap-3 items-center cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-[#F4F2FF] border-l-4 border-brand-purple shadow-xs'
                        : 'hover:bg-slate-50'
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        alt={conv.name}
                        src={conv.avatar}
                        className={`w-12 h-12 rounded-full object-cover ${
                          isSelected ? 'ring-2 ring-brand-purple/20' : ''
                        }`}
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full ring-2 ring-white ${
                          conv.online ? 'bg-emerald-500' : 'bg-slate-300'
                        }`}
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="font-bold text-sm text-brand-dark truncate">{conv.name}</span>
                          {conv.verified && (
                            <span
                              className="material-symbols-outlined text-brand-blue text-[15px]"
                              style={{ fontVariationSettings: "'FILL' 1" }}
                            >
                              verified
                            </span>
                          )}
                        </div>
                        <span
                          className={`text-xs flex-shrink-0 ${
                            conv.unreadCount > 0 ? 'font-semibold text-brand-pink' : 'text-brand-muted'
                          }`}
                        >
                          {conv.lastMessageTime}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 text-xs text-brand-muted mb-1 truncate">
                        <span className="material-symbols-outlined text-[13px] text-brand-blue">
                          {conv.tradeIcon}
                        </span>
                        <span className="truncate">{conv.tradeSubtitle}</span>
                      </div>

                      <div className="flex items-center justify-between gap-2">
                        <p
                          className={`text-xs truncate ${
                            conv.unreadCount > 0 ? 'font-medium text-brand-dark' : 'text-brand-muted'
                          }`}
                        >
                          {lastMsg ? lastMsg.text : 'No messages yet'}
                        </p>
                        {conv.unreadCount > 0 ? (
                          <span className="w-4 h-4 rounded-full bg-brand-pink text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0 shadow-xs">
                            {conv.unreadCount}
                          </span>
                        ) : (
                          <span
                            className="material-symbols-outlined text-brand-blue text-[15px] flex-shrink-0"
                            style={{ fontVariationSettings: "'FILL' 1" }}
                          >
                            done_all
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Compact Footer Strip in Conversations */}
          <div className="p-3 bg-[#FBFBFE] border-t border-[#EFF2F8] flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-brand-muted font-medium">
              <span className="material-symbols-outlined text-[17px] text-brand-purple">support_agent</span>
              <span>Kaarya Concierge</span>
            </div>
            <button
              type="button"
              onClick={() => setShowConciergeModal(true)}
              className="text-brand-pink hover:text-brand-purple font-semibold flex items-center gap-0.5 transition-colors"
            >
              <span>Help Desk</span>
              <span className="material-symbols-outlined text-[13px]">arrow_outward</span>
            </button>
          </div>
        </aside>

        {/* RIGHT PANEL: Active Chat (~70% width, flex-1) */}
        <section
          className={`${
            mobileChatOpen ? 'flex' : 'hidden md:flex'
          } flex-1 flex-col bg-[#FAFAFE] h-full overflow-hidden`}
        >
          {/* Chat Header */}
          <div className="px-5 py-3.5 bg-white border-b border-[#EEF2F9] flex items-center justify-between gap-3 shadow-xs z-10">
            <div className="flex items-center gap-3 min-w-0">
              {/* Mobile Back to List Button */}
              <button
                type="button"
                onClick={() => setMobileChatOpen(false)}
                className="md:hidden w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center text-brand-dark"
                aria-label="Back to conversations list"
              >
                <span className="material-symbols-outlined text-[20px]">arrow_back</span>
              </button>

              <div className="relative flex-shrink-0">
                <img
                  alt={activeChat.name}
                  src={activeChat.chatAvatar || activeChat.avatar}
                  className="w-11 h-11 rounded-full object-cover ring-2 ring-brand-purple/20"
                />
                <span
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-white ${
                    activeChat.online ? 'bg-emerald-500' : 'bg-slate-300'
                  }`}
                />
              </div>

              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-brand-dark text-base truncate">{activeChat.name}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-blue-50 text-brand-blue text-[11px] font-bold flex items-center gap-1 flex-shrink-0 border border-blue-200/50">
                    <span className="material-symbols-outlined text-[13px]">verified</span>
                    {activeChat.tradeBadge}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-brand-muted">
                  <span className="inline-flex items-center gap-1 text-emerald-600 font-semibold">
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        activeChat.online ? 'bg-emerald-500' : 'bg-slate-400'
                      }`}
                    />
                    {activeChat.online ? 'Available' : 'Offline'}
                  </span>
                  <span className="text-slate-300">·</span>
                  <span className="truncate">{activeChat.statusText}</span>
                </div>
              </div>
            </div>

            {/* Header Actions */}
            <div className="flex items-center gap-2 flex-shrink-0">
              {activeChat.bookingId ? (
                <Link
                  to={`/bookings/${activeChat.bookingId}`}
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-brand-blue bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200/50 transition-colors"
                >
                  <span>View Booking</span>
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                </Link>
              ) : (
                <Link
                  to="/my-bookings"
                  className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-brand-blue bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg border border-blue-200/50 transition-colors"
                >
                  <span>My Bookings</span>
                  <span className="material-symbols-outlined text-[14px]">open_in_new</span>
                </Link>
              )}

              <button
                type="button"
                onClick={() => setShowCallModal('audio')}
                aria-label="Call"
                className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-brand-muted hover:text-brand-dark flex items-center justify-center transition-colors"
                title={`Call ${activeChat.name}`}
              >
                <span className="material-symbols-outlined text-[18px]">call</span>
              </button>
              <button
                type="button"
                onClick={() => setShowCallModal('video')}
                aria-label="Video Call"
                className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-brand-muted hover:text-brand-dark flex items-center justify-center transition-colors"
                title={`Video call ${activeChat.name}`}
              >
                <span className="material-symbols-outlined text-[18px]">videocam</span>
              </button>
              <button
                type="button"
                onClick={() => showToast(`Options for ${activeChat.name}: Mute notifications, Report, Clear chat`)}
                aria-label="More options"
                className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 text-brand-muted hover:text-brand-dark flex items-center justify-center transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">more_vert</span>
              </button>
            </div>
          </div>

          {/* Slim Booking Context Strip */}
          {showBanner && activeChat.bookingTitle && (
            <div className="px-4 py-2 bg-white/80 backdrop-blur border-b border-[#EEF2F9] flex items-center justify-between gap-3 text-xs text-brand-dark shadow-xs">
              <div className="flex items-center gap-2 min-w-0">
                <span className="w-5 h-5 rounded-md bg-blue-50 text-brand-blue flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-[14px]">handyman</span>
                </span>
                <div className="flex items-center gap-1.5 truncate">
                  <span className="font-semibold text-brand-dark truncate">{activeChat.bookingTitle}</span>
                  <span className="text-slate-300">·</span>
                  <span className="text-brand-muted hidden sm:inline truncate">{activeChat.appointmentTime}</span>
                  <span className="text-slate-300 hidden sm:inline">·</span>
                  <span className="font-bold text-brand-pink truncate">{activeChat.agreedPrice}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <Link
                  to={activeChat.bookingId ? `/bookings/${activeChat.bookingId}` : '/my-bookings'}
                  className="text-brand-blue hover:text-brand-purple font-semibold flex items-center gap-1 transition-colors"
                >
                  <span>View Details</span>
                  <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setShowBanner(false)}
                  aria-label="Dismiss banner"
                  className="text-brand-muted hover:text-brand-dark"
                >
                  <span className="material-symbols-outlined text-[15px]">close</span>
                </button>
              </div>
            </div>
          )}

          {/* Spacious Conversation Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 md:p-6 space-y-4 font-body">
            {/* Date Pill */}
            <div className="flex items-center justify-center my-1">
              <span className="px-3 py-1 rounded-full bg-slate-100 text-brand-muted font-sans text-xs font-medium">
                Today, May 24
              </span>
            </div>

            {/* Message Feed */}
            {activeChat.messages.map((msg) => {
              const isWorker = msg.sender === 'worker';

              if (isWorker) {
                return (
                  <div key={msg.id} className="flex items-end gap-2.5 max-w-[85%] sm:max-w-[70%] group">
                    <img
                      alt={activeChat.name}
                      src={activeChat.chatAvatar || activeChat.avatar}
                      className="w-7 h-7 rounded-full object-cover flex-shrink-0 mb-1"
                    />
                    <div className="flex flex-col gap-1">
                      <div className="bg-[#F0F2F9] text-brand-dark rounded-2xl rounded-tl-sm px-4 py-3 text-sm leading-relaxed shadow-xs">
                        {msg.text}
                      </div>
                      <span className="text-[11px] text-brand-muted ml-1">{msg.time}</span>
                    </div>
                  </div>
                );
              }

              return (
                <div key={msg.id} className="flex flex-col items-end gap-1 ml-auto max-w-[85%] sm:max-w-[70%]">
                  <div className="bg-[linear-gradient(135deg,#FF1493_0%,#8B00FF_50%,#0080FF_100%)] text-white font-medium rounded-2xl rounded-tr-sm px-4 py-3 text-sm leading-relaxed text-left shadow-md shadow-pink-500/10 flex flex-col gap-2.5">
                    <p className="text-white">{msg.text}</p>
                    {msg.image && (
                      <div
                        onClick={() => setExpandedImage(msg.image)}
                        className="relative rounded-xl overflow-hidden shadow-sm group/img cursor-pointer max-w-sm border border-white/20"
                      >
                        <img
                          alt="Under-sink plumbing pipe preview"
                          src={msg.image}
                          className="w-full h-40 object-cover group-hover/img:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-between p-2.5 text-white">
                          <span className="text-[11px] font-medium bg-black/40 px-2 py-0.5 rounded-full backdrop-blur-sm">
                            {msg.imageName || 'Attachment.jpg'}
                          </span>
                          <div className="w-6 h-6 rounded-full bg-white/80 text-brand-dark flex items-center justify-center backdrop-blur-md">
                            <span className="material-symbols-outlined text-[15px]">fullscreen</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mr-1 text-[11px] text-brand-muted font-sans">
                    <span>{msg.time}</span>
                    <span>·</span>
                    <span className="text-brand-blue font-medium">{msg.status || 'Delivered'}</span>
                    <span
                      className="material-symbols-outlined text-brand-blue text-[14px]"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      done_all
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Subtle Trust Escrow Pill */}
            <div className="flex items-center justify-center pt-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50/70 border border-blue-100 text-brand-blue text-xs font-medium">
                <span className="material-symbols-outlined text-[15px]">verified_user</span>
                <span>Protected by Kaarya Guaranteed Booking Escrow</span>
              </div>
            </div>

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Shortcuts & Emoji Picker Drawers */}
          {showShortcuts && (
            <div className="border-t border-slate-100 bg-[#FAF9FF] px-4 py-2 flex items-center gap-2 overflow-x-auto">
              <span className="text-xs font-bold text-brand-purple flex-shrink-0 flex items-center gap-1">
                <span className="material-symbols-outlined text-[15px]">bolt</span> Quick:
              </span>
              {QUICK_SHORTCUTS.map((sc, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectShortcut(sc)}
                  className="px-2.5 py-1 rounded-full bg-white text-xs text-brand-dark hover:border-brand-purple border border-slate-200/80 shadow-xs flex-shrink-0 transition-colors"
                >
                  {sc}
                </button>
              ))}
            </div>
          )}

          {showEmojiPicker && (
            <div className="border-t border-slate-100 bg-white px-4 py-2 flex items-center gap-3 overflow-x-auto">
              <span className="text-xs font-semibold text-brand-muted flex-shrink-0">Reactions:</span>
              {EMOJI_LIST.map((emoji, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleAddEmoji(emoji)}
                  className="text-lg hover:scale-125 transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* Fixed-Height Message Composer */}
          <div className="border-t border-[#EFF2F8] bg-white px-4 py-3 z-10">
            <form
              onSubmit={handleSendMessage}
              className="flex items-center gap-2.5 rounded-2xl border border-gray-200 shadow-sm px-3 py-2 bg-white focus-within:border-brand-purple/50 focus-within:ring-2 focus-within:ring-brand-purple/10 transition-all"
            >
              {/* Action Icons */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleSimulateAttachment}
                  aria-label="Attach File"
                  className="w-8 h-8 rounded-lg text-brand-muted hover:text-brand-blue hover:bg-slate-100 flex items-center justify-center transition-colors"
                  title="Attach photo or document"
                >
                  <span className="material-symbols-outlined text-[20px]">attach_file</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  aria-label="Emoji"
                  className="w-8 h-8 rounded-lg text-brand-muted hover:text-brand-pink hover:bg-slate-100 flex items-center justify-center transition-colors"
                  title="Emoji"
                >
                  <span className="material-symbols-outlined text-[20px]">mood</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowShortcuts(!showShortcuts)}
                  aria-label="Shortcuts"
                  className="w-8 h-8 rounded-lg text-brand-muted hover:text-brand-purple hover:bg-slate-100 hidden sm:flex items-center justify-center transition-colors"
                  title="Quick reply shortcuts"
                >
                  <span className="material-symbols-outlined text-[20px]">bolt</span>
                </button>
              </div>

              {/* Input Area */}
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Write a message to ${activeChat.name}...`}
                className="flex-1 bg-transparent border-0 px-2 py-1 outline-none text-sm text-brand-dark placeholder:text-brand-muted/70 focus:ring-0"
              />

              {/* Send Button */}
              <button
                type="submit"
                aria-label="Send"
                disabled={!inputText.trim()}
                className={`bg-gradient-to-r from-[#FF1493] via-[#8B00FF] to-[#0080FF] text-white px-5 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 shadow-md shadow-purple-500/20 active:scale-95 transition-all ${
                  inputText.trim() ? 'opacity-100 hover:opacity-95 cursor-pointer' : 'opacity-60 cursor-not-allowed'
                }`}
              >
                <span>Send</span>
                <span className="material-symbols-outlined text-[17px]">send</span>
              </button>
            </form>

            <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-brand-muted">
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px] text-brand-blue">lock</span>
                Calls &amp; chats are recorded for dispute resolution &amp; safety.
              </span>
              <span className="hidden sm:inline">
                Press{' '}
                <kbd className="px-1.5 py-0.5 rounded bg-slate-100 text-brand-dark font-mono text-[10px]">
                  Enter ↵
                </kbd>{' '}
                to send
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* FULLSCREEN IMAGE LIGHTBOX MODAL */}
      {expandedImage && (
        <div
          onClick={() => setExpandedImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in cursor-zoom-out"
        >
          <div className="relative max-w-3xl max-h-[90vh] flex flex-col items-center">
            <button
              type="button"
              onClick={() => setExpandedImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-brand-pink text-sm flex items-center gap-1 bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm"
            >
              <span>Close</span>
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
            <img
              alt="Expanded preview"
              src={expandedImage}
              className="max-w-full max-h-[80vh] rounded-2xl object-contain shadow-2xl border border-white/10"
            />
            <span className="text-white text-xs mt-3 bg-black/50 px-4 py-1.5 rounded-full backdrop-blur-sm">
              IMG_sink_trap.jpg • Under-sink joint photo sent to Rahul Sharma
            </span>
          </div>
        </div>
      )}

      {/* CALL / VIDEO CALL DEMO DIALOG */}
      {showCallModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1c30]/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center shadow-2xl border border-slate-100 flex flex-col items-center gap-4">
            <div className="relative">
              <img
                alt={activeChat.name}
                src={activeChat.chatAvatar || activeChat.avatar}
                className="w-20 h-20 rounded-full object-cover ring-4 ring-brand-purple/20 shadow-md"
              />
              <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-emerald-500 ring-2 ring-white flex items-center justify-center text-white text-[10px]">
                <span className="material-symbols-outlined text-[12px]">
                  {showCallModal === 'video' ? 'videocam' : 'call'}
                </span>
              </span>
            </div>

            <div>
              <h3 className="font-bold text-lg text-brand-dark">{activeChat.name}</h3>
              <p className="text-xs text-brand-muted">{activeChat.tradeSubtitle}</p>
              <div className="flex items-center justify-center gap-1.5 mt-2 text-xs font-semibold text-emerald-600">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span>
                  {showCallModal === 'video' ? 'Connecting Secure Video Call...' : 'Calling via Kaarya VoIP...'}
                </span>
              </div>
            </div>

            <p className="text-[11px] text-brand-muted bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed">
              In this prototype demonstration, phone numbers are masked for mutual safety under the Kaarya Privacy Shield.
            </p>

            <div className="flex items-center gap-3 w-full pt-1">
              <button
                type="button"
                onClick={() => setShowCallModal(null)}
                className="flex-1 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-sm flex items-center justify-center gap-1.5"
              >
                <span className="material-symbols-outlined text-[16px]">call_end</span>
                <span>End Call</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* KAARYA CONCIERGE HELP DESK MODAL */}
      {showConciergeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0b1c30]/75 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-100 flex flex-col gap-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-pink to-brand-purple flex items-center justify-center text-white shadow-sm">
                  <span className="material-symbols-outlined text-[22px]">support_agent</span>
                </div>
                <div>
                  <h3 className="font-bold text-base text-brand-dark">Kaarya Concierge</h3>
                  <p className="text-xs text-brand-muted">24/7 Booking Support &amp; Dispute Protection</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowConciergeModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors"
                aria-label="Close modal"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            <div className="space-y-2.5 text-xs text-brand-dark">
              <div className="p-3 rounded-xl bg-[#F8F9FE] border border-slate-100 flex items-start gap-2.5">
                <span className="material-symbols-outlined text-brand-purple text-[18px] mt-0.5">verified_user</span>
                <div>
                  <h4 className="font-bold">Escrow Payment Protection</h4>
                  <p className="text-brand-muted mt-0.5">
                    Your payments are held securely and only released when you confirm satisfactory service completion.
                  </p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#F8F9FE] border border-slate-100 flex items-start gap-2.5">
                <span className="material-symbols-outlined text-brand-blue text-[18px] mt-0.5">schedule</span>
                <div>
                  <h4 className="font-bold">Guaranteed On-Time Arrival</h4>
                  <p className="text-brand-muted mt-0.5">
                    If your confirmed professional is delayed by more than 30 minutes without prior notice, Kaarya will dispatch an alternate verified specialist.
                  </p>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowConciergeModal(false)}
              className="w-full py-2.5 rounded-full bg-brand-dark text-white text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm"
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {/* QUICK TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 max-w-sm w-[calc(100%-2rem)] bg-slate-900 text-white text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center justify-between gap-3 animate-fade-in border border-slate-700">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-brand-cyan text-[18px]">info</span>
            <span>{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-white"
            aria-label="Dismiss toast"
          >
            <span className="material-symbols-outlined text-[15px]">close</span>
          </button>
        </div>
      )}
    </div>
  );
}
