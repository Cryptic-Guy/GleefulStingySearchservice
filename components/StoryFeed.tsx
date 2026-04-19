import { useState, useEffect } from 'react'
import { useReadContract } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contract'

type Line = {
  author: string
  text: string
}

interface StoryFeedProps {
  storyId: bigint
  refreshTrigger: number
}

export default function StoryFeed({ storyId, refreshTrigger }: StoryFeedProps) {
  const PAGE_SIZE = 10n

  const { data: lineCount, refetch: refetchCount } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getLineCount',
    args: [storyId],
  })

  const [offset, setOffset] = useState(0n)
  const [allLines, setAllLines] = useState<Line[]>([])

  const { data: lines, refetch: refetchLines } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'getStoryLinesByRange',
    args: [storyId, offset, PAGE_SIZE],
  })

  useEffect(() => {
    refetchCount()
    refetchLines()
    setOffset(0n)
    setAllLines([])
  }, [refreshTrigger])

  useEffect(() => {
    if (lines && lines.length > 0) {
      if (offset === 0n) {
        setAllLines(lines as Line[])
      } else {
        setAllLines(prev => [...prev, ...(lines as Line[])])
      }
    }
  }, [lines])

  const loadMore = () => {
    const nextOffset = offset + PAGE_SIZE
    setOffset(nextOffset)
  }

  const shortAddr = (addr: string) => `${addr.slice(0, 6)}...${addr.slice(-4)}`
  const total = lineCount ? Number(lineCount) : 0

  return (
    <div className="space-y-0">
      {/* Stats bar */}
      <div className="flex gap-4 mb-4 pb-3 border-b-2 border-black text-xs font-black uppercase">
        <span>LINES: <span className="text-[#FF3B00]">{total}</span></span>
        <span>CONTRIBUTORS: <span className="text-[#FF3B00]">∞</span></span>
        <span>STATUS: <span className="text-[#00AA44] cursor-blink">● LIVE</span></span>
      </div>

      {/* Lines */}
      <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
        {allLines.length === 0 && (
          <div className="text-sm font-bold text-gray-500 py-4 uppercase">
            LOADING LORE FROM CHAIN...
          </div>
        )}
        {allLines.map((line, i) => (
          <div
            key={i}
            className="border-l-4 border-black pl-3 py-2 hover:border-[#FF3B00] transition-colors bg-[#F5F0E8]"
          >
            <div className="text-xs font-black uppercase mb-1 flex gap-2 text-gray-500">
              <span className="text-black">[{String(i + 1).padStart(3, '0')}]</span>
              <a
                href={`https://sepolia.basescan.org/address/${line.author}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-[#FF3B00] transition-colors"
              >
                {shortAddr(line.author)}
              </a>
            </div>
            <p className="text-sm font-bold leading-relaxed">{line.text}</p>
          </div>
        ))}
      </div>

      {/* Load more */}
      {total > allLines.length && (
        <button
          onClick={loadMore}
          className="brut-btn brut-btn-outline w-full mt-4 text-xs"
        >
          LOAD MORE LORE ({total - allLines.length} REMAINING)
        </button>
      )}
    </div>
  )
}