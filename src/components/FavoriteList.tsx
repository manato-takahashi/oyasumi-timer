import { Video } from '../types/video';
import { Heart } from 'lucide-react';

type Props = {
    favoriteList: Video[];
    changeFavorited: (id: number) => void;
};

export const FavoriteList = ({ favoriteList, changeFavorited }: Props) => {
    return (
        <div className="space-y-3">
            {favoriteList.filter(video => video.favorite).map((video) => (
                <div 
                    key={video.id}
                    className="flex items-center rounded p-2"
                >
                    <label className="flex grow items-center gap-3 hover:cursor-pointer">
                        <span className="flex items-center justify-start">{video.title}</span>
                        <div className="flex items-center justify-end">
                            <input
                                type="checkbox"
                                className="sr-only"
                                checked={video.favorite}
                                onChange={() => changeFavorited(video.id)}
                            />
                            <label>
                                <Heart
                                    className="cursor-pointer text-red-500"
                                />
                            </label>
                        </div>
                    </label>
                </div>
            ))}
        </div>
    );
};