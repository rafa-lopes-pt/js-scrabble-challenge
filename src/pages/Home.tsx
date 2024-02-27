import React, { useEffect, useState } from 'react'
import { Button, Flex, Modal } from 'antd'
import { motion } from 'framer-motion'

export default function Home({ onPlay }: { onPlay: Function }) {
  const [showAboutModal, setShowAboutModal] = useState(false)
  return (
    <>
      <motion.div className="home-container">
        <h1 className="home-container__title">Scrabble</h1>
        <Flex vertical gap={'small'}>
          <Button type="primary" onClick={() => onPlay()}>
            Play
          </Button>
          <Button type="text" onClick={() => setShowAboutModal(true)}>
            About
          </Button>
        </Flex>
      </motion.div>
      <About
        open={showAboutModal}
        onClose={() => setShowAboutModal(false)}
      ></About>
    </>
  )
}

function About({ open, onClose }: { open: boolean; onClose: Function }) {
  return (
    <Modal
      title="About the game"
      open={open}
      centered
      onOk={() => onClose()}
      cancelButtonProps={{ style: { display: 'none' } }}
    />
  )
}
