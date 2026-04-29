import { CSSProperties, ReactNode } from 'react'
import {
  AbsoluteFill,
  Easing,
  Img,
  OffthreadVideo,
  Sequence,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion'

import botThumbsUp from '../assets/bot-thumbsup.webp'
import heroFly from '../assets/hero-fly.webp'

const brand = {
  ink: '#14213d',
  teal: '#00a9a5',
  coral: '#ff6f59',
  lemon: '#ffd166',
  paper: '#fffaf0',
  blue: '#4f7cff',
  plum: '#6d4c7d',
}

const ease = Easing.bezier(0.16, 1, 0.3, 1)

const featureScenes = [
  {
    label: '輸入',
    start: 125,
    end: 285,
    number: '1',
    kicker: '輸入來源',
    title: '滑鼠點選、拖拉即可輸入',
    body: '把喜歡的圖片拖進工作區，或點選選擇圖檔；ICON HERO 會立即接住素材並準備轉換。',
    bullets: ['拖曳圖片到工作區', '支援本機檔案與貼上', '不需要離開瀏覽器'],
    clip: 'remotion-footage/input-drag.mp4',
    focus: { scale: 1.42, x: -12, y: -16 },
    color: brand.teal,
  },
  {
    label: '轉換',
    start: 275,
    end: 455,
    number: '2',
    kicker: '自動處理',
    title: '系統全自動轉換',
    body: '檔案進入佇列後自動分析格式並進行轉換，使用者只需要等待完成狀態出現。',
    bullets: ['自動辨識圖片來源', '顯示處理佇列狀態', '完成後保留可下載結果'],
    clip: 'remotion-footage/auto-convert.mp4',
    focus: { scale: 1.58, x: 0, y: -8 },
    color: brand.coral,
  },
  {
    label: '下載',
    start: 445,
    end: 625,
    number: '3',
    kicker: '專用格式',
    title: '一鍵取得 PNG、ICO、ICNS',
    body: '同一張圖片可直接輸出跨平台 icon 格式，Windows、macOS、一般圖片使用情境都能覆蓋。',
    bullets: ['PNG 用於通用預覽', 'ICO 推薦 Windows', 'ICNS 對應 macOS'],
    clip: 'remotion-footage/conversion-result.mp4',
    clipStart: 160,
    focus: { scale: 1.5, x: -92, y: -230 },
    color: brand.blue,
  },
  {
    label: '安裝',
    start: 615,
    end: 795,
    number: '4',
    kicker: '自動安裝',
    title: '生成腳本後套用至目標',
    body: '選擇平台與目標路徑，下載腳本與 icon package；真正變更資料夾圖示的動作在本機執行。',
    bullets: ['選擇 Windows / macOS / Linux', '輸入或選取目標資料夾', '下載後在本機執行腳本'],
    clip: 'remotion-footage/script-install.mp4',
    focus: { scale: 1.48, x: 0, y: -28 },
    color: brand.plum,
  },
] as const

type FeatureSceneData = (typeof featureScenes)[number]

const panelStyle: CSSProperties = {
  border: '2px solid rgba(20, 33, 61, 0.1)',
  borderRadius: 28,
  background: 'rgba(255, 250, 240, 0.92)',
  boxShadow: '0 28px 80px rgba(20, 33, 61, 0.18)',
}

const fade = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, start + 18, end - 18, end], [0, 1, 1, 0], {
    easing: ease,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

const rise = (frame: number, start: number, distance = 48) =>
  interpolate(frame, [start, start + 28], [distance, 0], {
    easing: ease,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

const Badge = ({ children, color = brand.blue }: { children: ReactNode; color?: string }) => (
  <div
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      borderRadius: 999,
      padding: '14px 22px',
      background: color,
      color: '#fff',
      fontSize: 28,
      fontWeight: 800,
      letterSpacing: 0,
      boxShadow: `0 16px 36px ${color}40`,
      whiteSpace: 'nowrap',
    }}
  >
    {children}
  </div>
)

const FeatureVideoFrame = ({ feature }: { feature: FeatureSceneData }) => (
  <div style={{ ...panelStyle, overflow: 'hidden' }}>
    <div
      style={{
        height: 66,
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        padding: '0 24px',
        background: '#ffffff',
        borderBottom: '1px solid rgba(20, 33, 61, 0.08)',
      }}
    >
      <div style={{ width: 17, height: 17, borderRadius: 999, background: '#ff5f57' }} />
      <div style={{ width: 17, height: 17, borderRadius: 999, background: '#ffbd2e' }} />
      <div style={{ width: 17, height: 17, borderRadius: 999, background: '#28c840' }} />
      <div
        style={{
          marginLeft: 16,
          borderRadius: 999,
          padding: '10px 24px',
          background: '#eef3ff',
          color: brand.ink,
          fontSize: 24,
          fontWeight: 800,
          flex: 1,
        }}
      >
        功能片段 {feature.number} / 4：{feature.title}
      </div>
    </div>
    <div style={{ position: 'relative', width: 920, height: 520, background: '#f8fbff', overflow: 'hidden' }}>
      <OffthreadVideo
        muted
        startFrom={'clipStart' in feature ? feature.clipStart : 0}
        src={staticFile(feature.clip)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          transform: `translate(${feature.focus.x}px, ${feature.focus.y}px) scale(${feature.focus.scale})`,
          transformOrigin: 'center center',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 24,
          bottom: 24,
          borderRadius: 999,
          padding: '10px 18px',
          background: 'rgba(255, 255, 255, 0.92)',
          color: brand.ink,
          fontSize: 22,
          fontWeight: 850,
          boxShadow: '0 12px 28px rgba(20, 33, 61, 0.18)',
        }}
      >
        真實操作錄影
      </div>
    </div>
  </div>
)

