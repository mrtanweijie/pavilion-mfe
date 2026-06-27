declare module 'demo-app/main' {
  import type { SegmentLifecycle } from '@pavilion/router'
  const lifecycle: SegmentLifecycle
  export default lifecycle
}

declare module 'react-app/main' {
  import type { SegmentLifecycle } from '@pavilion/router'
  const lifecycle: SegmentLifecycle
  export default lifecycle
}
