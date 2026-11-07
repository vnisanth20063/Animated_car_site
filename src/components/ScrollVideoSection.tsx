import type { Service } from '../data/services';
import { useLiteMotion } from '../hooks/useMedia';
import VideoChapter from './VideoChapter';
import FrameChapter from './FrameChapter';

interface Props { service: Service; index: number; total: number }

/** Desktop: pinned scroll-scrubbed video. Phones and tablets: sticky canvas frame sequence (smooth native scroll). */
export default function ScrollVideoSection(props: Props) {
  const lite = useLiteMotion();
  return lite ? <FrameChapter {...props} /> : <VideoChapter {...props} />;
}
