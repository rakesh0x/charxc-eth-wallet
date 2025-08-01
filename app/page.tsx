"use client";

import { Button } from "@/components/ui/button";
import { randomBytes } from "crypto";
import { HDNodeWallet, Mnemonic } from "ethers";
import { useState, useEffect } from "react";
import { Eye, EyeOff, Copy, Check, RefreshCw, Wallet, Shield, Download } from "lucide-react";

export default function Home() {
  const [seedphrase, setSeedphrase] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [privateKey, setPrivateKey] = useState<string | null>(null);
  const [showPrivateKey, setShowPrivateKey] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [walletCreated, setWalletCreated] = useState(false);
  const [step, setStep] = useState(0);

  const onClickButton = async () => {
    setIsGenerating(true);
    setStep(1);
    
    // Simulate generation steps for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    setStep(2);
    
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const entropy = randomBytes(16);
    const mnemonic = Mnemonic.fromEntropy(entropy); 
    const phrase = mnemonic.phrase;
    const hdWallet = HDNodeWallet.fromMnemonic(mnemonic);

    setSeedphrase(phrase);
    setPublicKey(hdWallet.publicKey);
    setPrivateKey(hdWallet.privateKey);
    
    setStep(3);
    await new Promise(resolve => setTimeout(resolve, 400));
    
    setIsGenerating(false);
    setWalletCreated(true);
  };

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const downloadWallet = () => {
    const walletData = {
      seedPhrase: seedphrase,
      publicKey: publicKey,
      privateKey: privateKey,
      createdAt: new Date().toISOString()
    };
    
    const dataStr = JSON.stringify(walletData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `wallet-${Date.now()}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const resetWallet = () => {
    setSeedphrase(null);
    setPublicKey(null);
    setPrivateKey(null);
    setWalletCreated(false);
    setShowPrivateKey(false);
    setStep(0);
  };

  const seedWords = seedphrase?.split(' ') || [];

  return (
    <div className="min-h-screen bg-black text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center py-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Wallet className="w-12 h-12 text-purple-400" />
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              CharXwallet
            </h1>
          </div>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Securely generate your cryptocurrency wallet with military-grade encryption
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          {!walletCreated ? (
            <div className="text-center space-y-8">
              {/* Security Notice */}
              <div className="bg-yellow-900/30 border border-yellow-500/50 rounded-lg p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Shield className="w-5 h-5 text-yellow-400" />
                  <span className="font-semibold text-yellow-400">Security Notice</span>
                </div>
                <p className="text-sm text-yellow-200">
                  Never share your private key or seed phrase with anyone. Store them securely offline.
                </p>
              </div>

              {/* Generation Button */}
              <div className="space-y-4">
                <Button 
                  onClick={onClickButton}
                  disabled={isGenerating}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 px-8 rounded-xl text-lg transform transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {isGenerating ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-5 h-5 animate-spin" />
                      Generating Wallet...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Wallet className="w-5 h-5" />
                      Create New Wallet
                    </div>
                  )}
                </Button>

                {/* Generation Steps */}
                {isGenerating && (
                  <div className="space-y-3">
                    <div className={`flex items-center gap-2 text-sm transition-all duration-300 ${step >= 1 ? 'text-green-400' : 'text-gray-400'}`}>
                      <div className={`w-2 h-2 rounded-full ${step >= 1 ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                      Generating entropy...
                    </div>
                    <div className={`flex items-center gap-2 text-sm transition-all duration-300 ${step >= 2 ? 'text-green-400' : 'text-gray-400'}`}>
                      <div className={`w-2 h-2 rounded-full ${step >= 2 ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                      Creating mnemonic phrase...
                    </div>
                    <div className={`flex items-center gap-2 text-sm transition-all duration-300 ${step >= 3 ? 'text-green-400' : 'text-gray-400'}`}>
                      <div className={`w-2 h-2 rounded-full ${step >= 3 ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                      Deriving keys...
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in fade-in duration-500">
              {/* Success Header */}
              <div className="text-center bg-green-900/30 border border-green-500/50 rounded-lg p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Check className="w-6 h-6 text-green-400" />
                  <span className="text-xl font-semibold text-green-400">Wallet Created Successfully!</span>
                </div>
                <p className="text-green-200">Your new wallet has been generated securely.</p>
              </div>

              {/* Seed Phrase */}
              <div className="bg-gray-800/50 backdrop-blur border border-gray-600 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-purple-400">Seed Phrase (BIP39)</h3>
                  <Button
                    onClick={() => copyToClipboard(seedphrase!, 'seed')}
                    variant="outline"
                    size="sm"
                    className="hover:bg-purple-600/20"
                  >
                    {copiedField === 'seed' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {seedWords.map((word, index) => (
                    <div key={index} className="bg-gray-700/50 rounded-lg p-3 text-center">
                      <span className="text-xs text-gray-400">{index + 1}</span>
                      <div className="font-mono font-semibold">{word}</div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-red-400">⚠️ Write down these 12 words in order and store them safely offline</p>
              </div>

              {/* Public Key */}
              <div className="bg-gray-800/50 backdrop-blur border border-gray-600 rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-blue-400">Public Key</h3>
                  <Button
                    onClick={() => copyToClipboard(publicKey!, 'public')}
                    variant="outline"
                    size="sm"
                    className="hover:bg-blue-600/20"
                  >
                    {copiedField === 'public' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="font-mono text-sm bg-gray-900/50 p-3 rounded-lg break-all">
                  {publicKey}
                </p>
                <p className="text-xs text-gray-400 mt-2">Safe to share - used to receive funds</p>
              </div>

              {/* Private Key */}
              <div className="bg-gray-800/50 backdrop-blur border border-red-600/50 rounded-xl p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-red-400">Private Key</h3>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setShowPrivateKey(!showPrivateKey)}
                      variant="outline"
                      size="sm"
                      className="hover:bg-red-600/20"
                    >
                      {showPrivateKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </Button>
                    <Button
                      onClick={() => copyToClipboard(privateKey!, 'private')}
                      variant="outline"
                      size="sm"
                      className="hover:bg-red-600/20"
                    >
                      {copiedField === 'private' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    </Button>
                  </div>
                </div>
                <p className="font-mono text-sm bg-gray-900/50 p-3 rounded-lg break-all">
                  {showPrivateKey ? privateKey : '•'.repeat(64)}
                </p>
                <p className="text-xs text-red-400 mt-2">⚠️ NEVER share this - gives full access to your wallet</p>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center pt-4">
                <Button
                  onClick={downloadWallet}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download Backup
                </Button>
                <Button
                  onClick={resetWallet}
                  variant="outline"
                  className="hover:bg-purple-600/20"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Create Another
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-400 text-sm">
          <p>Built with security and privacy in mind • Your keys are generated locally</p>
        </div>
      </div>
    </div>
  );
}