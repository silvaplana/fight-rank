# FightRank Android (Capacitor)

Ce dossier est un projet Android natif standard, généré par
`npx cap add android` (voir `frontend/package.json`). Il embarque le build
web (`npm run android`) et l'affiche dans une WebView native. L'appli parle
en HTTPS à l'API de production (`https://silvaplana.cloud/fight-rank/api`),
elle n'a pas besoin du backend en local.

## Prérequis (une fois)

Pas besoin d'Android Studio : un JDK 21+ et le SDK Android en ligne de
commande suffisent.

```bash
# JDK 21+ portable (pas besoin de droits root)
curl -sL -o /tmp/jdk.tar.gz "https://api.adoptium.net/v3/binary/latest/21/ga/linux/x64/jdk/hotspot/normal/eclipse"
mkdir -p ~/tools && tar xzf /tmp/jdk.tar.gz -C ~/tools && mv ~/tools/jdk-21* ~/tools/jdk21

# SDK Android en ligne de commande
mkdir -p ~/android-sdk/cmdline-tools
cd ~/android-sdk/cmdline-tools
curl -sL -o tools.zip "https://dl.google.com/android/repository/commandlinetools-linux-11076708_latest.zip"
python3 -c "import zipfile; zipfile.ZipFile('tools.zip').extractall('.')"
mv cmdline-tools latest && rm tools.zip
yes | latest/bin/sdkmanager --sdk_root=$HOME/android-sdk "platform-tools" "platforms;android-34" "build-tools;34.0.0"
yes | latest/bin/sdkmanager --sdk_root=$HOME/android-sdk --licenses
```

(Le repo a été buildé avec le JDK système 25, qui a aussi marché — 21 est le
minimum requis par Capacitor 8, pas un plafond.)

## Build de l'APK

```bash
cd frontend
npm run android    # vite build (base "/", API prod) + npx cap sync android

cd android
echo "sdk.dir=$HOME/android-sdk" > local.properties
export JAVA_HOME=~/tools/jdk21
export ANDROID_HOME=~/android-sdk
./gradlew assembleDebug
```

APK généré : `android/app/build/outputs/apk/debug/app-debug.apk`.

## Installer l'APK sur le téléphone

- **Le plus simple** : transférer le fichier au téléphone (Drive, mail, câble
  USB — sous WSL2 le fichier est aussi visible côté Windows via
  `\\wsl$\<distro>\...\android\app\build\outputs\apk\debug\app-debug.apk`),
  l'ouvrir depuis le téléphone et autoriser l'installation depuis cette
  source.
- **Ou via adb**, téléphone branché en USB avec le débogage USB activé :
  ```bash
  ~/android-sdk/platform-tools/adb install app/build/outputs/apk/debug/app-debug.apk
  ```

## Après une modif du frontend

```bash
cd frontend && npm run android && cd android && ./gradlew assembleDebug
```

## Notes

- C'est un APK **debug**, non signé pour la Play Store — suffisant pour
  installer directement sur un téléphone ("release" + signature à faire le
  jour où une publication sur le Play Store est voulue).
- Le backend doit autoriser l'origine `https://localhost` en CORS (c'est
  l'origine par défaut de la WebView Capacitor) — déjà fait, voir
  `backend/app/config.py` et `.env` sur le VPS.
