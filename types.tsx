/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { IAlchemyResponse } from "./common/types/alchemy";

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

export type RootStackParamList = {
  Auth: undefined;
  Feed: undefined;
  Profile: { id: string; currentUser?: boolean };
  Modal: undefined;
  NotFound: undefined;
  NFTs: undefined;
  NFT: { data: IAlchemyResponse };
};