const HeroScene = () => {
  const frame = useCurrentFrame()
  const opacity = fade(frame, 0, 150)
  const float = Math.sin(frame / 18) * 14

  return (
    <AbsoluteFill style={{ opacity }}>
      <div style={{ position: 'absolute', left: 122, top: 126 }}>
        <div style={{ display: 'grid', gap: 24 }}>
          <Badge color={brand.teal}>ICON HERO 操作動畫</Badge>
          <div style={{ color: brand.ink, fontSize: 76, fontWeight: 900, lineHeight: 1.02, letterSpacing: 0, maxWidth: 860 }}>
            4 個重點功能，看懂圖片如何變成 Icon
          </div>
          <div style={{ color: '#40506f', fontSize: 34, lineHeight: 1.45, maxWidth: 820 }}>
            每段都是獨立真實操作片段：輸入、轉換、下載格式、生成腳本安裝。
          </div>
        </div>
      </div>
      <Img
        src={staticFile('ICONHERO.png')}
        style={{
          position: 'absolute',
          right: 180,
          top: 154 + float,
          width: 380,
          height: 380,
          objectFit: 'contain',
        }}
      />
      <Img
        src={heroFly}
        style={{
          position: 'absolute',
          right: 310,
          bottom: 164 - float,
          width: 420,
          objectFit: 'contain',
        }}
      />
      <div style={{ position: 'absolute', left: 126, top: 650, display: 'flex', gap: 22 }}>
        <Badge color={brand.teal}>輸入</Badge>
        <Badge color={brand.coral}>轉換</Badge>
        <Badge color={brand.blue}>下載</Badge>
        <Badge color={brand.plum}>安裝</Badge>
      </div>
    </AbsoluteFill>
  )
}

