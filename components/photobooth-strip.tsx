"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Download, Heart, Printer, RotateCcw } from "lucide-react";
import {
  getFilter,
  getFrame,
  getLayout,
  type CapturedPhoto,
  type FilterId,
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

/**
 * Exact CSS filter lookup table used by Canvas 2D context rendering.
 */
const CANVAS_FILTER_MAP: Record<FilterId, string> = {
  provia: "none",
  "warm-vintage-sepia": "sepia(0.75) contrast(1.15) brightness(0.95) saturate(0.8) hue-rotate(-5deg)",
  acros: "grayscale(100%) contrast(1.25) brightness(0.9)",
  "classic-negative": "sepia(0.35) saturate(0.75) contrast(1.1) brightness(0.95) hue-rotate(-15deg)",
  "sony-fl": "contrast(1.2) brightness(0.75) saturate(0.6) sepia(0.2) hue-rotate(-5deg)",
  "classic-chrome": "contrast(1.15) saturate(0.8) sepia(0.15)",
  astia: "contrast(0.85) brightness(1.15) saturate(0.9) sepia(0.1)",
  "nostalgic-neg": "contrast(1.05) saturate(0.85) sepia(0.25) hue-rotate(5deg) brightness(1.05)",
  velvia: "contrast(1.2) saturate(1.4) brightness(1.05)",
  "s-cinetone": "contrast(0.95) saturate(0.9) brightness(1.05) sepia(0.05)",
  "sony-in": "contrast(0.85) saturate(0.9) sepia(0.3) brightness(1.1)",
  "kodak-portra": "contrast(1.1) saturate(1.2) sepia(0.1) hue-rotate(5deg)",
  "faded-polaroid": "contrast(0.8) brightness(1.1) sepia(0.2)",
  "cyberpunk-night": "contrast(1.2) saturate(1.5) hue-rotate(180deg)",
};

export function PhotoStrip({ photos, layoutId, frameId, onRetake, onHome }: PhotoStripProps) {
  const layout = getLayout(layoutId);
  const frame = getFrame(frameId);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloaded, setDownloaded] = useState(false);

  const handleDownloadPhotostrip = async () => {
    if (isDownloading || photos.length !== layout.photoCount) return;
    setIsDownloading(true);
    try {
      const canvas = await renderStripCanvas(photos, layoutId, frame);
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = "Our-Little-Memory.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
          <button className="primary-button download-button" type="button" onClick={handleDownloadPhotostrip} disabled={isDownloading}><Download size={17} /> {isDownloading ? "Getting it ready…" : downloaded ? "Saved to your device" : "Download photostrip"}</button>
          <button className="secondary-button" type="button" onClick={onRetake}><RotateCcw size={16} /> Retake photos</button>
        </div>
        <p className="download-footnote">A high-resolution PNG keepsake, made just for you two.</p>
      </div>
    </section>
  );
}

/**
 * Asynchronously loads an HTMLImageElement using a Promise.
 */
function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Could not load image: ${src}`));
    image.src = src;
  });
}

/**
 * Generates an off-screen repeating analog film grain tile and overlays it across the canvas.
 */
function applyAnalogFilmGrain(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const tileSize = 220;
  const grainCanvas = document.createElement("canvas");
  grainCanvas.width = tileSize;
  grainCanvas.height = tileSize;
  const grainCtx = grainCanvas.getContext("2d");
  if (!grainCtx) return;

  const imageData = grainCtx.createImageData(tileSize, tileSize);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const value = Math.floor(Math.random() * 256);
    data[i] = value;
    data[i + 1] = value;
    data[i + 2] = value;
    data[i + 3] = 255;
  }
  grainCtx.putImageData(imageData, 0, 0);

  const pattern = ctx.createPattern(grainCanvas, "repeat");
  if (!pattern) return;

  ctx.save();
  ctx.filter = "none";
  ctx.globalCompositeOperation = "overlay";
  ctx.globalAlpha = 0.15;
  ctx.fillStyle = pattern;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();

  // Explicitly ensure composite operation and alpha are reset
  ctx.globalCompositeOperation = "source-over";
  ctx.globalAlpha = 1.0;
}

async function renderStripCanvas(capturedPhotos: CapturedPhoto[], layoutId: LayoutId, frame: FrameOption) {
  // 1. Canvas Initialization
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas 2D context is not available in this browser.");

  // Preload all captured photos asynchronously before drawing
  const loadedPhotos = await Promise.all(capturedPhotos.map((photo) => loadImage(photo.src)));

  // Branch A: Custom illustrated frame asset (with transparent cutouts)
  if (frame.overlaySrc && frame.slots && frame.width && frame.height) {
    canvas.width = frame.width;
    canvas.height = frame.height;

    // 2. Draw base background
    const isTransparentEdge = frame.id === "frame-film" || frame.id === "summer-memories" || frame.id === "music-player";
    if (!isTransparentEdge) {
      ctx.fillStyle = "#fffaf0";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // 3. Process Photos & Apply Filters
    for (let index = 0; index < capturedPhotos.length; index++) {
      const slot = frame.slots[index];
      const image = loadedPhotos[index];
      if (!slot || !image) continue;

      const selectedFilterString = CANVAS_FILTER_MAP[capturedPhotos[index].filter] ?? getFilter(capturedPhotos[index].filter).css ?? "none";

      ctx.save();
      ctx.beginPath();
      if (slot.shape === "ellipse") {
        ctx.ellipse(
          slot.x + slot.width / 2,
          slot.y + slot.height / 2,
          slot.width / 2 + 2,
          slot.height / 2 + 2,
          0,
          0,
          Math.PI * 2
        );
      } else {
        ctx.rect(slot.x - 2, slot.y - 2, slot.width + 4, slot.height + 4);
      }
      ctx.clip();

      ctx.filter = selectedFilterString;
      drawCover(ctx, image, slot.x - 2, slot.y - 2, slot.width + 4, slot.height + 4);
      ctx.filter = "none";
      ctx.restore();
      ctx.filter = "none";
    }

    // Draw the frame image asset over the photos
    const overlayImg = await loadImage(frame.overlaySrc);
    ctx.filter = "none";
    ctx.drawImage(overlayImg, 0, 0, canvas.width, canvas.height);

    // 4. Add Analog Film Grain Overlay
    applyAnalogFilmGrain(ctx, canvas.width, canvas.height);

    return canvas;
  }

  // Branch B: Procedural frame themes (Standard White, Cozy Cafe, Retro Film Roll, Polkadot, Grid, Floral)
  const frameId = frame.id;
  const settings: Record<LayoutId, { width: number; columns: number; rows: number; pad: number; gap: number; photoHeight: number }> = {
    "classic-4": { width: 800, columns: 1, rows: 4, pad: 46, gap: 20, photoHeight: 520 },
    "classic-3": { width: 800, columns: 1, rows: 3, pad: 46, gap: 20, photoHeight: 520 },
    "classic-5": { width: 800, columns: 1, rows: 5, pad: 46, gap: 18, photoHeight: 450 },
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

  // 2. Draw the Frame/Background
  ctx.fillStyle =
    frameId === "film"
      ? "#39251f"
      : frameId === "cafe"
        ? "#f6e9d4"
        : frameId === "polkadot"
          ? "#fff1e2"
          : frameId === "grid"
            ? "#f6f0e5"
            : frameId === "floral"
              ? "#f8eee0"
              : "#fffaf0";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (frameId === "cafe") {
    ctx.strokeStyle = "#b7624e";
    ctx.lineWidth = 5;
    ctx.setLineDash([2, 13]);
    ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);
    ctx.setLineDash([]);
  }
  if (frameId === "polkadot") {
    ctx.fillStyle = "#cf8c77";
    for (let y = 18; y < canvas.height - 18; y += 30) {
      for (let x = 18; x < canvas.width - 18; x += 30) {
        ctx.beginPath();
        ctx.arc(x, y, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }
  if (frameId === "grid") {
    ctx.strokeStyle = "#d6c8b4";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (let x = 16; x < canvas.width; x += 28) {
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
    }
    for (let y = 16; y < canvas.height; y += 28) {
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
    }
    ctx.stroke();
  }
  if (frameId === "floral") {
    const color = "#a47c69";
    drawLeafSprig(ctx, 32, 35, 0, color);
    drawLeafSprig(ctx, canvas.width - 32, 35, Math.PI, color);
    drawLeafSprig(ctx, 32, canvas.height - 45, -Math.PI / 2, color);
    drawLeafSprig(ctx, canvas.width - 32, canvas.height - 45, Math.PI / 2, color);
  }
  if (frameId === "film") {
    ctx.fillStyle = "#dfbd80";
    for (let x = 32; x < canvas.width - 32; x += 74) {
      roundedRect(ctx, x, 18, 35, 18, 7);
      ctx.fill();
      roundedRect(ctx, x, canvas.height - 36, 35, 18, 7);
      ctx.fill();
    }
  }

  const positions = capturedPhotos.map((_, index) => {
    if (layoutId === "collage") {
      return index === 0
        ? { x: config.pad, y: config.pad, width: contentWidth, height: photoHeight }
        : {
            x: config.pad + (index - 1) * (cellWidth + config.gap),
            y: config.pad + photoHeight + config.gap,
            width: cellWidth,
            height: photoHeight,
          };
    }
    return {
      x: config.pad + (index % config.columns) * (cellWidth + config.gap),
      y: config.pad + Math.floor(index / config.columns) * (photoHeight + config.gap),
      width: cellWidth,
      height: photoHeight,
    };
  });

  // 3. Process Photos & Apply Filters
  for (let index = 0; index < capturedPhotos.length; index++) {
    const image = loadedPhotos[index];
    const pos = positions[index];
    if (!image || !pos) continue;

    const selectedFilterString = CANVAS_FILTER_MAP[capturedPhotos[index].filter] ?? getFilter(capturedPhotos[index].filter).css ?? "none";

    ctx.save();
    ctx.beginPath();
    roundedRect(ctx, pos.x, pos.y, pos.width, pos.height, frameId === "standard" ? 3 : 8);
    ctx.clip();

    ctx.filter = selectedFilterString;
    drawCover(ctx, image, pos.x, pos.y, pos.width, pos.height);
    ctx.filter = "none";
    ctx.restore();
    ctx.filter = "none";
  }

  ctx.fillStyle = frameId === "film" ? "#f4e6cc" : "#874b3e";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "600 24px Arial, sans-serif";
  ctx.fillText("♥   YOU + ME   ·   FOREVER A FAVORITE", canvas.width / 2, canvas.height - config.pad - captionHeight / 2);

  // 4. Add Analog Film Grain Overlay
  applyAnalogFilmGrain(ctx, canvas.width, canvas.height);

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
