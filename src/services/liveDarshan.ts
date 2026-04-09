import AsyncStorage from '@react-native-async-storage/async-storage';

import { templeStreams } from '../data/content';
import type { TempleStream, YouTubeLiveStatus } from '../types/models';

const YOUTUBE_API_KEY = process.env.EXPO_PUBLIC_YOUTUBE_API_KEY?.trim();
const YOUTUBE_API_BASE = 'https://www.googleapis.com/youtube/v3';
const CACHE_KEY = 'digitalmandir.live-darshan-cache.v1';
export const LIVE_CACHE_TTL_MS = 10 * 60 * 1000;

type CachedLiveStatuses = {
  updatedAt: string;
  statuses: Record<string, YouTubeLiveStatus>;
};

type ChannelLookupResponse = {
  items?: Array<{
    id?: string;
  }>;
};

type SearchLookupResponse = {
  items?: Array<{
    id?: {
      videoId?: string;
    };
    snippet?: {
      title?: string;
      publishedAt?: string;
      thumbnails?: {
        high?: { url?: string };
        medium?: { url?: string };
        default?: { url?: string };
      };
    };
  }>;
};

type VideosLookupResponse = {
  items?: Array<{
    id?: string;
    snippet?: {
      title?: string;
      publishedAt?: string;
      thumbnails?: {
        maxres?: { url?: string };
        high?: { url?: string };
        medium?: { url?: string };
        default?: { url?: string };
      };
    };
  }>;
};

type SearchLookupItem = NonNullable<SearchLookupResponse['items']>[number];
type VideoLookupItem = NonNullable<VideosLookupResponse['items']>[number];

type FetchStatusOptions = {
  preferCached?: boolean;
};

function getNowIsoString() {
  return new Date().toISOString();
}

function buildUrl(path: string, params: Record<string, string>) {
  const searchParams = new URLSearchParams(params);
  return `${YOUTUBE_API_BASE}/${path}?${searchParams.toString()}`;
}

async function fetchJson<T>(url: string) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`YouTube request failed with status ${response.status}`);
  }

  return (await response.json()) as T;
}

function getFallbackStatus(
  temple: TempleStream,
  overrides?: Partial<YouTubeLiveStatus>,
): YouTubeLiveStatus {
  return {
    templeId: temple.id,
    channelId: overrides?.channelId ?? temple.channelId,
    isLive: false,
    lastCheckedAt: overrides?.lastCheckedAt ?? getNowIsoString(),
    ...overrides,
  };
}

async function resolveChannelId(temple: TempleStream) {
  if (temple.channelId) {
    return temple.channelId;
  }

  if (!YOUTUBE_API_KEY) {
    return undefined;
  }

  const response = await fetchJson<ChannelLookupResponse>(
    buildUrl('channels', {
      part: 'id',
      forHandle: temple.channelHandle,
      key: YOUTUBE_API_KEY,
    }),
  );

  return response.items?.[0]?.id;
}

async function findLiveVideo(channelId: string) {
  if (!YOUTUBE_API_KEY) {
    return undefined;
  }

  const response = await fetchJson<SearchLookupResponse>(
    buildUrl('search', {
      part: 'id,snippet',
      channelId,
      eventType: 'live',
      type: 'video',
      maxResults: '1',
      key: YOUTUBE_API_KEY,
    }),
  );

  return response.items?.[0];
}

async function fetchVideoDetails(videoIds: string[]) {
  if (!YOUTUBE_API_KEY || videoIds.length === 0) {
    return {};
  }

  const response = await fetchJson<VideosLookupResponse>(
    buildUrl('videos', {
      part: 'snippet',
      id: videoIds.join(','),
      key: YOUTUBE_API_KEY,
    }),
  );

  return Object.fromEntries(
    (response.items ?? [])
      .filter((item): item is NonNullable<VideosLookupResponse['items']>[number] & { id: string } =>
        Boolean(item.id),
      )
      .map((item) => [item.id, item]),
  );
}

