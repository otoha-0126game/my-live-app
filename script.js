const cameraButton = document.getElementById('cameraButton');
const liveStartButton = document.getElementById('liveStartButton');
const videoElement = document.getElementById('camera');
const musicPlayer = document.getElementById('musicPlayer');
// ★★★ Get both subtitle containers ★★★
const currentSubtitleContainer = document.getElementById('current-subtitle-container');
const nextSubtitleContainer = document.getElementById('next-subtitle-container');
// ★★★★★★★★★★★★★★★★★★★★★★★
const canvas = document.getElementById('overlay');

const profileData = {
    otoha: [
        "おとは 20歳 ズッキーニが大好き🥒",
        "最近、寝言でズッキーニと言っていたらしい",
        "特技は3秒でズッキーニの絵を描くこと"
    ],
    tomoko: [
        "ともこ 54歳 秋田在住",
        "家庭菜園で一番うまく育つのはトマト",
        "実は甘党で、あんこが好き"
    ]
};
const faceStates = {};

// face-apiのモデルを読み込む
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('models')
]).then(() => {
    console.log("✅ [成功] 顔認識モデルの読み込み完了");
}).catch(err => {
    console.error("❌ [失敗] 顔認識モデルの読み込みエラー:", err);
});

// 字幕リスト
const subtitles = [
    { start: 1.08, end: 1.8, text: "だ〜だ！" },
    { start: 3.5, end: 4.3, text: "だ〜だ！" },
    { start: 5.2, end: 6.4, text: "👏はいせーの！" },
    { start: 6.6, end: 8.9, text: "ミョーホントゥスケ！化繊飛除去！" },
    { start: 9.0, end: 11.4, text: "ジャージャー！ファイボ！ワイパー！" },
    { start: 11.6, end: 16.7, text: "うっおい！×４ あ〜！しゃーいくぞ！" },
    { start: 16.9, end: 21.8, text: "タイガー！ファイヤー！サイバー！ファイバー！ダイバー！バイバー！ジャジャー！" },
    { start: 22.0, end: 24.0, text: "あ〜！えなちゃん！" },
    { start: 25.0, end: 27.0, text: "あ〜！るなちゃん！" },
    { start: 29.2, end: 31.8, text: "お！れ！の！えなorるなちゃん！" },
    { start: 33.0, end: 34.5, text: "あ〜！しおり！" },
    { start: 35.0, end: 37.0, text: "あ〜！りりちゃん！" },
    { start: 39.0, end: 41.5, text: "みんなで一緒にオーイング！" },
    { start: 41.8, end: 47.0, text: "お〜！ふっふ〜！(×4)" },
    { start: 53.1, end: 54.5, text: "👏俺もー！" },
    { start: 54.6, end: 55.3, text: "ふっふ〜！" },
    { start: 55.8, end: 57.0, text: "ふっふ〜！" },
    { start: 58.3, end: 59.7, text: "👏👏ふわふわ！" },
    { start: 59.8, end: 62.0, text: "はいせーの！はいせーの！" },
    { start: 62.2, end: 63.1, text: "うっおい！うっおい！" },
    { start: 63.3, end: 64.7, text: "おいおいおいおい！" },
    { start: 64.9, end: 66.0, text: "ふー！" },
    { start: 66.1, end: 67.2, text: "ふっふ〜！" },
    { start: 68.6, end: 69.8, text: "👏👏ふわふわ！" },
    { start: 69.9, end: 72.0, text: "はいせーの！はいせーの！" },
    { start: 72.2, end: 73.5, text: "うっおい！うっおい！" },
    { start: 73.7, end: 74.5, text: "おーいぇー！" },
    { start: 74.6, end: 77.0, text: "👏👏👏👏👏👏👏👏" },
    { start: 79.0, end: 80.0, text: "わお！" }
];


