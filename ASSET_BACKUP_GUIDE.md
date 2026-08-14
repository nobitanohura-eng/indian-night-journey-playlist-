# Indian Night Bus — Audio & Media Assets Guide

## ⚠️ GitHub & AI Studio Media Corruption Fix

### Kyun Corrupt Hota Hai?
Git default roop se large binary files (jaise 10MB+ `.mp3`, images) ko track karne ke liye nahi bana hai. Jab AI Studio ya Git CLI binary files ko push karta hai bina `.gitattributes` ke, tab line-ending converters (CRLF / text conversion) binary bytes ko corrupt (0-byte ya invalid encoding) kar dete hain.

### Humne Kya Fix Apply Kiya Hai?
1. **`/.gitattributes` File Add Ki Gayi Hai**:
   - `*.mp3 binary -text`
   - `*.wav binary -text`
   - `*.png binary -text`
   - `*.jpg binary -text`
   Yeh Git aur GitHub ko explicitly bolta hai ki media files ko binary stream ke roop mein treat karein aur text conversion bilkul na karein.

2. **Git LFS (Large File Storage) Compatibility**:
   Media files Git LFS rules ke under mapped hain.

---

## 💾 Local Backup Rakhne Ka Sabse Aasan Tareeqa:

1. Apne computer par ek folder banayein:
   ```
   Bus-App-Assets-Backup/
   ├── music/   (All 16 mp3 songs)
   ├── horns/   (All 3 horn mp3s)
   └── audio/   (engine, rain, road ambient mp3s)
   ```

2. **Google Drive / Cloudinary Backup (Recommended)**:
   - In saari files ka ek `.zip` Google Drive ya Mega par upload karke rakh lein.
   - Ya Cloudinary / Firebase Storage par upload karke direct links `src/constants/audio.ts` mein use kar sakte hain.

3. **Agar GitHub se Clone ke baad koi audio na chale**:
   - Bas apne backup folder se `music/` aur `horns/` ko project ke `public/` folder mein wapas copy/paste kar dijiye.
