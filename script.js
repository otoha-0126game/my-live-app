// HTMLの要素を取得
const cameraButton = document.getElementById('cameraButton');
const liveStartButton = document.getElementById('liveStartButton');
const videoElement = document.getElementById('camera');
const musicPlayer = document.getElementById('musicPlayer');
const subtitleContainer = document.getElementById('subtitle-container');

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

// 「カメラを起動」ボタンがクリックされたときの処理
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

// 「ライブ開始」ボタンがクリックされたときの処理
liveStartButton.addEventListener('click', () => {
    musicPlayer.play();
    liveStartButton.style.display = 'none';
});

// --- ★ここから追加★ ---
// 字幕のテキストに色を付ける関数
function colorizeSubtitle(text) {
    let coloredText = text;
    coloredText = coloredText.replace(/えな/g, '<span style="color: pink;">えな</span>');
    coloredText = coloredText.replace(/るな/g, '<span style="color: purple;">るな</span>');
    coloredText = coloredText.replace(/しおり/g, '<span style="color: lightgreen;">しおり</span>');
    coloredText = coloredText.replace(/りり/g, '<span style="color: red;">りり</span>');
    return coloredText;
}
// --- ★ここまで追加★ ---

// 音楽の再生時間に合わせて字幕を更新する
musicPlayer.addEventListener('timeupdate', () => {
    const currentTime = musicPlayer.currentTime;
    let currentSubtitle = "";

    for (const subtitle of subtitles) {
        if (currentTime >= subtitle.start && currentTime <= subtitle.end) {
            currentSubtitle = subtitle.text;
            break;
        }
    }
    
    // --- ★ここを修正★ ---
    // innerTextの代わりにinnerHTMLを使い、色付けしたテキストをセットする
    subtitleContainer.innerHTML = colorizeSubtitle(currentSubtitle);
});
