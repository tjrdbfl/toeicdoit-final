"use client";

import { PG } from "@/constants/enums/PG";
import { useExamAnswerStore, useResultStore, useTakeStore } from "@/store/toeic/store";
import { useRouter } from "next/navigation";

const ScoreBtn=({label,type,option,toeicId}:{label:string,type:string,option:number,toeicId:number})=>{

    const router=useRouter();
    console.log('type: ',type);
    const url=type==='exam'?`${PG.EXAM}`:type==='level'?`${PG.LEVEL}`:type==='part'? `${PG.PART}`:`${PG.LEVEL_TEST}`;
    const {setTake}=useTakeStore();
    const {initialize}=useExamAnswerStore();

    const handleClick=()=>{
        router.push(url);


        useResultStore.setState({
            BarData:[],
            score:0,
            lc_score:0,
            rc_score:0,
            timeElapsed:0,
            name:'',
            type:'',
            toeicId:0,
          }
        );

        if(option===2){
            router.push(url);
        }else{
            router.push(`${url}/${toeicId}`);
        }

        setTake(toeicId,false);
        initialize();
       
    }
    
    return(<>
    <button
    onClick={handleClick}
    className="lime_button w-[230px] justify-center p-3"
    >
        <p className="text-black font-semibold">{label}</p>
    </button>
    </>);
}
export default ScoreBtn;