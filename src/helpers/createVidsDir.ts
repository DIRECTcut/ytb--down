import fs from 'fs';
import config from '../config';

export default function createVidsDir() {
  if (!fs.existsSync(config.VIDS_FOLDER_PATH)) {
    fs.mkdirSync(config.VIDS_FOLDER_PATH);
  }
}
