import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { base } from 'wagmi/chains'

export const config = getDefaultConfig({
  appName: 'BaseChainLore',
  projectId: '9f7d421ee5a5891f0d1f1c02048e86e2', // get free one at cloud.walletconnect.com
  chains: [base],
  ssr: true,
})