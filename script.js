// HTMLの要素を取得
const cameraButton = document.getElementById('cameraButton');
const liveStartButton = document.getElementById('liveStartButton');
const videoElement = document.getElementById('camera');
const musicPlayer = document.getElementById('musicPlayer');

// 「カメラを起動」ボタンがクリックされたときの処理
cameraButton.addEventListener('click', async () => {
    try {
        const constraints = {
            video: {
                facingMode: 'environment'
            },
            audio: false
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        videoElement.srcObject = stream;
        
        // ボタンの表示/非表示を切り替え
        cameraButton.style.display = 'none';
        liveStartButton.style.display = 'block';

    } catch (error) {
        console.error('カメラへのアクセスに失敗しました:', error);
        alert('カメラの起動に失敗しました。ブラウザのカメラアクセスを許可してください。');
    }
});

// 「ライブ開始」ボタンがクリックされたときの処理
liveStartButton.addEventListener('click', () => {
    // 音楽を再生
    musicPlayer.play();
    
    // （任意）一度押したらボタンを非表示にする
    liveStartButton.style.display = 'none';

    // ここに将来的に字幕を表示する処理を追加していきます
    console.log("ライブ開始！音楽を再生します。");
});
