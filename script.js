// 'cameraFeed'というIDがついたvideo要素を見つけて、'videoElement'という変数に入れる
const videoElement = document.getElementById('cameraFeed');

// スマホのカメラを使えるようにするプログラム
navigator.mediaDevices.getUserMedia({
    video: {
        facingMode: 'environment' // 外カメ（背面カメラ）を使うことを指示
    }
})
.then(stream => {
    // カメラの映像が取れたら、それをvideoElementに流し込む
    videoElement.srcObject = stream;
})
.catch(error => {
    // もしカメラが使えなかったり、許可されなかったりした場合の処理
    console.error('カメラへのアクセスに失敗しました:', error);
    alert('カメラへのアクセスを許可してください。または、お使いのデバイスではカメラが利用できません。');
});
