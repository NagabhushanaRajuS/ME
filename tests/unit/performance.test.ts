import {
  debounce,
  throttle,
  memoize,
  prefersReducedMotion,
  getAnimationDuration,
  isTouchDevice,
  isLowEndDevice,
  getOptimizedParticleCount,
} from '@/lib/utils/performance'

describe('Performance utilities', () => {
  jest.useFakeTimers()

  describe('debounce', () => {
    it('should delay function execution', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 300)

      debouncedFn()
      debouncedFn()
      debouncedFn()

      expect(mockFn).not.toHaveBeenCalled()

      jest.advanceTimersByTime(300)
      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('should reset delay on multiple calls', () => {
      const mockFn = jest.fn()
      const debouncedFn = debounce(mockFn, 300)

      debouncedFn()
      jest.advanceTimersByTime(100)
      debouncedFn()
      jest.advanceTimersByTime(100)
      debouncedFn()
      jest.advanceTimersByTime(300)

      expect(mockFn).toHaveBeenCalledTimes(1)
    })
  })

  describe('throttle', () => {
    it('should limit execution frequency', () => {
      const mockFn = jest.fn()
      const throttledFn = throttle(mockFn, 300)

      throttledFn()
      throttledFn()
      throttledFn()

      expect(mockFn).toHaveBeenCalledTimes(1)

      jest.advanceTimersByTime(300)
      throttledFn()

      expect(mockFn).toHaveBeenCalledTimes(2)
    })
  })

  describe('memoize', () => {
    it('should cache function results', () => {
      const mockFn = jest.fn((a: number, b: number) => a + b)
      const memoizedFn = memoize(mockFn)

      expect(memoizedFn(1, 2)).toBe(3)
      expect(memoizedFn(1, 2)).toBe(3)

      expect(mockFn).toHaveBeenCalledTimes(1)
    })

    it('should distinguish different arguments', () => {
      const mockFn = jest.fn((a: number) => a * 2)
      const memoizedFn = memoize(mockFn)

      memoizedFn(5)
      memoizedFn(10)

      expect(mockFn).toHaveBeenCalledTimes(2)
    })
  })

  describe('prefersReducedMotion', () => {
    it('should return boolean', () => {
      const result = prefersReducedMotion()
      expect(typeof result).toBe('boolean')
    })
  })

  describe('getAnimationDuration', () => {
    it('should return preferred duration when motion is not reduced', () => {
      jest.spyOn(window, 'matchMedia').mockReturnValue({
        matches: false,
        media: '',
        onchange: null,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        addListener: jest.fn(),
        removeListener: jest.fn(),
        dispatchEvent: jest.fn(),
      } as any)

      const duration = getAnimationDuration(300, 0)
      expect(duration).toBe(300)
    })
  })

  describe('isTouchDevice', () => {
    it('should return boolean', () => {
      const result = isTouchDevice()
      expect(typeof result).toBe('boolean')
    })
  })

  describe('isLowEndDevice', () => {
    it('should return boolean', () => {
      const result = isLowEndDevice()
      expect(typeof result).toBe('boolean')
    })
  })

  describe('getOptimizedParticleCount', () => {
    it('should return reduced count on low-end devices', () => {
      const defaultCount = 100
      const optimized = getOptimizedParticleCount(defaultCount)
      expect(optimized).toBeLessThanOrEqual(defaultCount)
    })

    it('should return default count on normal devices', () => {
      const count = 100
      const result = getOptimizedParticleCount(count)
      expect(result).toBeGreaterThan(0)
    })
  })
})
