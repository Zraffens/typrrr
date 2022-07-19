import { HeadersDefaults } from 'axios'

type keyTiming = {
  timestamp: number;
  key: string;
};

type User = {
  username?: string;
  email?: string;
  created?: string;
  races_completed?: number;
  average_speed?: number;
  races_won?: number;
};

interface HeaderProperties extends HeadersDefaults {
  Authorization: string
}

export { keyTiming, User, HeaderProperties };
