import { useCallback, useState, useRef, useEffect } from "react"
import { v4 as uuidv4 } from 'uuid'
import Webcam from "react-webcam"

const WebcamStreamCapture = () => {
  const webcamRef = useRef<Webcam>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null); // Add this line
  const [capturing, setCapturing] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
//   const [deviceId, setDeviceId] = useState({});
  const [devices, setDevices] = useState<MediaDevices[]>([]);
  // const [blobToExport, setBlobToExport] = useState<Blob | null>(null);

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
    if (webcamRef.current) {
      mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream!, {
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
      // setBlobToExport(blob);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.setAttribute("style", "display: none");
      a.href = url;
      a.download = `webcam-stream-capture${uuidv4().slice(0,8)}.webm`;
      a.click();
      window.URL.revokeObjectURL(url);
      setRecordedChunks([]);
    }
  }, [recordedChunks]);




//   const uploadToS3 = () => {
//     const s3 = new AWS.S3({
//       accessKeyId: 'YOUR_ACCESS_KEY_ID',
//       secretAccessKey: 'YOUR_SECRET_ACCESS_KEY',
//       region: 'us-east-2',
//     });

//     const params = {
//       Bucket: 'arn:aws:s3:::video-storage-demonki',
//       Key: 'video.webm',
//       Body: blobToExport,
//       ContentType: 'video/webm',
//     };

//     s3.upload(params, (err: any, data: any) => {
//       if (err) {
//         console.error(err);
//         return;
//       }
//       console.log('Video uploaded successfully', data.Location);
//     });
//   };






  return (
    <>
      <Webcam 
      audio={false} 
      mirrored={true}
      ref={webcamRef} />
      {capturing ? (
        <button onClick={handleStopCaptureClick}>Stop Capture</button>
      ) : (
        <button onClick={handleStartCaptureClick}>Start Capture</button>
      )}
      {recordedChunks.length > 0 && (
        <button onClick={handleDownload}>Download</button>
      )}

      {devices.map((device, key) => (
        <div key={key}>
          <Webcam 
          audio={false} 
          videoConstraints={{ 
            deviceId: (device as unknown as MediaDeviceInfo).deviceId
          }} 
          // videoConstraints={{
          //   facingMode: "user", // Use the front camera (you can also set to "environment" for the rear camera)
          // }}
          mirrored={true} // Set mirror to false to avoid the mirrored effect
          />
          {(device as unknown as MediaDeviceInfo).label || `Device ${key + 1}`}
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
