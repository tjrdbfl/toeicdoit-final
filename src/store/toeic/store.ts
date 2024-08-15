'use client';
import { classifyPart } from '@/service/toeic/items';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

type ResultStore = {
  type: string,
  BarData: number[],
  score: number,
  lc_score: number,
  rc_score: number,
  timeElapsed: number,
  toeicId: number,
  name:string,
}
export const useResultStore = create<ResultStore>()(
  persist(
    (set) => ({
      type: '',
      BarData: [],
      score: 0,
      lc_score: 0,
      rc_score: 0,
      timeElapsed: 0,
      toeicId: 0,
      name:'',
      }),{
        name: 'ResultStore',
        storage: createJSONStorage(() => sessionStorage),
      }),
);


type Take = {
  toeicId: number,
  take: boolean
};
type TakeStore = {
  takes: Take[]
  setTake: (
    toeicId: number,
    take: boolean) => void;
  initialize: () => void
}
export const useTakeStore = create<TakeStore>()(
  persist(
    (set) => ({
      takes: Array.from({ length: 200 }, (_, index) => ({
        toeicId: index + 1,
        take: false
      })),
      setTake: (toeicId, take) =>
        set((state) => {

          const existingAnswerIndex = state.takes.findIndex(
            (take) => take.toeicId === toeicId
          );

          if (existingAnswerIndex !== -1) {
            const updatedAnswers = [...state.takes];
            updatedAnswers[existingAnswerIndex].take = take;

            return { takes: updatedAnswers };
          } else {
            return { takes: [...state.takes, { toeicId, take }] };
          }
        }),
      initialize: () =>
        set({
          takes: Array.from({ length: 200 }, (_, index) => ({
            toeicId: index + 1,
            take: false
          }))
        })
    }),
    {
      name: 'TakeStore',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

type ExamCautionModalStore = {
  toggle: boolean;
  toggleModal: () => void
}
export const useExamCautionModalStore = create<ExamCautionModalStore>()((set) => ({
  toggle: false,
  toggleModal: () => set((state) => ({ toggle: !state.toggle }))
}));

type ExamRetakeModalStore = {
  show: boolean;
  setShow: () => void
}
export const useExamRetakeModalStore = create<ExamRetakeModalStore>()((set) => ({
  show: false,
  setShow: () => set((state) => ({ show: !state.show }))
}));

type NumberOfQuestionStore = {
  count: number;
  setCount: () => void;
}
export const useNumberOfQuestionStore = create<NumberOfQuestionStore>()((set) => ({
  count: 0,
  setCount: () => set((state) => ({ count: ++state.count }))
}))

type ToeicAnswer = {
  id: number;
  answer: string;
};

type ToeicAnswerStore = {
  answers: ToeicAnswer[];
  setAnswer: (questionId: number, selectedAnswer: string) => void;
};

export const useToeicAnswerStore = create<ToeicAnswerStore>()(
  persist(
    (set) => ({
      answers: [], // 초기에는 빈 배열로 설정
      setAnswer: (questionId, selectedAnswer) =>
        set((state) => {
          // 필요한 경우 answers 배열의 크기를 늘립니다.
          while (state.answers.length <= questionId) {
            state.answers.push({ id: state.answers.length, answer: '' });
          }

          const existingAnswerIndex = state.answers.findIndex(
            (answer) => answer.id === questionId
          );

          if (existingAnswerIndex !== -1) {
            const updatedAnswers = [...state.answers];
            updatedAnswers[existingAnswerIndex].answer = selectedAnswer;
            return { answers: updatedAnswers };
          } else {
            return { answers: [...state.answers, { id: questionId, answer: selectedAnswer }] };
          }
        }),
    }),
    {
      name: 'toeic-answers',
    }
  )
);

type ExamAnswer = {
  toeicId: number;
  answer: string;
  part: number;
};

type ExamAnswerStore = {
  answers: ExamAnswer[];
  setAnswer: (questionId: number, selectedAnswer: string, part: number) => void;
  initialize: () => void
};

export const useExamAnswerStore = create<ExamAnswerStore>()(
  persist(
    (set) => ({
      answers: Array.from({ length: 200 }, (_, index) => ({
        toeicId: index + 1,
        answer: '',
        part: 0
      })),
      setAnswer: (questionId, selectedAnswer, part) =>
        set((state) => {
          console.log('part: ' + part);


          const existingAnswerIndex = state.answers.findIndex(
            (answer) => answer.toeicId === questionId
          );

          if (existingAnswerIndex !== -1) {
            const updatedAnswers = [...state.answers];
            updatedAnswers[existingAnswerIndex].answer = selectedAnswer;
            updatedAnswers[existingAnswerIndex].part = part;
            return { answers: updatedAnswers };
          } else {
            return { answers: [...state.answers, { toeicId: questionId, answer: selectedAnswer, part: part }] };
          }
        }),
      initialize: () =>
        set({
          answers: Array.from({ length: 200 }, (_, index) => ({
            toeicId: index + 1,
            answer: '',
            part: 0
          }))
        })
    }),
    {
      name: 'ExamAnswerStore',
      storage: createJSONStorage(() => sessionStorage),

    }
  )
);