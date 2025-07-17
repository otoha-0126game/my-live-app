document.addEventListener('DOMContentLoaded', () => {
    const cameraFeed = document.getElementById('cameraFeed');
    const startButton = document.getElementById('startButton');
    const callText = document.getElementById('callText');

    let stream = null; // メディアストリームを保持するための変数

    // カメラの起動処理
    const startCamera = async () => {
        try {
            // 既存のストリームがあれば停止
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }

            // カメラとマイクのアクセス許可を要求
            stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            cameraFeed.srcObject = stream; // 映像をvideo要素にセット

            // 1秒後に「コール」と表示
            setTimeout(() => {
                callText.textContent = 'コール';
                callText.style.display = 'block'; // 文字を表示
            }, 1000);

            // 3秒後に「コール」を消去
            setTimeout(() => {
                callText.style.display = 'none'; // 文字を非表示
            }, 3000);

        } catch (err) {
            console.error('カメラの起動に失敗しました:', err);
            alert('カメラの起動に失敗しました。カメラへのアクセスを許可してください。');
            // エラー時もボタンを再表示
            startButton.style.display = 'block';
        }
    };

    // スタートボタンがクリックされたらカメラを起動
    startButton.addEventListener('click', startCamera);

    // ページが非表示になったときにカメラを停止する処理（オプション）
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && stream) {
            stream.getTracks().forEach(track => track.stop());
            cameraFeed.srcObject = null;
            stream = null;
            startButton.style.display = 'block'; // ボタンを再表示
            callText.style.display = 'none'; // コールテキストを非表示
        }
    });

    // ページロード時に自動でカメラを起動させたい場合 (非推奨: ユーザーの許可が必要なため)
    // startCamera();
});