function getThumbnailUrl(
  searchItem?: SearchLookupItem,
  videoItem?: VideoLookupItem,
) {
  return (
    videoItem?.snippet?.thumbnails?.maxres?.url ??
    videoItem?.snippet?.thumbnails?.high?.url ??
    searchItem?.snippet?.thumbnails?.high?.url ??
    videoItem?.snippet?.thumbnails?.medium?.url ??
    searchItem?.snippet?.thumbnails?.medium?.url ??
    videoItem?.snippet?.thumbnails?.default?.url ??
    searchItem?.snippet?.thumbnails?.default?.url
  );
}

export async function getCachedTempleLiveStatuses() {
  const raw = await AsyncStorage.getItem(CACHE_KEY);

  if (!raw) {
    return {
      statuses: {} as Record<string, YouTubeLiveStatus>,
      updatedAt: null as number | null,
      isExpired: true,
    };
  }

  try {
    const parsed = JSON.parse(raw) as CachedLiveStatuses;
    const updatedAt = parsed.updatedAt ? new Date(parsed.updatedAt).getTime() : null;

    return {
      statuses: parsed.statuses ?? {},
      updatedAt,
      isExpired: !updatedAt || Date.now() - updatedAt > LIVE_CACHE_TTL_MS,
    };
  } catch {
    return {
      statuses: {} as Record<string, YouTubeLiveStatus>,
      updatedAt: null as number | null,
      isExpired: true,
    };
  }
}

export async function cacheLiveStatuses(statuses: Record<string, YouTubeLiveStatus>) {
  const payload: CachedLiveStatuses = {
    updatedAt: getNowIsoString(),
    statuses,
  };

  await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(payload));
}

export async function fetchTempleLiveStatus(
  temple: TempleStream,
  options?: FetchStatusOptions,
): Promise<YouTubeLiveStatus> {
  if (options?.preferCached) {
    const cached = await getCachedTempleLiveStatuses();
    const cachedStatus = cached.statuses[temple.id];

    if (cachedStatus) {
      return cachedStatus;
    }
  }

  if (!YOUTUBE_API_KEY) {
    return getFallbackStatus(temple, { error: 'missing_api_key' });
  }

  try {
    const channelId = await resolveChannelId(temple);

    if (!channelId) {
      return getFallbackStatus(temple, { error: 'channel_not_found' });
    }

    const liveItem = await findLiveVideo(channelId);
    const videoId = liveItem?.id?.videoId;

    if (!videoId) {
      return getFallbackStatus(temple, { channelId });
    }

    const details = await fetchVideoDetails([videoId]);
    const video = details[videoId];

    return {
      templeId: temple.id,
      channelId,
      isLive: true,
      liveVideoId: videoId,
      liveTitle: video?.snippet?.title ?? liveItem?.snippet?.title ?? temple.headline,
      thumbnailUrl: getThumbnailUrl(liveItem, video),
      publishedAt: video?.snippet?.publishedAt ?? liveItem?.snippet?.publishedAt,
      lastCheckedAt: getNowIsoString(),
    };
  } catch {
    return getFallbackStatus(temple, { error: 'lookup_failed' });
  }
}

