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
  }
}


export default function Home() {
  const { setTheme } = useTheme()
  const playerRef = useRef<YouTube>(null);
  const videoId = '4SIfagZps6w';
  const [inputValue, setInputValue] = useState(30);

  useEffect(() => {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    if (firstScriptTag && firstScriptTag.parentNode) {
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  }, []);

  const handleClick = async () => {
    if (playerRef.current) {
      const player = await playerRef.current.getInternalPlayer();
      player.playVideo();
  
      setTimeout(async () => {
        if (playerRef.current) {
          const player = await playerRef.current.getInternalPlayer();
          player.stopVideo();
        }
      }, inputValue * 60000);
    }
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
          <InputNumber size="large" min={1} max={120} defaultValue={30} onChange={value => {
            if (value !== null) {
              setInputValue(value);
            }
          }} />
        </Space>
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl pl-2">
          min.
        </h1>
      </div>
      <div className="flex items-center justify-center pt-4">
        <Button onClick={handleClick}>Oyasumi!</Button>
      </div>
      <div className="flex items-center justify-center pt-4">
        <YouTube videoId={videoId} ref={playerRef} />
      </div>
    </div>
  );
}