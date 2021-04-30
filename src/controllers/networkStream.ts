import { NextFunction, Request, Response } from 'express';
import path from 'path';
import ytdl from 'ytdl-core';
import fs from 'fs';
import config from '../config';
import getVideoTitle from '../helpers/getVideoTitle';

export default async (req: Request, res: Response, next: NextFunction) => {
  const fileName = await getVideoTitle(req.body.videoID);
  const filePath = path.join(config.VIDS_FOLDER_PATH, fileName ?? 'VIDEO');

  const stream = ytdl(req.body.videoID, { quality: req.body.quality });

  // fs.stat(filePath, (err) => {
  //   if (err) {
  //     next(err);
  //   }
  // })

  let writeStream = fs.createWriteStream(filePath);
  stream.pipe(writeStream);

  stream.on('error', (streamErr) => {
    res.removeHeader('Content-Type');
    res.status(400).send({ error: streamErr.message });
  });

  stream.on('finish', () => {
    const networkStreamUrl = `${req.protocol
      }://${path.join(req.get('host') as string, 'vids', fileName)}`;

    res.json(networkStreamUrl);
  });
};
