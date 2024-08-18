import { MessageData } from "./MessengerData";


export type OptionData = {
    id: number;
    choice1: string;
    choice2: string;
    choice3: string;
    choice4: string;
    toeicId: number;
    createdAt:string;
    updatedAt:string;
}

export type ToeicProblemType = {
    id: number,
    level: number,
    part: string,
    question: string,
    answer: string,
    image: string,
    description: string,
    take: boolean,
    toeicCategory:ToeicCategoryType,
    option: OptionData,
}

export type ToeicCategoryType={
    id:number,
    title:string,
    sound:string,
    testType:string,
    take:boolean,
    createdAt:string,
    updatedAt:string,
    toeicQuestions:null   
}


export type resultChartData = {
    BarData: number[],
    score: number,
    lc_score: number,
    rc_score: number,
    timeElapsed: number,
}


export type ChartData = {
    BarData: number[];     //파트별 점수 합산 
    score: number;       //level 정제 필요 score/100
    LC_score: number;
    RC_Score: number;
    RadarData: number[];     //듣기, 어휘, 구조, 문법, 독해 별 정보
    timeElapsed: number;
}
export const ITEMS_PER_PAGE = 10;
export const CURRENT_TOTAL_PAGE = 10;

export interface I_ApiLevelTestRequest {
    currentPage?: number;
    level: number;
}
export type ResultChartData = {
    id: number,
    userId: number,
    toeicCategoryId: number,
    toeicId: |null,
    timeElapsed: number,
    score:number,
    lcScore:number,
    rcScore: number,
    rcAllScore:number,
    lcAllScore:number,
    scorePart1: number,
    scorePart2: number,
    scorePart3: number,
    scorePart4: number,
    scorePart5: number,
    scorePart6: number,
    scorePart7: number,
    barData:number[],
    take:boolean
}

export type LineResultData={
    recentResults:{
        exam:number[],
        level:number[],
        part:number[],
        test:number[]
    }
}

