import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Camera,
  CameraOff,
  SwitchCamera,
  X,
  Check,
  RotateCcw,
  Sparkles,
  UploadCloud,
  Trash2,
  Image as ImageIcon,
  Zap,
  Sliders,
  CheckCircle2,
  Layers,
  Maximize2,
  RefreshCw,
  Eye
} from 'lucide-react';

export interface CapturedPhoto {
  id: string;
  url: string;
  tag: string;
  timestamp: string;
  source: 'camera' | 'upload';
  isPrimary?: boolean;
}

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotosSaved: (photos: CapturedPhoto[], primaryUrl: string) => void;
  initialPhotos?: CapturedPhoto[];
}

const ROOM_TAGS = [
  { id: 'exterior', label: 'Building Exterior / Facade', emoji: '🏢' },
  { id: 'living', label: 'Living Room / Reception', emoji: '🛋️' },
  { id: 'bedroom', label: 'Master Bedroom / Executive Cabin', emoji: '🛏️' },
  { id: 'kitchen', label: 'Kitchen / Pantry', emoji: '🍳' },
  { id: 'washroom', label: 'Washroom / Restroom', emoji: '🚿' },
  { id: 'balcony', label: 'Balcony / City View', emoji: '🌅' },
  { id: 'workspace', label: 'Workstation / Floor Layout', emoji: '💻' }
];

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onPhotosSaved,
  initialPhotos = []
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [selectedTag, setSelectedTag] = useState(ROOM_TAGS[0].id);
  const [photos, setPhotos] = useState<CapturedPhoto[]>(initialPhotos);
  const [currentSnapshot, setCurrentSnapshot] = useState<string | null>(null);
  const [isShutterAnimating, setIsShutterAnimating] = useState(false);
  const [isUploadingToSupabase, setIsUploadingToSupabase] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [hasTorch, setHasTorch] = useState(false);
  const [torchOn, setTorchOn] = useState(false);

  // Initialize and switch camera stream
  const startCamera = useCallback(async (mode: 'environment' | 'user') => {
    setCameraError(null);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    try {
      // Constraints with preferred resolution
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: mode,
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        },
        audio: false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setCameraActive(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      // Check for torch/flashlight support
      const videoTrack = mediaStream.getVideoTracks()[0];
      if (videoTrack) {
        const capabilities = (videoTrack.getCapabilities ? videoTrack.getCapabilities() : {}) as any;
        if (capabilities.torch) {
          setHasTorch(true);
        }
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      let message = 'Unable to access device camera. Please check permissions or use file upload.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        message = 'Camera permission was denied. Please allow camera access in your browser settings.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        message = 'No camera found on this device. You can select photos from your device storage.';
      }
      setCameraError(message);
      setCameraActive(false);
    }
  }, [stream]);

  // Stop camera when closing
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setCameraActive(false);
  }, [stream]);

  useEffect(() => {
    if (isOpen) {
      startCamera(facingMode);
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  // Flip Front / Rear Camera
  const toggleCameraFacing = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
  };

  // Toggle Flash / Torch
  const toggleTorch = async () => {
    if (stream && hasTorch) {
      const videoTrack = stream.getVideoTracks()[0];
      try {
        await (videoTrack as any).applyConstraints({
          advanced: [{ torch: !torchOn }]
        });
        setTorchOn(!torchOn);
      } catch (e) {
        console.warn('Torch constraint error:', e);
      }
    }
  };

  // Capture Photo from Video Stream
  const takeSnapshot = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Set canvas dimensions to match video stream
    const width = video.videoWidth || 1280;
    const height = video.videoHeight || 720;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      // If user facing mode, mirror horizontally for natural feel
      if (facingMode === 'user') {
        ctx.translate(width, 0);
        ctx.scale(-1, 1);
      }
      ctx.drawImage(video, 0, 0, width, height);

      // Shutter flash effect
      setIsShutterAnimating(true);
      setTimeout(() => setIsShutterAnimating(false), 200);

      // Convert to JPEG data URL with high quality
      const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
      setCurrentSnapshot(dataUrl);
    }
  };

  // Accept current snapshot into photo collection
  const acceptSnapshot = () => {
    if (!currentSnapshot) return;

    const tagObj = ROOM_TAGS.find(t => t.id === selectedTag);
    const newPhoto: CapturedPhoto = {
      id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      url: currentSnapshot,
      tag: tagObj ? tagObj.label : 'Property Photo',
      timestamp: new Date().toISOString(),
      source: 'camera',
      isPrimary: photos.length === 0
    };

    setPhotos(prev => [newPhoto, ...prev]);
    setCurrentSnapshot(null);
  };

  // Retake current snapshot
  const retakeSnapshot = () => {
    setCurrentSnapshot(null);
  };

  // Remove a photo from gallery
  const removePhoto = (id: string) => {
    setPhotos(prev => {
      const filtered = prev.filter(p => p.id !== id);
      if (filtered.length > 0 && !filtered.some(p => p.isPrimary)) {
        filtered[0].isPrimary = true;
      }
      return filtered;
    });
  };

  // Set as primary photo
  const setPrimary = (id: string) => {
    setPhotos(prev => prev.map(p => ({
      ...p,
      isPrimary: p.id === id
    })));
  };

  // Handle native file input camera/gallery upload
  const handleNativeFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file: File, index: number) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          const tagObj = ROOM_TAGS.find(t => t.id === selectedTag);
          const newPhoto: CapturedPhoto = {
            id: `upload-${Date.now()}-${index}`,
            url: result,
            tag: tagObj ? tagObj.label : 'Uploaded Photo',
            timestamp: new Date().toISOString(),
            source: 'upload',
            isPrimary: photos.length === 0 && index === 0
          };
          setPhotos(prev => [newPhoto, ...prev]);
        }
      };
      reader.readAsDataURL(file);
    });

    if (e.target) e.target.value = '';
  };

  // Return captured photos to the listing form. The actual Supabase Storage
  // upload happens after the final property ID is known, so files are never
  // uploaded into a temporary/orphan listing path.
  const handleSaveAndConfirm = async () => {
    if (photos.length === 0) return;

    setIsUploadingToSupabase(true);
    try {
      const primaryPhoto = photos.find(p => p.isPrimary) || photos[0];
      onPhotosSaved(photos, primaryPhoto.url);
      stopCamera();
      onClose();
    } finally {
      setIsUploadingToSupabase(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div 
        className="bg-slate-900 text-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl relative flex flex-col max-h-[94vh] border border-slate-800 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hidden Canvas for High-Res Capture */}
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Native File Input with Camera Capture attribute */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          multiple
          onChange={handleNativeFileUpload}
          className="hidden"
        />

        {/* Modal Top Bar */}
        <div className="px-5 py-4 bg-slate-950/90 border-b border-slate-800/80 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white font-serif">Device Camera Photo Studio</h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-extrabold border border-emerald-500/30">
                  Supabase Linked
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Take high-res architectural photos directly using your camera</p>
            </div>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Room Area Selector Bar */}
        <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800/60 overflow-x-auto flex items-center gap-2 no-scrollbar flex-shrink-0">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
            Room Tag:
          </span>
          {ROOM_TAGS.map(tag => (
            <button
              key={tag.id}
              type="button"
              onClick={() => setSelectedTag(tag.id)}
              className={`px-3 py-1 rounded-xl text-xs font-bold transition whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                selectedTag === tag.id
                  ? 'bg-amber-500 text-slate-950 shadow-sm shadow-amber-500/30'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <span>{tag.emoji}</span>
              <span>{tag.label}</span>
            </button>
          ))}
        </div>

        {/* Camera Viewfinder Area */}
        <div className="relative bg-black flex-1 min-h-[300px] sm:min-h-[380px] flex items-center justify-center overflow-hidden">
          
          {/* Shutter Animation Flash */}
          {isShutterAnimating && (
            <div className="absolute inset-0 bg-white z-40 pointer-events-none animate-out fade-out duration-200" />
          )}

          {/* Snapshot Review Mode */}
          {currentSnapshot ? (
            <div className="relative w-full h-full flex flex-col items-center justify-center bg-black">
              <img
                src={currentSnapshot}
                alt="Captured Snapshot"
                className="w-full h-full object-contain max-h-[360px] sm:max-h-[420px]"
              />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-center gap-3 z-30">
                <button
                  type="button"
                  onClick={retakeSnapshot}
                  className="px-5 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-white text-xs font-bold transition flex items-center gap-2 backdrop-blur-md cursor-pointer border border-slate-700 shadow-lg"
                >
                  <RotateCcw className="w-4 h-4 text-amber-400" />
                  <span>Retake Photo</span>
                </button>
                <button
                  type="button"
                  onClick={acceptSnapshot}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition flex items-center gap-2 shadow-xl cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>Accept & Add to Listing</span>
                </button>
              </div>
            </div>
          ) : cameraActive ? (
            /* Live Camera Video Stream */
            <div className="relative w-full h-full flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-full object-cover max-h-[380px] sm:max-h-[440px] ${
                  facingMode === 'user' ? 'scale-x-[-1]' : ''
                }`}
              />

              {/* Viewfinder Rule-of-Thirds Grid */}
              {showGrid && (
                <div className="absolute inset-0 pointer-events-none grid grid-cols-3 grid-rows-3 border border-white/20">
                  <div className="border-r border-b border-white/20"></div>
                  <div className="border-r border-b border-white/20"></div>
                  <div className="border-b border-white/20"></div>
                  <div className="border-r border-b border-white/20"></div>
                  <div className="border-r border-b border-white/20 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full border border-amber-400/60 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></div>
                    </div>
                  </div>
                  <div className="border-b border-white/20"></div>
                  <div className="border-r border-white/20"></div>
                  <div className="border-r border-white/20"></div>
                  <div></div>
                </div>
              )}

              {/* Top Viewfinder Controls */}
              <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-20 pointer-events-auto">
                <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-bold text-amber-400 border border-amber-400/20 uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  <span>LIVE CAMERA • {facingMode === 'environment' ? 'Rear / Main' : 'Front / Selfie'}</span>
                </span>

                <div className="flex items-center gap-2">
                  {hasTorch && (
                    <button
                      type="button"
                      onClick={toggleTorch}
                      className={`p-2 rounded-xl backdrop-blur-md transition border cursor-pointer ${
                        torchOn
                          ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md'
                          : 'bg-black/60 text-white border-white/20 hover:bg-black/80'
                      }`}
                      title="Toggle Flashlight / Torch"
                    >
                      <Zap className="w-4 h-4" />
                    </button>
                  )}

                  <button
                    type="button"
                    onClick={() => setShowGrid(!showGrid)}
                    className={`p-2 rounded-xl backdrop-blur-md transition border cursor-pointer ${
                      showGrid
                        ? 'bg-white/20 text-white border-white/40'
                        : 'bg-black/60 text-slate-400 border-white/10 hover:text-white'
                    }`}
                    title="Toggle Architectural Alignment Grid"
                  >
                    <Layers className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={toggleCameraFacing}
                    className="p-2 rounded-xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 transition cursor-pointer"
                    title="Switch Front / Rear Camera"
                  >
                    <SwitchCamera className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Bottom Shutter Action Bar */}
              <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-6 z-20">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-11 h-11 rounded-2xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition cursor-pointer"
                  title="Upload from Device Storage"
                >
                  <ImageIcon className="w-5 h-5 text-amber-400" />
                </button>

                {/* Big Shutter Button */}
                <button
                  type="button"
                  onClick={takeSnapshot}
                  className="group relative w-18 h-18 rounded-full bg-white/20 backdrop-blur-md p-1 border-2 border-white flex items-center justify-center transition-all duration-150 hover:scale-105 active:scale-95 shadow-2xl cursor-pointer"
                  title="Take Photo"
                >
                  <div className="w-full h-full rounded-full bg-amber-500 group-hover:bg-amber-400 flex items-center justify-center transition shadow-inner">
                    <Camera className="w-7 h-7 text-slate-950" />
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => startCamera(facingMode)}
                  className="w-11 h-11 rounded-2xl bg-black/60 hover:bg-black/80 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition cursor-pointer"
                  title="Restart Camera"
                >
                  <RefreshCw className="w-5 h-5 text-slate-300" />
                </button>
              </div>
            </div>
          ) : (
            /* Camera Unavailable / Error State with direct upload fallback */
            <div className="p-8 text-center space-y-4 max-w-md">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/20">
                <CameraOff className="w-7 h-7" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Camera Access Required</h4>
                <p className="text-xs text-slate-400 mt-1">
                  {cameraError || 'Browser camera stream is unavailable or blocked in this window.'}
                </p>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-2.5">
                <button
                  type="button"
                  onClick={() => startCamera(facingMode)}
                  className="w-full sm:w-auto px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry Camera</span>
                </button>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-auto px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 border border-slate-700"
                >
                  <UploadCloud className="w-3.5 h-3.5 text-amber-400" />
                  <span>Take Photo with Mobile App / Upload</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Captured Photo Reel / Bottom Gallery */}
        <div className="bg-slate-950 p-4 border-t border-slate-800 space-y-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Listing Photo Gallery ({photos.length})
              </span>
              {photos.length > 0 && (
                <span className="text-[10px] text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded-md border border-amber-400/20">
                  Ready to attach
                </span>
              )}
            </div>

            {photos.length > 0 && (
              <span className="text-[11px] text-slate-400">
                Click star to set as main cover photo
              </span>
            )}
          </div>

          {photos.length === 0 ? (
            <div className="py-4 text-center border border-dashed border-slate-800 rounded-2xl bg-slate-900/50">
              <p className="text-xs text-slate-400">No photos captured yet. Press the amber shutter button above to take your first photo.</p>
            </div>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 max-h-28 overflow-y-auto no-scrollbar">
              {photos.map((photo) => (
                <div
                  key={photo.id}
                  className={`group relative aspect-[4/3] rounded-xl overflow-hidden border-2 transition ${
                    photo.isPrimary
                      ? 'border-amber-500 ring-2 ring-amber-500/30'
                      : 'border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <img src={photo.url} alt={photo.tag} className="w-full h-full object-cover" />
                  
                  {/* Tag overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 p-1 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setPrimary(photo.id)}
                        className={`p-1 rounded-md text-[9px] font-bold ${
                          photo.isPrimary
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-black/60 text-slate-300 hover:text-white'
                        }`}
                        title="Set as Cover Photo"
                      >
                        {photo.isPrimary ? '★ Cover' : '☆'}
                      </button>

                      <button
                        type="button"
                        onClick={() => removePhoto(photo.id)}
                        className="p-1 rounded-md bg-black/60 hover:bg-rose-500 text-slate-300 hover:text-white transition"
                        title="Delete Photo"
                      >
                        <Trash2 className="w-2.5 h-2.5" />
                      </button>
                    </div>

                    <p className="text-[8px] font-bold text-slate-200 truncate leading-tight">
                      {photo.tag}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Action Footer */}
          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={() => {
                stopCamera();
                onClose();
              }}
              className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={photos.length === 0 || isUploadingToSupabase}
              onClick={handleSaveAndConfirm}
              className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-xs rounded-xl shadow-md shadow-amber-500/20 transition flex items-center gap-2 cursor-pointer"
            >
              {isUploadingToSupabase ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Attaching photos to listing...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Attach {photos.length} Photo{photos.length !== 1 ? 's' : ''} to Listing</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
