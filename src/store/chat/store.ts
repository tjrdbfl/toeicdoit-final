'use client';
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type ChatAlertStore = {
    message:string;
    fadeOut: boolean;
}
export const useChatAlertStore=create<ChatAlertStore>((set)=>({
    fadeOut:false,
    message:'',
}))
type ChatNewMessageStore = {
    message:string;
    fadeOut: boolean;
}
export const useChatNewMessageStore=create<ChatNewMessageStore>((set)=>({
    fadeOut:false,
    message:'',
}))


export type CountMemberStore={
    numberOfMember:{roomId:string,count:number}[],
    setNumberOfMember: (roomId: string, count: number) => void;
}
export const useCountMemberStore= create<CountMemberStore>()(
   
    (set) => ({
        numberOfMember: Array.from({ length: 200 }, (_, index) => ({
            roomId: (index + 1).toString(),
            count: 0
        })),
        setNumberOfMember: (roomId, count) =>
          set((state) => {
  
            const existingAnswerIndex = state.numberOfMember.findIndex(
              (numberOfMem) => numberOfMem.roomId === roomId
            );
  
            if (existingAnswerIndex !== -1) {
              const updatedAnswers = [...state.numberOfMember];
              updatedAnswers[existingAnswerIndex].roomId = roomId;
              updatedAnswers[existingAnswerIndex].count = count;
  
              return { numberOfMember: updatedAnswers };
            } else {
              return { numberOfMember: [...state.numberOfMember, { roomId, count }] };
            }
          }),
      }),
    
);
  
// export const useCountMemberStore= create<CountMemberStore>()(
//     persist(
//       (set) => ({
//         numberOfMember: Array.from({ length: 200 }, (_, index) => ({
//             roomId: (index + 1).toString(),
//             count: 0
//         })),
//         setNumberOfMember: (roomId, count) =>
//           set((state) => {
  
//             const existingAnswerIndex = state.numberOfMember.findIndex(
//               (numberOfMem) => numberOfMem.roomId === roomId
//             );
  
//             if (existingAnswerIndex !== -1) {
//               const updatedAnswers = [...state.numberOfMember];
//               updatedAnswers[existingAnswerIndex].roomId = roomId;
//               updatedAnswers[existingAnswerIndex].count = count;
  
//               return { numberOfMember: updatedAnswers };
//             } else {
//               return { numberOfMember: [...state.numberOfMember, { roomId, count }] };
//             }
//           }),
//       }),
//       {
//         name: 'CountMemberStore',
//         storage: createJSONStorage(() => sessionStorage),
//       }
//     )
//   );
  