const FeatureScene = ({ feature }: { feature: FeatureSceneData }) => {
  const frame = useCurrentFrame()
  const opacity = fade(frame, feature.start, feature.end)
  const textY = rise(frame, feature.start)
  const videoY = rise(frame, feature.start + 8, 34)

  return (
    <AbsoluteFill style={{ opacity }}>
      <div
        style={{
          position: 'absolute',
          left: 112,
          top: 100,
          display: 'grid',
          gridTemplateColumns: '720px 1fr',
          gap: 64,
          alignItems: 'center',
        }}
      >
        <div style={{ transform: `translateY(${textY}px)`, display: 'grid', gap: 26 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div
              style={{
                width: 78,
                height: 78,
                borderRadius: 24,
                background: feature.color,
                color: '#fff',
                display: 'grid',
                placeItems: 'center',
                fontSize: 42,
                fontWeight: 950,
                boxShadow: `0 20px 44px ${feature.color}55`,
              }}
            >
              {feature.number}
            </div>
            <Badge color={feature.color}>{feature.kicker}</Badge>
          </div>
          <div style={{ color: brand.ink, fontSize: 68, fontWeight: 950, lineHeight: 1.03, letterSpacing: 0 }}>
            {feature.title}
          </div>
          <div style={{ color: '#40506f', fontSize: 32, lineHeight: 1.45, maxWidth: 690 }}>
            {feature.body}
          </div>
          <div style={{ display: 'grid', gap: 18, marginTop: 12 }}>
            {feature.bullets.map((bullet, index) => (
              <div key={bullet} style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
                <div
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 14,
                    background: index === 1 ? brand.coral : feature.color,
                    color: '#fff',
                    display: 'grid',
                    placeItems: 'center',
                    fontSize: 24,
                    fontWeight: 900,
                  }}
                >
                  {index + 1}
                </div>
                <div style={{ color: brand.ink, fontSize: 30, fontWeight: 850 }}>
                  {bullet}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ position: 'relative', transform: `translateY(${videoY}px)` }}>
          <Sequence from={feature.start} layout="none">
            <FeatureVideoFrame feature={feature} />
          </Sequence>
        </div>
      </div>
    </AbsoluteFill>
  )
}

const Timeline = () => {
  const frame = useCurrentFrame()
  const width = interpolate(frame, [0, 820], [0, 100], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <div style={{ position: 'absolute', left: 110, right: 110, bottom: 68 }}>
      <div style={{ position: 'relative', height: 10, borderRadius: 999, background: 'rgba(20, 33, 61, 0.12)' }}>
        <div style={{ width: `${width}%`, height: '100%', borderRadius: 999, background: brand.coral }} />
        {featureScenes.map(feature => {
          const active = frame >= feature.start
          return (
            <div
              key={feature.label}
              style={{
                position: 'absolute',
                left: `${(feature.start / 820) * 100}%`,
                top: -18,
                transform: 'translateX(-50%)',
                display: 'grid',
                gap: 16,
                justifyItems: 'center',
              }}
            >
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 999,
                  background: active ? feature.color : '#ffffff',
                  border: `4px solid ${active ? feature.color : 'rgba(20, 33, 61, 0.18)'}`,
                  boxShadow: active ? `0 10px 26px ${feature.color}66` : 'none',
                }}
              />
              <div style={{ color: active ? brand.ink : '#71809d', fontSize: 22, fontWeight: 800 }}>
                {feature.label}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const FinalScene = () => {
  const frame = useCurrentFrame()
  const opacity = fade(frame, 780, 900)
  const scale = interpolate(frame, [800, 840], [0.9, 1], {
    easing: ease,
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill style={{ opacity }}>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center' }}>
        <div
          style={{
            ...panelStyle,
            width: 1280,
            minHeight: 620,
            padding: 76,
            display: 'grid',
            gridTemplateColumns: '1fr 390px',
            gap: 56,
            alignItems: 'center',
            transform: `scale(${scale})`,
          }}
        >
          <div style={{ display: 'grid', gap: 34 }}>
            <Badge color={brand.coral}>完成流程</Badge>
            <div style={{ color: brand.ink, fontSize: 76, fontWeight: 950, lineHeight: 1.03 }}>
              不是長流程，而是 4 段可剪輯功能素材
            </div>
            <div style={{ color: '#4d5b77', fontSize: 35, lineHeight: 1.45 }}>
              每段影片都可以獨立調整、替換或延長，適合後續放進產品頁、README 或短影音。
            </div>
            <div style={{ display: 'flex', gap: 22, marginTop: 8 }}>
              <Badge color={brand.teal}>輸入</Badge>
              <Badge color={brand.coral}>轉換</Badge>
              <Badge color={brand.blue}>下載</Badge>
              <Badge color={brand.plum}>安裝</Badge>
            </div>
          </div>
          <Img src={botThumbsUp} style={{ width: 390, objectFit: 'contain' }} />
        </div>
      </div>
    </AbsoluteFill>
  )
}

export const IconHeroTutorial = () => {
  const frame = useCurrentFrame()
  const { durationInFrames } = useVideoConfig()
  const sweep = interpolate(frame, [0, durationInFrames], [-24, 124], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  })

  return (
    <AbsoluteFill
      style={{
        fontFamily: 'Inter, "Segoe UI", "Noto Sans TC", Arial, sans-serif',
        background: `linear-gradient(135deg, ${brand.paper} 0%, #eff9ff 48%, #fff1e8 100%)`,
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: `${sweep}%`,
          top: -260,
          width: 620,
          height: 1600,
          background: 'rgba(255, 255, 255, 0.42)',
          transform: 'rotate(18deg)',
        }}
      />
      <HeroScene />
      {featureScenes.map(feature => (
        <FeatureScene key={feature.number} feature={feature} />
      ))}
      <FinalScene />
      <Timeline />
    </AbsoluteFill>
  )
}
