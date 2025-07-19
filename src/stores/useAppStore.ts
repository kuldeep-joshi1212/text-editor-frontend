/**
 * @author Rushikesh Bambadkar
 */
import { create } from 'zustand';


interface WinLossStore {


    userId: string;
    setUserId : (userId: string) => void;
}

const useWinLossStore = create<WinLossStore>((set) => ({
    userId:"",
    setUserId: (userId:string) => set({userId})

}));

export default useWinLossStore;