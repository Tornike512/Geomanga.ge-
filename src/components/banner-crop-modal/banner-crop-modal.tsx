"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import ReactCrop, {
  type Crop,
  centerCrop,
  makeAspectCrop,
  type PixelCrop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/button";

const ASPECT_RATIO = 3 / 1;

interface BannerCropModalProps {
  imageSrc: string;
  onCrop: (file: File) => void;
  onCancel: () => void;
}

function getCenterCrop(mediaWidth: number, mediaHeight: number): Crop {
  return centerCrop(
    makeAspectCrop(
      { unit: "%", width: 90 },
      ASPECT_RATIO,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}

async function canvasToFile(
  image: HTMLImageElement,
  crop: PixelCrop,
): Promise<File> {
  const canvas = document.createElement("canvas");
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  canvas.width = crop.width * scaleX;
  canvas.height = crop.height * scaleY;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not get canvas context");

  ctx.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    canvas.width,
    canvas.height,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Canvas toBlob failed"));
          return;
        }
        resolve(new File([blob], "banner.webp", { type: "image/webp" }));
      },
      "image/webp",
      0.9,
    );
  });
}

export function BannerCropModal({
  imageSrc,
  onCrop,
  onCancel,
}: BannerCropModalProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsVisible(true));
    });
  }, []);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(onCancel, 200);
  }, [onCancel]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [handleClose]);

  const onImageLoad = useCallback(
    (e: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = e.currentTarget;
      setCrop(getCenterCrop(width, height));
    },
    [],
  );

  const handleSave = useCallback(async () => {
    if (!imgRef.current || !completedCrop) return;
    const file = await canvasToFile(imgRef.current, completedCrop);
    onCrop(file);
  }, [completedCrop, onCrop]);

  return createPortal(
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-all duration-200 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Backdrop */}
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleClose}
        tabIndex={-1}
        aria-label="Close crop modal"
      />

      {/* Modal */}
      <div
        className={`relative z-10 mx-4 flex w-full max-w-7xl flex-col rounded-lg border border-[var(--border)] bg-[var(--card)] shadow-2xl transition-all duration-200 ${
          isVisible ? "scale-100" : "scale-95"
        }`}
      >
        {/* Header */}
        <div className="border-[var(--border)] border-b px-6 py-4">
          <h2 className="font-semibold text-[var(--foreground)] text-lg">
            ბანერის მოჭრა
          </h2>
          <p className="text-[var(--muted-foreground)] text-sm">
            გადაიტანეთ და შეცვალეთ არე სურათის მოსაჭრელად
          </p>
        </div>

        {/* Crop Area */}
        <div className="flex max-h-[75vh] items-center justify-center overflow-auto p-8">
          <ReactCrop
            crop={crop}
            onChange={(c) => setCrop(c)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={ASPECT_RATIO}
            className="max-h-full max-w-full"
          >
            {/* biome-ignore lint/performance/noImgElement: react-image-crop requires native img with ref */}
            <img
              ref={imgRef}
              src={imageSrc}
              alt="Crop preview"
              onLoad={onImageLoad}
              className="max-h-[65vh] max-w-full object-contain"
            />
          </ReactCrop>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-[var(--border)] border-t px-6 py-4">
          <Button variant="outline" onClick={handleClose}>
            გაუქმება
          </Button>
          <Button onClick={handleSave} disabled={!completedCrop}>
            შენახვა
          </Button>
        </div>
      </div>
    </div>,
    document.body,
  );
}
