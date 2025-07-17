const videoElement = document.getElementById('cameraFeed');

// スマホのカメラを使えるようにするプログラム 
navigator.mediaDevices.getUserMedia({
    video: {
        facingMode: { exact: 'environment' }
    }
})
.then(stream => {
    videoElement.srcObject = stream;
})
.catch(error => {
    console.error('カメラへのアクセスに失敗しました:', error);
    alert('カメラへのアクセスを許可してください。または、お使いのデバイスではカメラが利用できません。');
});


// コールやミックスのデータ
// text: 表示する文章
// start: 表示を開始する秒数
// end: 表示を終了する秒数
const callData = [
    { text: "タイガー！", start: 5, end: 7 }, // 曲が始まって5秒〜7秒に「タイガー！」と表示
    { text: "ファイヤー！", start: 8, end: 10 },
    { text: "サイバー！", start: 11, end: 13 },
    { text: "ファイバー！", start: 14, end: 16 },
    { text: "ダイバー！", start: 17, end: 19 },
    { text: "バイバー！", start: 20, end: 22 },
    { text: "ジャージャー！", start: 25, end: 27 },
    { text: "サビ！\n拳を上げよう！", start: 30, end: 35 }, // \nで改行
    { text: "〇〇（メンバー名）コール！", start: 40, end: 43 },
    { text: "もう一回！\nタイガー！", start: 45, end: 48 },
    { text: "ありがとう！", start: 50, end: 53 },
    // 他にも、曲に合わせてどんどん追加していく
    // (例: 1分20秒から1分25秒まで「盛り上がれー！」と表示したい場合)
    // { text: "盛り上がれー！", start: 80, end: 85 },
];

const startButton = document.getElementById('startButton');
const callTextElement = document.getElementById('callText');

let startTime = 0; // ライブ開始からの時間を測るための変数
let timerInterval; // 時間を管理するタイマー
let currentCallIndex = 0; // 今、どのコールを見ているかを示す番号

// 「ライブ開始」ボタンが押されたときの処理
startButton.addEventListener('click', () => {
    startTime = Date.now(); // ボタンが押された今の時刻を記録
    startButton.style.display = 'none'; // ボタンを非表示にする
    callTextElement.style.display = 'block'; // コール表示領域を表示

    // 0.1秒（100ミリ秒）ごとに、今の時間をチェックする
    timerInterval = setInterval(() => {
        // ライブ開始から何秒経ったかを計算（ミリ秒を秒に直す）
        const elapsedTime = (Date.now() - startTime) / 1000;

        // まだ全てのコールを表示し終わっていないか確認
        if (currentCallIndex < callData.length) {
            const currentCall = callData[currentCallIndex];

            // 今の時間が、コールの表示開始時間と終了時間の間にいるかチェック
            if (elapsedTime >= currentCall.start && elapsedTime < currentCall.end) {
                callTextElement.textContent = currentCall.text; // コール文字を表示
                callTextElement.style.display = 'block'; // 見えるようにする
            } else if (elapsedTime >= currentCall.end) {
                // コールの表示時間が終わったら
                callTextElement.style.display = 'none'; // 非表示にする
                currentCallIndex++; // 次のコールに移る
            } else {
                // まだ次のコールの表示タイミングではない場合（待機中）
                callTextElement.style.display = 'none';
            }
        } else {
            // 全てのコールが表示し終わったら
            callTextElement.textContent = "ライブ終了！お疲れ様でした！"; // 最後のメッセージ
            clearInterval(timerInterval); // 時間をチェックするのをやめる
            callTextElement.style.display = 'block'; // 最後のメッセージは表示しておく
        }
    }, 100); // 100ミリ秒（0.1秒）ごとにこの処理を実行
});
