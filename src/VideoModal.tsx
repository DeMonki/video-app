import { Button, Modal } from "antd"
import { useState } from "react"
import ReactPlayer from "react-player"

export const VideoModal = () => {

    const [showVideoModal,setShowVideoModal ] = useState(false)

    const localURL = '/videos/webcam-stream-capture6f7737e7-b0dd-4350-941d-fa2acc96434d.webm'
    const youtubeURL = 'https://www.youtube.com/watch?v=FdB9J5_V3WQ'

    return (
        <>
        <Button
        onClick={() => setShowVideoModal(!showVideoModal)}
        >
            open video modal
        </Button>
        <Modal
        open={showVideoModal}
        closable={false}
        onOk={() => setShowVideoModal(!showVideoModal)}
        onCancel={() => setShowVideoModal(!showVideoModal)}
        width={'80%'}
        >
            <ReactPlayer 
            url={localURL} 
            controls 
            // width="100%" 
            // height="100%" 
            />            
        </Modal>
        </>
    )
}