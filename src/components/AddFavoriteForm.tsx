import { useState } from "react";
import { Plus } from "lucide-react";

type Props = {
    addFavorite: (title: string, url: string) => void;
};

export const AddFavoriteForm = ({ addFavorite }: Props) => {
    const [inputTitle, setInputTitle] = useState('');
    const [inputUrl, setInputUrl] = useState('');

    const onSubmit = (e: React.FormEvent) => {
        // ページの更新を防ぐ
        e.preventDefault();
        // 親に値を渡す
        addFavorite(inputTitle, inputUrl);
        // 値を空に戻す
        setInputTitle('');
        setInputUrl('');
    };

    return (
        <form className="flex gap-2" onSubmit={onSubmit}>
            <input
                type="text"
                placeholder="タイトル"
                className="grow rounded-s p-2"
                value={inputTitle}
                onChange={(e) => setInputTitle(e.target.value)}
            />
            <input
                type="text"
                placeholder="URL"
                className="grow rounded-s p-2"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
            />
            <button
                type="submit"
                className="rounded-e p-2 transition-colors hover:bg-blue-800 disabled:bg-gray-400"
                disabled={!inputTitle || !inputUrl}
            >
                <Plus className="text-white" />
            </button>
        </form>
    )
}