"use client"

import Image from "next/image";
import React, { useState, useEffect, useRef } from "react";
import type { InputNumberProps } from "antd";
import { InputNumber, Space } from "antd";
import YouTube from "react-youtube";

import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
 
// shadcn-ui components
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { FavoriteList } from "@/components/FavoriteList"
import { AddFavoriteForm } from "@/components/AddFavoriteForm";
import { Video } from "@/types/video"

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
  }
}


export default function Home() {
  const { setTheme } = useTheme()
  const playerRef = useRef<YouTube>(null);
  // const videoId = '4SIfagZps6w';
  const [videoId, setVideoId] = useState('4SIfagZps6w'); // デフォルトは原神のBGM
  const [inputUrl, setInputUrl] = useState(''); // 動画URL
  const [inputValue, setInputValue] = useState(30);
  const [favoriteList, setFavoriteList] = useState<Video[]>(() => {
  // ローカルストレージからお気に入りリストを取得
  const localStorageFavoriteList = localStorage.getItem('favoriteList');

  // 配列に変換
  return JSON.parse(localStorageFavoriteList ?? '[]');
  });

  // ページマウント時に発火
  useEffect(() => {
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    if (firstScriptTag && firstScriptTag.parentNode) {
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }
  }, []);

  // videoIdが変更されたら発火
  useEffect(() => {
    const loadVideo = async () => {
      if (playerRef.current) {
        const player = await playerRef.current.getInternalPlayer();
        if (player) {
          player.loadVideoById(videoId);
        }
      }
    };
  
    (async () => {
      await loadVideo();
    })();
  }, [videoId]);

  // お気に入りリストが変更されたら発火
  useEffect(() => {
    // ローカルストレージにお気に入りリストを保存
    localStorage.setItem('favoriteList', JSON.stringify(favoriteList));
  }, [favoriteList]);

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

  const handleConfirm = () => {
    try {
      const url = new URL(inputUrl);
      let _videoId;
      if (url.hostname === "youtu.be") {
        _videoId = url.pathname.slice(1);
      } else if (url.hostname === "www.youtube.com") {
        _videoId = new URLSearchParams(url.search).get("v");
      }
      if (_videoId) {
        setVideoId(_videoId);
      } else {
        console.error("Invalid video ID");
      }
    } catch (e) {
      console.error("Invalid URL");
    }
  };

  const addFavorite = (title: string, url: string) => {
    setFavoriteList((prevFavoriteList) => {
      const newFavorite = {
        id: Date.now(),
        title,
        url,
        favorite: true,
      };

      return [newFavorite, ...prevFavoriteList];
    });
  };

  const deleteFavorite = (id: number) => {
    setFavoriteList((prevFavoriteList) => {
      const newFavoriteList = prevFavoriteList.filter((video) => video.id !== id);
      
      // Update local storage
      localStorage.setItem('favoriteList', JSON.stringify(newFavoriteList));
      
      return newFavoriteList;
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen overflow-x-hidden">

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
        <Tabs defaultValue="home" className="w-full">
          <TabsList className="flex justify-center">
            <TabsTrigger value="home">Home</TabsTrigger>
            <TabsTrigger value="favorite">Favorite</TabsTrigger>
          </TabsList>
          <TabsContent value="home">
            <div className="flex flex-col sm:flex-row items-center justify-center px-4 sm:px-0">
              <Space wrap>
                <InputNumber size="large" min={1} max={240} defaultValue={60} onChange={value => {
                  if (value !== null) {
                    setInputValue(value);
                  }
                }} />
              </Space>
              <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl pl-2">
                min.
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center px-4 py-2 sm:px-0">
              <Input type="url" placeholder="URL" value={inputUrl} onChange={e => setInputUrl(e.target.value)} />
              <Button type="submit" className="ml-2" onClick={handleConfirm}>Confirm</Button>
            </div>
            <div className="flex items-center justify-center pt-2">
              <Button onClick={handleClick}>Oyasumi!</Button>
            </div>
            <div className="flex items-center justify-center pt-2 aspect-w-16 aspect-h-9 max-w-full">
              <YouTube videoId={videoId} ref={playerRef} className="w-full h-full" />
            </div>
          </TabsContent>
          <TabsContent value="favorite">
            <div className="flex flex-col sm:flex-row items-center justify-center px-4 sm:px-0">
              <AddFavoriteForm addFavorite={addFavorite}/>
            </div>
            <div className="mx-auto mt-10 max-w-xl space-y-10">
              <FavoriteList favoriteList={favoriteList} deleteFavorite={deleteFavorite}/>
            </div>
          </TabsContent>
        </Tabs>
      </div>

    </div>
  );
}