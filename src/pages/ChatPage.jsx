import React from 'react';
import { useChat } from '../hooks/useChat';
import { Sidebar } from '../components/chat/Sidebar';
import { ChatHeader } from '../components/chat/ChatHeader';
import { MessageList } from '../components/chat/MessageList';
import { MessageInput } from '../components/chat/MessageInput';
import { InfoPanel } from '../components/chat/InfoPanel';
import { NewChatModal } from '../components/chat/NewChatModal';
import { MediaViewer } from '../components/chat/MediaViewer';
import { RefreshCw, AlertTriangle } from 'lucide-react';

export function ChatPage() {
  const {
    isLoading,
    isError,
    errorMessage,
    refetchData,
    conversations,
    activeConversation,
    activeMessages,
    userProfile,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    isTyping,
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

  // 1. Loading State UI Representation
  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="flex flex-col items-center space-y-3">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <h2 className="text-base font-bold text-gray-700">Loading ChatFlow...</h2>
          <p className="text-xs text-gray-500">Fetching conversations and messages</p>
        </div>
      </div>
    );
  }

  // 2. Error State UI Representation
  if (isError) {
    return (
      <div className="h-screen w-screen bg-gray-100 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full text-center space-y-4 border border-gray-200">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">Connection Error</h2>
            <p className="text-xs text-gray-500 mt-1">{errorMessage}</p>
          </div>
          <button
            onClick={() => refetchData()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2.5 px-4 rounded-md flex items-center justify-center gap-2 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Loading</span>
          </button>
        </div>
      </div>
    );
  }

  // 3. Successful Data State UI Representation
  return (
    <div className="flex h-screen w-screen bg-gray-100 text-gray-800 overflow-hidden">
      {/* Sidebar Drawer Container */}
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

      {/* Main Chat Window */}
      <div className="flex-1 flex flex-col h-full min-w-0 bg-white">
        <ChatHeader
          conversation={activeConversation}
          isTyping={isTyping}
          onToggleMobileSidebar={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          onToggleInfoPanel={() => setIsInfoPanelOpen(!isInfoPanelOpen)}
          isInfoPanelOpen={isInfoPanelOpen}
        />

        <MessageList
          messages={activeMessages}
          currentUser={userProfile}
          isTyping={isTyping}
          onImageClick={setLightboxImage}
          activeConversation={activeConversation}
        />

        {activeConversation && (
          <MessageInput onSendMessage={sendMessage} />
        )}
      </div>

      {/* Right Info Panel */}
      {isInfoPanelOpen && activeConversation && (
        <InfoPanel
          conversation={activeConversation}
          onClose={() => setIsInfoPanelOpen(false)}
          onImageClick={setLightboxImage}
        />
      )}

      {/* Modal Dialogs */}
      <NewChatModal
        isOpen={isNewChatModalOpen}
        onClose={() => setIsNewChatModalOpen(false)}
        contacts={mockContacts}
        onSelectContact={startNewConversation}
      />

      <MediaViewer
        imageUrl={lightboxImage}
        onClose={() => setLightboxImage(null)}
      />
    </div>
  );
}
