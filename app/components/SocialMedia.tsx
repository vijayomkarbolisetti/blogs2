"use client";

import { Facebook, Twitter, MessageCircle } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import whatsapp from "../../public/whatsapp.svg"; 

const SocialMediaShare = ({ postTitle, postUrl }) => {
  const [copied, setCopied] = useState(false);

  const encodedTitle = encodeURIComponent(postTitle);
  const encodedUrl = encodeURIComponent(postUrl);

  const socialLinks = {
    whatsapp: `https://api.whatsapp.com/send?text=${encodedTitle} - ${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(postUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-4 mt-4 border-t pt-4">
      <p className="text-gray-700 font-medium">Share this post:</p>
      
  
      <a href={socialLinks.whatsapp} target="_blank" rel="noopener noreferrer" className="text-green-600 hover:text-green-700">
        <Image src={whatsapp} alt="WhatsApp" className="w-6 h-6" />
      </a>


      <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700">
        <Facebook size={24} />
      </a>


      <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-500">
        <Twitter size={24} />
      </a>

 
      <button onClick={copyToClipboard} className="text-gray-600 hover:text-gray-800">
        {copied ? "Copied!" : "Copy Link"}
      </button>
    </div>
  );
};

export default SocialMediaShare;
