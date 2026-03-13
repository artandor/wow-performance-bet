/**
 * DEMO MODE – Fake session returned by auth() when DEMO_MODE=true.
 */
import { DEMO_GUILDS, DEMO_USER_ID, DEMO_USERNAME } from './store'

export const DEMO_SESSION = {
  user: {
    id: DEMO_USER_ID,
    name: DEMO_USERNAME,
    username: DEMO_USERNAME,
    avatar: '',
    email: null as string | null,
    image: null as string | null,
    guilds: DEMO_GUILDS,
  },
  expires: '2099-01-01T00:00:00.000Z',
}
