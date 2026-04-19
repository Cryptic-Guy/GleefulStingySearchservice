import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contract'

interface StartStoryProps {
  onSuccess: () => void
}

export default function StartStory({ onSuccess }: StartStoryProps) {
  const [title, setTitle] = useState('')
  const [firstLine, setFirstLine] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const { isConnected } = useAccount()

  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const handleSubmit = () => {
    if (!title.trim() || !firstLine.trim()) return
    if (title.length > 50 || firstLine.length > 280) return
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'startStory',
      args: [title.trim(), firstLine.trim()],
    })
  }

  if (isSuccess) {
    setTimeout(() => {
      setTitle('')
      setFirstLine('')
      setIsOpen(false)
      onSuccess()
    }, 2000)
  }

  if (!isConnected) return null

  return (
    <div className="mt-4">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="brut-btn brut-btn-outline w-full text-xs"
        >
          + START NEW STORY [ADVANCED]
        </button>
      ) : (
        <div className="brut-box bg-white p-5 space-y-4">
          <div className="text-xs font-black uppercase text-[#FF3B00]">▶ NEW STORY GENESIS:</div>

          <div>
            <div className="text-xs font-black uppercase mb-1">TITLE (MAX 50):</div>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="The Broke Frog Chronicles"
              maxLength={50}
              className="w-full p-3 text-sm font-bold"
            />
            <div className="text-xs font-bold text-gray-500 mt-1">{50 - title.length} REMAINING</div>
          </div>

          <div>
            <div className="text-xs font-black uppercase mb-1">FIRST LINE (MAX 280):</div>
            <textarea
              value={firstLine}
              onChange={e => setFirstLine(e.target.value)}
              placeholder="In 2026 on Base, a broke frog woke up with 0.01 ETH and decided to..."
              rows={3}
              maxLength={280}
              className="w-full resize-none p-3 text-sm font-bold"
            />
            <div className="text-xs font-bold text-gray-500 mt-1">{280 - firstLine.length} REMAINING</div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSubmit}
              disabled={!title.trim() || !firstLine.trim() || isPending || isConfirming}
              className="brut-btn text-xs"
            >
              {isPending ? 'SIGNING...' : isConfirming ? 'DEPLOYING...' : '▶ GENESIS BLOCK'}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="brut-btn brut-btn-danger text-xs"
            >
              CANCEL
            </button>
          </div>

          {isSuccess && (
            <div className="text-xs font-black text-[#00AA44] border-2 border-[#00AA44] p-2 bg-green-50">
              ✓ STORY BORN ON BASE. THE LORE BEGINS.
            </div>
          )}
          {error && (
            <div className="text-xs font-black text-white bg-[#FF3B00] border-2 border-black p-2">
              ERR: {(error as any)?.shortMessage || error.message}
            </div>
          )}
        </div>
      )}
    </div>
  )
}