import { useCallback, useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";

const WebcamStreamCapture = () => {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef<MediaRecorder>(null);
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [deviceId, setDeviceId] = useState({});
  const [devices, setDevices] = useState([]);
  const [blobToExport, setBlobToExport] = useState<Blob | null>(null);

  const handleDevices = useCallback(
    (mediaDevices: any[]) =>
      setDevices(mediaDevices.filter(({ kind }) => kind === "videoinput")),
    [setDevices]
  );

  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then(handleDevices);
  }, [handleDevices]);

  const handleStartCaptureClick = useCallback(() => {
    setCapturing(true);
    console.log('*** webcamRef, mediaRecorderRef Line no: [24] ***', webcamRef, mediaRecorderRef);
    if (webcamRef.current) {
      console.log("***  Line no: [13] ***");
      mediaRecorderRef.current = new MediaRecorder(webcamRef?.current.stream, {
        mimeType: "video/webm",
      });
      mediaRecorderRef?.current.addEventListener(
        "dataavailable",
        handleDataAvailable
      );
      mediaRecorderRef?.current.start();
    }
  }, [webcamRef, setCapturing, mediaRecorderRef]);

  const handleDataAvailable = useCallback(
    ({ data }: any) => {
      if (data.size > 0) {
        console.log("***  Line no: [27] ***");
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStopCaptureClick = useCallback(() => {
    mediaRecorderRef && mediaRecorderRef.current && mediaRecorderRef.current.stop();
    setCapturing(false);
  }, [mediaRecorderRef, webcamRef, setCapturing]);

  const handleDownload = useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm",
      });
      setBlobToExport(blob);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = "react-webcam-stream-capture.webm";
      a.click();
      window.URL.revokeObjectURL(url);
      setRecordedChunks([]);
    }
  }, [recordedChunks]);




  const uploadToS3 = () => {
    const s3 = new AWS.S3({
      accessKeyId: 'YOUR_ACCESS_KEY_ID',
      secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
      region: 'us-east-2',
    });

    const params = {
      Bucket: 'arn:aws:s3:::video-storage-demonki',
      Key: 'video.webm',
      Body: blobToExport,
      ContentType: 'video/webm',
    };

    s3.upload(params, (err: any, data: any) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('Video uploaded successfully', data.Location);
    });
  };






  return (
    <>
      <Webcam audio={false} ref={webcamRef} />
      {capturing ? (
        <button onClick={handleStopCaptureClick}>Stop Capture</button>
      ) : (
        <button onClick={handleStartCaptureClick}>Start Capture</button>
      )}
      {recordedChunks.length > 0 && (
        <button onClick={handleDownload}>Download</button>
      )}

       {devices.map((device, key) => (
          <div key={key} >
            <Webcam audio={false} videoConstraints={{ deviceId: device.deviceId }} />
            {device.label || `Device ${key + 1}`}
          </div>
                  ))}
                  </>

  );
};

function Video() {
  return (
    <div>
      <h1>Video</h1>
      <WebcamStreamCapture />
    </div>
  );
}

export default Video;
