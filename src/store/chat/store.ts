'use client';
import { create } from "zustand";

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
// export const useCountMemberStore=create<CountMemberStore>((set)=>({
//     numberOfMember:[],
//     setNumberOfMember: (roomId, count) =>
//         set((state) => {
//              // 필요한 경우 answers 배열의 크기를 늘립니다.
//           while (state.numberOfMember.length <= questionId) {
//             state.answers.push({ id: state.answers.length, answer: '' });
//           }

//           const existingAnswerIndex = state.answers.findIndex(
//             (answer) => answer.toeicId === questionId
//           );

//           if (existingAnswerIndex !== -1) {
//             const updatedAnswers = [...state.answers];
//             updatedAnswers[existingAnswerIndex].answer = selectedAnswer;
//             updatedAnswers[existingAnswerIndex].part=part;
//             return { answers: updatedAnswers };
//           } else {
//             return { answers: [...state.answers, { toeicId: questionId, answer: selectedAnswer,part:part}] };
//           }
//         }),
//     }),
//     {
//       name: 'CountMemberStore',
//       storage: createJSONStorage(() => sessionStorage),
//     }
// }))