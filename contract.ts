export const CONTRACT_ADDRESS = '0x3aF69540d1f63d916B5A4bcb4aADf7880737EF94' as const

export const CONTRACT_ABI = [
  {
    name: 'startStory',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: '_title', type: 'string' },
      { name: '_firstLine', type: 'string' },
    ],
    outputs: [],
  },
  {
    name: 'addLine',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [
      { name: '_storyId', type: 'uint256' },
      { name: '_text', type: 'string' },
    ],
    outputs: [],
  },
  {
    name: 'storyCount',
    type: 'function',
    stateMutability: 'view',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'stories',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: '', type: 'uint256' }],
    outputs: [
      { name: 'title', type: 'string' },
      { name: 'isActive', type: 'bool' },
    ],
  },
  {
    name: 'getLineCount',
    type: 'function',
    stateMutability: 'view',
    inputs: [{ name: '_storyId', type: 'uint256' }],
    outputs: [{ name: '', type: 'uint256' }],
  },
  {
    name: 'getStoryLinesByRange',
    type: 'function',
    stateMutability: 'view',
    inputs: [
      { name: '_storyId', type: 'uint256' },
      { name: '_offset', type: 'uint256' },
      { name: '_limit', type: 'uint256' },
    ],
    outputs: [
      {
        name: '',
        type: 'tuple[]',
        components: [
          { name: 'author', type: 'address' },
          { name: 'text', type: 'string' },
        ],
      },
    ],
  },
  {
    name: 'StoryStarted',
    type: 'event',
    inputs: [
      { name: 'storyId', type: 'uint256', indexed: true },
      { name: 'title', type: 'string', indexed: false },
      { name: 'creator', type: 'address', indexed: true },
    ],
  },
  {
    name: 'LineAdded',
    type: 'event',
    inputs: [
      { name: 'storyId', type: 'uint256', indexed: true },
      { name: 'author', type: 'address', indexed: true },
      { name: 'text', type: 'string', indexed: false },
    ],
  },
] as const