export async function fetchAllTempleLiveStatuses(temples: TempleStream[] = templeStreams) {
  if (!YOUTUBE_API_KEY) {
    return Object.fromEntries(
      temples.map((temple) => [temple.id, getFallbackStatus(temple, { error: 'missing_api_key' })]),
    );
  }

  const resolvedChannels = await Promise.all(
    temples.map(async (temple) => {
      try {
        const channelId = await resolveChannelId(temple);
        return { temple, channelId };
      } catch {
        return { temple, channelId: undefined };
      }
    }),
  );

  const liveResults = await Promise.all(
    resolvedChannels.map(async ({ temple, channelId }) => {
      if (!channelId) {
        return {
          temple,
          channelId,
          liveItem: undefined,
          error: temple.channelId ? 'lookup_failed' : 'channel_not_found',
        } as const;
      }

      try {
        const liveItem = await findLiveVideo(channelId);
        return { temple, channelId, liveItem, error: undefined } as const;
      } catch {
        return { temple, channelId, liveItem: undefined, error: 'lookup_failed' } as const;
      }
    }),
  );

  const videoIds = liveResults
    .map((result) => result.liveItem?.id?.videoId)
    .filter((value): value is string => Boolean(value));

  const videoDetails = await fetchVideoDetails(videoIds);
  const statuses = Object.fromEntries(
    liveResults.map((result) => {
      const videoId = result.liveItem?.id?.videoId;
      const video = videoId ? videoDetails[videoId] : undefined;

      const status: YouTubeLiveStatus = videoId
        ? {
            templeId: result.temple.id,
            channelId: result.channelId,
            isLive: true,
            liveVideoId: videoId,
            liveTitle:
              video?.snippet?.title ?? result.liveItem?.snippet?.title ?? result.temple.headline,
            thumbnailUrl: getThumbnailUrl(result.liveItem, video),
            publishedAt: video?.snippet?.publishedAt ?? result.liveItem?.snippet?.publishedAt,
            lastCheckedAt: getNowIsoString(),
          }
        : getFallbackStatus(result.temple, {
            channelId: result.channelId,
            error: result.error,
          });

      return [result.temple.id, status];
    }),
  );

  await cacheLiveStatuses(statuses);

  return statuses;
}

export function mergeTempleStreamsWithStatuses(
  statuses: Record<string, YouTubeLiveStatus>,
  temples: TempleStream[] = templeStreams,
) {
  return temples.map((temple) => {
    const status = statuses[temple.id];

    return {
      ...temple,
      channelId: status?.channelId ?? temple.channelId,
      isLive: status?.isLive ?? false,
      liveVideoId: status?.liveVideoId,
      liveTitle: status?.liveTitle,
      thumbnailUrl: status?.thumbnailUrl,
      lastCheckedAt: status?.lastCheckedAt,
    };
  });
}

export function getTempleStreamById(id: string) {
  return templeStreams.find((temple) => temple.id === id) ?? templeStreams[0]!;
}

export function getYouTubeEmbedUrl(videoId: string) {
  return `https://www.youtube-nocookie.com/embed/${videoId}?playsinline=1&autoplay=1&rel=0&modestbranding=1&enablejsapi=1&origin=https%3A%2F%2Fwww.youtube.com`;
}

export function getYouTubeEmbedHtml(videoId: string) {
  const embedUrl = getYouTubeEmbedUrl(videoId);

  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
    />
    <style>
      html, body {
        margin: 0;
        padding: 0;
        background: #000;
        width: 100%;
        height: 100%;
        overflow: hidden;
      }

      .frame {
        border: 0;
        width: 100%;
        height: 100%;
      }
    </style>
  </head>
  <body>
    <iframe
      class="frame"
      src="${embedUrl}"
      title="Live Darshan Stream"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      allowfullscreen
      referrerpolicy="strict-origin-when-cross-origin"
    ></iframe>
  </body>
</html>`;
}

export function getYouTubeWatchUrl(videoId: string) {
  return `https://www.youtube.com/watch?v=${videoId}`;
}

export function getTempleExternalLiveUrl(temple: TempleStream, liveVideoId?: string) {
  if (liveVideoId) {
    return getYouTubeWatchUrl(liveVideoId);
  }

  return temple.fallbackLiveUrl || temple.channelUrl;
}

export function formatLiveStatusMessage(status?: YouTubeLiveStatus | null) {
  if (!status?.error) {
    return null;
  }

  if (status.error === 'missing_api_key') {
    return 'Add EXPO_PUBLIC_YOUTUBE_API_KEY to enable live status lookup.';
  }

  if (status.error === 'channel_not_found') {
    return 'This temple channel could not be resolved from YouTube yet.';
  }

  return 'We could not refresh the live status right now.';
}

export function getYouTubeError153HelpUrl() {
  return 'https://support.google.com/youtube/answer/3037019';
}
