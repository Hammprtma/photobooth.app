"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Heart, Printer, RotateCcw } from "lucide-react";
import {
  getFilter,
  getFrame,
  getLayout,
  type CapturedPhoto,
  type FrameOption,
  type FrameThemeId,
  type LayoutId,
} from "@/components/photobooth-types";

type PhotoStripProps = {
  photos: CapturedPhoto[];
  layoutId: LayoutId;
  frameId: FrameThemeId;
  onRetake: () => void;
  onHome: () => void;
};

export function PhotoStrip({ photos, layoutId, frameId, onRetake, onHome }: PhotoStripProps) {
  const layout = getLayout(layoutId);
  const frame = getFrame(frameId);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const downloadStrip = async () => {
    if (isDownloading || photos.length !== layout.photoCount) return;
    setIsDownloading(true);
    try {
      const canvas = await renderStripCanvas(photos, layoutId, frame);
      const link = document.createElement("a");
      const isTransparentEdge = frame.id === "frame-film" || frame.id === "summer-memories" || frame.id === "music-player";
      link.download = `dar-der-dor-${frame.id}.${isTransparentEdge ? "png" : "jpg"}`;
      link.href = isTransparentEdge ? canvas.toDataURL("image/png") : canvas.toDataURL("image/jpeg", 0.94);
      link.click();
      setDownloaded(true);
      window.setTimeout(() => setDownloaded(false), 2400);
    } finally {
      setIsDownloading(false);
    }
  };

  const hasCustomOverlay = Boolean(frame.overlaySrc && frame.slots && frame.width && frame.height);

  return (
    <section className="booth-step result-step">
      <div className="step-heading result-heading">
        <div>
          <div className="eyebrow"><span className="eyebrow-dot" /> FRESH FROM THE BOOTH</div>
          <h1>Dar Der <em>Dor!</em></h1>
          <p>Your tiny little time capsule, ready to keep.</p>
        </div>
        <button className="text-button back-button" onClick={onHome} type="button"><ArrowLeft size={17} /> Start over</button>
      </div>

      <div className="result-content">
        <div className="result-note"><span className="note-icon"><Heart size={17} fill="currentColor" /></span><div><strong>Made with a little love</strong><span>{layout.name} · {layout.photoCount} lovely moments · {frame.name}</span></div></div>
        <motion.div
          className="print-stage"
          initial={{ y: -75, opacity: 0, rotate: 2.5, scale: 0.94 }}
          animate={{ y: 0, opacity: 1, rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 150, damping: 13, mass: 0.85 }}
        >
          {hasCustomOverlay && frame.slots ? (
            <div
              className="photo-strip-frame photo-strip-custom"
              style={{ aspectRatio: `${frame.width} / ${frame.height}` }}
            >
              {photos.map((photo, index) => {
                const slot = frame.slots?.[index];
                if (!slot) return null;
                return (
                  <div
                    key={photo.id}
                    className={`custom-strip-slot ${slot.shape === "ellipse" ? "is-ellipse" : ""}`}
                    style={{
                      left: `${slot.xPct}%`,
                      top: `${slot.yPct}%`,
                      width: `${slot.wPct}%`,
                      height: `${slot.hPct}%`,
                    }}
                  >
                    <img
                      src={photo.src}
                      alt={`Photobooth moment ${index + 1}`}
                      style={{ filter: getFilter(photo.filter).css }}
                    />
                  </div>
                );
              })}
              <img
                src={frame.overlaySrc}
                alt={frame.name}
                className="custom-strip-overlay"
              />
            </div>
          ) : (
            <div className={`photo-strip-frame frame-${frameId} strip-${layoutId}`}>
              <div className={`strip-photo-grid ${layout.gridClass}`}>
                {photos.map((photo, index) => <div className="strip-photo" key={photo.id}><img src={photo.src} alt={`Photobooth moment ${index + 1}`} style={{ filter: getFilter(photo.filter).css }} /><span className="strip-photo-index">{String(index + 1).padStart(2, "0")}</span></div>)}
              </div>
              <div className="strip-caption"><span className="caption-heart"><Heart size={13} fill="currentColor" /></span><span>YOU + ME</span><i>•</i><span>FOREVER A FAVORITE</span></div>
              {frameId === "film" && <div className="film-perforations" aria-hidden="true"><span /><span /><span /><span /><span /><span /></div>}
            </div>
          )}
          <div className="print-shadow" aria-hidden="true" />
        </motion.div>
        <p className="print-caption"><Printer size={15} /> A little piece of right-now, saved for later.</p>
        <div className="result-actions">
          <button className="primary-button download-button" type="button" onClick={downloadStrip} disabled={isDownloading}><Download size={17} /> {isDownloading ? "Getting it ready…" : downloaded ? "Saved to your device" : "Download photostrip"}</button>
          <button className="secondary-button" type="button" onClick={onRetake}><RotateCcw size={16} /> Retake photos</button>
        </div>
        <p className="download-footnote">A little keepsake, made just for you two.</p>
      </div>
    </section>
  );
}

