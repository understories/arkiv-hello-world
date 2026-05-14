'use client';

import { useState, useEffect } from 'react';

interface Message {
  id: string; // Entity key
  text: string;
  wallet: string;
  createdAt: string;
  txHash?: string; // Transaction hash
}

type LastWrite = { entityKey: string; txHash: string };

export default function ArkivHelloWorld() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [lastWrite, setLastWrite] = useState<LastWrite | null>(null);

  // Load messages on mount
  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/serverless-dapp101/messages');
      const data = await res.json();
      if (data.ok) {
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      setSubmitting(true);
      const res = await fetch('/api/serverless-dapp101/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: newMessage }),
      });
      const data = await res.json();
      
      if (data.ok) {
        setNewMessage('');
        if (data.entityKey && data.txHash) {
          setLastWrite({ entityKey: data.entityKey, txHash: data.txHash });
        }
        // Reload messages after a short delay (indexer lag)
        setTimeout(loadMessages, 2000);
      } else {
        alert('Error: ' + (data.error || 'Failed to submit'));
      }
    } catch (error) {
      console.error('Error submitting message:', error);
      alert('Error submitting message');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pt-20 pb-8 px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-4">
            <h1 className="text-3xl font-bold text-gray-900">
              🌍 Arkiv Hello World
            </h1>
          </div>
          <p className="text-gray-600 mb-6">
            A simple decentralized message board powered by Arkiv
          </p>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800 mb-2">
              <strong>What makes this special?</strong> These messages are stored on Arkiv, 
              a decentralized database. They're not in a traditional database - they're on-chain 
              and independently verifiable!
            </p>
            <p className="text-xs text-blue-700 mb-2">
              🌐 Connected to <strong>Braga Testnet</strong> •
              Each message is stored as an <strong>entity</strong> (created via a <strong>transaction</strong>) • 
              Click links below to verify on the explorer
            </p>
            <p className="text-xs text-blue-700">
              <strong>Note:</strong> Messages on this demo page are signed by a wallet saved as an 
              environmental variable. When you create your own version, you'll use your own wallet 
              (don't worry; no funds needed), but your messages will still appear here!
            </p>
          </div>

          {lastWrite && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <p className="text-sm font-semibold text-green-800 mb-1">Posted! Both views on the Braga explorer:</p>
              <div className="flex flex-wrap gap-4 text-xs font-mono">
                <a
                  href={`https://explorer.braga.hoodi.arkiv.network/entity/${lastWrite.entityKey}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-700 hover:underline"
                >
                  Entity: {lastWrite.entityKey.slice(0, 16)}...
                </a>
                <a
                  href={`https://explorer.braga.hoodi.arkiv.network/tx/${lastWrite.txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-700 hover:underline"
                >
                  Transaction: {lastWrite.txHash.slice(0, 16)}...
                </a>
              </div>
            </div>
          )}

          <form onSubmit={submitMessage} className="mb-6">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Write a message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={submitting}
              />
              <button
                type="submit"
                disabled={submitting || !newMessage.trim()}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Post'}
              </button>
            </div>
          </form>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Messages</h2>
              <button
                onClick={loadMessages}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading messages...</div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No messages yet. Be the first to post!
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                  >
                    <p className="text-gray-900 mb-2">{msg.text}</p>
                    <div className="flex flex-col gap-2 text-sm text-gray-500">
                      <div className="flex justify-between items-center">
                        <div className="flex gap-4">
                          <span>Wallet: {msg.wallet.slice(0, 10)}...</span>
                          <span>{new Date(msg.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                      <div className="flex gap-4 items-center pt-1 border-t border-gray-100">
                        <div className="flex flex-col gap-1">
                          <span className="text-xs font-semibold text-gray-400 uppercase">Entity</span>
                          <a
                            href={`https://explorer.braga.hoodi.arkiv.network/entity/${msg.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-700 hover:underline text-xs font-mono"
                            title="View entity details on explorer"
                          >
                            {msg.id.slice(0, 16)}... →
                          </a>
                        </div>
                        {msg.txHash && (
                          <div className="flex flex-col gap-1">
                            <span className="text-xs font-semibold text-gray-400 uppercase">Transaction</span>
                            <a
                              href={`https://explorer.braga.hoodi.arkiv.network/tx/${msg.txHash}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700 hover:underline text-xs font-mono"
                              title="View transaction details on explorer"
                            >
                              {msg.txHash.slice(0, 16)}... →
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="font-semibold mb-2">What's happening here?</h3>
            <ul className="text-sm text-gray-600 space-y-1 mb-4">
              <li>• Messages are stored as <strong>entities</strong> on Arkiv (decentralized database)</li>
              <li>• Creating an entity is also a <strong>transaction</strong> on the blockchain</li>
              <li>• <strong>Entity</strong> = the data (your message, attributes, payload)</li>
              <li>• <strong>Transaction</strong> = the blockchain operation that creates/records that entity</li>
              <li>• Every entity is stamped with a <strong>project attribute</strong> so this app only reads its own data on shared Braga</li>
              <li>• No central database required!</li>
            </ul>
            <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
              <p className="font-semibold mb-1">💡 Understanding Entities vs Transactions:</p>
              <p>When you create a message, you get both an <strong>entity key</strong> (identifier for the data) and a <strong>transaction hash</strong> (identifier for the blockchain operation). Click the links above to see both on the explorer!</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
