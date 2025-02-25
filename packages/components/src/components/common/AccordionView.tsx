import React, { useCallback, useRef, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { ReactSpringHook, useSpring } from 'react-spring/native'

import { usePrevious } from '../../hooks/use-previous'
import { Platform } from '../../libs/platform/index.web'
import { SpringAnimatedView } from '../animated/spring/SpringAnimatedView'

export type Transition = ReactSpringHook

export interface AccordionViewProps {
  children: React.ReactNode
  isOpen?: boolean
}

export interface AccordionView {}

export const AccordionView = React.memo((props: AccordionViewProps) => {
  const { children, isOpen } = props

  const wasOpen = usePrevious(isOpen)

  const [size, setSize] = useState<number | 'auto'>(0)

  const animatedStyles = useSpring<any>({
    from: { height: 0 },
    to: { height: isOpen ? size : 0 },
  })

  const handleContentSizeChange = useCallback(
    (_width: number, height: number) => {
      if (size !== height && height > 0) setSize(height)
    },
    [],
  )

  const onLayout = useCallback(e => {
    const { width, height } = e.nativeEvent.layout
    handleContentSizeChange(width, height)
  }, [])

  return (
    <SpringAnimatedView
      style={{
        height: isOpen && wasOpen === isOpen ? 'auto' : animatedStyles.height,
        overflow: 'hidden',
      }}
    >
      {Platform.OS === 'web' ? (
        <View onLayout={onLayout}>{children}</View>
      ) : (
        <ScrollView
          bounces={false}
          onContentSizeChange={handleContentSizeChange}
          scrollEnabled={false}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      )}
    </SpringAnimatedView>
  )
})
