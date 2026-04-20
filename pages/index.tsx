import { useState, useEffect } from 'react'
import Head from 'next/head'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useReadContract } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contract'
import StoryFeed from '../components/StoryFeed'
import AddLine from '../components/AddLine'
import StartStory from '../components/StartStory'

const GENESIS_STORY_ID = 1n

export default function Home() {
  const [refreshTrigger, setRefreshTrigger] = useState(0)
  const [activeStoryId, setActiveStoryId] = useState(GENESIS_STORY_ID)
  const [tick, setTick] = useState(true)

  useEffect(() => {
    const t = setInterval(() => setTick(v => !v), 600)
    return () => clearInterval(t)
  }, [])

  const { data: storyCount, refetch: refetchCount } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'storyCount',
  })

  const { data: activeStory } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'stories',
    args: [activeStoryId],
  })

  const handleLineAdded = () => setRefreshTrigger(v => v + 1)
  const handleStoryCreated = () => {
    refetchCount()
    setRefreshTrigger(v => v + 1)
  }

  const totalStories = storyCount ? Number(storyCount) : 0

  return (
    <>
      <Head>
        <title>BaseChainLore — Living On-Chain Story</title>
        <meta name="description" content="A living on-chain collaborative story on Base. Anyone can add one sentence." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Ticker tape */}
      <div className="w-full overflow-hidden bg-black py-1 border-b-4 border-black">
        <div className="text-xs font-bold text-[#FFEF00] whitespace-nowrap inline-block animate-scroll px-4">
          BASE_CHAINLORE &nbsp;///&nbsp; STORY LIVES FOREVER ON BASE &nbsp;///&nbsp; ANYONE CAN WRITE &nbsp;///&nbsp; 0 CENSORSHIP &nbsp;///&nbsp; 0 OWNERS &nbsp;///&nbsp; ∞ CHAOS &nbsp;///&nbsp; CONTRACT: {CONTRACT_ADDRESS} &nbsp;///&nbsp; NETWORK: BASE &nbsp;///&nbsp;
        </div>
      </div>

      <main className="min-h-screen bg-[#F5F0E8] px-4 py-6 max-w-2xl mx-auto">

        {/* Header */}
        <header className="mb-8">
          <div className="flex justify-between items-start gap-4 flex-wrap mb-6">
            <div>
              <div className="text-xs font-black uppercase tracking-widest text-[#FF3B00] mb-1">
                ▶ ON-CHAIN COLLABORATIVE STORY
              </div>
              <h1 className="text-4xl font-black uppercase leading-none tracking-tight">
                BASE_<br />CHAIN_<br />LORE
              </h1>
              <div className="text-sm font-bold mt-2 text-gray-600">
                Add one sentence. Chaos erupts.{' '}
                <span style={{ opacity: tick ? 1 : 0 }} className="text-black">█</span>
              </div>
            </div>

            {/* Connect button box */}
            <div className="brut-box p-2 bg-white self-start">
              <ConnectButton
                chainStatus="icon"
                showBalance={false}
                accountStatus="avatar"
              />
            </div>
          </div>

          {/* Stats row */}
          <div className="flex gap-3 text-xs flex-wrap">
            <div className="brut-tag brut-tag-active">
              STORIES: {totalStories}
            </div>
            <div className="brut-tag">
              CHAIN: BASE
            </div>
            <div className="brut-tag">
              CONTRACT:{' '}
              <a
                href={`https://basescan.org/address/${CONTRACT_ADDRESS}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[#FF3B00]"
              >
                {CONTRACT_ADDRESS.slice(0, 8)}...
              </a>
            </div>
          </div>
        </header>

        {/* Story selector */}
        {totalStories > 1 && (
          <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
            {Array.from({ length: totalStories }, (_, i) => BigInt(i + 1)).map(id => (
              <button
                key={id.toString()}
                onClick={() => setActiveStoryId(id)}
                className={`brut-tag whitespace-nowrap transition-all ${
                  activeStoryId === id ? 'brut-tag-active' : 'hover:bg-gray-100'
                }`}
              >
                STORY #{id.toString()}
              </button>
            ))}
          </div>
        )}

        {/* Active story box */}
        <section className="brut-box-accent bg-white p-5 mb-5">
          {/* Story header */}
          <div className="mb-4 pb-3 border-b-2 border-black">
            <div className="text-xs font-black uppercase text-[#FF3B00] mb-1">
              ▶ ACTIVE LORE — STORY #{activeStoryId.toString()}
            </div>
            <div className="text-xl font-black uppercase mt-1">
              {activeStory ? (activeStory as any)[0] : 'LOADING...'}
            </div>
            {activeStory && (
              <div className="text-xs font-bold mt-1">
                STATUS:{' '}
                <span className={`${(activeStory as any)[1] ? 'text-[#00AA44]' : 'text-[#FF3B00]'}`}>
                  {(activeStory as any)[1] ? '● ACTIVE' : '● CLOSED'}
                </span>
              </div>
            )}
          </div>

          <StoryFeed storyId={activeStoryId} refreshTrigger={refreshTrigger} />
        </section>

        {/* Add a line */}
        <section className="mb-5">
          <AddLine storyId={activeStoryId} onSuccess={handleLineAdded} />
        </section>

        {/* Start new story */}
        <StartStory onSuccess={handleStoryCreated} />

        {/* Footer */}
        <footer className="mt-12 pt-4 border-t-4 border-black text-xs font-bold text-center space-y-1 uppercase">
          <div>BUILT ON BASE. LIVES FOREVER.</div>
          <div>
            <a
              href="https://x.com/tyson_6154"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-[#FF3B00] transition-colors"
            >
              FOLLOW ON X ↗
            </a>
          </div>
        </footer>
      </main>
    </>
  )
}