async function loadImage(src: string): Promise<HTMLImageElement> {
  const image = new Image();
  image.crossOrigin = "anonymous";
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = () => reject(new Error(`Could not load image: ${src}`));
    image.src = src;
  });
  return image;
}

async function renderStripCanvas(photos: CapturedPhoto[], layoutId: LayoutId, frame: FrameOption) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Canvas is not available in this browser.");

  // Custom overlay frame rendering
  if (frame.overlaySrc && frame.slots && frame.width && frame.height) {
    canvas.width = frame.width;
    canvas.height = frame.height;

    const isTransparentEdge = frame.id === "frame-film" || frame.id === "summer-memories" || frame.id === "music-player";
    if (!isTransparentEdge) {
      context.fillStyle = "#fffaf0";
      context.fillRect(0, 0, canvas.width, canvas.height);
    }

    for (let index = 0; index < photos.length; index++) {
      const slot = frame.slots[index];
      if (!slot) continue;
      const image = await loadImage(photos[index].src);
      context.save();
      context.beginPath();
      if (slot.shape === "ellipse") {
        context.ellipse(
          slot.x + slot.width / 2,
          slot.y + slot.height / 2,
          slot.width / 2 + 2,
          slot.height / 2 + 2,
          0,
          0,
          Math.PI * 2
        );
      } else {
        // Expand by 2px so photos tuck cleanly behind the anti-aliased overlay border
        context.rect(slot.x - 2, slot.y - 2, slot.width + 4, slot.height + 4);
      }
      context.clip();
      context.filter = getFilter(photos[index].filter).css;
      drawCover(context, image, slot.x - 2, slot.y - 2, slot.width + 4, slot.height + 4);
      context.restore();
    }

    const overlayImg = await loadImage(frame.overlaySrc);
    context.drawImage(overlayImg, 0, 0, canvas.width, canvas.height);
    return canvas;
  }

  // Procedural frame rendering
  const frameId = frame.id;
  const settings: Record<LayoutId, { width: number; columns: number; rows: number; pad: number; gap: number; photoHeight: number }> = {
    "classic-4": { width: 920, columns: 1, rows: 4, pad: 52, gap: 22, photoHeight: 590 },
    "classic-3": { width: 920, columns: 1, rows: 3, pad: 52, gap: 22, photoHeight: 590 },
    "classic-5": { width: 920, columns: 1, rows: 5, pad: 52, gap: 20, photoHeight: 500 },
    "grid-2x2": { width: 1200, columns: 2, rows: 2, pad: 58, gap: 28, photoHeight: 405 },
    "wide-film": { width: 1500, columns: 4, rows: 1, pad: 50, gap: 18, photoHeight: 260 },
    collage: { width: 1000, columns: 2, rows: 2, pad: 54, gap: 22, photoHeight: 310 },
  };
  const config = settings[layoutId];
  const contentWidth = config.width - config.pad * 2;
  const cellWidth = (contentWidth - config.gap * (config.columns - 1)) / config.columns;
  const photoHeight = layoutId === "collage" ? 345 : config.photoHeight;
  const contentHeight = layoutId === "collage"
    ? photoHeight * 2 + config.gap
    : config.rows * photoHeight + (config.rows - 1) * config.gap;
  const captionHeight = 148;
  canvas.width = config.width;
  canvas.height = config.pad * 2 + contentHeight + captionHeight;

  context.fillStyle = frameId === "film" ? "#39251f" : frameId === "cafe" ? "#f6e9d4" : frameId === "polkadot" ? "#fff1e2" : frameId === "grid" ? "#f6f0e5" : frameId === "floral" ? "#f8eee0" : "#fffaf0";
  context.fillRect(0, 0, canvas.width, canvas.height);

  if (frameId === "cafe") {
    context.strokeStyle = "#b7624e";
    context.lineWidth = 5;
    context.setLineDash([2, 13]);
    context.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
    context.setLineDash([]);
  }
  if (frameId === "polkadot") {
    context.fillStyle = "#cf8c77";
    for (let y = 18; y < canvas.height - 18; y += 30) {
      for (let x = 18; x < canvas.width - 18; x += 30) {
        context.beginPath();
        context.arc(x, y, 2.2, 0, Math.PI * 2);
        context.fill();
      }
    }
  }
  if (frameId === "grid") {
    context.strokeStyle = "#d6c8b4";
    context.lineWidth = 1;
    context.beginPath();
    for (let x = 16; x < canvas.width; x += 28) { context.moveTo(x, 0); context.lineTo(x, canvas.height); }
    for (let y = 16; y < canvas.height; y += 28) { context.moveTo(0, y); context.lineTo(canvas.width, y); }
    context.stroke();
  }
  if (frameId === "floral") {
    const color = "#a47c69";
    drawLeafSprig(context, 32, 35, 0, color);
    drawLeafSprig(context, canvas.width - 32, 35, Math.PI, color);
    drawLeafSprig(context, 32, canvas.height - 45, -Math.PI / 2, color);
    drawLeafSprig(context, canvas.width - 32, canvas.height - 45, Math.PI / 2, color);
  }
  if (frameId === "film") {
    context.fillStyle = "#dfbd80";
    for (let x = 32; x < canvas.width - 32; x += 74) {
      roundedRect(context, x, 18, 35, 18, 7);
      context.fill();
      roundedRect(context, x, canvas.height - 36, 35, 18, 7);
      context.fill();
    }
  }

  const positions = photos.map((_, index) => {
    if (layoutId === "collage") {
      return index === 0
        ? { x: config.pad, y: config.pad, width: contentWidth, height: photoHeight }
        : { x: config.pad + (index - 1) * (cellWidth + config.gap), y: config.pad + photoHeight + config.gap, width: cellWidth, height: photoHeight };
    }
    return { x: config.pad + (index % config.columns) * (cellWidth + config.gap), y: config.pad + Math.floor(index / config.columns) * (photoHeight + config.gap), width: cellWidth, height: photoHeight };
  });

  for (let index = 0; index < photos.length; index++) {
    const image = await loadImage(photos[index].src);
    const pos = positions[index];
    context.save();
    context.beginPath();
    roundedRect(context, pos.x, pos.y, pos.width, pos.height, frameId === "standard" ? 3 : 8);
    context.clip();
    context.filter = getFilter(photos[index].filter).css;
    drawCover(context, image, pos.x, pos.y, pos.width, pos.height);
    context.restore();
  }

  context.fillStyle = frameId === "film" ? "#f4e6cc" : "#874b3e";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.font = "600 25px Arial, sans-serif";
  context.fillText("♥   YOU + ME   ·   FOREVER A FAVORITE", canvas.width / 2, canvas.height - config.pad - captionHeight / 2);
  return canvas;
}

