import { getStreamRevealRate } from '@/src/modules/chat/utils/canvas';
import { STREAM_FRAME_CAP_MS } from '@/src/modules/chat/constants';

/**
 * Drives the typewriter-style reveal animation for streaming assistant
 * responses. Content is pushed in as it arrives from the network and gets
 * revealed progressively based on the remaining length.
 */
export class RevealStream {
  private targetContent = '';
  private displayedContent = '';
  private animationFrame: number | null = null;
  private resolveDisplayFlush: (() => void) | null = null;
  private lastFrameTime = 0;
  private revealBudget = 0;

  constructor(private readonly onUpdate: (content: string) => void) {}

  push(content: string) {
    this.targetContent = content;

    if (this.animationFrame === null) {
      this.animationFrame = window.requestAnimationFrame(this.animate);
    }
  }

  displayed() {
    return this.displayedContent;
  }

  waitForDisplay() {
    if (this.displayedContent.length >= this.targetContent.length) {
      return Promise.resolve();
    }

    return new Promise<void>((resolve) => {
      this.resolveDisplayFlush = resolve;

      if (this.animationFrame === null) {
        this.animationFrame = window.requestAnimationFrame(this.animate);
      }
    });
  }

  stop() {
    if (this.animationFrame !== null) {
      window.cancelAnimationFrame(this.animationFrame);
      this.animationFrame = null;
    }
  }

  private readonly animate = (frameTime: number) => {
    const remaining = this.targetContent.length - this.displayedContent.length;

    if (remaining > 0) {
      const elapsedTime = this.lastFrameTime
        ? Math.min(frameTime - this.lastFrameTime, STREAM_FRAME_CAP_MS)
        : 16;
      const revealRate = getStreamRevealRate(remaining);

      this.lastFrameTime = frameTime;
      this.revealBudget += (revealRate * elapsedTime) / 1000;

      const step = Math.min(remaining, Math.max(1, Math.floor(this.revealBudget)));
      this.revealBudget = Math.max(0, this.revealBudget - step);
      this.displayedContent = this.targetContent.slice(0, this.displayedContent.length + step);
      this.onUpdate(this.displayedContent);
    }

    if (this.displayedContent.length < this.targetContent.length) {
      this.animationFrame = window.requestAnimationFrame(this.animate);
      return;
    }

    this.animationFrame = null;
    this.lastFrameTime = 0;
    this.revealBudget = 0;
    this.resolveDisplayFlush?.();
    this.resolveDisplayFlush = null;
  };
}
