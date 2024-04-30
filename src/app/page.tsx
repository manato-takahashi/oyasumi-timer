"use client"

import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import type { InputNumberProps } from "antd";
import { InputNumber, Space } from "antd";
import YouTube from "react-youtube";

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
 
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

// グローバルスコープでonYouTubeIframeAPIReadyを定義
// window.onYouTubeIframeAPIReady = () => {};

export default function Home() {
  const { setTheme } = useTheme()
  const playerRef = useRef(null);
  const videoId = '4SIfagZps6w';
  const [countdown, setCountdown] = useState(30);

  useEffect(() => {
    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player('player', {
        events: {
          'onReady': onPlayerReady,
        }
      });
    };

    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
  }, []);

  useEffect(() => {
    if (countdown === 0 && playerRef.current && typeof playerRef.current.stopVideo === 'function') {
      playerRef.current.stopVideo();
    }
  }, [countdown]);

  const onPlayerReady = (event) => {
    event.target.playVideo();
  }

  const handleClick = () => {
    setCountdown(30);
    console.log('handleClick');
    const intervalId = setInterval(() => {
      setCountdown(prevCountdown => {
        if (prevCountdown <= 1) {
          clearInterval(intervalId);
          return 0;
        }
        return prevCountdown - 1;
      });
    }, 60000); // 1分ごとにカウントダウン
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="absolute top-2 right-2 p-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="flex items-center justify-center">
        <Space wrap>
          <InputNumber size="large" min={1} max={120} defaultValue={30} onChange={value => setCountdown(value)} />
        </Space>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl pl-2">
          min.
        </h1>
      </div>
      <div className="flex items-center justify-center pt-4">
        <Button onClick={handleClick}>Oyasumi!</Button>
      </div>
      <div className="flex items-center justify-center pt-4">
        <YouTube videoId={videoId} ref={playerRef} id="player"/>
      </div>
    </div>
  );
}