import { Request, Response, NextFunction } from 'express';
import ytdl from 'ytdl-core';

export default async (req: Request, res: Response, next: NextFunction) => {
  const stream = ytdl(req.body.videoID, { quality: req.body.quality });

  res.setHeader('Content-Type', 'video/mp4');
  res.setHeader('Content-Disposition', 'attachment');

  stream.pipe(res);

  stream.on('error', (err: Error) => {
    res.removeHeader('Content-Type');
    res.status(400).send({ error: err.message });
    next();
  });
};
