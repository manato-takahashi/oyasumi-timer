import { Video } from '../types/video';
import { Trash2 } from 'lucide-react';

type Props = {
    favoriteList: Video[];
    deleteFavorite: (id: number) => void;
};

export const FavoriteList = ({ favoriteList, deleteFavorite }: Props) => {
    return (
        <>
        <div className="space-y-3 rounded bg-slate-800">
            {favoriteList.filter(video => video.favorite).map((video) => (
                <div 
                    key={video.id}
                    className="flex items-center rounded p-2 space-y-4"
                >
                    <div className="flex justify-between items-center gap-3 w-full">
                        <span className="flex items-center">{video.title}</span>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                className="sr-only"
                                checked={video.favorite}
                                onChange={() => deleteFavorite(video.id)}
                            />
                            <label>
                                <Trash2
                                    className="cursor-pointer text-red-300 hover:text-red-700"
                                    onClick={() => deleteFavorite(video.id)}
                                />
                            </label>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        {/* お気に入りがない場合 */}
        {favoriteList.filter(video => video.favorite).length === 0 && (
            <p className="text-center text-sm">お気に入りがありません</p>
        )}
        </>
    );
};