export class AudioManager {
  backgroundMusic: HTMLAudioElement | null = null;
  hitSound: HTMLAudioElement | null = null;
  successSound: HTMLAudioElement | null = null;
  isMuted: boolean = false;
  originalBackgroundVolume: number = 0.3;
  originalHitVolume: number = 0.5;
  originalSuccessVolume: number = 0.6;

  constructor() {
    // Initialize audio elements
    this.loadAudioFiles();

    console.log("AudioManager initialized");
  }

  loadAudioFiles(): void {
    try {
      // Load background music (supports mp3, wav, midi)
      this.backgroundMusic = new Audio("/sounds/background.mp3");
      this.backgroundMusic.loop = true;
      this.backgroundMusic.volume = this.originalBackgroundVolume;

      // Load sound effects
      this.hitSound = new Audio("/sounds/hit.mp3");
      this.hitSound.volume = this.originalHitVolume;

      this.successSound = new Audio("/sounds/success.mp3");
      this.successSound.volume = this.originalSuccessVolume;

      console.log("Audio files loaded successfully");
    } catch (error) {
      console.warn("Failed to load audio files:", error);
    }
  }

  startBackgroundMusic(): void {
    if (this.backgroundMusic) {
      this.backgroundMusic.currentTime = 0;
      this.backgroundMusic.play().catch((error) => {
        console.warn("Background music play prevented:", error);
      });
      console.log("Background music started");
    }
  }

  stopBackgroundMusic(): void {
    if (this.backgroundMusic) {
      this.backgroundMusic.pause();
      this.backgroundMusic.currentTime = 0;
      console.log("Background music stopped");
    }
  }

  /**
   * Fades out background music in the specified duration
   * @param duration A parameter that represents the duration in milliseconds on how the music would fade away.
   * Default value is 1000 milliseconds.
   */
  fadeOutBackgroundMusic(duration: number = 1000): void {
    if (this.backgroundMusic) {
      // && !this.backgroundMusic.paused
      const startVolume = this.backgroundMusic.volume;
      const fadeStep = startVolume / (duration / 50);

      const fadeInterval = setInterval(() => {
        if (this.backgroundMusic!.paused) {
          this.backgroundMusic!.volume = this.isMuted
            ? 0
            : this.originalBackgroundVolume;
          clearInterval(fadeInterval);
        }
        if (this.backgroundMusic!.volume > fadeStep) {
          this.backgroundMusic!.volume -= fadeStep;
        } else {
          this.backgroundMusic!.volume = 0;
          this.backgroundMusic!.pause();
          this.backgroundMusic!.volume = startVolume; // Reset volume for next play
          clearInterval(fadeInterval);
          console.log("Background music faded out");
        }
      }, 50);
    }
  }

  playCrashSound(): void {
    if (this.hitSound) {
      /*
      // Clone the sound to allow overlapping playback

      // playCrashSound() clones the original <audio> element and plays the clone. That means if crash events happen in quick succession, you’ll hear multiple instances at once (they can stack/overlap).
      // Because it’s a DOM clone, only attributes are copied; runtime stuff like added event listeners aren’t, and properties that aren’t reflected as attributes (e.g., volume, playbackRate) won’t carry over unless you re-apply them to the clone.
      */

      /*
      const soundClone = this.hitSound.cloneNode() as HTMLAudioElement;
      soundClone.play().catch((error) => {
        console.log("Crash sound play prevented:", error);
      });
      */
      this.hitSound.currentTime = 0;
      this.hitSound.play().catch((error) => {
        console.log("Crash sound play prevented:", error);
      });
      console.log("Crash sound played");
    }
  }

  playSuccessSound(): void {
    if (this.successSound) {
      this.successSound.currentTime = 0;
      this.successSound.play().catch((error) => {
        console.log("Success sound play prevented:", error);
      });
      console.log("Success sound played");
    }
  }

  toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.backgroundMusic) {
      this.backgroundMusic.volume = this.isMuted
        ? 0
        : this.originalBackgroundVolume;
    }
    if (this.hitSound) {
      this.hitSound.volume = this.isMuted ? 0 : this.originalHitVolume;
    }
    if (this.successSound) {
      this.successSound.volume = this.isMuted ? 0 : this.originalSuccessVolume;
    }

    console.log(`Audio ${this.isMuted ? "muted" : "unmuted"}`);
    return this.isMuted;
  }

  // Method to restart background music when unmuting (now just ensures it's playing)
  resumeBackgroundMusic(): void {
    if (this.backgroundMusic) {
      // && this.backgroundMusic.paused
      this.backgroundMusic.play().catch((error) => {
        console.warn("Background music resume prevented:", error);
      });
      console.log("Background music resumed");
    }
  }

  // Method to load different audio formats
  // loadCustomAudio(
  //   path: string,
  //   loop: boolean = false,
  //   volume: number = 0.5
  // ): HTMLAudioElement | null {
  //   try {
  //     const audio = new Audio(path);
  //     audio.loop = loop;
  //     audio.volume = volume;
  //     return audio;
  //   } catch (error) {
  //     console.warn(`Failed to load custom audio: ${path}`, error);
  //     return null;
  //   }
  // }
}
