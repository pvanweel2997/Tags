import { UserType } from '@app/types/user.types';

export type ProfileType = UserType & { following: boolean };
