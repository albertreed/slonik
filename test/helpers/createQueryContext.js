// @flow

import type {
  QueryContextType,
} from '../../src/types';

export default (): QueryContextType => {
  // $FlowFixMe
  return {
    connectionId: '1',

    // $FlowFixMe
    log: {
      getContext: () => {
        return {
          connectionId: '1',
          poolId: '1',
        };
      },
    },
    poolId: '1',
  };
};
