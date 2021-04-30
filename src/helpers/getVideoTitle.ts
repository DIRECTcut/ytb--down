import { getInfo } from 'ytdl-core';

export default async function getVideoTitle(videoID: string): Promise<string> {
  const videoInfo = await getInfo(videoID);
  const videoTitle = videoInfo.videoDetails.title;

  return `${Buffer.from(videoTitle).toString('base64').slice(0, 5)}.mp4`;
}