function drawLeafSprig(context: CanvasRenderingContext2D, x: number, y: number, rotation: number, color: string) {
  context.save();
  context.translate(x, y);
  context.rotate(rotation);
  context.strokeStyle = color;
  context.fillStyle = color;
  context.lineWidth = 1.6;
  context.beginPath();
  context.moveTo(0, 0);
  context.lineTo(43, 0);
  context.stroke();
  for (const position of [10, 23, 36]) {
    for (const side of [-1, 1]) {
      context.beginPath();
      context.ellipse(position, side * 5, 6, 3, side * 0.45, 0, Math.PI * 2);
      context.fill();
    }
  }
  context.restore();
}

function drawCover(context: CanvasRenderingContext2D, image: HTMLImageElement, x: number, y: number, width: number, height: number) {
  const scale = Math.max(width / image.width, height / image.height);
  const sourceWidth = width / scale;
  const sourceHeight = height / scale;
  const sourceX = (image.width - sourceWidth) / 2;
  const sourceY = (image.height - sourceHeight) / 2;
  context.drawImage(image, sourceX, sourceY, sourceWidth, sourceHeight, x, y, width, height);
}

function roundedRect(context: CanvasRenderingContext2D, x: number, y: number, width: number, height: number, radius: number) {
  const r = Math.min(radius, width / 2, height / 2);
  context.beginPath();
  context.moveTo(x + r, y);
  context.arcTo(x + width, y, x + width, y + height, r);
  context.arcTo(x + width, y + height, x, y + height, r);
  context.arcTo(x, y + height, x, y, r);
  context.arcTo(x, y, x + width, y, r);
  context.closePath();
}
