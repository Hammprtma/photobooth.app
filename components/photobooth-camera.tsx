"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Aperture, ArrowLeft, Camera, Check, FlipHorizontal2, Heart, RefreshCw } from "lucide-react";
import { FILTERS, getFilter, type CapturedPhoto, type FilterId, type FilterPreset, type LayoutOption } from "@/components/photobooth-types";

type CameraRoomProps = {
  layout: LayoutOption;
  filterId: FilterId;
  photos: CapturedPhoto[];
  onFilterChange: (filter: FilterId) => void;
  onCapture: (photo: CapturedPhoto) => void;
  onBack: () => void;
};

export function CameraRoom({ layout, filterId, photos, onFilterChange, onCapture, onBack }: CameraRoomProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const [requestVersion, setRequestVersion] = useState(0);
  const [cameraStatus, setCameraStatus] = useState<"loading" | "ready" | "error">("loading");
  const [cameraError, setCameraError] = useState("");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [shooting, setShooting] = useState(false);
  const activeFilter = getFilter(filterId);

  useEffect(() => {
    let cancelled = false;
    let stream: MediaStream | null = null;

    async function startCamera() {
      setCameraStatus("loading");
      setCameraError("");
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error("This browser does not support camera access. Try opening the photobooth in a modern browser.");
        }
        stream = await navigator.mediaDevices.getUserMedia({
          audio: false,
          video: { facingMode: { ideal: facingMode }, width: { ideal: 1280 }, height: { ideal: 960 } },
        });
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop());
          return;
        }
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
        if (!cancelled) setCameraStatus("ready");
      } catch (error) {
        if (cancelled) return;
        const message = error instanceof Error ? error.message : "We couldn’t open your camera. Check your browser permissions and try again.";
        setCameraError(message);
        setCameraStatus("error");
      }
    }

    void startCamera();
    return () => {
      cancelled = true;
      stream?.getTracks().forEach((track) => track.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, [facingMode, requestVersion]);

  const takePhoto = useCallback(() => {
    const video = videoRef.current;
    if (!video || video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA || !video.videoWidth) return;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext("2d");
    if (!context) return;
    if (facingMode === "user") {
      context.translate(canvas.width, 0);
      context.scale(-1, 1);
    }
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    onCapture({ id: crypto.randomUUID(), src: canvas.toDataURL("image/jpeg", 0.92), filter: filterId });
  }, [facingMode, filterId, onCapture]);

  useEffect(() => {
    if (countdown === null) return;
    const timer = window.setTimeout(() => {
      if (countdown > 1) setCountdown(countdown - 1);
      else {
        takePhoto();
        setCountdown(null);
      }
    }, 1000);
    return () => window.clearTimeout(timer);
  }, [countdown, takePhoto]);

  useEffect(() => {
    if (!shooting || countdown !== null) return;
    if (photos.length >= layout.photoCount) {
      setShooting(false);
      return;
    }
    const timer = window.setTimeout(() => setCountdown(3), 900);
    return () => window.clearTimeout(timer);
  }, [countdown, layout.photoCount, photos.length, shooting]);

  const startSession = () => {
    if (cameraStatus !== "ready" || shooting || photos.length >= layout.photoCount) return;
    setShooting(true);
    setCountdown(3);
  };

  return (
    <section className="booth-step camera-step">
      <div className="step-heading camera-heading">
        <div>
          <div className="eyebrow"><span className="eyebrow-dot" /> THE CAMERA ROOM</div>
          <h1>Find your <em>light.</em></h1>
          <p>Pick a film look, get close, and let the little moments happen.</p>
        </div>
        <button className="text-button back-button" onClick={onBack} type="button"><ArrowLeft size={17} /> Back to frames</button>
      </div>

      <div className="camera-layout">
        <div className="camera-main">
          <div className="viewfinder" aria-label="Camera preview">
            <video
              ref={videoRef}
              className={`camera-video ${facingMode === "user" ? "is-mirrored" : ""}`}
              style={{ filter: activeFilter.cssFilter }}
              autoPlay
              muted
              playsInline
              aria-label="Live camera preview"
            />
            <FilmOverlayLayers preset={activeFilter} />
            <div className="viewfinder-corners" aria-hidden="true"><i /><i /><i /><i /></div>
            <div className="camera-live-label"><span className={cameraStatus === "ready" ? "live-dot" : "live-dot is-loading"} /> {cameraStatus === "ready" ? "LIVE VIEW" : cameraStatus === "loading" ? "WAKING UP THE CAMERA" : "CAMERA PAUSED"}</div>
            <div className="camera-counter"><span>TAKE</span><strong>{String(Math.min(photos.length + 1, layout.photoCount)).padStart(2, "0")}</strong><span>OF {String(layout.photoCount).padStart(2, "0")}</span></div>

            {cameraStatus !== "ready" && (
              <div className="camera-state-card">
                <div className="camera-state-icon">{cameraStatus === "loading" ? <Aperture size={26} /> : <Camera size={26} />}</div>
                <h2>{cameraStatus === "loading" ? "Warming up the camera…" : "Let’s find your camera"}</h2>
                <p>{cameraStatus === "loading" ? "Your little photo booth will be ready in a moment." : cameraError}</p>
                {cameraStatus === "error" && <button className="small-pill-button" onClick={() => setRequestVersion((version) => version + 1)} type="button"><RefreshCw size={14} /> Try again</button>}
              </div>
            )}

            <AnimatePresence>
              {countdown !== null && (
                <motion.div
                  key={countdown}
                  className="countdown-number"
                  initial={{ opacity: 0, scale: 0.45, y: 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.35, y: -10 }}
                  transition={{ type: "spring", stiffness: 240, damping: 14 }}
                  aria-live="assertive"
                  aria-label={`Photo in ${countdown}`}
                >{countdown}</motion.div>
              )}
            </AnimatePresence>
            <button
              className="flip-camera-button"
              onClick={() => setFacingMode((mode) => mode === "user" ? "environment" : "user")}
              type="button"
              aria-label="Flip camera"
              disabled={cameraStatus !== "ready" || shooting}
            ><FlipHorizontal2 size={18} /></button>
          </div>

          <div className="capture-panel">
            <div className="capture-copy">
              <span className="capture-kicker"><Heart size={13} fill="currentColor" /> YOUR LITTLE MOMENTS</span>
              <p>{shooting ? "Hold that smile — the next one is on its way." : `We’ll take ${layout.photoCount} photos, with a tiny pause between each.`}</p>
            </div>
            <button className={`shutter-button ${shooting ? "is-shooting" : ""}`} onClick={startSession} type="button" disabled={cameraStatus !== "ready" || shooting || photos.length >= layout.photoCount}>
              <span className="shutter-ring"><span /></span>
              <span>{shooting ? "One sec…" : photos.length >= layout.photoCount ? "All done!" : "Start photos"}</span>
            </button>
            <div className="captured-count"><span>{String(photos.length).padStart(2, "0")}</span><i>/</i>{String(layout.photoCount).padStart(2, "0")} <small>saved</small></div>
          </div>
          <div className="photo-progress-sidebar" role="group" aria-label={`${photos.length} of ${layout.photoCount} photos captured`}>
            <div className="progress-sidebar-head"><span className="eyebrow">YOUR PHOTOS</span><span className="progress-tally">{String(photos.length).padStart(2, "0")} / {String(layout.photoCount).padStart(2, "0")}</span></div>
            <div className="progress-thumbnails">
              {Array.from({ length: layout.photoCount }, (_, index) => {
                const photo = photos[index];
                const photoPreset = photo ? getFilter(photo.filter) : null;
                return (
                  <div className={`progress-photo ${photo ? "is-filled" : ""}`} key={index}>
                    {photo && photoPreset ? (
                      <>
                        <img src={photo.src} alt={`Captured photo ${index + 1}`} style={{ filter: photoPreset.cssFilter }} />
                        <FilmOverlayLayers preset={photoPreset} />
                      </>
                    ) : (
                      <span>{String(index + 1).padStart(2, "0")}</span>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="progress-note"><span className="progress-heart"><Heart size={15} /></span><span>{photos.length === layout.photoCount ? "That’s a wrap!" : "Your strip is coming together"}</span></div>
          </div>
        </div>

        <aside className="film-panel">
          <div className="film-panel-head"><span className="eyebrow">CHOOSE YOUR FILM</span><span className="film-label"><span className="live-dot" /> FILM LOOKS</span></div>
          <div className="film-list" role="group" aria-label="Film simulations">
            {FILTERS.map((filter, index) => (
              <button
                type="button"
                key={filter.id}
                className={`film-option ${filterId === filter.id ? "is-selected" : ""}`}
                onClick={() => onFilterChange(filter.id)}
                aria-pressed={filterId === filter.id}
              >
                <span className={`film-swatch swatch-${filter.id}`} style={{ filter: filter.cssFilter }}><span /></span>
                <span className="film-option-copy"><strong>{filter.name}</strong><small>{filter.subtitle}</small></span>
                <span className="film-index">{String(index + 1).padStart(2, "0")}</span>
                {filterId === filter.id && <Check className="film-check" size={16} />}
              </button>
            ))}
          </div>
          <div className="film-note"><Aperture size={17} /><p>Every little detail has that <em>old-film feeling.</em></p></div>
          <div className="film-hint"><span className="hint-line" /> <span>TIP · Get a little closer together</span></div>
        </aside>
      </div>
    </section>
  );
}

export function FilmOverlayLayers({ preset }: { preset: FilterPreset }) {
  return (
    <>
      {preset.fadeColor && (
        <div
          className="film-layer-fade"
          style={{ backgroundColor: preset.fadeColor }}
          aria-hidden="true"
        />
      )}
      {preset.tintColor && (
        <div
          className="film-layer-tint"
          style={{ backgroundColor: preset.tintColor }}
          aria-hidden="true"
        />
      )}
      {preset.grainOpacity > 0 && (
        <div
          className="camera-grain"
          style={{ opacity: preset.grainOpacity }}
          aria-hidden="true"
        />
      )}
    </>
  );
}
