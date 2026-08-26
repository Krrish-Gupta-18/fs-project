import React from 'react';
import { useChat } from '../hooks/useChat';
import { Sidebar } from '../components/chat/Sidebar';
import { ChatHeader } from '../components/chat/ChatHeader';
import { MessageList } from '../components/chat/MessageList';
import { MessageInput } from '../components/chat/MessageInput';
import { InfoPanel } from '../components/chat/InfoPanel';
import { NewChatModal } from '../components/chat/NewChatModal';
import { MediaViewer } from '../components/chat/MediaViewer';

export function ChatPage() {
  const {
    conversations,
    activeConversation,
    activeMessages,
    userProfile,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    isInfoPanelOpen,
    setIsInfoPanelOpen,
    isNewChatModalOpen,
    setIsNewChatModalOpen,
    lightboxImage,
    setLightboxImage,
    selectConversation,
    sendMessage,
    startNewConversation,
    mockContacts,
  } = useChat();

  return (
    <div className="flex h-screen w-screen bg-gray-100 text-gray-800 overflow-hidden">
      {/* Sidebar */}
      <div
        className={`
          fixed md:relative inset-y-0 left-0 z-30 w-72 md:w-80 flex-shrink-0 transition-transform duration-200
          ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <Sidebar
          userProfile={userProfile}
          conversations={conversations}
          activeConversationId={activeConversation?.id}
          onSelectConversation={selectConversation}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onNewChatClick={() => setIsNewChatModalOpen(true)}
        />
      </div>

      {/* Main Chat */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-white">
        <ChatHeader
          conversation={activeConversation}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          onToggleInfoPanel={() => setIsInfoPanelOpen(!isInfoPanelOpen)}
          isInfoPanelOpen={isInfoPanelOpen}
        />

        <MessageList
          messages={activeMessages}
          currentUser={userProfile}
          onImageClick={setLightboxImage}
          activeConversation={activeConversation}
        />

        {activeConversation && (
          <MessageInput onSendMessage={sendMessage} />
        )}
      </div>

      {/* Info Panel */}
      {isInfoPanelOpen && activeConversation && (
        <InfoPanel
          conversation={activeConversation}
          onClose={() => setIsInfoPanelOpen(false)}
          onImageClick={setLightboxImage}
        />
      )}

      {/* New Chat Modal */}
      <NewChatModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        contacts={mockContacts}
        onSelectContact={startNewConversation}
      />

      {/* Media Viewer */}
      <MediaViewer
        imageUrl={lightboxImage}
        onClose={() => setLightboxImage(null)}
      />
    </div>
  );
}
