export type StatusLive = 'offline' | 'live';
export interface Live {
    status: StatusLive;
    isLoading?: boolean;
    vod?: string;
    gameId?: string;
}