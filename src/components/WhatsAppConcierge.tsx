import React, { useState } from 'react';
import { MessageSquare, X, Send, PhoneCall, Sparkles } from 'lucide-react';

export const WhatsAppConcierge: React.FC = () => {
  const [showPrompt, setShowPrompt] = useState<boolean>(true);
  const [isOpenChat, setIsOpenChat] = useState<boolean>(false);
  const [userMsg, setUserMsg] = useState<string>('');

  const QUICK_TOPICS = [
    'Need help with my prescription upload',
    'Inquire about 3-Day Home Try-On box',
    'Custom Bespoke Frame design query',
    'Track my existing courier order',
  ];

  const handleSendToWhatsApp = (text: string) => {
    const encoded = encodeURIComponent(text);
    window.open(`https://wa.me/923245908220?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 text-left">
      {/* Dismissible Prompt Bubble */}
      {showPrompt && !isOpenChat && (
        <div className="mb-3 bg-white border border-slate-200 shadow-xl rounded-2xl p-3.5 max-w-xs text-xs text-slate-800 relative animate-in fade-in slide-in-from-bottom-2">
          <button
            onClick={() => setShowPrompt(false)}
            className="absolute top-2 right-2 text-slate-400 hover:text-black p-1"
            aria-label="Dismiss prompt"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-start gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-ping shrink-0 mt-1" />
            <div>
              <p className="font-bold text-[#0f172a]">Optical Specialist Online</p>
              <p className="text-slate-600 text-xs mt-0.5 leading-normal">
                "Need help with your prescription or frame sizing?"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quick Chat Popover */}
      {isOpenChat && (
        <div className="mb-4 bg-white border border-slate-200 shadow-2xl rounded-2xl w-80 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          {/* Header */}
          <div className="bg-[#25D366] text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <MessageSquare className="w-5 h-5 fill-white" />
              <div>
                <h4 className="font-bold text-sm">Nazar WhatsApp Concierge</h4>
                <p className="text-xs text-white/95">Licensed Optometrists Active</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpenChat(false)}
              className="text-white hover:opacity-80 p-1"
              aria-label="Close WhatsApp chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Quick Topics */}
          <div className="p-4 space-y-2 text-xs">
            <p className="text-slate-600 font-bold uppercase text-xs">Select a quick question:</p>
            {QUICK_TOPICS.map((topic, idx) => (
              <button
                key={idx}
                onClick={() => handleSendToWhatsApp(topic)}
                className="w-full text-left p-2 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-semibold transition-colors"
              >
                {topic}
              </button>
            ))}

            <div className="pt-2 border-t border-slate-200 space-y-2">
              <textarea
                rows={2}
                placeholder="Type your custom question..."
                value={userMsg}
                onChange={(e) => setUserMsg(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-lg text-xs focus:outline-none resize-none"
              />
              <button
                onClick={() => handleSendToWhatsApp(userMsg || 'Hello Nazar.pk!')}
                className="w-full py-2 bg-[#25D366] text-white font-bold rounded-lg flex items-center justify-center gap-2"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Start WhatsApp Chat</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpenChat(!isOpenChat)}
        className="w-13 h-13 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-2xl transition-transform active:scale-95 group relative"
        aria-label="WhatsApp Concierge"
      >
        <MessageSquare className="w-6 h-6 fill-white" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-300 rounded-full border-2 border-white" />
      </button>
    </div>
  );
};
