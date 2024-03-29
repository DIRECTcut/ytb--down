import { validateID, getInfo } from 'ytdl-core';

export default async function getVideoTitle(videoID: string): Promise<string|undefined> {
  const isIDValid = validateID(videoID);

  if (!isIDValid) return undefined;

  const videoInfo = await getInfo(videoID);
  const videoTitle = videoInfo.videoDetails.title;

  return `${Buffer.from(videoTitle).toString('base64').slice(0, 5)}.mp4`;
}
