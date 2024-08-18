'use client';
import LinkIcon from "@/components/common/LinkIcon";
import ScoreBtn from "@/components/toeic/ScoreBtn";
import { PG } from "@/constants/enums/PG";
import PieContainer from "@/templates/chart/PieContainer";
import RadarContainer from "@/templates/chart/RadarContainer";
import BarContainer from "@/templates/chart/BarContainer";

import {
  calculateBarData,
  calculateRadarData,
  calculateTime,
  calculateTimeData,
} from "@/service/toeic/util";
import DoughnutContainer from "@/templates/chart/DoughnutContainer";
import { useResultStore } from "@/store/toeic/store";
import { useEffect, useState } from "react";

export default function ScorePage() {

  const { type, name, score, lc_score, rc_score, BarData, timeElapsed, toeicId, lcAllScore, rcAllScore } = useResultStore();
  const [formattedTime, setFormattedTime] = useState<string|null>(null);

  const UserBarData = {
    label: "내 파트별 실력",
    data: BarData,
    backgroundColor: "rgba(18, 17, 17, 0.3)",
  };
  const PartBarData = calculateBarData(score);

  const PieLCLabels = [
    `나의 총 점수 : ${lc_score}점`,
    "총 점수 : 495점",
  ];
  const PieRCLabels = [
    `나의 총 점수 : ${rc_score}점`,
    "총 점수 : 495점",
  ];
  const UserLCPieData = [lc_score, 495 - lc_score];
  const UserRCPieData = [rc_score, 495 - rc_score];

  const LevelRadarData: number[] = calculateRadarData(score) || [];
  const radarLabel = [
    ["듣기", `${LevelRadarData[0]}/90`],
    ["어휘", `${LevelRadarData[1]}/90`],
    ["구조", `${LevelRadarData[2]}/90`],
    ["문법", `${LevelRadarData[3]}/90`],
    ["독해", `${LevelRadarData[4]}/90`],
  ];

  useEffect(() => {
    if (timeElapsed > 0) {
      const minutes = Math.floor(timeElapsed / 60000);
      const seconds = Math.floor((timeElapsed / 1000) % 60).toString().padStart(2, '0');
      setFormattedTime(`${minutes} : ${seconds}`);
    }
  }, [timeElapsed]);

  const DoughnutUserData = [
    Math.floor((Math.floor(timeElapsed / 60000) * 60 + Math.floor(timeElapsed / 1000)) / 60),
    Math.floor((120 * 60 - Math.floor(timeElapsed / 60000)) / 60)
  ];


  //const DoughnutUserData = [Math.floor((Math.floor(timeElapsed/60000)*60+Math.floor(timeElapsed/1000))/60), Math.floor((120*60 - Math.floor(timeElapsed/60000))/60)];
  const DoughnutOtherData = [
    calculateTimeData(score),
    120 - calculateTimeData(score),
  ];

  console.log('type: ', type)
  const DoughnutOtherTime = calculateTime(calculateTimeData(score));

  return (
    <>
      <div className="w-full flex flex-col justify-center items-center mt-20 px-20 min-h-screen">
        <div className="bg-blue-50 justify-center shadow-xl rounded-2xl border-slate-200 border-2 lg:w-[650px] p-5 animate-slidein300">
          <div className="flex flex-row justify-center ">
            <LinkIcon size={20} />
            <div className="ml-2 form_title text-xl text-center font-semibold text-black">
              {name}님의 점수는 {score}점 입니다.
            </div>
          </div>

          <div className="flex flex-wrap gap-10 justify-center">
            <RadarContainer
              score={score}
              UserRadarData={[65, 59, 90, 81, 56]}
              LevelRadarData={LevelRadarData}
              labels={radarLabel}
            />
            {formattedTime!==null && (
              <DoughnutContainer
                score={score}
                DoughnutUserData={DoughnutUserData}
                DoughnutOtherData={DoughnutOtherData}
                DoughnutUserTime={formattedTime}
                DoughnutOtherTime={DoughnutOtherTime}
              />
            )}
          </div>

          <div className="mt-10" />
          {type==='exam' && <BarContainer
            UserBarData={UserBarData}
            PartBarData={PartBarData}
            score={score}
          />}

          <div className="mt-10" />

          <PieContainer
            UserLCPieData={UserLCPieData}
            PieLCLabels={PieLCLabels}
            UserRCPieData={UserRCPieData}
            PieRCLabels={PieRCLabels}
          />
          <div className="mt-10" />

          <div className="flex flex-row justify-center gap-x-10">
            <ScoreBtn type={type} label={"오답 하러 가기"} option={1} toeicId={toeicId} />
            <ScoreBtn type={type} label={"응시하기 전으로 돌아가기"} option={2} toeicId={toeicId} />
          </div>
        </div>
      </div>
    </>
  );
}
