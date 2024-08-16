import BoardDetailContent from "@/components/board/BoardDetailContent";
import BoardDetailControl from "@/components/board/BoardDetailControl";
import BoardDetailProfile from "@/components/board/BoardDetailProfile";
import BoardDetailTitle from "@/components/board/BoardDetailTitle";
import NoticeLink from "@/components/board/NoticeLink";
import { CommonHeader } from "@/config/headers";
import { SERVER, SERVER_API } from "@/constants/enums/API";
import { ERROR } from "@/constants/enums/ERROR";
import { useBoardCurrentPageStore } from "@/store/board/store";
import { BoardData, I_ApiBoardDetailResponse, I_ApiBoardResponse } from "@/types/BoardData";
import { MessageData } from "@/types/MessengerData";


export default async function NoticeDetailPage({ params }: {
    params: {
        id: number;
    }
}) {

    let totalPages: number = 0;
    let notices: BoardData = {
        id: 0,
        title: "",
        content: "",
        userId: 0,
        writerName: "",
        type: "notice",
        createdAt: new Date(),
        updatedAt: new Date()
    };
    let totalElements: number = 0;

    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/${SERVER.USER}/public/${SERVER_API.BOARD}/findBy?type=notice&page=${params.id}&size=1`, {
            method: 'GET',
            headers: CommonHeader,
            cache:'no-store'
        });
        const data: I_ApiBoardResponse = await response.json();

        if (data) {
            notices = data.content[0];
            totalPages = data.totalPages;
            totalElements = data.totalElements;
            
            console.log('totalElements: '+totalElements);

        } else {
            console.error('Failed to get response data by find-by-types' + ERROR.SERVER_ERROR);
        }


    } catch (err) {
        console.log('Failed to get notice: ', ERROR.SERVER_ERROR);
    }

    return (<>
        <div className="px-28 py-20">
            <div className="xl:px-80 mb-5">
                <NoticeLink />
            </div>

            <div className="w-full flex flex-col lg:px-20 2xl:px-[25%]">
                <div className="mt-8" />
                <BoardDetailTitle
                    type={"notice"}
                    title={notices?.title}
                    category={notices?.category || ''} />

                <div className="bg-zinc-300 w-full h-[0.5px] my-3" />
                <BoardDetailProfile
                    writer={notices?.writerName}
                    createdAt={notices?.createdAt}
                    updatedAt={notices?.updatedAt} />

                <div className="bg-zinc-300 w-full h-[0.5px] mt-3" />
                <BoardDetailContent content={notices?.content} />
                <BoardDetailControl id={Number(params.id)} type={"notice"} totalElements={totalElements} />
            </div>
        </div>
    </>);
}