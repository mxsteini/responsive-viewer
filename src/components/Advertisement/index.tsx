import { Box, Chip, styled } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import { useAppSelector } from '../../hooks/useAppSelector'
import { selectAdvertismentPosition } from '../../reducers/layout'

type Message = {
  data: {
    [key: string]: any
    message: string
  }
}

const AdBlockerMessage = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  fontSize: 14,
}))
const Advertisement = ({ fixed }: { fixed?: boolean }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isAdsLoaded, setIsAdsLoaded] = useState(false)
  const [isAdsBlockerInstalled, setIsAdBlockerInstalled] = useState(false)
  useEffect(() => {
    const onMessage = function(message: Message) {
      if (message.data.message !== '@ADS/LOADED') {
        return
      }
      setIsAdsLoaded(true)

      if (!iframeRef.current) {
        return
      }

      const height = Math.min(190, message.data.height)

      iframeRef.current.style.flexShrink = '0'
      iframeRef.current.style.width = '100%'
      iframeRef.current.style.height = `${height}px`
    }

    window.addEventListener('message', onMessage)

    return () => {
      window.removeEventListener('message', onMessage)
    }
  }, [])

  useEffect(() => {
    if (!isLoaded) {
      return
    }
    let timer = setTimeout(() => {
      setIsAdBlockerInstalled(!isAdsLoaded)
    }, 1500)

    return () => {
      clearTimeout(timer)
    }
  }, [isAdsLoaded, isLoaded])
  const advertisementPosition = useAppSelector(selectAdvertismentPosition)
  let sx = fixed
    ? {
        position: 'absolute',
        left: `clamp( 0px, ${advertisementPosition[0]}px, calc(100vw - 200px))`,
        bottom: `clamp(0px, ${advertisementPosition[1]}px, calc(100vh - 200px))`,
        zIndex: 100,
        width: 200,
        borderRadius: 2,
        overflow: 'hidden',
        background: 'rgb(33, 33, 33)',
      }
    : {}
  return <Box sx={sx}></Box>
}

export default Advertisement
