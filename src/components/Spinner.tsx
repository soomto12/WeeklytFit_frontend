function Spinner({ size = 32 }: { size?: number }) {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="border-gray-200 border-t-green-600 rounded-full animate-spin"
      style={{ width: size, height: size, borderWidth: Math.max(2, size / 10), borderStyle: 'solid' }}
    />
  )
}

export default Spinner
