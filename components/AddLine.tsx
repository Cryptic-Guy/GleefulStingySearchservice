import { useState } from 'react'
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi'
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../contract'

interface AddLineProps {
  storyId: bigint
  onSuccess: () => void
}

export default function AddLine({ storyId, onSuccess }: AddLineProps) {
  const [text, setText] = useState('')
  const { isConnected } = useAccount()

  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash })

  const handleSubmit = () => {
    if (!text.trim() || text.length > 280) return
    writeContract({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI,
      functionName: 'addLine',
      args: [storyId, text.trim()],
    })
  }

  if (isSuccess && text !== '') {
    setText('')
    onSuccess()
  }

  const charsLeft = 280 - text.length
  const isOverLimit = charsLeft < 0
  const isNearLimit = charsLeft <= 40 && !isOverLimit

  if (!isConnected) {
    return (
      <div className="brut-box bg-[#FFEF00] p-4 text-center">
        <p className="text-sm font-black uppercase">⚡ CONNECT WALLET TO ADD A LINE TO THE LORE</p>
      </div>
    )
  }

  return (
    <div className="brut-box-blue bg-white p-5">
      <div className="text-xs font-black uppercase mb-3 text-[#0057FF]">
        ▶ YOUR NEXT LINE (1–280 CHARS):
      </div>

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="...the frog opened its eyes and saw a Uniswap pool glowing in the dark"
        rows={3}
        maxLength={280}
        className="w-full resize-none text-sm p-3 font-bold"
        disabled={isPending || isConfirming}
      />

      <div className="flex justify-between items-center mt-3">
        <span
          className={`text-xs font-black ${
            isOverLimit ? 'text-[#FF3B00]' : isNearLimit ? 'text-orange-500' : 'text-gray-500'
          }`}
        >
          {charsLeft} CHARS LEFT
        </span>

        <button
          onClick={handleSubmit}
          disabled={!text.trim() || isOverLimit || isPending || isConfirming}
          className="brut-btn text-xs"
        >
          {isPending
            ? 'SIGNING...'
            : isConfirming
            ? 'CONFIRMING...'
            : '▶ SUBMIT LINE'}
        </button>
      </div>

      {hash && (
        <div className="mt-3 text-xs font-bold border-t-2 border-black pt-2">
          TX:{' '}
          <a
            href={`https://basescan.org/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[#0057FF]"
          >
            {hash.slice(0, 20)}...
          </a>
        </div>
      )}

      {isSuccess && (
        <div className="mt-3 text-xs font-black text-[#00AA44] border-2 border-[#00AA44] p-2 bg-green-50">
          ✓ LINE ADDED TO THE LORE. THE FROG LIVES ON.
        </div>
      )}

      {error && (
        <div className="mt-3 text-xs font-black text-white bg-[#FF3B00] border-2 border-black p-2">
          ERR: {(error as any)?.shortMessage || error.message}
        </div>
      )}
    </div>
  )
}