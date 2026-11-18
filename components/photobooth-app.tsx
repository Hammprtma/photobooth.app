"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Camera, Check, Heart } from "lucide-react";
import { CameraRoom } from "@/components/photobooth-camera";
import { PhotoStrip } from "@/components/photobooth-strip";
import {
  LAYOUTS,
  getFrame,
  getFramesForLayout,
  getLayout,
  type CapturedPhoto,
  type FilterId,
  type FrameThemeId,
  type LayoutId,
} from "@/components/photobooth-types";

type Screen = "welcome" | "design" | "camera" | "result";

export function PhotoboothApp() {
  const [screen, setScreen] = useState<Screen>("welcome");
  const [layoutId, setLayoutId] = useState<LayoutId>("classic-4");
  const [frameId, setFrameId] = useState<FrameThemeId>("love-on-film");
  const [filterId, setFilterId] = useState<FilterId>("classic-chrome");
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
  const reducedMotion = useReducedMotion();
  const layout = useMemo(() => getLayout(layoutId), [layoutId]);

  const handleLayoutChange = (nextLayoutId: LayoutId) => {
    setLayoutId(nextLayoutId);
    const compatibleFrames = getFramesForLayout(nextLayoutId);
    if (!compatibleFrames.some((frame) => frame.id === frameId)) {
      setFrameId(compatibleFrames[0]?.id ?? "standard");
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [screen]);

  useEffect(() => {
    if (screen !== "camera" || photos.length !== layout.photoCount) return;
    const timer = window.setTimeout(() => setScreen("result"), 850);
    return () => window.clearTimeout(timer);
  }, [layout.photoCount, photos.length, screen]);

  const reset = () => {
    setPhotos([]);
    setScreen("welcome");
  };

  const startRetake = () => {
    setPhotos([]);
    setScreen("camera");
  };

  const addPhoto = (photo: CapturedPhoto) => setPhotos((current) => [...current, photo].slice(0, layout.photoCount));

  return (
    <main className="photobooth-shell">
      <AmbientDust reducedMotion={Boolean(reducedMotion)} />
      <header className="topbar">
        <div className="topbar-right"><span className="topbar-note"><span className="mini-heart">♥</span> A keepsake for two</span><span className="topbar-divider" /><span className="edition-mark">EST. IN A MOMENT</span></div>
      </header>

      <div className="main-stage">
        <AnimatePresence mode="wait">
          {screen === "welcome" && <WelcomeScreen key="welcome" onStart={() => setScreen("design")} reducedMotion={Boolean(reducedMotion)} />}
          {screen === "design" && <DesignScreen key="design" layoutId={layoutId} frameId={frameId} onLayoutChange={handleLayoutChange} onFrameChange={setFrameId} onNext={() => { setPhotos([]); setScreen("camera"); }} onBack={() => setScreen("welcome")} />}
          {screen === "camera" && <motion.div key="camera" className="screen-motion" initial={reducedMotion ? false : { opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.32 }}><CameraRoom layout={layout} filterId={filterId} photos={photos} onFilterChange={setFilterId} onCapture={addPhoto} onBack={() => { setPhotos([]); setScreen("design"); }} /></motion.div>}
          {screen === "result" && <motion.div key="result" className="screen-motion" initial={reducedMotion ? false : { opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.32 }}><PhotoStrip photos={photos} layoutId={layoutId} frameId={frameId} onRetake={startRetake} onHome={reset} /></motion.div>}
        </AnimatePresence>
      </div>
      <footer className="site-footer"><span>TAKE A LITTLE MEMORY HOME</span><span className="footer-ornament"><i /> <Heart size={11} fill="currentColor" /> <i /></span><span>MADE WITH A WARM CUP OF SOMETHING</span></footer>
    </main>
  );
}

function WelcomeScreen({ onStart, reducedMotion }: { onStart: () => void; reducedMotion: boolean }) {
  return (
    <motion.section className="welcome-step welcome-centered" initial={reducedMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.45 }}>
      <div className="welcome-copy">
        <div className="eyebrow welcome-eyebrow"><span className="eyebrow-dot" /> YOUR VERY OWN LITTLE PHOTO BOOTH</div>
        <h1>Some days are<br />made for <em>keeping.</em></h1>
        <p className="welcome-description">Come a little closer. We’ve saved you a corner booth, a soft glow, and a few frames for the two of you.</p>
        <button className="primary-button start-button" onClick={onStart} type="button"><Camera size={18} strokeWidth={2.5} /> Start photobooth <ArrowRight className="button-arrow" size={17} /></button>
        <div className="welcome-footnote"><span className="footnote-hearts"><Heart size={13} fill="currentColor" /><Heart size={10} fill="currentColor" /></span><span>No rush. These are your moments.</span></div>
      </div>
    </motion.section>
  );
}

