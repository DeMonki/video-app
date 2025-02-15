import { Button, Modal } from "antd"
import { useState } from "react"
import ReactPlayer from "react-player"

export const VideoModal = () => {

    const [showVideoModal,setShowVideoModal ] = useState(false)


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
            // url={localURL} 
            controls 
            // width="100%" 
            // height="100%" 
            />            
        </Modal>
        </>
    )
}