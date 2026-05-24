import { cn } from '@/lib/utils'

interface SkeletonCardProps {
  variant: 'movie' | 'booking' | 'list'
  className?: string
}

function Shimmer({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'rounded-lg bg-gradient-to-r from-white/5 via-white/10 to-white/5',
        'bg-[length:200%_100%] animate-shimmer',
        className
      )}
    />
  )
}

export function SkeletonCard({ variant, className }: SkeletonCardProps) {
  if (variant === 'movie') {
    return (
      <div
        className={cn(
          'rounded-2xl overflow-hidden bg-surface border border-white/10',
          className
        )}
      >
        {/* Poster */}
        <Shimmer className="w-full aspect-[2/3]" />

        {/* Info */}
        <div className="p-4 space-y-3">
          <Shimmer className="h-4 w-3/4" />
          <div className="flex items-center gap-2">
            <Shimmer className="h-3 w-12" />
            <Shimmer className="h-3 w-16" />
          </div>
          <div className="flex items-center gap-2">
            <Shimmer className="h-6 w-14 rounded-full" />
            <Shimmer className="h-6 w-14 rounded-full" />
          </div>
          <div className="flex items-center justify-between pt-1">
            <Shimmer className="h-4 w-20" />
            <Shimmer className="h-8 w-24 rounded-full" />
          </div>
        </div>
      </div>
    )
  }

  if (variant === 'booking') {
    return (
      <div
        className={cn(
          'rounded-2xl overflow-hidden bg-surface border border-white/10 p-4',
          className
        )}
      >
        <div className="flex gap-4">
          {/* Poster */}
          <Shimmer className="w-20 h-28 rounded-xl shrink-0" />

          {/* Details */}
          <div className="flex-1 space-y-3">
            <Shimmer className="h-5 w-3/4" />
            <Shimmer className="h-3 w-full" />
            <Shimmer className="h-3 w-1/2" />
            <div className="flex items-center gap-2 pt-1">
              <Shimmer className="h-6 w-20 rounded-full" />
              <Shimmer className="h-6 w-16 rounded-full" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/10">
          <Shimmer className="h-4 w-24" />
          <Shimmer className="h-8 w-28 rounded-full" />
        </div>
      </div>
    )
  }

  // list variant
  return (
    <div
      className={cn(
        'flex items-center gap-4 p-4 rounded-xl bg-surface border border-white/10',
        className
      )}
    >
      <Shimmer className="w-12 h-12 rounded-lg shrink-0" />
      <div className="flex-1 space-y-2">
        <Shimmer className="h-4 w-3/4" />
        <Shimmer className="h-3 w-1/2" />
      </div>
      <Shimmer className="h-8 w-20 rounded-full shrink-0" />
    </div>
  )
}