// 画像を読み込んで顔の特徴を学習
async function loadLabeledImages() {
    const labels = ['otoha', 'tomoko']; 
    return Promise.all(
        labels.map(async label => {
            faceStates[label] = {
                lastSeen: 0,
                firstSeen: 0,
                isCounting: false,
                triviaIndex: 0
            };
            const descriptions = [];
            try {
                const img = await faceapi.fetchImage(`images/${label}/1.jpg`);
                const detections = await faceapi.detectSingleFace(img, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptor();
                if (detections) {
                    descriptions.push(detections.descriptor);
                }
            } catch (e) {
                console.error(`Error loading image for ${label}`, e);
            }
            return new faceapi.LabeledFaceDescriptors(label, descriptions);
        })
    );
}

// カメラ起動処理
cameraButton.addEventListener('click', async () => {
    try {
        const constraints = { video: { facingMode: 'environment' }, audio: false };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoElement.srcObject = stream;
        cameraButton.style.display = 'none';
        liveStartButton.style.display = 'block';
    } catch (error) {
        console.error('カメラの起動エラー:', error);
    }
});

// カメラ再生時に顔認識を開始
videoElement.addEventListener('play', async () => {
    try {
        const labeledFaceDescriptors = await loadLabeledImages();
        const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);
        const displaySize = { width: videoElement.clientWidth, height: videoElement.clientHeight };
        faceapi.matchDimensions(canvas, displaySize);
        const ctx = canvas.getContext('2d');

        setInterval(async () => {
            const detections = await faceapi.detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
            const resizedDetections = faceapi.resizeResults(detections, displaySize);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const facesSeenThisFrame = new Set();
            resizedDetections.forEach(detection => {
                const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
                const label = bestMatch.label;
                facesSeenThisFrame.add(label);
                if (label !== 'unknown') {
                    const state = faceStates[label];
                    const box = detection.detection.box;
                    new faceapi.draw.DrawBox(box, { boxColor: '#ff4500' }).draw(canvas);
                    if (!state.isCounting) {
                        state.isCounting = true;
                        state.firstSeen = Date.now();
                    }
                    state.lastSeen = Date.now();
                    const duration = (Date.now() - state.firstSeen) / 1000;
                    let textToDraw = "";
                    if (duration < 1) {
                        textToDraw = "3";
                    } else if (duration < 2) {
                        textToDraw = "2";
                    } else if (duration < 3) {
                        textToDraw = "1";
                    } else {
                        const trivia = profileData[label];
                        textToDraw = trivia[state.triviaIndex];
                    }
                    const x = box.bottomLeft.x;
                    const y = box.bottomLeft.y + 30;
                    ctx.font = 'bold 30px sans-serif';
                    ctx.fillStyle = 'white';
                    ctx.strokeStyle = 'black';
                    ctx.lineWidth = 5;
                    ctx.strokeText(textToDraw, x, y);
                    ctx.fillText(textToDraw, x, y);
                }
            });
            Object.keys(faceStates).forEach(label => {
                if (!facesSeenThisFrame.has(label)) {
                    const state = faceStates[label];
                    const timeMissing = (Date.now() - state.lastSeen) / 1000;
                    if (timeMissing > 1 && state.isCounting) {
                        state.isCounting = false;
                        state.triviaIndex = (state.triviaIndex + 1) % profileData[label].length;
                    }
                }
            });
        }, 100);
    } catch(e) {
        console.error("顔認識の準備中にエラーが発生しました:", e);
    }
});

// ライブ開始ボタン
liveStartButton.addEventListener('click', () => {
    musicPlayer.play();
    liveStartButton.style.display = 'none';
});

// 字幕の色付け
function colorizeSubtitle(text) {
    let coloredText = text;
    coloredText = coloredText.replace(/えな/g, '<span style="color: pink;">えな</span>');
    coloredText = coloredText.replace(/るな/g, '<span style="color: purple;">るな</span>');
    coloredText = coloredText.replace(/しおり/g, '<span style="color: lightgreen;">しおり</span>');
    coloredText = coloredText.replace(/りり/g, '<span style="color: red;">りり</span>');
    return coloredText;
}

musicPlayer.addEventListener('timeupdate', () => {
    const currentTime = musicPlayer.currentTime;
    let currentSubtitleText = "";
    let nextSubtitleText = "";
    let currentSubtitleIndex = -1;

    // 現在の字幕
    for (let i = 0; i < subtitles.length; i++) {
        if (currentTime >= subtitles[i].start && currentTime <= subtitles[i].end) {
            currentSubtitleText = subtitles[i].text;
            currentSubtitleIndex = i;
            break;
        }
    }

    // 次の字幕
    if (currentSubtitleIndex !== -1) {
        // 現在の字幕が表示時間外になったら、次の字幕を探す
        let nextIndex = -1;
        for (let i = 0; i < subtitles.length; i++) {
            if (subtitles[i].start > currentTime) {
                nextIndex = i;
                break;
            }
        }
        if (nextIndex !== -1) {
            nextSubtitleText = "NEXT👉 " + subtitles[nextIndex].text;
        }
    } else {
        // 現在表示されるべき字幕がない場合
        let nextIndex = -1;
        for (let i = 0; i < subtitles.length; i++) {
            if (subtitles[i].start > currentTime) {
                nextIndex = i;
                break;
            }
        }
        if (nextIndex !== -1) {
            nextSubtitleText = "NEXT👉 " + subtitles[nextIndex].text;
        }
    }

    // 表示を更新
    currentSubtitleContainer.innerHTML = colorizeSubtitle(currentSubtitleText);
    nextSubtitleContainer.innerHTML = nextSubtitleText;
});
// ★★★★★★★★★★★★★★★★★★★★★
