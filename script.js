// HTMLの要素を取得
const cameraButton = document.getElementById('cameraButton');
const liveStartButton = document.getElementById('liveStartButton');
const videoElement = document.getElementById('camera');
const musicPlayer = document.getElementById('musicPlayer');
const subtitleContainer = document.getElementById('subtitle-container');
const canvas = document.getElementById('overlay');

// ★★★パスの先頭のスラッシュ「/」を削除★★★
Promise.all([
    faceapi.nets.tinyFaceDetector.loadFromUri('models'),
    faceapi.nets.faceLandmark68Net.loadFromUri('models'),
    faceapi.nets.faceRecognitionNet.loadFromUri('models')
]).then(() => {
    console.log("顔認識モデルの読み込み完了");
});

// 字幕リスト (内容は省略)
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


// お手本画像を読み込んで顔の特徴を学習する関数
async function loadLabeledImages() {
    const labels = ['ena', 'runa']; 
    return Promise.all(
        labels.map(async label => {
            const descriptions = [];
            // ★★★パスの先頭のスラッシュ「/」を削除★★★
            const img = await faceapi.fetchImage(`images/${label}/1.jpg`);
            const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
            if (detections) {
                descriptions.push(detections.descriptor);
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
        console.error('カメラへのアクセスに失敗しました:', error);
        alert('カメラの起動に失敗しました。');
    }
});

// カメラ再生時に顔認識を開始
videoElement.addEventListener('play', async () => {
    const labeledFaceDescriptors = await loadLabeledImages();
    const faceMatcher = new faceapi.FaceMatcher(labeledFaceDescriptors, 0.6);

    const displaySize = { width: videoElement.clientWidth, height: videoElement.clientHeight };
    faceapi.matchDimensions(canvas, displaySize);

    setInterval(async () => {
        const detections = await faceapi.detectAllFaces(videoElement, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceDescriptors();
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        
        canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

        resizedDetections.forEach(detection => {
            const bestMatch = faceMatcher.findBestMatch(detection.descriptor);
            const box = detection.detection.box;
            const drawBox = new faceapi.draw.DrawBox(box, { label: bestMatch.toString() });
            drawBox.draw(canvas);
        });
    }, 100);
});


// ライブ開始ボタンの処理 (変更なし)
liveStartButton.addEventListener('click', () => {
    musicPlayer.play();
    liveStartButton.style.display = 'none';
});

// 字幕の色付け関数 (変更なし)
function colorizeSubtitle(text) {
    let coloredText = text;
    coloredText = coloredText.replace(/えな/g, '<span style="color: pink;">えな</span>');
    coloredText = coloredText.replace(/るな/g, '<span style="color: purple;">るな</span>');
    coloredText = coloredText.replace(/しおり/g, '<span style="color: lightgreen;">しおり</span>');
    coloredText = coloredText.replace(/りり/g, '<span style="color: red;">りり</span>');
    return coloredText;
}

// 字幕更新処理 (変更なし)
musicPlayer.addEventListener('timeupdate', () => {
    const currentTime = musicPlayer.currentTime;
    let currentSubtitle = "";
    for (const subtitle of subtitles) {
        if (currentTime >= subtitle.start && currentTime <= subtitle.end) {
            currentSubtitle = subtitle.text;
            break;
        }
    }
    subtitleContainer.innerHTML = colorizeSubtitle(currentSubtitle);
});
