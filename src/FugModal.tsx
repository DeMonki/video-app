import { Button, Flex, Modal, Typography } from 'antd'
import { useState } from 'react'

export const FugModal = () => {
    const [openFug, setOpenFug] = useState(false)
    const [openInnerFug, setInnerOpenFug] = useState<boolean>(false)

    const handleInnerClick = () => {
        setInnerOpenFug(!openInnerFug)
    }

    return (
        <>
        <Button
        onClick={() => setOpenFug(!openFug)}
        >
            CLick to see 2 Modals actually do work in antd
        </Button>

        <Modal
        open={openFug}
        onCancel={() => setOpenFug(!openFug)}
        onOk={() => setOpenFug(!openFug)}
        >

            <Button
            onClick={ () =>handleInnerClick()}
            >
                Click
            </Button>
            <Modal
            onCancel={() => handleInnerClick()}
            onOk={() => handleInnerClick()}
            open={openInnerFug}
            >
                <Flex vertical>
                    <Typography.Paragraph>
                        What if i add more content?
                    </Typography.Paragraph>
                    <Typography.Paragraph>
                        What if i add more content?
                    </Typography.Paragraph>
                    <Typography.Paragraph>
                        What if i add more content?
                    </Typography.Paragraph>
                </Flex>
                inner modal
                where is the height
            </Modal>

            <div>open modal</div>
        </Modal></>
    )
}