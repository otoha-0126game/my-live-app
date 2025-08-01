// HTMLの要素を取得
const startButton = document.getElementById('startButton');
const videoElement = document.getElementById('camera');

// 「カメラを起動」ボタンがクリックされたときの処理
startButton.addEventListener('click', async () => {
    try {
        // カメラにアクセスするための設定（外側カメラを指定）
        const constraints = {
            video: {
                facingMode: 'environment' // 'user'にすると内側カメラになる
            },
            audio: false // 音声は不要なのでfalse
        };

        // カメラの映像データを取得
        const stream = await navigator.mediaDevices.getUserMedia(constraints);

        // <video>要素に映像を流し込む
        videoElement.srcObject = stream;
        
        // 起動ボタンを非表示にする
        startButton.style.display = 'none';

    } catch (error) {
        // エラーが起きた場合の処理
        console.error('カメラへのアクセスに失敗しました:', error);
        alert('カメラの起動に失敗しました。ブラウザのカメラアクセスを許可してください。');
    }
});