function DesignScreen({ layoutId, frameId, onLayoutChange, onFrameChange, onNext, onBack }: {
  layoutId: LayoutId;
  frameId: FrameThemeId;
  onLayoutChange: (layout: LayoutId) => void;
  onFrameChange: (frame: FrameThemeId) => void;
  onNext: () => void;
  onBack: () => void;
}) {
  const availableFrames = useMemo(() => getFramesForLayout(layoutId), [layoutId]);
  const activeFrame = getFrame(frameId);

  return (
    <motion.section className="booth-step design-step" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}>
      <div className="step-heading design-heading">
        <div>
          <div className="eyebrow"><span className="eyebrow-dot" /> MAKE IT YOURS</div>
          <h1>Pick your <em>little strip.</em></h1>
          <p>Choose a shape and a frame — we’ll handle the memories.</p>
        </div>
        <button className="text-button back-button" onClick={onBack} type="button">← Back</button>
      </div>

      <div className="selection-section">
        <div className="section-label-row"><div><span className="section-index">01</span><h2>THE LAYOUT</h2></div><span className="section-side-note">A home for {getLayout(layoutId).photoCount} happy accidents</span></div>
        <div className="layout-options" role="group" aria-label="Choose photostrip layout">
          {LAYOUTS.map((layout) => (
            <button key={layout.id} type="button" className={`layout-option ${layoutId === layout.id ? "is-selected" : ""}`} onClick={() => onLayoutChange(layout.id)} aria-pressed={layoutId === layout.id}>
              <LayoutSketch className={layout.gridClass} count={layout.photoCount} />
              <span className="layout-option-title">{layout.name}</span><span className="layout-option-meta">{layout.shortName}</span>
              {layoutId === layout.id && <span className="selected-badge"><Check size={12} /></span>}
            </button>
          ))}
        </div>
      </div>

      <div className="selection-section frame-section">
        <div className="section-label-row"><div><span className="section-index">02</span><h2>THE FRAME</h2></div><span className="section-side-note">{availableFrames.length} designs for {getLayout(layoutId).shortName}</span></div>
        <div className="frame-options" role="group" aria-label="Choose frame theme">
          {availableFrames.map((frame) => (
            <button type="button" key={frame.id} className={`frame-option ${frameId === frame.id ? "is-selected" : ""}`} onClick={() => onFrameChange(frame.id)} aria-pressed={frameId === frame.id}>
              {frame.overlaySrc ? (
                <span className="frame-sample frame-sample-custom">
                  <img src={frame.overlaySrc} alt="" loading="lazy" />
                </span>
              ) : (
                <span className={`frame-sample frame-sample-${frame.id}`}><i /><i /><i /></span>
              )}
              <span className="frame-option-copy">
                <strong>{frame.name}</strong>
                <small>{frame.detail}</small>
              </span>
              {frameId === frame.id && <span className="frame-selected-check"><Check size={13} /></span>}
            </button>
          ))}
        </div>
      </div>
      <div className="design-bottom"><div className="design-bottom-note"><span className="note-heart"><Heart size={14} fill="currentColor" /></span><span><strong>{activeFrame.name}</strong> · {getLayout(layoutId).photoCount} photos</span></div><button className="primary-button next-button" onClick={onNext} type="button">Next: open camera <ArrowRight size={17} /></button></div>
    </motion.section>
  );
}

function LayoutSketch({ className, count }: { className: string; count: number }) {
  return <span className={`layout-sketch ${className}`} aria-hidden="true">{Array.from({ length: count }, (_, index) => <i key={index} />)}</span>;
}

function AmbientDust({ reducedMotion }: { reducedMotion: boolean }) {
  const particles = [
    { left: "8%", top: "23%", delay: 0, duration: 15, size: 4 }, { left: "17%", top: "71%", delay: 2, duration: 18, size: 3 },
    { left: "28%", top: "14%", delay: 1, duration: 17, size: 3 }, { left: "39%", top: "83%", delay: 4, duration: 20, size: 4 },
    { left: "53%", top: "28%", delay: 3, duration: 16, size: 3 }, { left: "64%", top: "72%", delay: 1, duration: 19, size: 3 },
    { left: "73%", top: "16%", delay: 5, duration: 18, size: 4 }, { left: "88%", top: "35%", delay: 2, duration: 16, size: 3 },
    { left: "93%", top: "78%", delay: 0, duration: 21, size: 4 }, { left: "48%", top: "58%", delay: 6, duration: 19, size: 3 },
  ];
  return <div className="ambient-layer" aria-hidden="true">{particles.map((particle, index) => <motion.span key={index} className="firefly" style={{ left: particle.left, top: particle.top, width: particle.size, height: particle.size }} animate={reducedMotion ? { opacity: 0.25 } : { x: [0, index % 2 ? 17 : -14, 5, 0], y: [0, -22, 11, 0], opacity: [0.16, 0.7, 0.25, 0.16], scale: [0.8, 1.25, 0.9, 0.8] }} transition={{ duration: particle.duration, delay: particle.delay, repeat: Infinity, ease: "easeInOut" }} />)}</div>;
}
